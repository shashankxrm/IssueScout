import { BookmarkedIssues } from "@/components/dashboard/bookmarked-issues"
import { RecentlyViewedIssues } from "@/components/dashboard/recently-viewed-issues"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { FloatingCta } from "@/components/landing/floating-cta"

export default function DashboardPage() {
  return (
    <div className="container py-8 max-w-7xl mx-auto px-4">
      <div className="space-y-8">
        <DashboardHeader />
        <DashboardStats />

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Bookmarked Issues</h2>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>Find More Issues</span>
            </Button>
          </Link>
        </div>
        <BookmarkedIssues />

        <div className="pt-4">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Recently Viewed Issues</h2>
          <RecentlyViewedIssues />
        </div>
      </div>
      <FloatingCta 
        text="Found any bugs or wanna request an feature?" 
        buttonText="Report"
        buttonHref="mailto:shashankreddy0608@gmail.com"
        buttonProps={{
          variant: "outline",
          size: "sm",
          className: "rounded-full"
        }}
        showAfterScroll={true}
        
      />
    </div>
  )
}
