import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // USERS TABLE
  users: defineTable({
    name: v.optional(v.string()), // unique
    occupation:v.optional(v.string()),
    clerkToken: v.string(), //clerk user ID for auth
    email: v.string(),
    githubUsername: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    last_sign_in: v.optional(v.number()),
    // ✅ PLAN TYPE
    accountType: v.union(
        v.literal("free"),
        v.literal("plus"),
        v.literal("pro"),
    ),
    skills: v.optional(v.array(v.string())),
    lastUpdatedSkillsAt: v.optional(v.number()),

    hasCompletedOnboarding: v.boolean(),
    primaryUsage: v.optional(v.array(v.string())),

    createdAt: v.number(),
    updatedAt: v.number(),
    planExpiry: v.optional(v.number()), // For temporary upgrades/coupons

    bio: v.optional(v.string()),
    socialLinks: v.optional(v.array(v.string())), // max 3 links (excluding github)



    // // githubAccessToken: v.optional(v.string()), // cant store it in db for security reasons.
    // inviteLink: v.optional(v.string()),
    // // bio of the user
    // phoneNumber:v.optional(v.string()),
    // countryCode:v.optional(v.string()),

    impactScore : v.optional(v.number()),
    // GithubInfo
    commits:v.optional(v.number()),
    stars:v.optional(v.number()),
    forks:v.optional(v.number()),
    pr: v.optional(v.number()),
    issues: v.optional(v.number()),


    featuredProjectIds: v.optional(v.array(v.id("projects"))),

    // Scocial Links
    linkedin: v.optional(v.string()),
    website: v.optional(v.string()),
    github: v.optional(v.string()),




    // ✅ PROJECT LIMIT
    limit: v.union(v.literal(2), v.literal(5), v.literal(15)),


    //   INDEXES.....
  }) .index("by_token", ["clerkToken"])
      .index("by_accountType", ["accountType"])
      .index("by_name", ["name"]),



  // ===============================
  // REPOSITORIES TABLE
  // ===============================
  repositories: defineTable({
    githubId: v.int64(),
    isWebhookConnected: v.boolean(), // default false
    repoName: v.string(),
    repoOwner: v.string(),
    repoFullName: v.string(),
    repoType: v.optional(v.string()),
    repoUrl: v.string(),
    userId: v.id("users"),
    language: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
      .index("by_user", ["userId"])
      .index("by_github_id", ["githubId"]),

  // ===============================
  // REVIEWS TABLE
  // ===============================
  reviews: defineTable({
    // Relation to repositories table
    repositoryId: v.id("repositories"),
    prNumber: v.number(),
    prTitle: v.string(),
    prUrl: v.string(),
    // Large AI-generated review text
    review: v.string(),
    // Review status
    status: v.union(
      v.literal("completed"),
      v.literal("failed"),
      v.literal("pending")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_repository", ["repositoryId"]),
  // ===============================
  // PROJECTS TABLE
  // ===============================
  projects: defineTable({
    // Project details
    projectName: v.string(),
    slug: v.string(), // Globally-unique, URL-safe slug (name + random suffix)
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())), // (2-5) // Validation (2-5 tags) should be done in mutations
    // Visibility
    isPublic: v.boolean(),
    // Linked repository
    projectLiveLink: v.optional(v.string()),

    repositoryId: v.optional(v.id("repositories")),
    repoName: v.optional(v.string()),
    repoFullName: v.optional(v.string()),// e.g., "ronitrai27/Line-Queue-PR-Agent"
    // repoOwner: v.string(),
    // repoUrl: v.string(),
    thumbnailUrl: v.optional(v.string()),
    // lookingForMembers: v.optional(
    //   v.array(
    //     v.object({
    //       role: v.string(),
    //       type.ts: v.union(
    //         v.literal("casual"),
    //         v.literal("part-time"),
    //         v.literal("serious")
    //       ),
    //     })
    //   )
    // ),
    // Project owner (creator)
    ownerId: v.id("users"),
    ownerName: v.string(),
    ownerImage: v.string(),

    // new details for the project to maintain community engaement
    // projectForks: v.optional(v.float64()),
    // projectStars: v.optional(v.float64()),

    inviteLink: v.optional(v.string()),
    projectWorkStatus: v.optional(
        v.union(
            v.literal("ideation"),
            v.literal("validation"),
            v.literal("development"),
            v.literal("beta"),
            v.literal("production"),
            v.literal("scaling"),
        ),
    ),
    projectUpvotes: v.number(),

    // HEATH SCORES SUPER IMPORTANT ----------------
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
    // TIME STAMPS----
    createdAt: v.number(),
    updatedAt: v.number(),
  })
      .index("by_owner", ["ownerId"])
      .index("by_owner_name", ["ownerId", "projectName"])
      .index("by_slug", ["slug"])
      .index("by_repository", ["repositoryId"])
      .index("by_public", ["isPublic"])
      .index("by_invite_link", ["inviteLink"]),

  // ==============================
  // projectJoinRequests
  // ==============================
  projectJoinRequests: defineTable({
    projectId: v.id("projects"),
    userId: v.id("users"),
    userName: v.string(), // for quick lookup
    userImage: v.optional(v.string()), // for quick lookup
    message: v.optional(v.string()), // "Hey, I want to contribute"
    source: v.union(v.literal("invited"), v.literal("manual")),
    role:v.optional(v.string()),

    status: v.union(
        v.literal("pending"),
        v.literal("accepted"),
        v.literal("rejected"),
    ),
    createdAt: v.number(),
    updatedAt: v.number(), // whenever status changes
  })
      .index("by_project", ["projectId"])
      .index("by_user", ["userId"])
      .index("by_status", ["status"]),





  projectMembers: defineTable({
    projectId: v.id("projects"),
    userId: v.id("users"),
    userName: v.string(),
    userImage: v.optional(v.string()),
    AccessRole: v.optional(
        v.union(
            v.literal("owner"),
            v.literal("admin"),
            v.literal("member"),
            v.literal("viewer"),
        ),
    ),
    joinedAt: v.optional(v.number()),
    leftAt: v.optional(v.number()),
  })
      .index("by_project", ["projectId"])
      .index("by_user", ["userId"])
      .index("by_access_role", ["AccessRole"]),




  // ------------------------------------------------------------
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    type: v.optional(v.object({ label: v.string(), color: v.string() })), // Custom tag like {label: "dashboard", color: "blue"}
    priority: v.optional(
        v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    ),
    status: v.union(
        v.literal("not started"),
        v.literal("inprogress"),
        v.literal("reviewing"),
        v.literal("testing"),
        v.literal("completed"),
    ),
    estimation: v.object({
      startDate: v.number(),
      endDate: v.number(),
    }),
    isBlocked: v.optional(v.boolean()), // due to this task is marked as issue and cannot be marked as completed !!
    linkWithCodebase: v.optional(v.string()),
    projectId: v.id("projects"),
    createdByUserId: v.id("users"),

    sprintId: v.optional(v.id("sprints")),
    attachments: v.optional(
        v.array(
            v.object({
              name: v.string(),
              url: v.string(),
            })
        )
    ),
    // Insights
    finalCompletedAt: v.optional(v.number()), // date when finally its marked as completed.
    finalCompletedBy: v.optional(v.id("users")), // id of that user
    createdAt: v.number(),
    updatedAt: v.number(),
  })
      .index("by_project", ["projectId"])
      .index("by_creator", ["createdByUserId"])
      .index("by_status", ["status"])
      .index("by_priority", ["priority"])
      .index("by_project_status", ["projectId", "status"])
      .index("by_sprint", ["sprintId"]),

  // --------------------------------------------------
  taskComments: defineTable({
    taskId: v.id("tasks"),
    userId: v.id("users"),
    userName: v.string(),
    userImage: v.optional(v.string()),
    comment: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
      .index("by_task", ["taskId"])
      .index("by_user", ["userId"])
      .index("by_task_user", ["taskId", "userId"]),
  // ----------------------------------------------------

  issues: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    fileLinked: v.optional(v.string()),
    environment: v.optional(
        v.union(
            v.literal("local"),
            v.literal("dev"),
            v.literal("staging"),
            v.literal("production"),
        ),
    ),
    severity: v.optional(
        v.union(v.literal("critical"), v.literal("medium"), v.literal("low")),
    ),
    due_date: v.optional(v.number()), // for tracking
    status: v.union(
        v.literal("not opened"),
        v.literal("opened"),
        v.literal("reopened"),
        v.literal("closed"),
    ),
    type: v.union(
        v.literal("manual"),
        v.literal("task-issue"),
        v.literal("github"),
    ),
    githubIssueUrl: v.optional(v.string()), // if its from github.
    taskId: v.optional(v.id("tasks")), // if its from task.
    projectId: v.id("projects"),
    createdByUserId: v.id("users"),
    sprintId: v.optional(v.id("sprints")), // exluded closed issues
    // Insights
    finalCompletedAt: v.optional(v.number()),
    finalCompletedBy: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
      .index("by_project", ["projectId"])
      .index("by_creator", ["createdByUserId"])
      .index("by_task", ["taskId"])
      .index("by_status", ["status"])
      .index("by_severity", ["severity"])
      .index("by_environment", ["environment"])
      .index("by_sprint", ["sprintId"]),
  // ---------------------------------------------------
  issueComments: defineTable({
    issueId: v.id("issues"),
    userId: v.id("users"),
    userName: v.string(),
    userImage: v.optional(v.string()),
    comment: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
      .index("by_issue", ["issueId"])
      .index("by_user", ["userId"])
      .index("by_issue_user", ["issueId", "userId"]),

  // -----------------------------------------------------
  projectDetails: defineTable({
    projectId: v.id("projects"),
    repoId: v.optional(v.id("repositories")), // optional if project has connected repo.
    targetDate: v.optional(v.number()),
    // healthscore to:do
  })
      .index("by_project", ["projectId"])
      .index("by_repo", ["repoId"]),

  // ----------------------------------------------------
  calendarEvents: defineTable({
    projectId: v.id("projects"),
    creatorId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("event"), v.literal("milestone")),
    start: v.number(),
    end: v.number(),
    allDay: v.boolean(),
    color: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
      .index("by_project", ["projectId"])
      .index("by_creator", ["creatorId"]),

  // --------------------------------------------------------
  sprints: defineTable({
    projectId: v.id("projects"),
    creatorId: v.id("users"),
    duration: v.object({
      startDate: v.number(),
      endDate: v.number(),
    }),
    sprintName: v.string(),
    sprintGoal: v.string(),
    status: v.union(
        v.literal("planned"),
        v.literal("active"),
        v.literal("completed"),
    ),
    taskIds: v.optional(v.array(v.id("tasks"))), // to track history of tasks added to this sprint
    issueIds: v.optional(v.array(v.id("issues"))), // to track history of issues added to this sprint
    finalStats: v.optional(
        v.object({
          completedTasks: v.number(),
          totalTasks: v.number(),
          closedIssues: v.number(),
          totalIssues: v.number(),
        }),
    ), // store current stats of sprint when sprint is marked as completed
    createdAt: v.number(),
    updatedAt: v.number(),
  })
      .index("by_project", ["projectId"])
      .index("by_creator", ["creatorId"])
      .index("by_status", ["status"])
      .index("by_project_status", ["projectId", "status"]),

  // -------------------------------------------------------
  // For each project only 1 scheduler. User can make it active , update or delete.
  schedulers: defineTable({
    projectId: v.id("projects"),
    name: v.string(),
    frequencyDays: v.number(), // min 3 days
    recipientEmail: v.string(),
    isActive: v.boolean(), // default false , only true by kaya or team
    lastRunAt: v.optional(v.number()), // timestamp (Unix ms)
    nextRunAt: v.number(),
    isRunning: v.optional(v.boolean()), // default false , only true when its scheduler is running.
    lastRunStatus: v.optional(
        v.union(v.literal("success"), v.literal("failure")),
    ), // success or failure
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
      .index("by_project", ["projectId", "isActive", "nextRunAt"])
      .index("by_nextRun", ["isActive", "nextRunAt"]),

  // -------------------------------------------------
  tickets: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    createdBy: v.id("users"),
    assignedTo: v.id("users"),
    status: v.union(v.literal("open"), v.literal("closed")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
      .index("by_project", ["projectId"])
      .index("by_creator", ["createdBy"])
      .index("by_assignee", ["assignedTo"])
      .index("by_status", ["status"]),

  // -------------------------------------------------
  // Scalable Join Tables for Assignees
  taskAssignees: defineTable({
    taskId: v.id("tasks"),
    userId: v.id("users"),
    name: v.string(), // Denormalized for fast list rendering
    avatar: v.optional(v.string()), // Denormalized for fast list rendering
    projectId: v.id("projects"), // To optimize fetching all assignees for a project
  })
      .index("by_task", ["taskId"])
      .index("by_user", ["userId"])
      .index("by_project", ["projectId"])
      .index("by_task_user", ["taskId", "userId"]),

  issueAssignees: defineTable({
    issueId: v.id("issues"),
    userId: v.id("users"),
    name: v.string(),
    avatar: v.optional(v.string()),
    projectId: v.id("projects"),
  })
      .index("by_issue", ["issueId"])
      .index("by_user", ["userId"])
      .index("by_project", ["projectId"])
      .index("by_issue_user", ["issueId", "userId"]),

});

