import {action} from "../../_generated/server";
import {Octokit} from "octokit";
import {v} from "convex/values";
import {ensureGithubToken, setRateLimit} from "./GithubToken";
import {redis} from "../../redisClient";

export const RedisGetReadme = action({
    args:{
        owner:v.string(),
        repo:v.string(),
    },
    handler : async(ctx,args) =>{
        const { token ,identity} = await ensureGithubToken(ctx);

        if(!token) {
            throw  new Error("Call getReadMe without Token")
        }

        // Rate Limiting
        await setRateLimit("GithubGetReadme",identity.subject,`${args.owner}:${args.repo}`)

        const octokit = new Octokit({ auth: token });

        try {
            const { data } = await octokit.rest.repos.getReadme({
                owner:args.owner,
                repo:args.repo,
                mediaType: {
                    format: "raw",
                },
            });

            console.log("✅ README fetched successfully");
            return data as unknown as string;
        } catch (error) {
            console.error("❌ Error fetching README:", error);
            // If README doesn't exist, GitHub API returns 404
            return null;
        }

    }
})
