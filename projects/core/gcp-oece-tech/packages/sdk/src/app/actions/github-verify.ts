'use server';

import { Octokit } from "@octokit/rest";

export async function verifyGitHubConnection() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
      return { success: false, error: "No Token Found" };
  }

  const octokit = new Octokit({ auth: token });

  try {
    // 1. Get User Info
    const { data: user } = await octokit.rest.users.getAuthenticated();
    
    // 2. List Repos (to see what we can access)
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
        per_page: 10,
        sort: "updated"
    });

    return { 
        success: true, 
        user: user.login, 
        repoCount: user.total_private_repos + user.public_repos,
        recentRepos: repos.map(r => r.name)
    };
  } catch (error: any) {
    console.error("GitHub Connection Failed:", error);
    return { success: false, error: error.message };
  }
}
