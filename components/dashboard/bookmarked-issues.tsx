import { BookmarkedIssueCard } from "@/components/dashboard/bookmarked-issue-card"
import { EmptyState } from "@/components/empty-state"

// Mock data for demonstration
const mockBookmarkedIssues = [
  {
    id: 1,
    title: "Add dark mode support to the dashboard",
    repo: "vercel/next.js",
    language: "TypeScript",
    labels: [
      { name: "good first issue", color: "7057ff" },
      { name: "enhancement", color: "a2eeef" },
    ],
    bookmarkedAt: "2023-12-15T12:00:00Z",
  },
  {
    id: 2,
    title: "Fix broken link in documentation",
    repo: "facebook/react",
    language: "JavaScript",
    labels: [
      { name: "documentation", color: "0075ca" },
      { name: "good first issue", color: "7057ff" },
    ],
    bookmarkedAt: "2023-12-18T09:15:00Z",
  },
  {
    id: 3,
    title: "Improve error handling in API routes",
    repo: "prisma/prisma",
    language: "TypeScript",
    labels: [
      { name: "bug", color: "d73a4a" },
      { name: "help wanted", color: "008672" },
    ],
    bookmarkedAt: "2023-12-10T15:30:00Z",
  },
  {
    id: 4,
    title: "Add unit tests for authentication flow",
    repo: "supabase/supabase",
    language: "TypeScript",
    labels: [
      { name: "good first issue", color: "7057ff" },
      { name: "testing", color: "fbca04" },
    ],
    bookmarkedAt: "2023-12-17T11:45:00Z",
  },
  {
    id: 5,
    title: "Update README with new installation instructions",
    repo: "tailwindlabs/tailwindcss",
    language: "CSS",
    labels: [{ name: "documentation", color: "0075ca" }],
    bookmarkedAt: "2023-12-19T14:20:00Z",
  },
  {
    id: 6,
    title: "Fix mobile responsiveness in navigation menu",
    repo: "shadcn/ui",
    language: "TypeScript",
    labels: [
      { name: "bug", color: "d73a4a" },
      { name: "good first issue", color: "7057ff" },
    ],
    bookmarkedAt: "2023-12-16T10:10:00Z",
  },
]

export function BookmarkedIssues() {
  const hasBookmarks = mockBookmarkedIssues.length > 0

  if (!hasBookmarks) {
    return (
      <EmptyState
        title="No bookmarked issues yet"
        description="Start exploring and bookmark issues you're interested in"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockBookmarkedIssues.map((issue) => (
        <BookmarkedIssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  )
}
