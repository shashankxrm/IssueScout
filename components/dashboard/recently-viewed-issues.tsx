'use client'

import { useRecentlyViewed } from "@/hooks/useRecentlyViewed"
import { IssueCard } from "@/components/issue-card"
import { formatRelativeTime } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export function RecentlyViewedIssues() {
  const { recentlyViewed, isLoading } = useRecentlyViewed()

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

  if (!recentlyViewed.length) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No recently viewed issues</p>
        </div>
      </div>
    )
  }

  // Remove duplicates by keeping only the most recent view of each issue
  const uniqueRecentlyViewed = recentlyViewed.reduce((acc, current) => {
    const existingIndex = acc.findIndex(item => item.issueData.id === current.issueData.id)
    if (existingIndex === -1) {
      acc.push(current)
    }
    return acc
  }, [] as typeof recentlyViewed)

  return (
    <div className="space-y-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-4 p-4">
          {uniqueRecentlyViewed.map((item) => (
            <div key={item.issueData.id} className="w-[350px]">
              <IssueCard
                issue={item.issueData}
                viewedAt={formatRelativeTime(item.createdAt)}
              />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
