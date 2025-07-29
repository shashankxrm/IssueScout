import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../utils'
import { GitHubIssue } from '@/lib/github'

// Mock IssueCard component
vi.mock('@/components/issue-card', () => ({
  IssueCard: ({ issue }: { issue: any }) => (
    <div data-testid="issue-card" data-issue-id={issue.id}>
      {issue.title}
    </div>
  ),
}))

// Mock Skeleton component
vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}))

describe('IssueGrid', () => {
  const mockIssues: GitHubIssue[] = [
    {
      id: 1,
      title: 'Test Issue 1',
      state: 'open',
      repository: {
        name: 'repo1',
        full_name: 'test/repo1',
        html_url: 'https://github.com/test/repo1',
        language: 'TypeScript',
        stargazers_count: 100,
      },
      repository_url: 'https://api.github.com/repos/test/repo1',
      number: 123,
      body: 'Test description',
      labels: [
        { id: 1, name: 'bug', color: 'ff0000' },
        { id: 2, name: 'enhancement', color: '00ff00' },
      ],
      comments: 5,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      html_url: 'https://github.com/test/repo1/issues/123',
      assignee: null,
    },
    {
      id: 2,
      title: 'Test Issue 2',
      state: 'open',
      repository: {
        name: 'repo2',
        full_name: 'test/repo2',
        html_url: 'https://github.com/test/repo2',
        language: 'JavaScript',
        stargazers_count: 200,
      },
      repository_url: 'https://api.github.com/repos/test/repo2',
      number: 456,
      body: null,
      labels: [],
      comments: 0,
      created_at: '2024-01-03T00:00:00Z',
      updated_at: '2024-01-04T00:00:00Z',
      html_url: 'https://github.com/test/repo2/issues/456',
      assignee: null,
    },
  ]

  it('shows loading state', async () => {
    const { IssueGrid } = await import('@/components/issue-grid')
    render(<IssueGrid issues={[]} loading={true} error={null} />)
    
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons).toHaveLength(6) // 6 skeleton cards in loading state
  })

  it('shows error state', async () => {
    const { IssueGrid } = await import('@/components/issue-grid')
    const errorMessage = 'Failed to fetch issues'
    render(<IssueGrid issues={[]} loading={false} error={errorMessage} />)
    
    expect(screen.getByText(`Error loading issues: ${errorMessage}`)).toBeInTheDocument()
  })

  it('shows empty state', async () => {
    const { IssueGrid } = await import('@/components/issue-grid')
    render(<IssueGrid issues={[]} loading={false} error={null} />)
    
    expect(screen.getByText('No issues found. Try adjusting your filters.')).toBeInTheDocument()
  })

  it('renders issues correctly', async () => {
    const { IssueGrid } = await import('@/components/issue-grid')
    render(<IssueGrid issues={mockIssues} loading={false} error={null} />)
    
    const issueCards = screen.getAllByTestId('issue-card')
    expect(issueCards).toHaveLength(2)
    
    // Check if both issues are rendered with correct titles
    expect(screen.getByText('Test Issue 1')).toBeInTheDocument()
    expect(screen.getByText('Test Issue 2')).toBeInTheDocument()
  })

  it('handles missing repository data gracefully', async () => {
    const { IssueGrid } = await import('@/components/issue-grid')
    const issueWithMissingData: GitHubIssue = {
      ...mockIssues[0],
      repository: undefined,
    }
    
    render(<IssueGrid issues={[issueWithMissingData]} loading={false} error={null} />)
    
    const issueCard = screen.getByTestId('issue-card')
    expect(issueCard).toBeInTheDocument()
    expect(screen.getByText('Test Issue 1')).toBeInTheDocument()
  })

  it('handles missing body gracefully', async () => {
    const { IssueGrid } = await import('@/components/issue-grid')
    const issueWithMissingBody: GitHubIssue = {
      ...mockIssues[0],
      body: null,
    }
    
    render(<IssueGrid issues={[issueWithMissingBody]} loading={false} error={null} />)
    
    const issueCard = screen.getByTestId('issue-card')
    expect(issueCard).toBeInTheDocument()
    expect(screen.getByText('Test Issue 1')).toBeInTheDocument()
  })
}) 