import { QueryClient, useQuery } from "@tanstack/react-query"
import {api} from "@/convex/_generated/api";
import {useAction} from "convex/react"

export const FetchRepoColbarator =(owner:string,repo:string)=>{
    const fetchRepoColbarator = useAction(api.github.fetchRepoCollaborators)

    return useQuery({
        queryKey : ["Collab",owner,repo],
        queryFn: async()=> {
            const result =  await fetchRepoColbarator({owner,repo})
            return result.filter((item)=> item.login !== owner)
        },
        staleTime : 1000*60*30,
        gcTime : 1000*60*30,
        enabled : Boolean(owner && repo),
        retry : 1
        }
    )





}
