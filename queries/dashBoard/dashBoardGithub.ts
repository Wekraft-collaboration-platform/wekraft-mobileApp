import {api} from "@/convex/_generated/api";
import {useQuery} from "@tanstack/react-query";
import {useAction} from "convex/react";




function getMsUntilMidnight() {
    const now = new Date()
    const midnight = new Date()

    midnight.setHours(24, 0, 0, 0)

    return midnight.getTime() - now.getTime()
}


export const useGithubDashBoardInfo =(clerkId : string, githubName:string)=>{
    const fetchGithubDashBoardData = useAction(api.github.getDashboardStats)
    return useQuery({
            queryKey : ["DashBoardStat",githubName,clerkId],
            queryFn: async()=> {
               return await fetchGithubDashBoardData({clerkId,githubName})
            },
            staleTime: getMsUntilMidnight(),   // fresh until midnight
            gcTime: 24 * 60 * 60 * 1000,

            enabled : Boolean(clerkId && githubName),
            retry : 1
        }
    )
}