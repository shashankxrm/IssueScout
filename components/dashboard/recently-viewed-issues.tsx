import { RecentlyViewedIssueCard } from "@/components/dashboard/recently-viewed-issue-card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

// Mock data for demonstration
const mockRecentlyViewedIssues = [
  {
    id: 101,
    title: "Implement responsive design for mobile view",
    repo: "vercel/next.js",
    language: "TypeScript",
    viewedAt: "2023-12-21T14:30:00Z",
  },
  {
    id: 102,
    title: "Add support for custom themes",
    repo: "shadcn/ui",
    language: "TypeScript",
    viewedAt: "2023-12-21T12:15:00Z",
  },
  {
    id: 103,
    title: "Fix memory leak in useEffect hook",
    repo: "facebook/react",
    language: "JavaScript",
    viewedAt: "2023-12-20T18:45:00Z",
  },
  {
    id: 104,
    title: "Improve accessibility for form components",
    repo: "radix-ui/primitives",
    language: "TypeScript",
    viewedAt: "2023-12-20T10:30:00Z",
  },
  {
    id: 105,
    title: "Add dark mode support for code blocks",
    repo: "tailwindlabs/tailwindcss",
    language: "CSS",
    viewedAt: "2023-12-19T16:20:00Z",
  },
  {
    id: 106,
    title: "Fix broken links in API documentation",
    repo: "prisma/prisma",
    language: "TypeScript",
    viewedAt: "2023-12-19T09:10:00Z",
  },
  {
    id: 107,
    title: "Add support for PostgreSQL 15",
    repo: "supabase/supabase",
    language: "TypeScript",
    viewedAt: "2023-12-18T14:05:00Z",
  },
  {
    id: 108,
    title: "Implement server-side pagination",
    repo: "tanstack/query",
    language: "TypeScript",
    viewedAt: "2023-12-18T11:30:00Z",
  },
]

export function RecentlyViewedIssues() {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-4 pb-4">
        {mockRecentlyViewedIssues.map((issue) => (
          <RecentlyViewedIssueCard key={issue.id} issue={issue} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
