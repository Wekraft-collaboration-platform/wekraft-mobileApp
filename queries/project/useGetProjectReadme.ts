import { useQuery } from "@tanstack/react-query"
import { useAction } from "convex/react"
import { api } from "@/convex/_generated/api"

export const useGetProjectReadme = (owner:string , repo:string) => {
    const getProjectReadme = useAction(api.Redis.GitHubData.RedisGithubGetReadme.RedisGetReadme)

    return useQuery({
        queryKey: ["project-readme", owner, repo],
        queryFn: () => getProjectReadme({ owner,repo }),
        enabled: false,
        staleTime: Infinity,
        gcTime: Infinity,
        retry: 1
    })
}