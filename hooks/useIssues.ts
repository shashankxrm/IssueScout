'use client';

import { useState, useEffect } from 'react';
import { GitHubService, GitHubIssue } from '@/lib/github';

interface UseIssuesReturn {
  issues: GitHubIssue[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  fetchIssues: (page?: number) => Promise<void>;
}

export function useIssues(): UseIssuesReturn {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchIssues = async (page: number = 1) => {
    try {
      console.log('Fetching issues...'); // Debug log
      setLoading(true);
      setError(null);
      const response = await GitHubService.searchIssues(page);
      console.log('API Response:', response); // Debug log
      
      if (!response.items) {
        console.error('No items in response:', response);
        throw new Error('Invalid response format from GitHub API');
      }

      setIssues(response.items);
      setTotalCount(response.total_count);
      setCurrentPage(page);
      console.log('Issues set:', response.items); // Debug log
    } catch (err) {
      console.error('Error in fetchIssues:', err); // Debug log
      setError(err instanceof Error ? err.message : 'An error occurred while fetching issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered'); // Debug log
    fetchIssues();
  }, []);

  return {
    issues,
    loading,
    error,
    totalCount,
    currentPage,
    fetchIssues,
  };
} 