'use client';

import { IssueCard } from "@/components/issue-card"
import { Skeleton } from "@/components/ui/skeleton"
import { GitHubIssue } from "@/lib/github"

interface IssueGridProps {
  issues: GitHubIssue[];
  loading: boolean;
  error: string | null;
}

export function IssueGrid({ issues, loading, error }: IssueGridProps) {
  console.log('IssueGrid render:', { issues, loading, error });

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading issues: {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!issues || issues.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No issues found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {issues.map((issue) => {
        const issueData = {
          id: issue.id,
          title: issue.title,
          repo: issue.repository?.full_name || issue.repository_url.split('/').slice(-2).join('/'),
          number: issue.number,
          description: issue.body || "No description provided",
          labels: issue.labels.map(label => ({
            name: label.name,
            color: label.color
          })),
          language: issue.repository?.language || "Unknown",
          stars: issue.repository?.stargazers_count || 0,
          comments: issue.comments,
          createdAt: issue.created_at,
          lastActivity: issue.updated_at,
          html_url: issue.html_url
        };

        return (
          <IssueCard
            key={issue.id}
            issue={issueData}
          />
        );
      })}
    </div>
  );
}
