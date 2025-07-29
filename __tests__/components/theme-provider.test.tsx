import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '../utils'

describe('ThemeProvider', () => {
  it('renders children after mount', async () => {
    const { ThemeProvider } = await import('@/components/theme-provider')
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <div data-testid="child">Child</div>
      </ThemeProvider>
    )
    // Wait for the effect to run
    await waitFor(() => {
      expect(screen.getByTestId('child')).toBeInTheDocument()
    })
  })
}) 