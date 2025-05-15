'use client';

import { useState, useEffect } from 'react';
import { GitHubService, GitHubIssue, SearchFilters } from '@/lib/github';

interface UseIssuesReturn {
  issues: GitHubIssue[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
  fetchIssues: (filters?: SearchFilters) => Promise<void>;
}

export function useIssues(): UseIssuesReturn {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const fetchIssues = async (filters: SearchFilters = {}) => {
    try {
      console.log('Fetching issues...', { ...filters, languages: selectedLanguages });
      setLoading(true);
      setError(null);
      
      const response = await GitHubService.searchIssues({
        ...filters,
        languages: selectedLanguages.length > 0 ? selectedLanguages : undefined,
      });
      
      console.log('API Response:', response);
      
      if (!response.items) {
        console.error('No items in response:', response);
        throw new Error('Invalid response format from GitHub API');
      }

      setIssues(response.items);
      setTotalCount(response.total_count);
      setCurrentPage(filters.page || 1);
      console.log('Issues set:', response.items);
    } catch (err) {
      console.error('Error in fetchIssues:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching issues');
    } finally {
      setLoading(false);
    }
  };

  // Fetch issues when selected languages change
  useEffect(() => {
    fetchIssues({ page: 1 });
  }, [selectedLanguages]);

  return {
    issues,
    loading,
    error,
    totalCount,
    currentPage,
    selectedLanguages,
    setSelectedLanguages,
    fetchIssues,
  };
} 