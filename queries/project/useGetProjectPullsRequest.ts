import {useAction} from "convex/react";
import {useQuery} from "@tanstack/react-query";
import {api} from "@/convex/_generated/api";

export function useGetProjectPulls(owner:string,repo:string){
    const getPulls = useAction(api.github.getProjectPrs)

    return useQuery({
        queryKey:["ProjectPrs",owner,repo],
        queryFn : ()=>
            getPulls({owner,repo})
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

