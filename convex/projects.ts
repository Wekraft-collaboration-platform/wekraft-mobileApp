import {ConvexError, v} from "convex/values";
import { mutation, query } from "./_generated/server";
import {setRateLimit} from "./Redis/GitHubData/GithubToken";
import { customAlphabet } from "nanoid";
import {getPlanLimits} from "./pricing";

// export const create = mutation({
//   args: {
//     projectName: v.string(),
//     description: v.string(),
//     tags: v.array(v.string()), // Validation (2-5 tags) will be checked here
//     isPublic: v.boolean(),
//     repositoryId: v.id("repositories"),
//     thumbnailUrl: v.optional(v.string()),
//     // Denormalized repository data
//     repoName: v.string(),
//     repoFullName: v.string(),
//     repoOwner: v.string(),
//     repoUrl: v.string(),
//     lookingForMembers: v.optional(
//         v.array(
//             v.object({
//               role: v.string(),
//               type: v.union(
//                   v.literal("casual"),
//                   v.literal("part-time"),
//                   v.literal("serious")
//               ),
//             })
//         )
//     ),
//   },
//
//   handler: async (ctx, args) => {
//
//     console.log("Create project is Running at :", Date.now())
//
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       throw new Error("Unauthenticated");
//     }
//
//     const user = await ctx.db
//       .query("users")
//         .withIndex("by_token", (q) =>
//             q.eq("clerkToken", identity.subject)
//         )
//       .unique();
//
//     if (!user) {
//       throw new Error("User not found");
//     }
//
//     // Server-side validation for tags
//     if (args.tags.length < 2 || args.tags.length > 5) {
//       throw new Error("Please select between 2 and 5 tags.");
//     }
//
//     // Check if teh smae Project is Alrready Exixsits or not
//
//     const project = await ctx.db.query("projects")
//         .withIndex("by_repoUrl",(q)=>q.eq("repoUrl",args.repoUrl))
//         .first()
//
//     if(project){
//       throw  new ConvexError("Project Already Exists")
//     }
//
//     // Check if project with same name already exists for this user (optional but good practice)
//     // For now, we'll allow it or rely on unique constraints if any.
//     // Schema doesn't enforce unique project name per user, but it's good UX.
//     // omitted for MVP speed unless requested.
//
//     const projectId = await ctx.db.insert("projects", {
//       projectName: args.projectName,
//       description: args.description,
//       tags: args.tags,
//       isPublic: args.isPublic,
//       thumbnailUrl: args.thumbnailUrl,
//       repositoryId: args.repositoryId,
//       repoName: args.repoName,
//       repoFullName: args.repoFullName,
//       repoOwner: args.repoOwner,
//       repoUrl: args.repoUrl,
//       ownerId: user._id,
//       lookingForMembers: args.lookingForMembers,
//       createdAt: Date.now(),
//       updatedAt: Date.now(),
//     });
//     console.log("Create project is Finshed at :", Date.now())
//
//
//     return projectId;
//
//   },
// });
//
//


const slugId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 5);

function slugifyProjectName(name: string) {
  const base = name
      .toLowerCase()
      .trim()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  return base.length ? base : "project";
}


// =============================
// CREATE PROJECT
// =============================
export const projectInit = mutation({
  args: {
    projectName: v.string(),
    description: v.optional(v.string()),
    isPublic: v.boolean(),
    projectStatus: v.string(),
    inviteLink: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Called projectInit without authentication present");
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

    // --- PRICING & LIMITS CHECK ---
    const limits = getPlanLimits(user);
    const userProjects = await ctx.db
        .query("projects")
        .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
        .collect();

    if (userProjects.length >= limits.project_creation_limit) {
      throw new Error(
          `You've reached your limit of ${limits.project_creation_limit} projects. Please upgrade your plan to create more!`,
      );
    }

    // Check for unique invite link (only on new project creation)
    const existingProjectWithInvite = await ctx.db
        .query("projects")
        .withIndex("by_invite_link", (q) => q.eq("inviteLink", args.inviteLink))
        .unique();

    if (existingProjectWithInvite) {
      throw new Error("Invite link already exists.");
    }

    // Create globally-unique slug: "<kebab-name>-<5 random chars>"
    const slugBase = slugifyProjectName(args.projectName);
    let slug = `${slugBase}-${slugId()}`;
    for (let attempt = 0; attempt < 10; attempt++) {
      const existingBySlug = await ctx.db
          .query("projects")
          .withIndex("by_slug", (q) => q.eq("slug", slug))
          .unique();
      if (!existingBySlug) break;
      slug = `${slugBase}-${slugId()}`;
    }

    const stillExists = await ctx.db
        .query("projects")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
    if (stillExists) {
      throw new Error("Could not create a unique project slug. Please retry.");
    }

    const projectId = await ctx.db.insert("projects", {
      projectName: args.projectName,
      slug,
      description: args.description,
      isPublic: args.isPublic,
      projectWorkStatus: args.projectStatus as any,
      ownerId: user._id,
      ownerName: user.name ?? "",
      ownerImage: user.avatarUrl ?? "",
      projectUpvotes: 0,
      inviteLink: args.inviteLink,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Add owner to projectMembers so they are visible in Teamspace
    await ctx.db.insert("projectMembers", {
      projectId,
      userId: user._id,
      userName: user.name ?? "Owner",
      userImage: user.avatarUrl,
      AccessRole: "owner",
      joinedAt: Date.now(),
    });

    return projectId;
  },
});



// CREATE / UPDATE ONBOARDING DRAFT PROJECT
// =============================
export const projectInitOnboarding = mutation({
  args: {
    projectName: v.string(),
    description: v.optional(v.string()),
    isPublic: v.boolean(),
    projectStatus: v.string(),
    inviteLink: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error(
          "Called projectInitOnboarding without authentication present",
      );
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

    const validStatuses = [
      "ideation",
      "validation",
      "development",
      "beta",
      "production",
      "scaling",
    ];
    if (!validStatuses.includes(args.projectStatus)) {
      throw new Error("Invalid project status selected.");
    }

    const userProjects = await ctx.db
        .query("projects")
        .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
        .collect();

    const unlinkedProjects = userProjects
        .filter((p) => !p.repositoryId && !p.repoName)
        .sort((a, b) => b.createdAt - a.createdAt);

    const existingDraft = unlinkedProjects[0];

    if (existingDraft) {
      // Only allow a globally-unique invite link
      const existingProjectWithInvite = await ctx.db
          .query("projects")
          .withIndex("by_invite_link", (q) => q.eq("inviteLink", args.inviteLink))
          .unique();

      if (
          existingProjectWithInvite &&
          existingProjectWithInvite._id !== existingDraft._id
      ) {
        throw new Error("Invite link already exists.");
      }

      // Regenerate slug based on latest project name, enforcing global uniqueness
      const slugBase = slugifyProjectName(args.projectName);
      let slug = `${slugBase}-${slugId()}`;

      for (let attempt = 0; attempt < 10; attempt++) {
        const existingBySlug = await ctx.db
            .query("projects")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .unique();

        if (!existingBySlug) break;
        if (existingBySlug._id === existingDraft._id) break;

        slug = `${slugBase}-${slugId()}`;
      }

      const stillExists = await ctx.db
          .query("projects")
          .withIndex("by_slug", (q) => q.eq("slug", slug))
          .unique();

      if (stillExists && stillExists._id !== existingDraft._id) {
        throw new Error(
            "Could not update a unique project slug. Please retry.",
        );
      }

      await ctx.db.patch(existingDraft._id, {
        projectName: args.projectName,
        slug,
        description: args.description,
        isPublic: args.isPublic,
        projectWorkStatus: args.projectStatus as any,
        inviteLink: args.inviteLink,
        updatedAt: Date.now(),
      });

      return existingDraft._id;
    }

    // No draft exists -> create one (onboarding only enforces slug+invite uniqueness)
    const existingProjectWithInvite = await ctx.db
        .query("projects")
        .withIndex("by_invite_link", (q) => q.eq("inviteLink", args.inviteLink))
        .unique();

    if (existingProjectWithInvite) {
      throw new Error("Invite link already exists.");
    }

    // Create globally-unique slug: "<kebab-name>-<5 random chars>"
    const slugBase = slugifyProjectName(args.projectName);
    let slug = `${slugBase}-${slugId()}`;
    // Extremely low collision risk, but enforce uniqueness globally.
    for (let attempt = 0; attempt < 10; attempt++) {
      const existingBySlug = await ctx.db
          .query("projects")
          .withIndex("by_slug", (q) => q.eq("slug", slug))
          .unique();
      if (!existingBySlug) break;
      slug = `${slugBase}-${slugId()}`;
    }

    const stillExists = await ctx.db
        .query("projects")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
    if (stillExists) {
      throw new Error("Could not create a unique project slug. Please retry.");
    }

    return await ctx.db.insert("projects", {
      projectName: args.projectName,
      slug,
      description: args.description,
      isPublic: args.isPublic,
      projectWorkStatus: args.projectStatus as any,
      ownerId: user._id,
      ownerName: user.name ?? "",
      ownerImage: user.avatarUrl ?? "",
      projectUpvotes: 0,
      inviteLink: args.inviteLink,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});


// =================================
// GET PROJECTS
// =================================
export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }


    const user = await ctx.db
      .query("users")
        .withIndex("by_token", (q) =>
            q.eq("clerkToken", identity.subject)
        )
      .unique();

    if (!user) {
      return [];
    }

    const projects = await ctx.db
      .query("projects")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .order("desc") // Show newest first
      .collect();

    return projects;
  },
});


// =================================
// GET PROJECT BY ID
// =================================
export const getProjectById = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const project = await ctx.db.get(args.projectId);

    // Optional: You might want to check if the user is the owner
    // const user = ... get user ...
    // if (project.ownerId !== user._id) throw new Error("Unauthorized");

    return project;
  },
});

export const getProjectsBySelectedIds = query({
  args: {
    ids: v.array(v.id("projects")), // or v.id("projects") if you strictly pass IDs
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }


    // Map through the IDs and fetch each project
    const projectPromises = args.ids.map((id) =>
        ctx.db.get(id as any) // Type cast if necessary for the specific table
    );

    const projects = await Promise.all(projectPromises);

    // Filter out any null values in case a project was deleted but the ID remained in the user's featured list
    return projects.filter((project) => project !== null);
  },
});
export const updateThumbnail = mutation({
  args: {
    projectId: v.id("projects"),
    thumbnailUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const user = await ctx.db
      .query("users")
        .withIndex("by_token", (q) =>
            q.eq("clerkToken", identity.subject)
        )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const project = await ctx.db.get(args.projectId);
    if (!project) {
        throw new Error("Project not found");
    }

    if (project.ownerId !== user._id) {
        throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.projectId, {
      thumbnailUrl: args.thumbnailUrl,
      updatedAt: Date.now(),
    });
  },
});





// ===================================
// UPDATE PROJECT
// ===================================

export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    isPublic: v.optional(v.boolean()),
    about: v.optional(v.string()),
    lookingForMembers: v.optional(
      v.array(
        v.object({
          role: v.string(),
          type: v.union(
            v.literal("casual"),
            v.literal("part-time"),
            v.literal("serious")
          ),
        })
      )
    ),
    healthScore: v.optional(
        v.object({
          totalScore: v.number(), // 0–100
          activityMomentum: v.number(), // 0–35
          maintenanceQuality: v.number(), // 0–35
          communityTrust: v.number(), // 0–20
          freshness: v.number(), // 0–10
          lastCalculatedDate: v.string(), // YYYY-MM-DD
          // Stores last 2 health scores only
          previousScores: v.array(
              v.object({
                totalScore: v.number(), // 0–100
                calculatedDate: v.string(), // YYYY-MM-DD
              })
          ),
        })
    ),
    thumbnailUrl:v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }


    console.log("Update Project is Running at : ", Date.now())

    const user = await ctx.db
      .query("users")
        .withIndex("by_token", (q) =>
            q.eq("clerkToken", identity.subject)
        )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (project.ownerId !== user._id) {
      throw new Error("Unauthorized");
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if(args.healthScore !== undefined) updates.healthScore = args.healthScore
    if (args.description !== undefined) updates.description = args.description;
    if (args.about !== undefined) updates.about = args.about;
    if (args.tags !== undefined) {
      if (args.tags.length < 2 || args.tags.length > 5) {
        throw new Error("Please select between 2 and 5 tags.");
      }
      updates.tags = args.tags;
    }
    if (args.isPublic !== undefined) updates.isPublic = args.isPublic;
    if (args.lookingForMembers !== undefined)
      updates.lookingForMembers = args.lookingForMembers;
    if (args.thumbnailUrl !== undefined) updates.thumbnailUrl = args.thumbnailUrl;

    
    await ctx.db.patch(args.projectId, updates);
    console.log("Update Project is Finshed at : ", Date.now())
  },
});

// =================================
// UPDATE ABOUT SECTION TAB
// =================================
export const updateAbout = mutation({
  args: {
    projectId: v.id("projects"),
    about: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }


    const user = await ctx.db
      .query("users")
        .withIndex("by_token", (q) =>
            q.eq("clerkToken", identity.subject)
        )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (project.ownerId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.projectId, {
      // about: args.about,
      updatedAt: Date.now(),
    });
  },
});



// =================================
// Delete Project
// =================================
export const deleteProject = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }


    const user = await ctx.db
      .query("users")
        .withIndex("by_token", (q) =>
            q.eq("clerkToken", identity.subject)
        )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (project.ownerId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.projectId);
  },
});

