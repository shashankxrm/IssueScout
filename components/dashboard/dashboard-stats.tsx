'use client'

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Bookmark, Clock, GitPullRequest, Star } from "lucide-react"
import { useBookmarks } from "@/hooks/useBookmarks"
import { useEffect, useState } from "react"

export function DashboardStats() {
  const { bookmarks } = useBookmarks()
  const [bookmarkTrend, setBookmarkTrend] = useState<{ count: number; trend: string; trendUp: boolean | null }>({
    count: 0,
    trend: "No change",
    trendUp: null
  })

  useEffect(() => {
    // Calculate trend based on bookmarks created in the last week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const recentBookmarks = bookmarks.filter(bookmark => {
      const bookmarkDate = new Date(bookmark.createdAt)
      return bookmarkDate >= oneWeekAgo
    })

    const trend = recentBookmarks.length > 0
      ? `+${recentBookmarks.length} this week`
      : "No change this week"

    setBookmarkTrend({
      count: bookmarks.length,
      trend,
      trendUp: recentBookmarks.length > 0
    })
  }, [bookmarks])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Bookmarked Issues"
        value={bookmarkTrend.count.toString()}
        description="Total saved issues"
        icon={<Bookmark className="h-4 w-4 text-blue-500" />}
        trend={bookmarkTrend.trend}
        trendUp={bookmarkTrend.trendUp}
      />
      <StatsCard
        title="Recently Viewed"
        value="24"
        description="Issues viewed in last 30 days"
        icon={<Clock className="h-4 w-4 text-green-500" />}
        trend="+8 this week"
        trendUp={true}
      />
      <StatsCard
        title="Contributions"
        value="5"
        description="Pull requests submitted"
        icon={<GitPullRequest className="h-4 w-4 text-purple-500" />}
        trend="+1 this week"
        trendUp={true}
      />
      <StatsCard
        title="Stars Earned"
        value="18"
        description="On your contributions"
        icon={<Star className="h-4 w-4 text-yellow-500" />}
        trend="Same as last week"
        trendUp={null}
      />
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend: string
  trendUp: boolean | null
}

function StatsCard({ title, value, description, icon, trend, trendUp }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center justify-center rounded-md bg-muted p-2">{icon}</div>
          <div className="flex items-center text-xs font-medium">
            {trend}
            {trendUp !== null && (
              <span className={`ml-1 ${trendUp ? "text-green-500" : "text-red-500"}`}>{trendUp ? "↑" : "↓"}</span>
            )}
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
