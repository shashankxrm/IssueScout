import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../utils'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  usePathname: () => '/',
}))

describe('Providers', () => {
  it('renders children', async () => {
    const { Providers } = await import('@/components/providers')
    render(
      <Providers>
        <div data-testid="child">Child</div>
      </Providers>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
}) 