import {useAction} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {GithubRepo} from "@/constraints/interface";


export function repoFetchAllUserRepo(){
    const runGetRepos = useAction(
        api.github.fetchGithubRepos
    );

    return useQuery({
        queryKey: ["githubRepos"],
        queryFn: () =>
            runGetRepos(),

        // CRITICAL CONFIG
        staleTime: Infinity,          // never stale
        gcTime: Infinity,             // never garbage collected

        // DISABLE AUTOMATIC REFETCHES
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
    });
}


export function SelectedRepo(){
    const queryClient = useQueryClient();

    const repo = queryClient.getQueryData<GithubRepo>(["selectedRepo"])

    if (!repo) {
        throw new Error("Selected repo not found in TanStack Query cache");
    }

    return repo;


}