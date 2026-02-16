import {useQuery as ConvexQuerry} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useQuery} from "@tanstack/react-query";


export const useGetUserProjects = (owner:string, clerkId:any) => {
    const getProjects = ConvexQuerry(api.projects.getProjects)

    return useQuery({
        queryKey:["projects"],
        queryFn:  () => {
           return getProjects
        },
        enabled : Boolean(clerkId && owner),
        }

    )
}