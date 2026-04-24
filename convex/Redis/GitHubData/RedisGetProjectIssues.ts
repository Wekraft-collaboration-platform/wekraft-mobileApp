import {action} from "../../_generated/server";
import {Octokit} from "octokit";
import {ensureGithubToken,setRateLimit} from "./GithubToken";
import {v} from "convex/values";
import {redis} from "../../redisClient";

export const RedisGetProjectIssue = action({
    args:{
        owner:v.string(),
        repo:v.string()
    },
    handler : async(ctx,args) =>{

        const {token,identity} = await ensureGithubToken(ctx)

        if(!token){
            throw new Error("Calling Project Issues without Token")
        }

        const cacheKey = `redis:githubProjectIssue:${args.owner}:${args.repo}`

        const cached = await redis.get(cacheKey);
        if (cached) {
            console.log("Redis Project Issues Hit")
            return cached;
        }

        await setRateLimit("GithubProjectIssue",identity.subject,`${args.owner}:${args.repo}`)


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
        const result = issues.filter(issue => !issue.pull_request)
        await redis.set(cacheKey,result,{
            ex:1800
        })

        console.log("Redis Issue Set")
        return result
    }
})


