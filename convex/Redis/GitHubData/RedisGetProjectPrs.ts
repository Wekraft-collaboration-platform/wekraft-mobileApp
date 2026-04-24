import {action} from "../../_generated/server";
import {Octokit} from "octokit";
import {v} from "convex/values";
import {ensureGithubToken, setRateLimit} from "./GithubToken";
import {redis} from "../../redisClient";

export const RedisGetProjectPrs = action({
    args:{
        owner:v.string(),
        repo:v.string()
    },
    handler : async(ctx,args) =>{

        const {token,identity} = await ensureGithubToken(ctx)
        if(!token){
            throw new Error("Calling Project Pulls without Token")
        }

        const cacheKey = `redis:githubProjectPrs:${args.owner}:${args.repo}`

        const cached = await redis.get(cacheKey);
        if (cached) {
            console.log("Redis Project Prs Hit")
            return cached;
        }

        await setRateLimit("GithubProjectPRs",identity.subject,`${args.owner}:${args.repo}`)

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

        await redis.set(cacheKey,pullRequests,{
            ex:1800
        })

        console.log("Redis Prs Set")


        // Remove pull requests
        return pullRequests
    }
})


