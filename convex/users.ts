import { internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getGithubAccessToken } from "./githubHelper";

/**
 * 📘 CONVEX CHEATSHEET: How to write Backend Functions
 *
 * 1️⃣  QUERIES (Fetching Data)
 *    - Used to READ from the database.
 *    - They are "Reactive" (Frontend updates automatically when data changes).
 *    - Syntax Example:
 *      export const getSomething = query({
 *         args: { userId: v.id("users") }, // Validates args (requires: import { v } from "convex/values")
 *         handler: async (ctx, args) => {
 *            return await ctx.db.get(args.userId);
 *         }
 *      });
 *    - Frontend Usage:
 *      const data = useQuery(api.users.getSomething, { userId: "..." });
 *
 * 2️⃣  MUTATIONS (Changing Data)
 *    - Used to CREATE, UPDATE, or DELETE data.
 *    - Runs consistently (Atomic transactions).
 *    - Syntax Example:
 *      export const updateName = mutation({
 *         args: { id: v.id("users"), newName: v.string() },
 *         handler: async (ctx, args) => {
 *            // UPDATE:
 *            await ctx.db.patch(args.id, { name: args.newName });
 *
 *            // CREATE:
 *            // await ctx.db.insert("users", { name: "New guy" });
 *         }
 *      });
 *    - Frontend Usage:
 *      const mutate = useMutation(api.users.updateName);
 *      // In a function or useEffect:
 *      mutate({ id: "...", newName: "New Name" });
 */

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    console.log("identity from clerk ", identity)

    // This guarantees:
    // ❌ Mutation cannot run without Convex auth
    // ✅ Clerk → Convex token bridge is required

    // console.log("identity from clerk ", identity);
    // Find user by tokenIdentifier
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    // If user already exists
    if (user) {
      const updates: Partial<typeof user> = {};

      if (user.name !== identity.name && identity.name) {
        updates.name = identity.name;
      }

      if (Object.keys(updates).length > 0) {
        updates.updatedAt = Date.now();
        await ctx.db.patch(user._id, updates);
      }

      return user._id;
    }

    // Create new user
    return await ctx.db.insert("users", {
      name: identity.name ?? "Anonymous",
      clerkId: identity.subject,
      email: identity.email ?? "",
      imageUrl: identity.pictureUrl ?? undefined,

      hasCompletedOnboarding: false,

      githubUsername: identity.nickname ?? undefined,
      github: `https://github.com/${identity.nickname}`,
      githubAccessToken: undefined, // will be set later after OAuth
      last_sign_in:
        typeof identity.user_last_sign_in === "number"
          ? identity.user_last_sign_in
          : undefined,
      inviteLink: undefined,
      // DEFAULT PLAN
      type: "free",
      limit: 2,

      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    );


  },
});


// =========================================
// GET CURRENT USER
// =========================================
// changes fron query to internalQuery
// Secure
// ✔ Backend-only
// ✔ Reusable by mutations / checks
// Not exposed to the browser
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    return user ?? null;
  },
});



export const getUserbyId = query({
  args:{
    userId : v.id("users")
  },
  handler: async (ctx,args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const user = await ctx.db
        .query("users")
        .withIndex("by_id", (q) =>
            q.eq("_id", args.userId)
        )
        .unique();

    return user ?? null;
  },
});





export const connectGithub = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
        .query("users")
         .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
        .unique();

    if (!user) throw new Error("User not found");

    const token = await getGithubAccessToken(identity.subject);

    await ctx.db.patch(user._id, {
      githubAccessToken: token,
      updatedAt: Date.now(),
    });
  },
});


// =========================================
// SET GITHUB ACCESS TOKEN
// =========================================
export const setGithubToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) =>
            q.eq("clerkId", identity.subject)
        )
        .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      githubAccessToken: args.token,
      updatedAt: Date.now(),
    });
  },
});


// =========================================
// COMPLETE ONBOARDING
// =========================================
export const completeOnboarding = mutation({
  args: {}, // No args needed for now, just a status flip
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error(
        "Called completeOnboarding without authentication present"
      );
    }

    const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) =>
            q.eq("clerkId", identity.subject)
        )
        .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      hasCompletedOnboarding: true,
    });
  },
});


export const updateUser = mutation({
  args:{
    bio:v.optional(v.string()),
    occupation:v.optional(v.string()),
    phoneNumber:v.optional(v.string()),
    countryCode : v.optional(v.string()),
    onboardingCompleted:v.optional(v.boolean()),
    commits:v.optional(v.number()),
    pr: v.optional(v.number()),
    issues: v.optional(v.number()),
    impactScore : v.optional(v.number()),
    techStack: v.optional(v.array(v.string())),
    featuredProjectIds: v.optional(v.array(v.id("projects"))),
    linkedin: v.optional(v.string()),
    website: v.optional(v.string()),
    github: v.optional(v.string()),


  },
  handler : async (ctx,args)=>{
    const identity = await ctx.auth.getUserIdentity()
    if(!identity){
      throw new Error("Called updateUser without authentication present")
    }

    const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) =>
            q.eq("clerkId", identity.subject)
        )
        .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.bio !== undefined) updates.bio = args.bio
    if (args.occupation !== undefined) updates.occupation = args.occupation
    if (args.phoneNumber !== undefined) updates.phoneNumber = args.phoneNumber
    if (args.countryCode !== undefined) updates.countryCode = args.countryCode
    if (args.onboardingCompleted !== undefined)
      updates.hasCompletedOnboarding = args.onboardingCompleted

    if(args.techStack !== undefined) updates.techStack = args.techStack

    if(args.github !== undefined) updates.github = args.github
    if(args.linkedin !== undefined) updates.linkedin = args.linkedin
    if(args.website !== undefined) updates.website = args.website

    if(args.featuredProjectIds !== undefined) updates.featuredProjectIds = args.featuredProjectIds
    if (args.commits !== undefined) updates.commits = args.commits
    if (args.pr !== undefined) updates.pr = args.pr
    if (args.issues !== undefined) updates.issues = args.issues
    if (args.impactScore !== undefined) updates.impactScore = args.impactScore

    await ctx.db.patch(user._id, updates)
  }
})


// =========================================
// Get Github Token
// =========================================
export const getGithubToken = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        // console.log("User : ", user)
        if (!identity) return null;



      const dbUser = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) =>
              q.eq("clerkId", identity.subject)
          )
          .first();

        return dbUser?.githubAccessToken ?? null;
    },
});