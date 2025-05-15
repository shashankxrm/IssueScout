import { formatDistanceToNow } from "date-fns"
import { Github, ExternalLink, Bookmark } from "lucide-react"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Label {
  name: string
  color: string
}

interface BookmarkedIssue {
  id: number
  title: string
  repo: string
  language: string
  labels: Label[]
  bookmarkedAt: string
}

interface BookmarkedIssueCardProps {
  issue: BookmarkedIssue
}

export function BookmarkedIssueCard({ issue }: BookmarkedIssueCardProps) {
  const bookmarkedDate = new Date(issue.bookmarkedAt)

  return (
    <Card className="overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Github className="h-4 w-4" />
          <span>{issue.repo}</span>
        </div>
        <a
          href={`https://github.com/${issue.repo}/issues`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold hover:underline line-clamp-2"
        >
          {issue.title}
        </a>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {issue.labels.map((label) => (
            <Badge
              key={label.name}
              style={{
                backgroundColor: `#${label.color}20`,
                color: `#${label.color}`,
                borderColor: `#${label.color}40`,
              }}
              variant="outline"
              className="text-xs font-normal"
            >
              {label.name}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardFooter className="p-4 pt-2 flex items-center justify-between border-t">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {issue.language}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Bookmarked {formatDistanceToNow(bookmarkedDate, { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-yellow-500">
            <Bookmark className="h-4 w-4 fill-current" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="text-xs">View</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
