'use server';

import { Octokit } from "@octokit/rest";

const token = process.env.GITHUB_TOKEN;
const octokit = new Octokit({ auth: token });

// 1. 獲取當前用戶的所有倉庫 (包括私有)
export async function getUserRepos() {
  try {
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 20,
      type: 'all' // 獲取所有類型的倉庫
    });
    return { success: true, data: data };
  } catch (error: any) {
    console.error("Get Repos Error:", error);
    return { success: false, error: error.message };
  }
}

// 2. 獲取指定倉庫的文件樹 (遞歸獲取所有文件)
export async function getRepoTree(owner: string, repo: string, branch: string = 'main') {
  try {
    // 首先獲取最新 commit 的 sha
    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });
    const sha = refData.object.sha;

    // 獲取 Tree
    const { data: treeData } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: sha,
      recursive: 'true',
    });

    return { success: true, data: treeData.tree };
  } catch (error: any) {
    // 嘗試 master 分支，如果 main 不存在
    if (branch === 'main') {
        return getRepoTree(owner, repo, 'master');
    }
    return { success: false, error: error.message };
  }
}

// 3. 獲取文件內容
export async function getFileContent(owner: string, repo: string, path: string) {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });

    if ('content' in data && typeof data.content === 'string') {
       const decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');
       return { success: true, data: decodedContent };
    }
    return { success: false, error: "Not a file or too large." };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
