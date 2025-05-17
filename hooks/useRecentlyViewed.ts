'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface Issue {
  id: number;
  title: string;
  repo: string;
  number: number;
  description: string;
  labels: { name: string; color: string }[];
  language: string;
  stars: number;
  comments: number;
  createdAt: string;
  lastActivity: string;
  html_url: string;
}

interface RecentlyViewedIssue {
  issueData: Issue;
  createdAt: string;
}

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch recently viewed issues
  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      if (!isAuthenticated) return;

      setIsLoading(true);
      try {
        const response = await fetch('/api/recently-viewed');
        if (!response.ok) throw new Error('Failed to fetch recently viewed issues');
        
        const data = await response.json();
        setRecentlyViewed(data);
      } catch (error) {
        console.error('Error fetching recently viewed issues:', error);
        toast.error('Failed to fetch recently viewed issues');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentlyViewed();
  }, [isAuthenticated]);

  // Track a new view
  const trackView = async (issue: Issue) => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch('/api/recently-viewed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue }),
      });

      if (!response.ok) throw new Error('Failed to track view');
      
      const newView = await response.json();
      setRecentlyViewed(prev => [newView, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Error tracking view:', error);
      toast.error('Failed to track view');
    }
  };

  return {
    recentlyViewed,
    isLoading,
    trackView,
  };
} 