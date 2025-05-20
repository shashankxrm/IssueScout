import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../utils'
import { Filters } from '@/components/filters'

// Mock GitHubService
vi.mock('@/lib/github', () => ({
  GitHubService: {
    getPopularLanguages: () => ['TypeScript', 'JavaScript', 'Python'],
    getPopularLabels: () => ['bug', 'enhancement', 'good first issue'],
  },
}))

// Mock Radix UI components
vi.mock('@radix-ui/react-dropdown-menu', () => ({
  Root: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-root">{children}</div>,
  Trigger: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-trigger">{children}</div>,
  Content: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-content">{children}</div>,
  Label: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-label">{children}</div>,
  Group: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-group">{children}</div>,
  CheckboxItem: ({ children, checked, onCheckedChange }: { children: React.ReactNode; checked?: boolean; onCheckedChange?: (checked: boolean) => void }) => (
    <button 
      data-testid="dropdown-checkbox-item" 
      data-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
    >
      {children}
    </button>
  ),
  Item: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button data-testid="dropdown-item" onClick={onClick}>{children}</button>
  ),
  Separator: () => <hr data-testid="dropdown-separator" />,
  Portal: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-portal">{children}</div>,
  Sub: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-sub">{children}</div>,
  RadioGroup: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-radio-group">{children}</div>,
  SubTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-sub-trigger">{children}</div>,
  SubContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-sub-content">{children}</div>,
  RadioItem: ({ children, ...props }: { children: React.ReactNode }) => <div data-testid="dropdown-radio-item" {...props}>{children}</div>,
  ItemIndicator: ({ children }: { children: React.ReactNode }) => <span data-testid="dropdown-item-indicator">{children}</span>,
}))

import type { FiltersProps } from '@/components/filters'

describe('Filters', () => {
  const defaultProps = {
    onLanguageChange: vi.fn(),
    selectedLanguages: [],
    onLabelChange: vi.fn(),
    selectedLabels: [],
    searchQuery: '',
    onSearchChange: vi.fn(),
    sort: 'created' as const,
    onSortChange: vi.fn(),
    order: 'desc' as const,
    onOrderChange: vi.fn(),
    minStars: 0,
    onMinStarsChange: vi.fn(),
    noAssignee: false,
    onNoAssigneeChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all filter controls', () => {
    render(<Filters {...defaultProps} />)
    expect(screen.getByPlaceholderText('Search repositories or issues...')).toBeInTheDocument()
    expect(screen.getByText('Language')).toBeInTheDocument()
    expect(screen.getByText('Labels')).toBeInTheDocument()
    expect(screen.getByText('Sort')).toBeInTheDocument()
  })

  it('calls onSearchChange when typing in search', () => {
    render(<Filters {...defaultProps} />)
    const input = screen.getByPlaceholderText('Search repositories or issues...')
    fireEvent.change(input, { target: { value: 'test' } })
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('test')
  })

  it('calls onLanguageChange when selecting a language', () => {
    render(<Filters {...defaultProps} />)
    const languageButton = screen.getByText('Language')
    fireEvent.click(languageButton)
    const typeScriptOption = screen.getByText('TypeScript')
    fireEvent.click(typeScriptOption)
    expect(defaultProps.onLanguageChange).toHaveBeenCalled()
  })

  it('calls onLabelChange when selecting a label', () => {
    render(<Filters {...defaultProps} />)
    const labelButton = screen.getByText('Labels')
    fireEvent.click(labelButton)
    const bugOption = screen.getByText('bug')
    fireEvent.click(bugOption)
    expect(defaultProps.onLabelChange).toHaveBeenCalled()
  })

  it('calls onSortChange and onOrderChange when changing sort', () => {
    render(<Filters {...defaultProps} />)
    const sortButton = screen.getByText('Sort')
    fireEvent.click(sortButton)
    const mostCommentedOption = screen.getByText('Most commented')
    fireEvent.click(mostCommentedOption)
    expect(defaultProps.onSortChange).toHaveBeenCalledWith('comments')
    expect(defaultProps.onOrderChange).toHaveBeenCalledWith('desc')
  })
}) 