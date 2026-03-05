// // convex/github.ts
"use node";
// 
// import { getGithubAccessToken } from "./githubHelpers";/
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { Octokit } from "octokit";
import { getGithubAccessToken } from "./githubHelper";
import { fetchUserContributionsRaw } from "./githubHelper";
import {ctx} from "expo-router/_ctx";

type GithubOwner = {
  login: string;
  avatar_url: string;
  html_url: string;
};

type GithubRepoRaw = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  owner: GithubOwner;
  created_at: string;
  updated_at: string;
  pushed_at: string;
};

type GithubRepo = {
  
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  ownerLogin: string;
  ownerAvatar: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
 
};


type GithubCollaborator = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  permissions?: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
};




async function ensureGithubToken(ctx: any): Promise<string> {
  // 1. Try DB first
  let token = await ctx.runQuery(api.users.getGithubToken);

  if (token) {
    return token;
  }

  // 2. Fetch from Clerk
  const identity = await ctx.auth.getUserIdentity();

  console.log("ensureGithubToken Indentity : ", identity);
  if (!identity) {
    throw new Error("Unauthenticated");
  }

  token = await getGithubAccessToken(identity.subject);

  console.log("ensureGithubToken Indentity Token : ", token);

  // 3. Store once
  await ctx.runMutation(api.users.setGithubToken, {
    token,
  });

  return token;
}


// export const getRepositories = async (
//     page: number = 1,
//     perPage: number = 10
// ) => {
//
//
//   const token = await ensureGithubToken(page);
//
//   const octokit = new Octokit({ auth: token });
//
//   const { data } = await octokit.rest.repos.listForAuthenticatedUser({
//     sort: "updated",
//     direction: "desc",
//     visibility: "all",
//     page: page,
//     per_page: perPage,
//   });
//
//   return data;
// };

export const getRepositories = action({
  args: {
    page:v.number(),
  },
  handler : async(ctx,args):Promise< GithubRepo[]> =>{
    const identity = await ctx.auth.getUserIdentity()
    if(!identity) {
      throw new Error("Called getRepositories without authentication present");
    }


    const token = await ensureGithubToken(ctx)

    const octokit = new Octokit({ auth: token });
    const repos : GithubRepo[] = []

    
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: "updated",
      direction: "desc",
      visibility: "all",
      page: args.page,
      per_page: 10,
    });

    
    for(const repo of data){
      repos.push({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        private: repo.private,
        html_url: repo.html_url,
        ownerLogin: repo.owner.login,
        ownerAvatar: repo.owner.avatar_url,
        created_at: repo.created_at ?repo.created_at :"",
        updated_at: repo.updated_at? repo.updated_at : "",
        pushed_at: repo.pushed_at?repo.pushed_at : ""

      })

    }
    return repos;





}
})


export const getRepositoriesBySearch = action({
  args: {
    page:v.number(),
    searchQuery:v.string(),
  },
  handler : async(ctx,args):Promise< GithubRepo[]> =>{
    const identity = await ctx.auth.getUserIdentity()
    if(!identity) {
      throw new Error("Called getRepositories without authentication present");
    }

    const token = await ensureGithubToken(ctx)
    console.log(identity)

    const octokit = new Octokit({ auth: token });
    const repos : GithubRepo[] = []

    
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      q: `${args.searchQuery} user:${identity.nickname}`, 
      sort: "updated",
      direction: "desc",
      visibility: "all",
      page: args.page,
      per_page: 10,
    });


    for(const repo of data){
      repos.push({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        private: repo.private,
        html_url: repo.html_url,
        ownerLogin: repo.owner.login,
        ownerAvatar: repo.owner.avatar_url,
        created_at: repo.created_at ?repo.created_at :"",
        updated_at: repo.updated_at? repo.updated_at : "",
        pushed_at: repo.pushed_at?repo.pushed_at : ""

      })

    }
    return repos;





}
})

export const fetchGithubRepos = action({
  args: {},
  handler: async (ctx): Promise<GithubRepo[] | null> => {
    const identity = ctx.auth.getUserIdentity()

    if(!identity) {
      return null
    }

    const token = await ensureGithubToken(ctx);

    let page = 1;
    const allRepos: GithubRepo[] = [];

    while (true) {
      const res = await fetch(
          `https://api.github.com/user/repos?per_page=100&page=${page}&affiliation=owner,collaborator,organization_member`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github+json",
            },
          }
      );

      if (!res.ok) {
        throw new Error("GitHub API request failed");
      }

      // console.log("GitHub API request success," res.json());

      // const r = await res.json();
      // console.log("GitHub API request success,"); 
      const repos: GithubRepoRaw[] = await res.json();
      if (repos.length === 0) break;

      for (const repo of repos) {
        allRepos.push({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          private: repo.private,
          html_url: repo.html_url,
          ownerLogin: repo.owner.login,
          ownerAvatar: repo.owner.avatar_url,
          created_at: repo.created_at,
          updated_at: repo.updated_at,
          pushed_at: repo.pushed_at,
          // description:repo.description
        });
      }

      page++;
    }

    return allRepos;
  },
});

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

type LabelNode = {
  name: string;
};

export const getProjectHealthData = action({
  args: {
    owner: v.string(),
    repo: v.string(),
  },
  handler: async (ctx, args) => {
    const token = await ensureGithubToken(ctx);
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


    return {
      openIssuesCount,
      closedIssuesCount,
      lastCommitDate,
      totalCommits,
      commitsLast60Days,
      totalPRs,
      mergedPRs,
      prMergeRate,

      issueCount:issueCount,
      prCount:prCount,

      velocity7d: Math.round(velocityCurrent),
      velocityPrev7d: Math.round(velocityPrevious),
      velocityDelta,
      velocityTrend,
      isFreshRepo,

      velocityBreakdown: {
        commits: commitScoreCurrent,
        issues: issueScoreCurrent,
        prs: prScoreCurrent,
      },


    };
  },


});




export const fetchRepoCollaborators = action({
  args: {
    owner: v.string(),
    repo: v.string(),
  },

  handler: async (ctx, { owner, repo }): Promise<GithubCollaborator[]> => {
    const token = await ensureGithubToken(ctx);

    let page = 1;
    const collaborators: GithubCollaborator[] = [];

    while (true) {
      const res = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/collaborators?per_page=100&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github+json",
            },
          }
      );

      if (res.status === 403 || res.status === 404) {
        return [];
      }

      if (!res.ok) {
        throw new Error("Failed to fetch collaborators");
      }

      const data: GithubCollaborator[] = await res.json();
      if (data.length === 0) break;

      collaborators.push(...data);
      page++;
    }

    return collaborators;
  },
});




export const fetchRepoLanguages = action({
  args: {
   owner: v.string(),
    repo: v.string(),
  },
  handler: async (ctx, args) => {
    const token = await ensureGithubToken(ctx);

    const res = await fetch(
    `https://api.github.com/repos/${args.owner}/${args.repo}/languages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch repo languages");
    }

    const raw: Record<string, number> = await res.json();

    const totalBytes = Object.values(raw).reduce((a, b) => a + b, 0);

    const breakdown = Object.entries(raw)
      .map(([language, bytes]) => ({
        language,
        bytes,
        percentage:
          totalBytes === 0
            ? 0
            : Math.round((bytes / totalBytes) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage);

    return {
      totalBytes,
      breakdown,
    };
  },
});


export const getGithubToken = action({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    return await getGithubAccessToken(identity.subject);
  },
});

export const fetchAndStoreGitHubToken = action({
  args:{
    clerkUserId:v.string()
  },
  handler: async (ctx,args) => {

    console.log("Args ClerkUserId" , args.clerkUserId)
    const clerkUserId = args.clerkUserId;
    console.log("ClerkUserId" , clerkUserId)

    // ✅ SINGLE source of truth
    const token = await getGithubAccessToken(clerkUserId);

    console.log("TOken", token)

    await ctx.runMutation(api.users.setGithubToken, {
      token: token,
    });

    console.log("[LOGIN] GitHub token stored Succefully in Convex");

    return { ok: true };
  },
});




export const getDashboardStats = action({
  args: {
    clerkId: v.string(),
    githubName: v.string(),
  },
  

  handler: async (ctx, args) => {
    console.log("Function Called.")


    // 1. Auth
    const identity = await ctx.auth.getUserIdentity();


    if (!identity) {
      throw new Error("Unauthenticated");
    }

    // ⚠️ this is still wrong architecturally, but logging only
    const token = await ensureGithubToken(ctx);

    if (!token && !args.githubName) {
      throw new Error("GitHub not connected");
    }

    const accessToken = token;
    const githubName = args.githubName;

    // 3. GitHub client
    const octokit = new Octokit({ auth: accessToken });
    
    // 4. Contributions

    const calendar = await fetchUserContributionsRaw(
      accessToken,
      githubName
    );

    
    const totalCommits = calendar?.totalContributions ?? 0;

    // 5. PRs
    const { data: pr } =
      await octokit.rest.search.issuesAndPullRequests({
        q: `author:${githubName} type:pr`,
        per_page: 1,
      });


    const { data: mergedPR } =
      await octokit.rest.search.issuesAndPullRequests({
        q: `author:${githubName} type:pr is:merged`,
        per_page: 1,
      });



    // 6. Issues

    const { data: closedIssues } =
      await octokit.rest.search.issuesAndPullRequests({
        q: `author:${githubName} type:issue is:closed`,
        per_page: 1,
      });

    const { data: openIssues } =
      await octokit.rest.search.issuesAndPullRequests({
        q: `author:${githubName} type:issue is:open`,
        per_page: 1,
      });


    // 7. Reviews

    const { data: reviews } =
      await octokit.rest.search.issuesAndPullRequests({
        q: `commenter:${githubName} type:pr`,
        per_page: 1,
      });


    // 8. Account age
   
    const { data: ghUser } =
      await octokit.rest.users.getByUsername({
        username: githubName,
      });


    const accountCreatedAt = new Date(ghUser.created_at);
    const accountAgeInYears =
      (Date.now() - accountCreatedAt.getTime()) /
      (1000 * 60 * 60 * 24 * 365);


    return {
      totalCommits,
      totalPRs: pr.total_count ?? 0,
      totalMergedPRs: mergedPR.total_count ?? 0,
      totalIssuesClosed: closedIssues.total_count ?? 0,
      totalOpenIssues: openIssues.total_count ?? 0,
      totalReviews: reviews.total_count ?? 0,
      accountAgeInYears,
      accountCreatedAt: ghUser.created_at,
    };
  },
});


//   Get Project Commits data

export const getProjectCommits = action({
  args:{
    owner:v.string(),
    repo : v.string(),
  },
  handler : async (ctx,args)=>{
    const identiy = await  ctx.auth.getUserIdentity()
    if(!identiy) {
      throw new Error("call commits with out Authentication")
    }

    const token = await ensureGithubToken(ctx)
    if(!token){
      throw  new Error("call commits with out token")
    }


    const octokit = new Octokit({
      auth:token
    })

    return await octokit.rest.repos.listCommits({
      owner: args.owner,
      repo: args.repo,
      per_page: 100,
    });
  }
})




//    Get Projects Pulls Request

export const getProjectPrs = action({
  args:{
    owner:v.string(),
    repo:v.string()
  },
  handler : async(ctx,args) =>{

    const identity = await ctx.auth.getUserIdentity()

    if(!identity){
      throw new Error("calling Project Pulls without Auth")
    }

    const token = await ensureGithubToken(ctx)
    if(!token){
      throw new Error("Calling Project Pulls without Token")
    }

    const octokit = new Octokit({auth:token})

    const pullRequests = await octokit.paginate(
        octokit.rest.pulls.list,
        {
          owner:args.owner,
          repo:args.repo,
          state: "all",
          per_page: 100,
        }
    )


    // Remove pull requests
    return pullRequests
  }
})




// Get project Issues


export const getProjectIssue = action({
  args:{
    owner:v.string(),
    repo:v.string()
  },
  handler : async(ctx,args) =>{

    const identity = await ctx.auth.getUserIdentity()

    if(!identity){
      throw new Error("calling Project Issue without Auth")
    }

    const token = await ensureGithubToken(ctx)
    if(!token){
      throw new Error("Calling Project Issues without Token")
    }

    const octokit = new Octokit({auth:token})

    const issues = await octokit.paginate(
        octokit.rest.issues.listForRepo,
        {
          owner:args.owner,
          repo:args.repo,
          state: "all",
          per_page: 100,
        }
    )


    // Remove pull requests
    return issues.filter(issue => !issue.pull_request)
  }
})
