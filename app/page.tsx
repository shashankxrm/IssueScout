'use client';

import { Filters } from "@/components/filters"
import { IssueGrid } from "@/components/issue-grid"
import { EmptyState } from "@/components/empty-state"
import { Pagination } from "@/components/pagination"
import { useIssues } from '@/hooks/useIssues';
import { FloatingCta } from "@/components/landing/floating-cta"

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
    sort,
    setSort,
    order,
    setOrder,
    minStars,
    setMinStars,
    noAssignee,
    setNoAssignee,
    currentPage,
    totalPages,
    handlePageChange,
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
          sort={sort}
          onSortChange={setSort}
          order={order}
          onOrderChange={setOrder}
          minStars={minStars}
          onMinStarsChange={setMinStars}
          noAssignee={noAssignee}
          onNoAssigneeChange={setNoAssignee}
        />

        {!loading && issues.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <IssueGrid issues={issues} loading={loading} error={error} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
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
