import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useGetProjectRequests(projectId: any) {
    return useQuery(
        api.projectRequests.getProjectRequests,
        projectId ? { projectId } : "skip"
    );
}
