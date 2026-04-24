import {action} from "../../_generated/server";
import {fetchUserContributionsRaw, getGithubAccessToken} from "./githubHelper";
import {redis} from "../../redisClient";

export async function ensureGithubToken(ctx: any): Promise<{
    token: string;
    identity: any;
}> {

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new Error("Unauthenticated");
    }

    const token = await getGithubAccessToken(identity.subject);

    return {
        token,
        identity
    };
}

export async function getfetchUserContributionsRaw(
    ctx: any,
    token: string,
    githubUsername: string){
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new Error("Unauthenticated");
    }

    return await fetchUserContributionsRaw(token, githubUsername);

}

export async function setRateLimit(key:string,identity:string,res?:string){



    const globalKey = `redis:GlobalKey:${identity}`
    const rateKey = res ?`redis:${key}:${identity}:${res}` :`redis:${key}:${identity}`

    const count = await redis.incr(rateKey)
    const globalCount = await redis.incr(globalKey)

    if(globalCount === 1){
        await redis.expire(globalKey, 300);

    }
    if(count ===1 ){
        await redis.expire(rateKey, 60);
    }


    if(count >10 || globalCount >60){
        throw new Error("Too many requests");
    }


}