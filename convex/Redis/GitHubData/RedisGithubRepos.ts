import {action} from "../../_generated/server";
import {ensureGithubToken, setRateLimit} from "./GithubToken";
import {redis} from "../../redisClient";


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


export const RedisFetchGithubRepos = action({
    args: {},
    handler: async (ctx): Promise<GithubRepo[] | null> => {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            throw new Error("Unauthenticated");
        }




        const userId = identity.subject; // ✅ secure


        // Rate Limiting on reddis
        const rateKey = `rate:repos:${userId}`
        await setRateLimit(rateKey,identity.subject)



        const cacheKey = `github:Repos:${userId}`;


        const cached = await redis.get<GithubRepo[]>(cacheKey);

        if (cached) {
            console.log("Redis Repo HIT");
            return cached;
        }

        const {token} = await ensureGithubToken(ctx);

        if(!token){
            throw new Error("GitHub API Token Not Found");

        }


        let page = 1;
        const allRepos: GithubRepo[] = [];

        while (page<=10) {
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
                throw new Error(`GitHub API failed: ${res.status}`);
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


        await redis.set(cacheKey,allRepos,{
            ex:1800
        })
        console.log("Redis Repo Set")

        return  allRepos
    },
});
