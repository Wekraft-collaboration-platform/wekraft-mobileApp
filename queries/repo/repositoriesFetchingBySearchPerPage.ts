import { QueryClient, useQuery } from "@tanstack/react-query"
import {api} from "@/convex/_generated/api";
import {useAction} from "convex/react"

export const FetchRepoBySearchAndPage =(searchQuery : string,page : number)=>{
    const getRepoStories = useAction(api.github.getRepositoriesBySearch)

    return useQuery({
        queryKey : ["RepoStoriesBySearch",page,searchQuery],
        queryFn: ()=>  getRepoStories({page,searchQuery}),
        staleTime : 1000*60*30,
        enabled : Boolean(page > 0 && searchQuery),
        retry : 1
        }
    )

}
