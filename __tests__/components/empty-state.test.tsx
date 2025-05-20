import { describe, it, expect } from 'vitest'
import { render, screen } from '../utils'

describe('EmptyState', () => {
  it('renders empty state with correct content', async () => {
    const { EmptyState } = await import('@/components/empty-state')
    render(<EmptyState />)
    
    // Check for the icon using its class
    expect(screen.getByTestId('file-search-icon')).toBeInTheDocument()
    
    // Check for the heading
    expect(screen.getByText('No issues found')).toBeInTheDocument()
    
    // Check for the description
    expect(screen.getByText(/Try adjusting your search or filter criteria/)).toBeInTheDocument()
  })

  it('applies correct styling classes', async () => {
    const { EmptyState } = await import('@/components/empty-state')
    const { container } = render(<EmptyState />)
    
    // Check for Card with dashed border
    const card = container.querySelector('.border-dashed')
    expect(card).toBeInTheDocument()
    
    // Check for centered content
    const content = container.querySelector('.flex.flex-col.items-center')
    expect(content).toBeInTheDocument()
  })
}) 