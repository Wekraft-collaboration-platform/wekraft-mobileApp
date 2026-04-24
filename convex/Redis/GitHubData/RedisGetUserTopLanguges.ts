import {action} from "../../_generated/server";
import {Octokit} from "octokit";
import {ensureGithubToken, setRateLimit} from "./GithubToken";
import {v} from "convex/values";
import {redis} from "../../redisClient";

export const RedisGetUserTopLanguages = action({
    args:{
        username : v.string(),
    },
    handler : async(ctx,args)=>{

        const {token,identity} = await ensureGithubToken(ctx);
        const octokit = new Octokit({ auth: token });




        const rateKey = `rate:GitHubLanguges:${args.username}`
        await setRateLimit(rateKey,identity.subject)


        try {
            const { data: repos } = await octokit.rest.repos.listForUser({
                username:args.username,
                per_page: 30,
                sort: "pushed",
                direction: "desc",
                type: "owner",
            });

            console.log(`📦 Got ${repos.length} repos — counting languages...`);

            // count how many repos each language appears in
            const counts: Record<string, number> = {};
            for (const repo of repos) {
                if (!repo.language) continue;
                counts[repo.language] = (counts[repo.language] ?? 0) + 1;
            }

            console.log(`📊 Raw language counts:`, counts);

            const threshold = repos.length * 0.1; // 30 * 0.1 = 3 repos minimum
            const topLanguages = Object.entries(counts)
                .filter(([, count]) => count >= threshold)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 4)
                .map(([lang]) => lang);

            console.log(`✅ Top languages for ${args.username}:`, topLanguages);
            return topLanguages;
        } catch (error) {
            console.error(`❌ Error fetching languages for ${args.username}:`, error);
            return [];
        }
    }
})
