import { formatDistanceToNow } from "date-fns"
import { Github, ExternalLink, Bookmark, Clock } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface RecentlyViewedIssue {
  id: number
  title: string
  repo: string
  language: string
  viewedAt: string
}

interface RecentlyViewedIssueCardProps {
  issue: RecentlyViewedIssue
}

export function RecentlyViewedIssueCard({ issue }: RecentlyViewedIssueCardProps) {
  const viewedDate = new Date(issue.viewedAt)

  return (
    <Card className="w-[300px] transition-all hover:-translate-y-1 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Github className="h-4 w-4" />
          <span className="truncate">{issue.repo}</span>
        </div>
        <a
          href={`https://github.com/${issue.repo}/issues`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-semibold hover:underline line-clamp-2 h-12"
        >
          {issue.title}
        </a>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>Viewed {formatDistanceToNow(viewedDate, { addSuffix: true })}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex items-center justify-between border-t">
        <Badge variant="secondary" className="text-xs">
          {issue.language}
        </Badge>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
