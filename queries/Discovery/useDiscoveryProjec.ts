import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";

export const useDiscoveryProject = (
    tags: string[],
    roles: string[],
    query: string
) => {
    return useQuery(api.discoveryProject.searchAndRank, {
        tags,
        roles,
        query
    });
};