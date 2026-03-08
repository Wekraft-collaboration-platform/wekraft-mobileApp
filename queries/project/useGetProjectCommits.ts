import {useAction} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useQuery} from "@tanstack/react-query";


export function useGetProjectCommits(owner:string,repo:string){
    const getCommits = useAction(api.github.getProjectCommits)

    return useQuery({
        queryKey:["ProjectCommits",owner,repo],
        queryFn : ()=>
            getCommits({owner,repo})
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
