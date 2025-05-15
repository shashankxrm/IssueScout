"use client"

import { Button } from "@/components/ui/button"
import { Github, RefreshCw } from "lucide-react"
import { useState } from "react"

export function DashboardHeader() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track your bookmarked and recently viewed issues</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="gap-1" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </Button>
        <Button variant="default" size="sm" className="gap-1">
          <Github className="h-4 w-4" />
          <span>Sync with GitHub</span>
        </Button>
      </div>
    </div>
  )
}
