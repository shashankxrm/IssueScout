'use client';

import { formatDistanceToNow } from "date-fns"
import { Star, MessageSquare, Github, ExternalLink, BookmarkIcon, Bookmark } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useBookmarks } from "@/hooks/useBookmarks"
import { toast } from "sonner"

interface Label {
  name: string
  color: string
}

interface Issue {
  id: number
  title: string
  repo: string
  number: number
  description: string
  labels: Label[]
  language: string
  stars: number
  comments: number
  createdAt: string
  lastActivity: string
  html_url: string
}

interface IssueCardProps {
  issue: Issue
}

export function IssueCard({ issue }: IssueCardProps) {
  const createdDate = new Date(issue.createdAt)
  const lastActivityDate = new Date(issue.lastActivity)
  const { isBookmarked, toggleBookmark } = useBookmarks()

  const handleBookmarkClick = () => {
    toggleBookmark(issue)
    toast.success(
      isBookmarked(issue.id) 
        ? "Bookmark removed" 
        : "Bookmark saved locally"
    )
  }

  return (
    <Card className="overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Github className="h-4 w-4" />
          <span>{issue.repo}</span>
        </div>
        <a
          href={issue.html_url}
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
                backgroundColor: `#${label.color}15`,
                color: `#${label.color}`,
                borderColor: `#${label.color}30`,
                fontWeight: 500,
                textShadow: '0 0 1px rgba(255, 255, 255, 0.5)',
              }}
              variant="outline"
              className="text-xs font-medium hover:bg-opacity-20 transition-colors"
            >
              {label.name}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{issue.description || "No description provided"}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>#{issue.number}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5" />
            <span>{issue.stars.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{issue.comments}</span>
          </div>
          <div>{formatDistanceToNow(createdDate, { addSuffix: true })}</div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex items-center justify-between border-t">
        <Badge variant="secondary" className="text-xs">
          {issue.language}
        </Badge>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleBookmarkClick}
          >
            {isBookmarked(issue.id) ? (
              <Bookmark className="h-4 w-4 fill-current" />
            ) : (
              <BookmarkIcon className="h-4 w-4" />
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-1" 
            onClick={() => window.open(issue.html_url, '_blank')}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="text-xs">View</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
