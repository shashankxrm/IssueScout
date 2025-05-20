import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../utils'
import { ThemeProvider, useTheme } from 'next-themes'

// Default mock for next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    themes: ['light', 'dark'],
    systemTheme: 'light',
    resolvedTheme: 'light',
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('ModeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the toggle button', async () => {
    vi.resetModules()
    const { ModeToggle } = await import('@/components/mode-toggle')
    render(<ModeToggle />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('toggles theme when clicked', async () => {
    const mockSetTheme = vi.fn()
    vi.doMock('next-themes', () => ({
      useTheme: () => ({
        theme: 'light',
        setTheme: mockSetTheme,
        themes: ['light', 'dark'],
        systemTheme: 'light',
        resolvedTheme: 'light',
      }),
      ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    }))
    vi.resetModules()
    const { ModeToggle } = await import('@/components/mode-toggle')
    render(<ModeToggle />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('shows correct icon based on theme', async () => {
    vi.resetModules()
    const { ModeToggle } = await import('@/components/mode-toggle')
    render(<ModeToggle />)
    const sunIcon = screen.getByTestId('sun-icon')
    expect(sunIcon).toBeInTheDocument()
    expect(sunIcon).toHaveClass('scale-100')
  })
}) 