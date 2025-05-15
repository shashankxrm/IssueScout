'use client';

import { IssueCard } from "@/components/issue-card"
import { useIssues } from "@/hooks/useIssues"
import { Skeleton } from "@/components/ui/skeleton"

export function IssueGrid() {
  const { issues, loading, error } = useIssues();

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
        if (!issue.repository) {
          console.warn('Issue missing repository data:', issue);
          return null;
        }

        const issueData = {
          id: issue.id,
          title: issue.title,
          repo: issue.repository.full_name,
          number: issue.number,
          description: issue.body || "No description provided",
          labels: (issue.labels || []).map(label => ({
            name: label.name,
            color: label.color
          })),
          language: issue.repository.language || "Unknown",
          stars: issue.repository.stargazers_count || 0,
          comments: issue.comments || 0,
          createdAt: issue.created_at,
          lastActivity: issue.updated_at
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
