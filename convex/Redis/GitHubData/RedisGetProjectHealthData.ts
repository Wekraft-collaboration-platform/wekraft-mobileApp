import {action} from "../../_generated/server";
import {Octokit} from "octokit";
import {ensureGithubToken, setRateLimit} from "./GithubToken";
import {v} from "convex/values";
import {redis} from "../../redisClient";

type CommitNode = {
    committedDate: string;
};

type IssueNode = {
    createdAt: string;
    closedAt: string | null;
    comments: { totalCount: number };
};

type PRNode = {
    mergedAt: string | null;
    additions: number;
    deletions: number;
    files: { totalCount: number };
    labels: { nodes: { name: string }[] };
};


export type RepoMetrics = {
    // Issues
    openIssuesCount: number;
    closedIssuesCount: number;
    issueCount: number; // define clearly: total = open + closed

    // Commits
    totalCommits: number;
    commitsLast60Days: number;
    lastCommitDate: string | null; // ISO string (never Date object across boundary)

    // Pull Requests
    totalPRs: number;
    mergedPRs: number;
    prCount: number; // clarify meaning (often same as totalPRs)
    prMergeRate: number; // 0 → 1 (not %)

    // Velocity
    velocity7d: number;
    velocityPrev7d: number;
    velocityDelta: number;
    velocityTrend: "up" | "down" | "stable";
    isFreshRepo: boolean;

    // Breakdown
    velocityBreakdown: {
        commits: number;
        issues: number;
        prs: number;
    };
};

export const RedisGetProjectHealthData = action({
    args: {
        owner: v.string(),
        repo: v.string(),
    },
    handler: async (ctx, args) : Promise<RepoMetrics> => {
        const {token,identity} = await ensureGithubToken(ctx);

        if(!token){
            throw  new Error("call Project Health Data  without token")
        }

        const cacheKey = `redis:githubFetchProjectHealth:${args.owner}:${args.repo}`

        const cached = await redis.get(cacheKey);
        if (typeof cached === "string") {
            try {
                return JSON.parse(cached) as RepoMetrics;
            } catch {
                await redis.del(cacheKey); // corrupted cache
            }
        }

        await setRateLimit("GithubProjectHealth",identity.subject,`${args.owner}:${args.repo}`)



        const octokit = new Octokit({ auth: token });

        const query = `
       query ($owner: String!, $repo: String!, $since: GitTimestamp!) {
        repository(owner: $owner, name: $repo) {
        
          openIssues: issues(states: OPEN) {
          totalCount
          }
          closedIssues: issues(states: CLOSED) {
            totalCount
          }
          pullRequests(first:100) {
            nodes {
              merged
            }
          }
          mergedPRs: pullRequests(states: MERGED) {
            totalCount
          }
          defaultBranchRef {
            target {
              ... on Commit {
                committedDate

                history {
                  totalCount
                }

                recentHistory: history(first: 100, since: $since) {
                  nodes {
                    committedDate
                  }
                }
              }
            }
          }
          recentClosedIssues: issues(
            states: CLOSED,
            first: 50,
            orderBy: { field: UPDATED_AT, direction: DESC }
          ) {
            nodes {
              createdAt
              closedAt
              comments {
                totalCount
              }
            }
          }

          recentMergedPRs: pullRequests(
            states: MERGED,
            first: 50,
            orderBy: { field: UPDATED_AT, direction: DESC }
          ) {
            nodes {
              mergedAt
              additions
              deletions
              files {
                totalCount
              }
              labels(first: 10) {
                nodes {
                  name
                }
              }
            }
        }
      }
      }
    `;

        const now = Date.now();
        const DAY = 24 * 60 * 60 * 1000;

        const since60Days = new Date(now - 60 * DAY).toISOString();
        const sevenDaysAgo = now - 7 * DAY;
        const fourteenDaysAgo = now - 14 * DAY;

        const res: any = await octokit.graphql(query, {
            owner: args.owner,
            repo: args.repo,
            since:since60Days
        });




        const repo = res.repository;

        const commitData = repo.defaultBranchRef?.target;

        const commits: CommitNode[] = commitData?.recentHistory?.nodes ?? [];

        // ✅ Issue counts (exact)
        const openIssuesCount = repo.openIssues.totalCount;
        const closedIssuesCount = repo.closedIssues.totalCount;

        // ✅ Commit data (max 100, same as REST)
        const totalCommits =
            commitData?.history?.totalCount ?? 0;

// ✅ Last 60 days commits (array)
        const recentCommits =
            commitData?.recentHistory?.nodes ?? [];

        const commitsLast60Days = recentCommits.length;

        const lastCommitDate =
            commitData?.committedDate ?? null;

        const prs = repo.pullRequests?.nodes ?? [];

        const totalPRs = prs.length;
        const mergedPRs = prs.filter((pr: any) => pr.merged).length;

        const prMergeRate =
            totalPRs > 0 ? Math.round((mergedPRs / totalPRs) * 100) : 0;


        // ---- Velocity windows ----
        const commitsCurrent = commits.filter((c) =>
            new Date(c.committedDate).getTime() >= sevenDaysAgo
        );

        const commitsPrevious = commits.filter(c => {
            const t = new Date(c.committedDate).getTime();
            return t >= fourteenDaysAgo && t < sevenDaysAgo;
        });

        const commitScoreCurrent = commitsCurrent.length ;
        const commitScorePrev = commitsPrevious.length  ;


        // ---- Issues ----
        let issueScoreCurrent = 0;
        let issueCount = 0
        let issueScorePrev = 0;

        const issues: IssueNode[] = repo.recentClosedIssues?.nodes ?? [];


        for (const issue of issues) {
            if (!issue.closedAt) continue;

            const closedAt = new Date(issue.closedAt).getTime();
            const createdAt = new Date(issue.createdAt).getTime();

            const hoursOpen =
                (closedAt - createdAt) / (1000 * 60 * 60);

            if (hoursOpen < 1 && issue.comments.totalCount === 0)
                continue;

            let factor = 1;
            if (hoursOpen < 24) factor = 0.5;

            if (closedAt >= sevenDaysAgo) {
                issueCount++;
                issueScoreCurrent += 3 * factor;
            } else if (closedAt >= fourteenDaysAgo) {
                issueScorePrev += 3 * factor;
            }
        }


        // ---- PRs ----
        let prScoreCurrent = 0;
        let prCount = 0

        let prScorePrev = 0;

        const recentPRs: PRNode[] = repo.recentMergedPRs?.nodes ?? [];

        for (const pr of recentPRs) {
            if (!pr.mergedAt) continue;

            const mergedAt = new Date(pr.mergedAt).getTime();

            const isDocs =
                pr.labels.nodes.some((l) =>
                    l.name.toLowerCase().includes("doc")
                ) || pr.files.totalCount <= 1;

            const size = pr.additions + pr.deletions;
            const weight = isDocs ? 2 : size < 20 ? 3 : 5;

            if (mergedAt >= sevenDaysAgo) {
                prCount++;
                prScoreCurrent += weight;
            } else if (mergedAt >= fourteenDaysAgo) {
                prScorePrev += weight;
            }
        }


        // ---- Final velocities ----
        const velocityCurrent =
            commitScoreCurrent + issueScoreCurrent + prScoreCurrent;

        const velocityPrevious =
            commitScorePrev + issueScorePrev + prScorePrev;

        const velocityDelta = velocityCurrent - velocityPrevious;

        // ---- Fresh repo validation ----
        const repoCreatedAt = new Date(res.repository.createdAt).getTime();
        const repoAgeDays = (now - repoCreatedAt) / DAY;

        const isFreshRepo =
            repoAgeDays < 14 ||
            res.repository.defaultBranchRef?.target?.history?.totalCount < 5 ||
            commitsLast60Days === commitScoreCurrent;

        let velocityTrend: "up" | "down" | "flat" | "insufficient" =
            "flat";

        if (isFreshRepo) {
            velocityTrend = "insufficient";
        } else if (velocityDelta >= 2) {
            velocityTrend = "up";
        } else if (velocityDelta <= -2) {
            velocityTrend = "down";
        }


        const result: RepoMetrics = {
            openIssuesCount,
            closedIssuesCount,

            lastCommitDate,
            totalCommits,
            commitsLast60Days,

            totalPRs,
            mergedPRs,

            // FIX: keep 0 → 1 scale
            prMergeRate: totalPRs > 0 ? mergedPRs / totalPRs : 0,

            issueCount,
            prCount,

            velocity7d: Math.round(velocityCurrent),
            velocityPrev7d: Math.round(velocityPrevious),

            velocityDelta,

            // FIX: match type
            velocityTrend: isFreshRepo
                ? "stable"
                : velocityDelta >= 2
                    ? "up"
                    : velocityDelta <= -2
                        ? "down"
                        : "stable",

            isFreshRepo,

            velocityBreakdown: {
                commits: commitScoreCurrent,
                issues: issueScoreCurrent,
                prs: prScoreCurrent,
            },
        };

        await redis.set(cacheKey, JSON.stringify(result), {
            ex: 1800,
        });

            console.log("Redis Project Health Set")

            return result;



    },


});

