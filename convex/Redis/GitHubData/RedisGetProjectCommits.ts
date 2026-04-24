import {action} from "../../_generated/server";
import {Octokit} from "octokit";
import {ensureGithubToken, setRateLimit} from "./GithubToken";
import {v} from "convex/values";
import {redis} from "../../redisClient";

export const RedisGetProjectCommits = action({
    args:{
        owner:v.string(),
        repo : v.string(),
    },
    handler : async (ctx,args)=>{

        const {token,identity} = await ensureGithubToken(ctx)
        if(!token){
            throw  new Error("call commits with out token")
        }


        const cacheKey = `redis:githubProjectCommits:${args.owner}:${args.repo}`

        const cached = await redis.get(cacheKey);
        if (cached) {
            console.log("Redis Project Commit Hit")
            return cached;
        }

        await setRateLimit("GithubProjectCommits",identity.subject,`${args.owner}:${args.repo}`)


        const octokit = new Octokit({
            auth:token
        })

        const result = await octokit.rest.repos.listCommits({
            owner: args.owner,
            repo: args.repo,
            per_page: 100,
        });

       await redis.set(cacheKey,result,{
            ex:1800
        })
        console.log("Redis Project Commit Set")


        return result
    }
})


