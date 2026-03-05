import {api} from "@/convex/_generated/api";
import {useQuery} from "@tanstack/react-query";
import {useAction} from "convex/react";

export const useGithubDashBoardInfo =(clerkId : string, githubName:string)=>{
    const fetchGithubDashBoardData = useAction(api.github.getDashboardStats)
    return useQuery({
            queryKey : ["DashBoardStat",githubName,clerkId],
            queryFn: async()=> {
               return await fetchGithubDashBoardData({clerkId,githubName})
            },
            // staleTime : 1000*60*30,
            // gcTime : 1000*60*30,
            enabled : Boolean(clerkId && githubName),
            retry : 1
        }
    )
}