import { internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getGithubAccessToken } from "./Redis/GitHubData/githubHelper";
import {redis} from "./redisClient";
import {setRateLimit} from "./Redis/GitHubData/GithubToken";

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
      .withIndex("by_token", (q) =>
        q.eq("clerkToken", identity.tokenIdentifier)
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
      clerkToken: identity.tokenIdentifier,
      email: identity.email ?? "",
      avatarUrl: identity.pictureUrl ?? undefined,

      hasCompletedOnboarding: false,

      githubUsername: identity.nickname ?? undefined,
      github: `https://github.com/${identity.nickname}`,
      last_sign_in:
        typeof identity.user_last_sign_in === "number"
          ? identity.user_last_sign_in
          : undefined,
      // DEFAULT PLAN
      accountType: "free",
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
        .withIndex("by_token", (q) =>
            q.eq("clerkToken", identity.tokenIdentifier)
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
    name:v.optional(v.string()),
    primaryUsage: v.optional(v.array(v.string())),

  },


  handler : async (ctx,args)=>{
    const identity = await ctx.auth.getUserIdentity()
    if(!identity){
      throw new Error("Called updateUser without authentication present")
    }



    const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
            q.eq("clerkToken", identity.tokenIdentifier)
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
    if(args.name !== undefined) updates.name = args.name
    if(args.primaryUsage !== undefined) updates.primaryUsage = args.primaryUsage


    if(args.github !== undefined) updates.github = args.github
    if(args.linkedin !== undefined) updates.linkedin = args.linkedin
    if(args.website !== undefined) updates.website = args.website

    if(args.featuredProjectIds !== undefined) updates.featuredProjectIds = args.featuredProjectIds
    if (args.commits !== undefined) updates.commits = args.commits
    if (args.pr !== undefined) updates.pr = args.pr
    if (args.issues !== undefined) updates.issues = args.issues
    if (args.impactScore !== undefined) updates.impactScore = args.impactScore


    if (user.updatedAt && (Date.now() - user.updatedAt < 5000)) {
      throw new Error("Too frequent updates");
    }

    await ctx.db.patch(user._id, updates)
  }
})



// ==============================
// UPDATES USER FOR ONBOARDING
// =============================

export const updateUserPrimaryUsage = mutation({
  args: { purposes: v.array(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
            q.eq("clerkToken", identity.tokenIdentifier),
        )
        .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      primaryUsage: args.purposes,
      updatedAt: Date.now(),
    });
  },
});

export const updateUserIdentity = mutation({
  args: {
    name: v.string(),
    occupation: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("unauthorized");
    }

    const currentUser = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
            q.eq("clerkToken", identity.tokenIdentifier),
        )
        .unique();

    if (!currentUser) throw new Error("User not found");

    if (args.name.length < 3 || args.name.length > 20) {
      throw new Error("Username must be between 3 and 20 characters");
    }

    // Check if name is already taken by a diff user
    const existingUserWithName = await ctx.db
        .query("users")
        .withIndex("by_name", (q) => q.eq("name", args.name))
        .unique();

    if (existingUserWithName && existingUserWithName._id !== currentUser._id) {
      throw new Error("Username is already taken");
    }

    await ctx.db.patch(currentUser._id, {
      name: args.name,
      occupation: args.occupation,
    });
  },
});

export const completeOnboarding = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
            q.eq("clerkToken", identity.tokenIdentifier),
        )
        .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      hasCompletedOnboarding: true,
      updatedAt: Date.now(),
    });
  },
});

// ==============================
// UPGRADE ACCOUNT (Usage for Coupons/Payments)
// =============================
export const upgradeAccount = mutation({
  args: {
    plan: v.union(v.literal("plus"), v.literal("pro")),
    durationDays: v.optional(v.number()), // e.g., 7 days for a 1-week coupon
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
            q.eq("clerkToken", identity.tokenIdentifier),
        )
        .unique();

    if (!user) throw new Error("User not found");

    let planExpiry = undefined;
    if (args.durationDays) {
      planExpiry = Date.now() + args.durationDays * 24 * 60 * 60 * 1000;
    }

    await ctx.db.patch(user._id, {
      accountType: args.plan,
      planExpiry,
      updatedAt: Date.now(),
    });

    return { success: true, plan: args.plan, expires: planExpiry };
  },
});

// =======================================
// UPDATE USER PROFILE
// =======================================
export const updateUserBio = mutation({
  args: { bio: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
            q.eq("clerkToken", identity.tokenIdentifier),
        )
        .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      bio: args.bio,
      updatedAt: Date.now(),
    });
  },
});

// Add this to r:\wekraft-saas\convex\user.ts

export const updateSocialLinks = mutation({
  args: { links: v.array(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
            q.eq("clerkToken", identity.tokenIdentifier),
        )
        .unique();

    if (!user) throw new Error("User not found");

    const trimmedLinks = args.links.slice(0, 3);

    await ctx.db.patch(user._id, {
      socialLinks: trimmedLinks,
      updatedAt: Date.now(),
    });
  },
});

// ==================================
// GET USER BY ID (name + avatar + accountType)
// ==================================
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    return {
      name: user.name ?? "Unknown",
      avatarUrl: user.avatarUrl ?? null,
      accountType: user.accountType,
    };
  },
});

export const getUserByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
        .query("users")
        .withIndex("by_name", (q) => q.eq("name", args.name))
        .unique();
  },
});

