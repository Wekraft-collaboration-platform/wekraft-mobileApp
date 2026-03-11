
import {query} from "./_generated/server";
import {v} from "convex/values";


// ================================= ================================= =================================
//                                            Fetching Projects
// ================================= ================================= =================================


const PAGE_SIZE = 10;

export const fetchDefaultDiscoverProject = query({
    args: {
        cursor: v.optional(v.number()), // _creationTime
    },

    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");


        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) =>
                q.eq("clerkId", identity.subject)
            )
            .first();

        if (!user) {
            throw new Error("Unauthorized access");
        }


        let q = ctx.db
            .query("projects")
            .withIndex("by_creation_time", q =>
                args.cursor
                    ? q.lt("_creationTime", args.cursor)
                    : q
            )
            .order("desc");

        const results = await q.take(PAGE_SIZE + 1);

        const hasMore = results.length > PAGE_SIZE;
        const items = results.slice(0, PAGE_SIZE);

        return {
            items,
            hasMore,
            nextCursor: hasMore
                ? items[items.length - 1]._creationTime
                : null,
        };
    },
});




// =======================================
// SEARCH AND RANK PROJECTS
// =======================================
export const searchAndRank = query({
    args: {
        query : v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        roles: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        // Fetch all public projects
        const allPublicProjects = await ctx.db
            .query("projects")
            .withIndex("by_public", (q) => q.eq("isPublic", true))
            .collect();

        // If no tags or roles provided, just return all public projects ranked
        if (!args.tags && !args.roles && !args.query) {
            return allPublicProjects.sort((a, b) => {
                const scoreA = a.healthScore?.totalScore ?? 0;
                const scoreB = b.healthScore?.totalScore ?? 0;
                return scoreB - scoreA;
            });
        }

        const filtered = allPublicProjects.filter((project) => {
            const hasTags = args.tags && args.tags.length > 0;
            const hasRoles = args.roles && args.roles.length > 0;
            const hasQuery = args.query && args.query.trim().length > 0;

            const normalize = (text: string) =>
                text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

            let queryMatch = true;

            if (hasQuery) {
                const projectName = normalize(project.projectName);
                const tokens = normalize(args.query!).split(" ");

                queryMatch = tokens.every(token => projectName.includes(token));
            }
            let tagMatch = true;
            if (hasTags) {
                tagMatch = project.tags.some((tag) => args.tags!.includes(tag));
            }

            // Check roles match
            let roleMatch = true;
            if (hasRoles) {
                roleMatch = project.lookingForMembers
                    ? project.lookingForMembers.some((m) => args.roles!.includes(m.role))
                    : false;
            }

            // Intersection (AND) logic: Must satisfy both if both are provided
            return tagMatch && roleMatch && queryMatch;
        });

        // Rank by healthScore totalScore
        return filtered.sort((a, b) => {
            const scoreA = a.healthScore?.totalScore ?? 0;
            const scoreB = b.healthScore?.totalScore ?? 0;
            return scoreB - scoreA;
        });
    },
});
