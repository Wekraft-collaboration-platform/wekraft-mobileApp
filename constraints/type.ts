import {Id} from "@/convex/_generated/dataModel";


export interface Tag {
  label: string;
  color: string;
}

export interface Task {
  _id: Id<"tasks">;
  title: string;
  description?: string;
  estimation: { startDate: number; endDate: number };
  type?: Tag;
  assignees?: { name: string; avatar?: string; userId: Id<"users"> }[];
  priority?: string;
  status: string;
  linkWithCodebase?: string;
  isBlocked?: boolean;
  attachments?: { name: string; url: string }[];
  projectId: Id<"projects">;
  createdByUserId: Id<"users">;
  finalCompletedAt?: number;
  finalCompletedBy?: Id<"users">;
  createdAt: number;
  updatedAt: number;
}