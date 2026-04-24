import {action} from "../../_generated/server";
import {redis} from "../../redisClient";
import {Octokit} from "octokit";
import {v} from "convex/values";

import {ensureGithubToken,getfetchUserContributionsRaw,setRateLimit} from "./GithubToken"

export const RedisGetGithubDashboard = action({
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


        const userId = identity.subject; // ✅ secure
        const githubName = args.githubName;



        // Rate Limiting on reddis
        await setRateLimit("GithubDashBoard",userId)


        // 🧠 Safe cache key
        const cacheKey = `github:dashboard:${userId}:${githubName}`;

        // ⚡ 1. Check Redis
        const cached = await redis.get(cacheKey);
        if (cached) {
            console.log("Redis DashBoard Hit")
            return cached;
        }

        // ⚠️ this is still wrong architecturally, but logging only
        const {token} = await ensureGithubToken(ctx);

        if (!token && !args.githubName) {
            throw new Error("GitHub not connected");
        }

        const accessToken = token;

        // 3. GitHub client
        const octokit = new Octokit({ auth: accessToken });

        // 4. Contributions

        const calendar = await getfetchUserContributionsRaw(
            ctx,
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


        const result = {
            totalCommits,
            totalPRs: pr.total_count ?? 0,
            totalMergedPRs: mergedPR.total_count ?? 0,
            totalIssuesClosed: closedIssues.total_count ?? 0,
            totalOpenIssues: openIssues.total_count ?? 0,
            totalReviews: reviews.total_count ?? 0,
            accountAgeInYears,
            accountCreatedAt: ghUser.created_at,
        };

        await redis.set(cacheKey,result,{
            ex:1800
        })
        console.log("Redis  DashBoard Set")


        return result
    },
});
