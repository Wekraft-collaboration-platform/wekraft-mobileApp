import { QueryClient, useQuery } from "@tanstack/react-query"
import {api} from "@/convex/_generated/api";
import {useAction} from "convex/react"

export const FetchRepoByPage =(page : number)=>{
    const getRepoStories = useAction(api.github.getRepositories)

    return useQuery({
        queryKey : ["RepoStories",page],
        queryFn: ()=>  getRepoStories({page}),
        staleTime : 1000*60*30,
        enabled : Boolean(page > 0),
        retry : 1
        }
    )





}
