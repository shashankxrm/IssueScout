import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../utils'
import { IssueCard } from '@/components/issue-card'

// Mock the hooks
vi.mock('@/hooks/useBookmarks', () => ({
  useBookmarks: () => ({
    isBookmarked: vi.fn().mockReturnValue(false),
    toggleBookmark: vi.fn(),
  }),
}))

vi.mock('@/lib/auth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
  }),
}))

vi.mock('@/hooks/useRecentlyViewed', () => ({
  useRecentlyViewed: () => ({
    trackView: vi.fn(),
  }),
}))

// Mock window.open
const mockOpen = vi.fn()
window.open = mockOpen

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}))

describe('IssueCard', () => {
  const mockIssue = {
    id: 1,
    title: 'Test Issue',
    repo: 'test/repo',
    number: 123,
    description: 'This is a test issue description',
    labels: [
      { name: 'bug', color: 'ff0000' },
      { name: 'enhancement', color: '00ff00' },
    ],
    language: 'TypeScript',
    stars: 100,
    comments: 5,
    createdAt: '2024-01-01T00:00:00Z',
    lastActivity: '2024-01-02T00:00:00Z',
    html_url: 'https://github.com/test/repo/issues/123',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders issue card with all information', async () => {
    vi.resetModules()
    const { IssueCard } = await import('@/components/issue-card')
    render(<IssueCard issue={mockIssue} />)

    // Check title and repo
    expect(screen.getByText('Test Issue')).toBeInTheDocument()
    expect(screen.getByText('test/repo')).toBeInTheDocument()

    // Check labels
    expect(screen.getByText('bug')).toBeInTheDocument()
    expect(screen.getByText('enhancement')).toBeInTheDocument()

    // Check description
    expect(screen.getByText('This is a test issue description')).toBeInTheDocument()

    // Check metadata
    expect(screen.getByText('#123')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument() // stars
    expect(screen.getByText('5')).toBeInTheDocument() // comments
    expect(screen.getByText('TypeScript')).toBeInTheDocument() // language
  })

  it('handles bookmark click correctly', async () => {
    const mockToggleBookmark = vi.fn()
    vi.doMock('@/hooks/useBookmarks', () => ({
      useBookmarks: () => ({
        isBookmarked: vi.fn().mockReturnValue(false),
        toggleBookmark: mockToggleBookmark,
      }),
    }))

    vi.resetModules()
    const { IssueCard } = await import('@/components/issue-card')
    render(<IssueCard issue={mockIssue} />)

    const bookmarkButton = screen.getByRole('button', { name: 'Add bookmark' })
    fireEvent.click(bookmarkButton)

    expect(mockToggleBookmark).toHaveBeenCalledWith(mockIssue)
  })

  it('handles view click correctly', async () => {
    const mockTrackView = vi.fn()
    vi.doMock('@/hooks/useRecentlyViewed', () => ({
      useRecentlyViewed: () => ({
        trackView: mockTrackView,
      }),
    }))

    vi.resetModules()
    const { IssueCard } = await import('@/components/issue-card')
    render(<IssueCard issue={mockIssue} />)

    const viewButton = screen.getByRole('button', { name: 'View issue on GitHub' })
    fireEvent.click(viewButton)

    expect(mockTrackView).toHaveBeenCalledWith(mockIssue)
    expect(mockOpen).toHaveBeenCalledWith(mockIssue.html_url, '_blank')
  })

  it('shows bookmark and view timestamps when provided', async () => {
    vi.resetModules()
    const { IssueCard } = await import('@/components/issue-card')
    render(
      <IssueCard 
        issue={mockIssue} 
        bookmarkedAt="2 days ago"
        viewedAt="1 day ago"
      />
    )

    expect(screen.getByText('Bookmarked 2 days ago')).toBeInTheDocument()
    expect(screen.getByText('Viewed 1 day ago')).toBeInTheDocument()
  })

  it('shows correct bookmark state when issue is bookmarked', async () => {
    vi.doMock('@/hooks/useBookmarks', () => ({
      useBookmarks: () => ({
        isBookmarked: vi.fn().mockReturnValue(true),
        toggleBookmark: vi.fn(),
      }),
    }))

    vi.resetModules()
    const { IssueCard } = await import('@/components/issue-card')
    render(<IssueCard issue={mockIssue} />)

    const bookmarkButton = screen.getByRole('button', { name: 'Remove bookmark' })
    expect(bookmarkButton).toHaveClass('text-yellow-500')
  })
}) 