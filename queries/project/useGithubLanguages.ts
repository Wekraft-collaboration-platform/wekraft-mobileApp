import {useAction} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useQuery} from "@tanstack/react-query";


export function useGithubLanguages(owner: string, repo: string) {
    // 1️⃣ Get the Convex action runner
    const runLanguages = useAction(
        api.Redis.GitHubData.RedisGetRepoLanguges.RedisFetchRepoLanguages
    );

    // 2️⃣ TanStack Query wrapper
    return useQuery({
        queryKey: ["githubLanguages", owner, repo],

        queryFn: () =>
            runLanguages({
                owner,
                repo,
            }),

        enabled : Boolean(owner && repo),
        staleTime: 30 * 60 * 1000,   // 5 minutes
        gcTime: 30 * 60 * 1000,  // keep unused cache
        retry: 1,
    });
}
