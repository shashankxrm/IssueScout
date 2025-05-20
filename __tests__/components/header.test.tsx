import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../utils'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="next-image" />
  ),
}))

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: 'light',
  }),
}))

// Mock auth
vi.mock('@/lib/auth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    login: vi.fn(),
  }),
}))

// Mock ModeToggle
vi.mock('@/components/mode-toggle', () => ({
  ModeToggle: () => <div data-testid="mode-toggle">Mode Toggle</div>,
}))

// Mock ProfileDropdown
vi.mock('@/components/profile-dropdown', () => ({
  ProfileDropdown: () => <div data-testid="profile-dropdown">Profile Dropdown</div>,
}))

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('renders logo and title', async () => {
    const { default: Header } = await import('@/components/header')
    render(<Header />)
    expect(screen.getByText('IssueScout')).toBeInTheDocument()
    expect(screen.getByTestId('next-image')).toHaveAttribute('alt', 'IssueScout Logo')
  })

  it('shows About link', async () => {
    const { default: Header } = await import('@/components/header')
    render(<Header />)
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('shows ModeToggle', async () => {
    const { default: Header } = await import('@/components/header')
    render(<Header />)
    expect(screen.getByTestId('mode-toggle')).toBeInTheDocument()
  })

  it('shows Dashboard link on home page', async () => {
    const { default: Header } = await import('@/components/header')
    render(<Header />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('shows Issues link on dashboard page', async () => {
    vi.doMock('next/navigation', () => ({
      usePathname: () => '/dashboard',
    }))
    const { default: Header } = await import('@/components/header')
    render(<Header />)
    expect(screen.getByText('Issues')).toBeInTheDocument()
  })

  it('shows Sign in button when not authenticated', async () => {
    const { default: Header } = await import('@/components/header')
    render(<Header />)
    expect(screen.getByText('Sign in')).toBeInTheDocument()
  })

  it('shows ProfileDropdown when authenticated', async () => {
    vi.doMock('@/lib/auth', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        login: vi.fn(),
      }),
    }))
    const { default: Header } = await import('@/components/header')
    render(<Header />)
    expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument()
  })

  it('uses dark logo in dark theme', async () => {
    vi.doMock('next-themes', () => ({
      useTheme: () => ({
        resolvedTheme: 'dark',
      }),
    }))
    const { default: Header } = await import('@/components/header')
    render(<Header />)
    expect(screen.getByTestId('next-image')).toHaveAttribute('src', '/issuescout-dark.png')
  })

  it('uses light logo in light theme', async () => {
    vi.doMock('next-themes', () => ({
      useTheme: () => ({
        resolvedTheme: 'light',
      }),
    }))
    const { default: Header } = await import('@/components/header')
    render(<Header />)
    expect(screen.getByTestId('next-image')).toHaveAttribute('src', '/issuescout-light.png')
  })
}) 