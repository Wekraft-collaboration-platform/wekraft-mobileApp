// // convex/github.ts
"use node";
// 
// import { getGithubAccessToken } from "./githubHelpers";/
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { Octokit } from "octokit";
import { getGithubAccessToken } from "./githubHelper";
import { fetchUserContributionsRaw } from "./githubHelper";

type GithubOwner = {
  login: string;
  avatar_url: string;
  html_url: string;
};

type GithubRepoRaw = {
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

type GithubRepo = {
  
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


type GithubCollaborator = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  permissions?: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
};




async function ensureGithubToken(ctx: any): Promise<string> {
  // 1. Try DB first
  let token = await ctx.runQuery(api.users.getGithubToken);

  if (token) {
    return token;
  }

  // 2. Fetch from Clerk
  const identity = await ctx.auth.getUserIdentity();

  console.log("ensureGithubToken Indentity : ", identity);
  if (!identity) {
    throw new Error("Unauthenticated");
  }

  token = await getGithubAccessToken(identity.subject);

  console.log("ensureGithubToken Indentity Token : ", token);

  // 3. Store once
  await ctx.runMutation(api.users.setGithubToken, {
    token,
  });

  return token;
}





export const fetchGithubRepos = action({
  args: {},
  handler: async (ctx): Promise<GithubRepo[]> => {
    const token = await ensureGithubToken(ctx);

    let page = 1;
    const allRepos: GithubRepo[] = [];

    while (true) {
      const res = await fetch(
          `https://api.github.com/user/repos?per_page=100&page=${page}&affiliation=owner,collaborator,organization_member`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github+json",
            },
          }
      );

      if (!res.ok) {
        throw new Error("GitHub API request failed");
      }

      // console.log("GitHub API request success," res.json());

      // const r = await res.json();
      // console.log("GitHub API request success,"); 
      const repos: GithubRepoRaw[] = await res.json();
      if (repos.length === 0) break;

      for (const repo of repos) {
        allRepos.push({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          private: repo.private,
          html_url: repo.html_url,
          ownerLogin: repo.owner.login,
          ownerAvatar: repo.owner.avatar_url,
          created_at: repo.created_at,
          updated_at: repo.updated_at,
          pushed_at: repo.pushed_at,
          // description:repo.description
        });
      }

      page++;
    }

    return allRepos;
  },
});


export const getProjectHealthData = action({
  args: {
    owner: v.string(),
    repo: v.string(),
  },
  handler: async (ctx, args) => {
    const token = await ensureGithubToken(ctx);
    const octokit = new Octokit({ auth: token });

    const query = `
      query ($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          issues {
            totalCount
          }
          closedIssues: issues(states: CLOSED) {
            totalCount
          }
          pullRequests {
            totalCount
          }
          mergedPRs: pullRequests(states: MERGED) {
            totalCount
          }
          defaultBranchRef {
            target {
              ... on Commit {
                committedDate
                history(
                  since: "${new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()}"
                  first: 100
                ) {
                  nodes {
                    committedDate
                  }
                }

              }
            }
          }
        }
      }
    `;

    const res: any = await octokit.graphql(query, {
      owner: args.owner,
      repo: args.repo,
    });
    

    const buckets = Array(60).fill(0);
    const now = Date.now();

    res.repository.defaultBranchRef.target.history.nodes.forEach(
      (commit: any) => {
        const daysAgo = Math.floor(
          (now - new Date(commit.committedDate).getTime()) /
          (24 * 60 * 60 * 1000)
        );

        
        if (daysAgo >= 0 && daysAgo < 60) {
            buckets[daysAgo]++
        }
      }
    );

    const openIssues =
      res.repository.issues.totalCount -
      res.repository.closedIssues.totalCount;

    const closedIssues = res.repository.closedIssues.totalCount;

    const totalPRs = res.repository.pullRequests.totalCount;
    const mergedPRs = res.repository.mergedPRs.totalCount;

    const prMergeRate =
      totalPRs === 0 ? 0 : Math.round((mergedPRs / totalPRs) * 100);

    return {
      openIssuesCount: openIssues,
      closedIssuesCount: closedIssues,
      lastCommitDate:
        res.repository.defaultBranchRef?.target?.committedDate ?? null,
      commitsLast60Days: buckets.reduce((a, b) => a + b, 0),
      commitBuckets: buckets,
      prMergeRate,
    };

  },
});




export const fetchRepoCollaborators = action({
  args: {
    owner: v.string(),
    repo: v.string(),
  },

  handler: async (ctx, { owner, repo }): Promise<GithubCollaborator[]> => {
    const token = await ensureGithubToken(ctx);

    let page = 1;
    const collaborators: GithubCollaborator[] = [];

    while (true) {
      const res = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/collaborators?per_page=100&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github+json",
            },
          }
      );

      if (res.status === 403 || res.status === 404) {
        return [];
      }

      if (!res.ok) {
        throw new Error("Failed to fetch collaborators");
      }

      const data: GithubCollaborator[] = await res.json();
      if (data.length === 0) break;

      collaborators.push(...data);
      page++;
    }

    return collaborators;
  },
});




export const fetchRepoLanguages = action({
  args: {
   owner: v.string(),
    repo: v.string(),
  },
  handler: async (ctx, args) => {
    const token = await ensureGithubToken(ctx);

    const res = await fetch(
    `https://api.github.com/repos/${args.owner}/${args.repo}/languages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch repo languages");
    }

    const raw: Record<string, number> = await res.json();

    const totalBytes = Object.values(raw).reduce((a, b) => a + b, 0);

    const breakdown = Object.entries(raw)
      .map(([language, bytes]) => ({
        language,
        bytes,
        percentage:
          totalBytes === 0
            ? 0
            : Math.round((bytes / totalBytes) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage);

    return {
      totalBytes,
      breakdown,
    };
  },
});




export const getGithubToken = action({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    return await getGithubAccessToken(identity.subject);
  },
});

export const fetchAndStoreGitHubToken = action({
  args:{
    clerkUserId:v.string()
  },
  handler: async (ctx,args) => {

    console.log("Args ClerkUserId" , args.clerkUserId)
    const clerkUserId = args.clerkUserId;
    console.log("ClerkUserId" , clerkUserId)

    // ✅ SINGLE source of truth
    const token = await getGithubAccessToken(clerkUserId);

    console.log("TOken", token)

    await ctx.runMutation(api.users.setGithubToken, {
      token: token,
    });

    console.log("[LOGIN] GitHub token stored Succefully in Convex");

    return { ok: true };
  },
});




export const getDashboardStats = action({
  args: {
    clerkId: v.string(),
    githubName: v.string(),
  },
  

  handler: async (ctx, args) => {
    console.log("Function Called.")


    // 1. Auth
    const identity = await ctx.auth.getUserIdentity();


    if (!identity) {
      throw new Error("Unauthenticated");
    }

    // ⚠️ this is still wrong architecturally, but logging only
    const token = await ensureGithubToken(ctx);

    if (!token && !args.githubName) {
      throw new Error("GitHub not connected");
    }

    const accessToken = token;
    const githubName = args.githubName;

    // 3. GitHub client
    const octokit = new Octokit({ auth: accessToken });
    
    // 4. Contributions

    const calendar = await fetchUserContributionsRaw(
      accessToken,
      githubName
    );

    
    const totalCommits = calendar?.totalContributions ?? 0;

    // 5. PRs
    const { data: pr } =
      await octokit.rest.search.issuesAndPullRequests({
        q: `author:${githubName} type:pr`,
        per_page: 1,
      });


    const { data: mergedPR } =
      await octokit.rest.search.issuesAndPullRequests({
        q: `author:${githubName} type:pr is:merged`,
        per_page: 1,
      });



    // 6. Issues

    const { data: closedIssues } =
      await octokit.rest.search.issuesAndPullRequests({
        q: `author:${githubName} type:issue is:closed`,
        per_page: 1,
      });

    const { data: openIssues } =
      await octokit.rest.search.issuesAndPullRequests({
        q: `author:${githubName} type:issue is:open`,
        per_page: 1,
      });


    // 7. Reviews

    const { data: reviews } =
      await octokit.rest.search.issuesAndPullRequests({
        q: `commenter:${githubName} type:pr`,
        per_page: 1,
      });


    // 8. Account age
   
    const { data: ghUser } =
      await octokit.rest.users.getByUsername({
        username: githubName,
      });


    const accountCreatedAt = new Date(ghUser.created_at);
    const accountAgeInYears =
      (Date.now() - accountCreatedAt.getTime()) /
      (1000 * 60 * 60 * 24 * 365);


    return {
      totalCommits,
      totalPRs: pr.total_count ?? 0,
      totalMergedPRs: mergedPR.total_count ?? 0,
      totalIssuesClosed: closedIssues.total_count ?? 0,
      totalOpenIssues: openIssues.total_count ?? 0,
      totalReviews: reviews.total_count ?? 0,
      accountAgeInYears,
      accountCreatedAt: ghUser.created_at,
    };
  },
});
