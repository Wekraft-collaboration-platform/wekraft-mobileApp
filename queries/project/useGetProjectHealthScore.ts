import {useAction} from "convex/react";
import {useQuery} from "@tanstack/react-query";
import {api} from "@/convex/_generated/api";

export function useGetProjectHealthScore(projectId: any) {
    const getScore = useAction(api.Redis.ProjectHealthScore.projecthealth.getProjectHealthScore)

    return useQuery({
        queryKey:["ProjectHealthScore",projectId],
        queryFn : ()=>
            getScore({projectId})
        ,
        enabled : false,
        // enabled: Boolean(projectId),
        // retry :1
    })
}

