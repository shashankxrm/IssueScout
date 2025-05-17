"use client"

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface Label {
  name: string;
  color: string;
}

interface Issue {
  id: number;
  title: string;
  repo: string;
  number: number;
  description: string;
  labels: Label[];
  language: string;
  stars: number;
  comments: number;
  createdAt: string;
  lastActivity: string;
  html_url: string;
}

interface BookmarkState {
  bookmarks: Issue[];
  isBookmarked: (issueId: number) => boolean;
  toggleBookmark: (issue: Issue) => void;
  isLoading: boolean;
}

const STORAGE_KEY = 'bookmarks';
const BOOKMARKS_CHANGED_EVENT = 'bookmarksChanged';

// Helper functions to manage localStorage
const getStoredBookmarks = (): Issue[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error('Error reading bookmarks from localStorage:', error);
  }
  return [];
};

const saveBookmarks = (bookmarks: Issue[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    // Dispatch custom event to notify all components
    window.dispatchEvent(new CustomEvent(BOOKMARKS_CHANGED_EVENT, { detail: bookmarks }));
  } catch (error) {
    console.error('Error saving bookmarks to localStorage:', error);
  }
};

export function useBookmarks(): BookmarkState {
  const [bookmarks, setBookmarks] = useState<Issue[]>(getStoredBookmarks());
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Sync bookmarks with MongoDB when authenticated
  useEffect(() => {
    const syncBookmarks = async () => {
      if (!isAuthenticated) return;

      setIsLoading(true);
      try {
        const response = await fetch('/api/bookmarks');
        if (!response.ok) throw new Error('Failed to fetch bookmarks');
        
        const data = await response.json();
        const syncedBookmarks = data.map((bookmark: any) => bookmark.issueData);
        
        // Merge local bookmarks with synced bookmarks
        const localBookmarks = getStoredBookmarks();
        const mergedBookmarks = [...syncedBookmarks];
        
        // Add local bookmarks that aren't in synced bookmarks
        localBookmarks.forEach(localBookmark => {
          if (!mergedBookmarks.some(b => b.id === localBookmark.id)) {
            mergedBookmarks.push(localBookmark);
            // Sync this bookmark to MongoDB
            fetch('/api/bookmarks', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ issue: localBookmark }),
            }).catch(console.error);
          }
        });

        setBookmarks(mergedBookmarks);
        saveBookmarks(mergedBookmarks);
      } catch (error) {
        console.error('Error syncing bookmarks:', error);
        toast.error('Failed to sync bookmarks');
      } finally {
        setIsLoading(false);
      }
    };

    syncBookmarks();
  }, [isAuthenticated]);

  // Listen for bookmark changes from other components
  useEffect(() => {
    const handleBookmarksChanged = (event: CustomEvent<Issue[]>) => {
      console.log('Bookmarks changed event received:', event.detail);
      setBookmarks(event.detail);
    };

    window.addEventListener(BOOKMARKS_CHANGED_EVENT, handleBookmarksChanged as EventListener);
    return () => {
      window.removeEventListener(BOOKMARKS_CHANGED_EVENT, handleBookmarksChanged as EventListener);
    };
  }, []);

  const isBookmarked = useCallback((issueId: number): boolean => {
    return bookmarks.some(bookmark => bookmark.id === issueId);
  }, [bookmarks]);

  const toggleBookmark = useCallback(async (issue: Issue) => {
    console.log('Toggling bookmark for issue:', issue);
    const currentBookmarks = getStoredBookmarks();
    console.log('Current bookmarks from storage:', currentBookmarks);

    const isAlreadyBookmarked = currentBookmarks.some(
      bookmark => bookmark.id === issue.id
    );

    let newBookmarks;
    if (isAlreadyBookmarked) {
      console.log('Removing bookmark');
      newBookmarks = currentBookmarks.filter(bookmark => bookmark.id !== issue.id);
      if (isAuthenticated) {
        try {
          await fetch('/api/bookmarks', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ issueId: issue.id }),
          });
        } catch (error) {
          console.error('Error deleting bookmark:', error);
          toast.error('Failed to delete bookmark');
          return;
        }
      }
    } else {
      console.log('Adding bookmark');
      newBookmarks = [...currentBookmarks, issue];
      if (isAuthenticated) {
        try {
          await fetch('/api/bookmarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ issue }),
          });
        } catch (error) {
          console.error('Error creating bookmark:', error);
          toast.error('Failed to create bookmark');
          return;
        }
      }
    }

    console.log('New bookmarks to save:', newBookmarks);
    saveBookmarks(newBookmarks);
    setBookmarks(newBookmarks);
  }, [isAuthenticated]);

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    isLoading,
  };
} 