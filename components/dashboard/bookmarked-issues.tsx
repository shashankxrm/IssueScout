'use client'

import { useBookmarks } from "@/hooks/useBookmarks"
import { IssueCard } from "@/components/issue-card"
import { formatRelativeTime } from "@/lib/utils"

export function BookmarkedIssues() {
  const { bookmarks, isLoading } = useBookmarks()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[200px] bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No bookmarked issues yet. Start bookmarking issues to see them here!
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookmarks.map((bookmark) => (
        <IssueCard
          key={bookmark.id}
          issue={bookmark}
          bookmarkedAt={formatRelativeTime(bookmark.bookmarkedAt || bookmark.createdAt)}
        />
      ))}
    </div>
  )
}
