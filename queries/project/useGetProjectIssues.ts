import {useAction} from "convex/react";
import {useQuery} from "@tanstack/react-query";
import {api} from "@/convex/_generated/api";

export function useGetProjectIssue(owner:string,repo:string){
    const getIssues = useAction(api.github.getProjectIssue)

    return useQuery({
        queryKey:["ProjectIssues",owner,repo],
        queryFn : ()=>
            getIssues({owner,repo})
        ,
        enabled: Boolean(owner && repo),
        // staleTime: 30 * 60 * 1000,   // 5 minutes
        // gcTime: 30 * 60 * 1000,  // keep unused cache
        // DISABLE AUTOMATIC REFETCHES
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // refetchOnReconnect: false,
        retry :1
    })
}

