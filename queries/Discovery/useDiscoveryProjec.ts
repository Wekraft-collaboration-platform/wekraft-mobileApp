import { useQuery } from "@tanstack/react-query";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";

export const useDiscoveryProject = (
    tags: string[],
    roles: string[],
    query : string
) => {
    const convex = useConvex();

    return useQuery({
        queryKey: [
            "DiscoveryProjects",
            tags.join(","),
            roles.join(","),
            query
        ],

        queryFn: () =>
            convex.query(api.discoveryProject.searchAndRank, {
                tags,
                roles,
                query
            }),

        // enabled: tags.length > 0 || roles.length > 0,

        staleTime: 1000 * 60 * 2, // 2 minutes cache
    });
};