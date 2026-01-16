// convex/githubHelpers.ts
import { createClerkClient } from "@clerk/backend";
import { Octokit } from "octokit";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

export async function getGithubAccessToken(
  clerkUserId: string
): Promise<string> {
  const tokens =
    await clerk.users.getUserOauthAccessToken(
      clerkUserId,
      "github"
    );

  const token = tokens.data[0]?.token;
  if (!token) {
    throw new Error("GitHub token missing");
  }

  return token;
}

export async function fetchUserContributionsRaw(
  token: string,
  githubUsername: string
) {


  const octokit = new Octokit({ auth: token });

  const query = `
    query ($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `;


  const response: any = await octokit.graphql(query, {
    username: githubUsername,
  });


  return response.user.contributionsCollection.contributionCalendar;
}
