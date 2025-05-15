import { IssueCard } from "@/components/issue-card"

// Mock data for demonstration
const mockIssues = [
  {
    id: 1,
    title: "Add dark mode support to the dashboard",
    repo: "vercel/next.js",
    number: 1234,
    description:
      "We need to add dark mode support to the dashboard to improve user experience in low-light environments.",
    labels: [
      { name: "good first issue", color: "7057ff" },
      { name: "enhancement", color: "a2eeef" },
    ],
    language: "TypeScript",
    stars: 98765,
    comments: 5,
    createdAt: "2023-12-15T12:00:00Z",
    lastActivity: "2023-12-20T14:30:00Z",
  },
  {
    id: 2,
    title: "Fix broken link in documentation",
    repo: "facebook/react",
    number: 5678,
    description: "The link to the installation guide in the documentation is broken and needs to be updated.",
    labels: [
      { name: "documentation", color: "0075ca" },
      { name: "good first issue", color: "7057ff" },
    ],
    language: "JavaScript",
    stars: 203456,
    comments: 2,
    createdAt: "2023-12-18T09:15:00Z",
    lastActivity: "2023-12-19T11:45:00Z",
  },
  {
    id: 3,
    title: "Improve error handling in API routes",
    repo: "prisma/prisma",
    number: 9012,
    description:
      "We need to improve error handling in API routes to provide better feedback to users when something goes wrong.",
    labels: [
      { name: "bug", color: "d73a4a" },
      { name: "help wanted", color: "008672" },
    ],
    language: "TypeScript",
    stars: 32109,
    comments: 8,
    createdAt: "2023-12-10T15:30:00Z",
    lastActivity: "2023-12-21T10:20:00Z",
  },
  {
    id: 4,
    title: "Add unit tests for authentication flow",
    repo: "supabase/supabase",
    number: 3456,
    description: "We need to add unit tests for the authentication flow to ensure it works correctly in all scenarios.",
    labels: [
      { name: "good first issue", color: "7057ff" },
      { name: "testing", color: "fbca04" },
    ],
    language: "TypeScript",
    stars: 54321,
    comments: 3,
    createdAt: "2023-12-17T11:45:00Z",
    lastActivity: "2023-12-20T09:30:00Z",
  },
  {
    id: 5,
    title: "Update README with new installation instructions",
    repo: "tailwindlabs/tailwindcss",
    number: 7890,
    description: "The README needs to be updated with the new installation instructions for v3.0.",
    labels: [{ name: "documentation", color: "0075ca" }],
    language: "CSS",
    stars: 67890,
    comments: 1,
    createdAt: "2023-12-19T14:20:00Z",
    lastActivity: "2023-12-21T08:15:00Z",
  },
  {
    id: 6,
    title: "Fix mobile responsiveness in navigation menu",
    repo: "shadcn/ui",
    number: 2345,
    description: "The navigation menu is not displaying correctly on mobile devices and needs to be fixed.",
    labels: [
      { name: "bug", color: "d73a4a" },
      { name: "good first issue", color: "7057ff" },
    ],
    language: "TypeScript",
    stars: 43210,
    comments: 4,
    createdAt: "2023-12-16T10:10:00Z",
    lastActivity: "2023-12-21T13:40:00Z",
  },
]

export function IssueGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockIssues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  )
}
