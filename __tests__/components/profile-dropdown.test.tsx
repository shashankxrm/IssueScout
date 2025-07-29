import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../utils'

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: 'light',
  }),
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

describe('ProfileDropdown', () => {
  const mockLogout = vi.fn()
  const mockUser = {
    name: 'Test User',
    email: 'test@example.com',
    image: '',
    githubUsername: 'testuser',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('renders nothing if no user', async () => {
    vi.doMock('@/lib/auth', () => ({
      useAuth: () => ({ user: null, logout: vi.fn() }),
    }))
    vi.doMock('next/navigation', () => ({
      usePathname: () => '/',
    }))
    const { ProfileDropdown } = await import('@/components/profile-dropdown')
    const { container } = render(<ProfileDropdown />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders user info in dropdown', async () => {
    vi.doMock('@/lib/auth', () => ({
      useAuth: () => ({ user: mockUser, logout: mockLogout }),
    }))
    vi.doMock('next/navigation', () => ({
      usePathname: () => '/',
    }))
    const { ProfileDropdown } = await import('@/components/profile-dropdown')
    render(<ProfileDropdown />)
    expect(screen.getByTestId('dropdown-content')).toHaveTextContent('Test User')
    expect(screen.getByTestId('dropdown-content')).toHaveTextContent('test@example.com')
  })

  it('shows dashboard link on /', async () => {
    vi.doMock('@/lib/auth', () => ({
      useAuth: () => ({ user: mockUser, logout: mockLogout }),
    }))
    vi.doMock('next/navigation', () => ({
      usePathname: () => '/',
    }))
    const { ProfileDropdown } = await import('@/components/profile-dropdown')
    render(<ProfileDropdown />)
    expect(screen.getByTestId('dropdown-content')).toHaveTextContent('Dashboard')
  })

  it('shows issues link on /dashboard', async () => {
    vi.doMock('@/lib/auth', () => ({
      useAuth: () => ({ user: mockUser, logout: mockLogout }),
    }))
    vi.doMock('next/navigation', () => ({
      usePathname: () => '/dashboard',
    }))
    vi.resetModules()
    const { ProfileDropdown } = await import('@/components/profile-dropdown')
    render(<ProfileDropdown />)
    expect(screen.getByTestId('dropdown-content')).toHaveTextContent('Issues')
  })

  it('renders logout button', async () => {
    vi.doMock('@/lib/auth', () => ({
      useAuth: () => ({ user: mockUser, logout: mockLogout }),
    }))
    vi.doMock('next/navigation', () => ({
      usePathname: () => '/',
    }))
    const { ProfileDropdown } = await import('@/components/profile-dropdown')
    render(<ProfileDropdown />)
    const logoutButton = screen.getByText('Log out')
    expect(logoutButton).toBeInTheDocument()
  })
}) 