'use client';

import { useState, useEffect } from 'react';
import { GitHubService, GitHubIssue, SearchFilters } from '@/lib/github';

interface UseIssuesReturn {
  issues: GitHubIssue[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
  selectedLabels: string[];
  setSelectedLabels: (labels: string[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sort: 'created' | 'updated' | 'comments';
  setSort: (sort: 'created' | 'updated' | 'comments') => void;
  order: 'asc' | 'desc';
  setOrder: (order: 'asc' | 'desc') => void;
  fetchIssues: (filters?: SearchFilters) => Promise<void>;
  handlePageChange: (page: number) => void;
}

export function useIssues(): UseIssuesReturn {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<'created' | 'updated' | 'comments'>('created');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const ITEMS_PER_PAGE = 15;
  const MAX_TOTAL_RESULTS = 500;
  const MAX_PAGES = Math.ceil(MAX_TOTAL_RESULTS / ITEMS_PER_PAGE);
  const totalPages = Math.min(Math.ceil(totalCount / ITEMS_PER_PAGE), MAX_PAGES);

  const fetchIssues = async (filters: SearchFilters = {}) => {
    try {
      console.log('Fetching issues...', { 
        ...filters, 
        languages: selectedLanguages,
        labels: selectedLabels,
        searchQuery,
        sort,
        order,
        page: filters.page || currentPage
      });
      setLoading(true);
      setError(null);
      
      const response = await GitHubService.searchIssues({
        ...filters,
        languages: selectedLanguages.length > 0 ? selectedLanguages : undefined,
        labels: selectedLabels.length > 0 ? selectedLabels : undefined,
        searchQuery: searchQuery || undefined,
        sort,
        order,
        page: filters.page || currentPage,
        perPage: ITEMS_PER_PAGE,
      });
      
      console.log('API Response:', response);
      
      if (!response.items) {
        console.error('No items in response:', response);
        throw new Error('Invalid response format from GitHub API');
      }

      setIssues(response.items);
      setTotalCount(Math.min(response.total_count, MAX_TOTAL_RESULTS));
      setCurrentPage(filters.page || currentPage);
      console.log('Issues set:', response.items);
    } catch (err) {
      console.error('Error in fetchIssues:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching issues');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchIssues({ page });
  };

  // Fetch issues when selected languages, labels, search query, sort, or order changes
  useEffect(() => {
    fetchIssues({ page: 1 });
  }, [selectedLanguages, selectedLabels, searchQuery, sort, order]);

  return {
    issues,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,
    selectedLanguages,
    setSelectedLanguages,
    selectedLabels,
    setSelectedLabels,
    searchQuery,
    setSearchQuery,
    sort,
    setSort,
    order,
    setOrder,
    fetchIssues,
    handlePageChange,
  };
} 