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
  createdAt: string; // When the issue was created on GitHub
  lastActivity: string;
  html_url: string;
  bookmarkedAt?: string; // When the user bookmarked this issue
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
  createdAt: Date; // When the bookmark was created
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
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Failed to fetch bookmarks');
        }
        
        const data = await response.json() as BookmarkDocument[];
        
        // Process synced bookmarks to include bookmark creation time
        const syncedBookmarks = data.map(bookmark => {
          // Add bookmarkedAt to the issue data
          return {
            ...bookmark.issueData,
            bookmarkedAt: bookmark.createdAt.toString()
          };
        });
        
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
            const now = new Date();
            const syncPromises = bookmarksToSync.map(bookmark =>
              fetch('/api/bookmarks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ issue: bookmark }),
              }).then(async response => {
                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.details || 'Failed to sync bookmark');
                }
                
                const savedBookmark = await response.json();
                // Add bookmarkedAt to the bookmark data
                return {
                  ...bookmark,
                  bookmarkedAt: savedBookmark.createdAt.toString()
                };
              })
            );
            
            const savedBookmarks = await Promise.all(syncPromises);
            
            // Add newly synced bookmarks to the map with bookmark time
            savedBookmarks.forEach(bookmark => {
              bookmarkMap.set(bookmark.id, bookmark);
            });
          } catch (error) {
            console.error('Error syncing bookmarks:', error);
            toast.error('Failed to sync some bookmarks');
          }
        }

        // Convert map values back to array and sort by bookmark creation date
        const mergedBookmarks = Array.from(bookmarkMap.values())
          .sort((a, b) => {
            const dateA = a.bookmarkedAt ? new Date(a.bookmarkedAt).getTime() : 0;
            const dateB = b.bookmarkedAt ? new Date(b.bookmarkedAt).getTime() : 0;
            return dateB - dateA; // Newest bookmarks first
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
          const response = await fetch('/api/bookmarks', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ issueId: issue.id }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || 'Failed to delete bookmark');
          }
        } catch (error) {
          console.error('Error deleting bookmark:', error);
          toast.error('Failed to delete bookmark');
          return;
        }
      }
    } else {
      const now = new Date();
      const bookmarkedIssue = {
        ...issue,
        bookmarkedAt: now.toString()
      };
      
      newBookmarks = [...currentBookmarks, bookmarkedIssue];
      
      if (isAuthenticated) {
        try {
          const response = await fetch('/api/bookmarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ issue }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || 'Failed to create bookmark');
          }

          const savedBookmark = await response.json();
          console.log('Bookmark saved successfully:', savedBookmark);
          
          // Update the bookmarkedAt timestamp with the one from the server
          const indexToUpdate = newBookmarks.findIndex(b => b.id === issue.id);
          if (indexToUpdate !== -1) {
            newBookmarks[indexToUpdate].bookmarkedAt = savedBookmark.createdAt.toString();
          }
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