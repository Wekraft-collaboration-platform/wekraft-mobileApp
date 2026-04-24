import {useAction} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useQuery} from "@tanstack/react-query";


export function useGithubProjectHealth(owner: string, repo: string) {
    // 1️⃣ Get the Convex action runner
    const runProjectHealth = useAction(
        api.Redis.GitHubData.RedisGetProjectHealthData.RedisGetProjectHealthData
    );

    // 2️⃣ TanStack Query wrapper
    return useQuery({
        queryKey: ["githubProjectHealth", owner, repo],
        queryFn: () =>
            runProjectHealth({
                owner,
                repo,
            }),
        enabled : Boolean(owner && repo),
        staleTime: 30 * 60 * 1000,   // 5 minutes
        gcTime: 30 * 60 * 1000,  // keep unused cache
        retry: 1,
    });
}

