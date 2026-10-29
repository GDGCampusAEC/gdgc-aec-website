import { GitHubPullRequest } from "./types";

export interface ParsedRepo {
  owner: string;
  repo: string;
}

/**
 * Validates and safely parses a GitHub repository URL.
 * Only accepts standard https://github.com/owner/repo format to prevent SSRF.
 */
export function parseGitHubRepoUrl(url: string): ParsedRepo {
  if (!url || typeof url !== "string") {
    throw new Error("Repository URL is required");
  }

  const trimmed = url.trim();
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(trimmed);
  } catch {
    throw new Error("Invalid URL format");
  }

  if (parsedUrl.protocol !== "https:") {
    throw new Error("Repository URL must use https protocol");
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  if (hostname !== "github.com" && hostname !== "www.github.com") {
    throw new Error("Only GitHub repositories (https://github.com/owner/repo) are supported");
  }

  // Path parts: ['', 'owner', 'repo']
  const parts = parsedUrl.pathname.split("/").filter(Boolean);
  if (parts.length < 2) {
    throw new Error("Repository URL must include both owner and repository name (e.g., https://github.com/owner/repo)");
  }

  const owner = parts[0].trim();
  const repo = parts[1].replace(/\.git$/i, "").trim();

  // Validate owner and repo characters (alphanumeric, hyphens, underscores, dots)
  const validRegex = /^[a-zA-Z0-9._-]+$/;
  if (!validRegex.test(owner) || !validRegex.test(repo)) {
    throw new Error("Repository owner or name contains invalid characters");
  }

  return { owner, repo };
}

/**
 * Builds request headers for GitHub API calls.
 * Reuses optional process.env.GITHUB_TOKEN if configured.
 */
function getGitHubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "GDGC-AEC-OpenOrbit/1.0",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Fetches closed pull requests from a GitHub repository with full pagination.
 *
 * @param repositoryUrl - Public GitHub repository URL
 * @param maxPages - Safety bound for pagination (default 20 pages = 2000 PRs)
 */
export async function fetchClosedPullRequests(
  repositoryUrl: string,
  maxPages: number = 20
): Promise<GitHubPullRequest[]> {
  const { owner, repo } = parseGitHubRepoUrl(repositoryUrl);
  const allPrs: GitHubPullRequest[] = [];
  const headers = getGitHubHeaders();

  let page = 1;
  const perPage = 100;

  while (page <= maxPages) {
    const endpoint = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls?state=closed&per_page=${perPage}&page=${page}`;

    const res = await fetch(endpoint, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      let message = `GitHub API request failed with status ${res.status}`;

      if (res.status === 403 || res.status === 429) {
        message = "GitHub API rate limit exceeded. Please wait or configure GITHUB_TOKEN.";
      } else if (res.status === 404) {
        message = `GitHub repository '${owner}/${repo}' was not found. Please verify the URL.`;
      }

      console.error("[OpenOrbit GitHub API Error]:", res.status, errorText);
      throw new Error(message);
    }

    const prs: GitHubPullRequest[] = await res.json();

    if (!Array.isArray(prs)) {
      throw new Error("Invalid response format received from GitHub API");
    }

    if (prs.length === 0) {
      break;
    }

    allPrs.push(...prs);

    // If fewer than perPage were returned, we have reached the last page
    if (prs.length < perPage) {
      break;
    }

    page++;
  }

  return allPrs;
}

/**
 * Optionally looks up a GitHub user profile avatar URL.
 */
export async function fetchGitHubAvatar(username: string): Promise<string | null> {
  if (!username) return null;
  const cleanUsername = username.replace(/^@/, "").trim();
  if (!/^[a-zA-Z0-9-_]+$/.test(cleanUsername)) return null;

  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}`, {
      method: "GET",
      headers: getGitHubHeaders(),
      next: { revalidate: 86400 }, // Cache user avatar for 24h
    });

    if (res.ok) {
      const data = await res.json();
      return data.avatar_url || null;
    }
  } catch (err) {
    // Ignore network error on optional avatar fetch
  }

  return `https://github.com/${cleanUsername}.png`;
}
