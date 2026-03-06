import {useConvex} from "convex/react";
import {useQuery} from "@tanstack/react-query";
import {api} from "@/convex/_generated/api";

export function useGetProjectRequests(projectId : any){
    const convex = useConvex()
    return useQuery({
        queryKey:["ProjectRequest",projectId],
        queryFn: async () => {
            if (!projectId) return [];
            return await convex.query(
                api.projectRequests.getProjectRequests,
                { projectId }
            );
        },
        retry : 1,
        enabled :!!projectId
    })

}
