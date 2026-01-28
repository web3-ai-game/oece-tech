'use server';

import { Octokit } from "@octokit/rest";

// 這裡我們需要一個 GitHub Token。
// 為了演示，我會創建一個無需認證的客戶端（只能訪問公開信息），
// 或者您可以提供一個 GITHUB_TOKEN 環境變量來獲取更高權限。
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // Optional
});

// 獲取 GitHub 用戶信息
export async function getGitHubUserProfile(username: string) {
  try {
    const { data } = await octokit.rest.users.getByUsername({
      username,
    });
    return {
      success: true,
      data: {
        login: data.login,
        avatar_url: data.avatar_url,
        html_url: data.html_url,
        name: data.name,
        public_repos: data.public_repos,
        followers: data.followers,
        bio: data.bio,
      }
    };
  } catch (error) {
    console.error("GitHub API Error:", error);
    return { success: false, error: "User not found or API limit exceeded." };
  }
}

// 獲取用戶的最新倉庫
export async function getGitHubUserRepos(username: string) {
    try {
        const { data } = await octokit.rest.repos.listForUser({
            username,
            sort: 'updated',
            per_page: 5
        });
        return {
            success: true,
            data: data.map(repo => ({
                name: repo.name,
                html_url: repo.html_url,
                description: repo.description,
                language: repo.language,
                stargazers_count: repo.stargazers_count
            }))
        };
    } catch (error) {
        console.error("GitHub API Error (Repos):", error);
        return { success: false, error: "Failed to fetch repos." };
    }
}
