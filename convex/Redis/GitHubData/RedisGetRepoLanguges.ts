import {action} from "../../_generated/server";
import {ensureGithubToken, setRateLimit} from "./GithubToken";
import {v} from "convex/values";
import {redis} from "../../redisClient";

export const RedisFetchRepoLanguages = action({
    args: {
        owner: v.string(),
        repo: v.string(),
    },
    handler: async (ctx, args) => {
        const {token,identity} = await ensureGithubToken(ctx);

        if(!token){
            throw  new Error("call Fetch Languges with out token")
        }

        const cacheKey = `redis:githubFetchRepoLanguages:${args.owner}:${args.repo}`

        const cached = await redis.get(cacheKey);
        if (cached) {
            console.log("Redis Project Commit Hit")
            return cached;
        }

        await setRateLimit("GithubFetchRepoLanguages",identity.subject,`${args.owner}:${args.repo}`)

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

        const result = {
            totalBytes,
            breakdown
        }

        await redis.set(cacheKey,result,{
            ex:1800
        })
        console.log("Redis Repo Languages Hit")

        return result
    },
});



