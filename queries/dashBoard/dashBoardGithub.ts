import {api} from "@/convex/_generated/api";
import {useQuery} from "@tanstack/react-query";
import {useAction} from "convex/react";



type GithubDashboard = {
    totalCommits: number;
    totalPRs: number;
    totalMergedPRs: number;
    totalIssuesClosed: number;
    totalOpenIssues: number;
    totalReviews: number;
    accountAgeInYears: number;
    accountCreatedAt: string;
};

function getMsUntilMidnight() {
    const now = new Date()
    const midnight = new Date()

    midnight.setHours(24, 0, 0, 0)

    return midnight.getTime() - now.getTime()
}


export const useGithubDashBoardInfo = (
    clerkId: string,
    githubName: string
) => {
    const fetchGithubDashBoardData =
        useAction(api.Redis.GitHubData.RedisGithubDashboard.RedisGetGithubDashboard) as (

            args: { clerkId: string,githubName: string }
        ) => Promise<GithubDashboard>;

    return useQuery<GithubDashboard>({
        queryKey: ["DashBoardStat", githubName, clerkId],

        queryFn: async () => {
            return await fetchGithubDashBoardData({ clerkId, githubName });
        },

        staleTime: 5 * 60 * 1000, // 5 min (match Redis)
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
};