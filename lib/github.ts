const GITHUB_API_URL = process.env.GITHUB_API_URL || 'https://api.github.com';

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: string;
  created_at: string;
  updated_at: string;
  comments: number;
  body: string | null;
  labels: Array<{
    id: number;
    name: string;
    color: string;
    description?: string;
  }>;
  repository_url: string;
  repository?: GitHubRepository;
  assignee: {
    login: string;
    avatar_url: string;
  } | null;
}

export interface GitHubRepository {
  name: string;
  full_name: string;
  html_url: string;
  language: string;
  stargazers_count: number;
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubIssue[];
}

export class GitHubService {
  private static getHeaders() {
    const token = process.env.GITHUB_TOKEN;
    console.log('Token exists:', !!token); // Debug log
    console.log('Token length:', token?.length); // Debug log

    if (!token) {
      throw new Error('GitHub token is not configured. Please add GITHUB_TOKEN to your .env.local file.');
    }

    return {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `Bearer ${token}`,
    };
  }

  static async testConnection() {
    try {
      console.log('Testing connection with URL:', GITHUB_API_URL); // Debug log
      const response = await fetch(`${GITHUB_API_URL}/user`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `GitHub API error (${response.status}): ${errorData?.message || response.statusText}`
        );
      }

      const data = await response.json();
      return {
        success: true,
        username: data.login,
      };
    } catch (error) {
      console.error('GitHub API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private static async getRepositoryDetails(repoUrl: string): Promise<GitHubRepository> {
    const response = await fetch(repoUrl, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch repository details: ${response.statusText}`);
    }

    return response.json();
  }

  static async searchIssues(page: number = 1, perPage: number = 30): Promise<GitHubSearchResponse> {
    try {
      // Search for open issues with "good first issue" label
      const query = 'is:issue is:open label:"good first issue"';
      const response = await fetch(
        `${GITHUB_API_URL}/search/issues?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&sort=created&order=desc`,
        {
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `GitHub API error (${response.status}): ${errorData?.message || response.statusText}`
        );
      }

      const data = await response.json();
      console.log('GitHub API Response:', data);

      // Fetch repository details for each issue
      const issuesWithRepos = await Promise.all(
        data.items.map(async (issue: GitHubIssue) => {
          try {
            const repoDetails = await this.getRepositoryDetails(issue.repository_url);
            return {
              ...issue,
              repository: repoDetails
            };
          } catch (error) {
            console.error(`Failed to fetch repository details for ${issue.repository_url}:`, error);
            return {
              ...issue,
              repository: {
                name: issue.repository_url.split('/').pop() || 'Unknown',
                full_name: issue.repository_url.split('/').slice(-2).join('/'),
                html_url: issue.repository_url,
                language: 'Unknown',
                stargazers_count: 0
              }
            };
          }
        })
      );

      return {
        ...data,
        items: issuesWithRepos
      };
    } catch (error) {
      console.error('GitHub API Error:', error);
      throw error;
    }
  }
} 