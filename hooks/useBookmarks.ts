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

interface BookmarkDocument {
  userId: string;
  issueId: number;
  issueData: Issue;
  createdAt: Date;
  updatedAt: Date;
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
        // Fetch synced bookmarks
        const response = await fetch('/api/bookmarks');
        if (!response.ok) throw new Error('Failed to fetch bookmarks');
        
        const data = await response.json() as BookmarkDocument[];
        const syncedBookmarks = data.map(bookmark => bookmark.issueData);
        
        // Get local bookmarks
        const localBookmarks = getStoredBookmarks();
        
        // Create a Map of all bookmarks by ID for efficient lookup
        const bookmarkMap = new Map<number, Issue>();
        
        // First add all synced bookmarks
        syncedBookmarks.forEach(bookmark => {
          bookmarkMap.set(bookmark.id, bookmark);
        });
        
        // Find local bookmarks that need to be synced
        const bookmarksToSync = localBookmarks.filter(
          localBookmark => !bookmarkMap.has(localBookmark.id)
        );

        // Batch sync new bookmarks if there are any
        if (bookmarksToSync.length > 0) {
          try {
            const syncPromises = bookmarksToSync.map(bookmark =>
              fetch('/api/bookmarks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ issue: bookmark }),
              })
            );
            
            await Promise.all(syncPromises);
            
            // Add newly synced bookmarks to the map
            bookmarksToSync.forEach(bookmark => {
              bookmarkMap.set(bookmark.id, bookmark);
            });
          } catch (error) {
            console.error('Error syncing bookmarks:', error);
            toast.error('Failed to sync some bookmarks');
          }
        }

        // Convert map values back to array and sort by creation date
        const mergedBookmarks = Array.from(bookmarkMap.values())
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
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
    const currentBookmarks = getStoredBookmarks();
    const isAlreadyBookmarked = currentBookmarks.some(
      bookmark => bookmark.id === issue.id
    );

    let newBookmarks;
    if (isAlreadyBookmarked) {
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