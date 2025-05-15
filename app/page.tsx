'use client';

import { Filters } from "@/components/filters"
import { IssueGrid } from "@/components/issue-grid"
import { EmptyState } from "@/components/empty-state"
import { Pagination } from "@/components/pagination"
import { useIssues } from '@/hooks/useIssues';

export default function Home() {
  const {
    issues,
    loading,
    error,
    selectedLanguages,
    setSelectedLanguages,
    selectedLabels,
    setSelectedLabels,
    searchQuery,
    setSearchQuery,
  } = useIssues();

  return (
    <div className="container py-8 max-w-7xl mx-auto px-4">
      <div className="space-y-8">
        <div className="space-y-2 mx-2 md:mx-0">
          <h1 className="text-3xl font-bold tracking-tight">IssueScout</h1>
          <p className="text-muted-foreground">
            Discover beginner-friendly open source issues to start your contribution journey
          </p>
        </div>

        <Filters
          selectedLanguages={selectedLanguages}
          onLanguageChange={setSelectedLanguages}
          onLabelChange={setSelectedLabels}
          selectedLabels={selectedLabels}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {issues.length > 0 ? (
          <>
            <IssueGrid issues={issues} loading={loading} error={error} />
            <Pagination />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}
