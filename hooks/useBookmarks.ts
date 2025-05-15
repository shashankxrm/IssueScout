"use client"

import { useState, useEffect, useCallback } from 'react';

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

  const toggleBookmark = useCallback((issue: Issue) => {
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
    } else {
      console.log('Adding bookmark');
      newBookmarks = [...currentBookmarks, issue];
    }

    console.log('New bookmarks to save:', newBookmarks);
    saveBookmarks(newBookmarks);
    setBookmarks(newBookmarks);
  }, []);

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
  };
} 