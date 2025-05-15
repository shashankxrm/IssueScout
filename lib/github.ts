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

export interface SearchFilters {
  languages?: string[];
  searchQuery?: string;
  labels?: string[];
  page?: number;
  perPage?: number;
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

  static getPopularLabels(): string[] {
    return [
      'good first issue',
      'documentation',
      'bug',
      'enhancement',
      'help wanted',
      'beginner-friendly',
      'first-timers-only',
      'easy',
      'low-hanging-fruit',
      'starter-task'
    ];
  }

  static async searchIssues(filters: SearchFilters = {}): Promise<GitHubSearchResponse> {
    try {
      const { languages, searchQuery, labels, page = 1, perPage = 30 } = filters;
      
      // Build the search query
      let query = 'is:issue is:open';
      
      // Add labels to query
      if (labels && labels.length > 0) {
        const labelQuery = labels.map(label => `label:"${label}"`).join(' ');
        query += ` ${labelQuery}`;
      } else {
        // If no labels selected, default to "good first issue"
        query += ' label:"good first issue"';
      }
      
      // Add search query if provided
      if (searchQuery) {
        query += ` ${searchQuery}`;
      }

      if (languages && languages.length > 0) {
        // For multiple languages, we'll use a different approach
        // Instead of using OR, we'll make separate requests for each language
        // and combine the results
        const allIssues: GitHubIssue[] = [];
        let totalCount = 0;

        for (const language of languages) {
          // Use exact language name in the query
          const languageQuery = `${query} language:"${language}"`;
          console.log('Searching with query:', languageQuery); // Debug log

          const response = await fetch(
            `${GITHUB_API_URL}/search/issues?q=${encodeURIComponent(languageQuery)}&page=${page}&per_page=${perPage}&sort=created&order=desc`,
            {
              headers: this.getHeaders(),
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('GitHub API Error:', {
              status: response.status,
              message: errorData?.message || response.statusText,
              query: languageQuery
            });
            throw new Error(
              `GitHub API error (${response.status}): ${errorData?.message || response.statusText}`
            );
          }

          const data = await response.json();
          console.log(`Results for ${language}:`, {
            count: data.items.length,
            total: data.total_count,
            query: languageQuery
          });

          // Fetch repository details for each issue
          const issuesWithRepos = await Promise.all(
            data.items.map(async (issue: GitHubIssue) => {
              try {
                const repoDetails = await this.getRepositoryDetails(issue.repository_url);
                // Verify the repository language matches our search
                if (repoDetails.language !== language) {
                  console.log(`Language mismatch for ${issue.repository_url}:`, {
                    expected: language,
                    actual: repoDetails.language
                  });
                }
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

          // Filter out issues where the repository language doesn't match
          const filteredIssues = issuesWithRepos.filter(issue => 
            issue.repository?.language === language
          );

          allIssues.push(...filteredIssues);
          totalCount += filteredIssues.length;
        }

        // Remove duplicates based on issue ID
        const uniqueIssues = Array.from(
          new Map(allIssues.map(issue => [issue.id, issue])).values()
        );

        // Sort by creation date
        uniqueIssues.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        console.log('Final results:', {
          totalIssues: uniqueIssues.length,
          languages: languages,
          labels: labels,
          searchQuery
        });

        return {
          total_count: totalCount,
          incomplete_results: false,
          items: uniqueIssues
        };
      }

      // If no languages selected, use the original query
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

  static getPopularLanguages(): string[] {
    // Return exact language names as they appear in GitHub
    return [
      'JavaScript',
      'TypeScript',
      'Python',
      'Java',
      'C++',
      'Go',
      'Rust',
      'Ruby',
      'PHP',
      'C#',
      'Swift',
      'Kotlin',
      'Dart',
      'R',
      'Scala'
    ];
  }
} 