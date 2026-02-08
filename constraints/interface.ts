import { Id } from "@/convex/_generated/dataModel"


export type UserData = {
  name: string
  tokenIdentifier: string
  email: string
  imageUrl?: string

  hasCompletedOnboarding: boolean

  githubUsername?: string
  githubAccessToken?: string
  last_sign_in?: number
  inviteLink?: string

  // Bio
  bio?: string

  // Impact and GitHub metrics
  impactScore?: number
  commits?: number
  stars?: number
  forks?: number
  pr?: number
  issues?: number

  techStack?: string[]

  // Social links
  linkedIn?: string
  twitter?: string
  website?: string
  github?: string

  // Plan type
  type: "free" | "pro" | "elite"

  // Project limit
  limit: 2 | 5 | 15

  // Timestamps
  createdAt: number
  updatedAt: number
}


export type ProjectData = {
  // Project details
  projectName: string
  description: string
  tags: string[]

  // Visibility
  isPublic: boolean

  // Linked repository
  repositoryId: Id<"repositories">
  repoName: string
  repoFullName: string
  repoOwner: string
  repoUrl: string
  thumbnailUrl?: string

  // Team / collaboration
  lookingForMembers?: {
    role: string
    type: "casual" | "part-time" | "serious"
  }[]

  // Ownership
  ownerId: string
  about?: string

  // Community metrics
  projectForks?: number
  projectStars?: number
  projectUpvotes?: number

  // Health score system
  healthScore?: {
    totalScore: number            // 0–100
    activityMomentum: number      // 0–35
    maintenanceQuality: number    // 0–35
    communityTrust: number        // 0–20
    freshness: number             // 0–10
    lastCalculatedDate: string    // YYYY-MM-DD
    previousScores: {
      totalScore: number          // 0–100
      calculatedDate: string     // YYYY-MM-DD
    }[]
  }

  // Timestamps
  createdAt: number
  updatedAt: number
}



export type Repository = {
  githubId: number
  name: string
  owner: string
  fullName: string
  url: string

  // Relation
  userId: Id<"users">

  // Timestamps
  createdAt: number
  updatedAt: number

}


export type Review = {
  // Relation
  repositoryId: Id<"repositories">

  prNumber: number
  prTitle: string
  prUrl: string

  // AI-generated review content
  review: string

  // Review lifecycle
  status: "completed" | "failed" | "pending"

  // Timestamps
  createdAt: number
  updatedAt: number
}







export type GithubOwner = {
  login: string;
  avatar_url: string;
  html_url: string;
};



export type GithubRepoRaw = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  owner: GithubOwner;
  created_at: string;
  updated_at: string;
  pushed_at: string;
};


export type GithubRepo = {
  
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  ownerLogin: string;
  ownerAvatar: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
 
};