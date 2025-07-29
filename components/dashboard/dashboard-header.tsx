"use client"

import { Button } from "@/components/ui/button"
import { Github} from "lucide-react"
import { useAuth } from "@/lib/auth"

export function DashboardHeader() {
  const { isAuthenticated, login} = useAuth()

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track your bookmarked and recently viewed issues</p>
      </div>
      <div className="flex items-center gap-3">
        {!isAuthenticated && (
          <Button variant="default" size="sm" className="gap-1" onClick={login}>
            <Github className="h-4 w-4" />
            <span>Sync with GitHub</span>
          </Button>
        )}
      </div>
    </div>
  )
}
