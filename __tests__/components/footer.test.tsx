import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../utils'

// Mock window.open
const mockOpen = vi.fn()
window.open = mockOpen

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders footer with correct content', async () => {
    const { default: Footer } = await import('@/components/footer')
    render(<Footer />)
    
    // Check for copyright text
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(`© ${currentYear} IssueScout. All rights reserved.`)).toBeInTheDocument()
    
    // Check for buttons
    expect(screen.getByText('Contribute')).toBeInTheDocument()
    expect(screen.getByText('Buy me a coffee')).toBeInTheDocument()
  })

  it('opens GitHub link when Contribute button is clicked', async () => {
    const { default: Footer } = await import('@/components/footer')
    render(<Footer />)
    
    const contributeButton = screen.getByText('Contribute')
    contributeButton.click()
    
    expect(mockOpen).toHaveBeenCalledWith('https://github.com/shashankxrm/issuescout', '_blank')
  })

  it('opens Buy Me a Coffee link when button is clicked', async () => {
    const { default: Footer } = await import('@/components/footer')
    render(<Footer />)
    
    const coffeeButton = screen.getByText('Buy me a coffee')
    coffeeButton.click()
    
    expect(mockOpen).toHaveBeenCalledWith('https://www.buymeacoffee.com/shashankxrm', '_blank')
  })

  it('applies correct styling classes', async () => {
    const { default: Footer } = await import('@/components/footer')
    const { container } = render(<Footer />)
    
    // Check for footer with border
    const footer = container.querySelector('footer')
    expect(footer).toHaveClass('border-t')
    
    // Check for container with flex layout
    const containerDiv = container.querySelector('.container')
    expect(containerDiv).toHaveClass('flex')
    expect(containerDiv).toHaveClass('md:flex-row')
    expect(containerDiv).toHaveClass('flex-col')
  })
}) 