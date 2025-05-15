'use client'

import { useBookmarks } from "@/hooks/useBookmarks"
import { IssueCard } from "@/components/issue-card"

export function BookmarkedIssues() {
  const { bookmarks } = useBookmarks()

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No bookmarked issues yet. Start bookmarking issues to see them here!
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookmarks.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
        />
      ))}
    </div>
  )
}
