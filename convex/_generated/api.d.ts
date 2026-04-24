/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as Redis_GitHubData_GithubToken from "../Redis/GitHubData/GithubToken.js";
import type * as Redis_GitHubData_RedisGetProjectCommits from "../Redis/GitHubData/RedisGetProjectCommits.js";
import type * as Redis_GitHubData_RedisGetProjectHealthData from "../Redis/GitHubData/RedisGetProjectHealthData.js";
import type * as Redis_GitHubData_RedisGetProjectIssues from "../Redis/GitHubData/RedisGetProjectIssues.js";
import type * as Redis_GitHubData_RedisGetProjectPrs from "../Redis/GitHubData/RedisGetProjectPrs.js";
import type * as Redis_GitHubData_RedisGetRepoLanguges from "../Redis/GitHubData/RedisGetRepoLanguges.js";
import type * as Redis_GitHubData_RedisGetUserTopLanguges from "../Redis/GitHubData/RedisGetUserTopLanguges.js";
import type * as Redis_GitHubData_RedisGithubDashboard from "../Redis/GitHubData/RedisGithubDashboard.js";
import type * as Redis_GitHubData_RedisGithubGetReadme from "../Redis/GitHubData/RedisGithubGetReadme.js";
import type * as Redis_GitHubData_RedisGithubRepos from "../Redis/GitHubData/RedisGithubRepos.js";
import type * as Redis_GitHubData_githubHelper from "../Redis/GitHubData/githubHelper.js";
import type * as Redis_ProjectHealthScore_projecthealth from "../Redis/ProjectHealthScore/projecthealth.js";
import type * as Redis_ProjectHealthScore_projecthealthhelper from "../Redis/ProjectHealthScore/projecthealthhelper.js";
import type * as amazonS3 from "../amazonS3.js";
import type * as discoveryProject from "../discoveryProject.js";
import type * as projectRequests from "../projectRequests.js";
import type * as projects from "../projects.js";
import type * as redisClient from "../redisClient.js";
import type * as repos from "../repos.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "Redis/GitHubData/GithubToken": typeof Redis_GitHubData_GithubToken;
  "Redis/GitHubData/RedisGetProjectCommits": typeof Redis_GitHubData_RedisGetProjectCommits;
  "Redis/GitHubData/RedisGetProjectHealthData": typeof Redis_GitHubData_RedisGetProjectHealthData;
  "Redis/GitHubData/RedisGetProjectIssues": typeof Redis_GitHubData_RedisGetProjectIssues;
  "Redis/GitHubData/RedisGetProjectPrs": typeof Redis_GitHubData_RedisGetProjectPrs;
  "Redis/GitHubData/RedisGetRepoLanguges": typeof Redis_GitHubData_RedisGetRepoLanguges;
  "Redis/GitHubData/RedisGetUserTopLanguges": typeof Redis_GitHubData_RedisGetUserTopLanguges;
  "Redis/GitHubData/RedisGithubDashboard": typeof Redis_GitHubData_RedisGithubDashboard;
  "Redis/GitHubData/RedisGithubGetReadme": typeof Redis_GitHubData_RedisGithubGetReadme;
  "Redis/GitHubData/RedisGithubRepos": typeof Redis_GitHubData_RedisGithubRepos;
  "Redis/GitHubData/githubHelper": typeof Redis_GitHubData_githubHelper;
  "Redis/ProjectHealthScore/projecthealth": typeof Redis_ProjectHealthScore_projecthealth;
  "Redis/ProjectHealthScore/projecthealthhelper": typeof Redis_ProjectHealthScore_projecthealthhelper;
  amazonS3: typeof amazonS3;
  discoveryProject: typeof discoveryProject;
  projectRequests: typeof projectRequests;
  projects: typeof projects;
  redisClient: typeof redisClient;
  repos: typeof repos;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
