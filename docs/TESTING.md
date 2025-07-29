# Testing Guide

This document provides comprehensive information about the testing infrastructure and practices in IssueScout.

## Overview

IssueScout maintains a robust testing suite with **41 passing tests** and **70%+ code coverage**. Our testing strategy focuses on component reliability, user interaction testing, and continuous integration.

## Testing Stack

### Core Technologies
- **[Vitest](https://vitest.dev/)** - Lightning fast unit test runner built on Vite
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** - Simple and complete testing utilities for React components
- **[jsdom](https://github.com/jsdom/jsdom)** - Pure JavaScript DOM implementation for Node.js
- **[MSW (Mock Service Worker)](https://mswjs.io/)** - API mocking library for browser and Node.js
- **[@testing-library/user-event](https://testing-library.com/docs/user-event/intro/)** - Fire events the same way the user does

### Additional Tools
- **[@testing-library/jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/)** - Custom jest matchers for DOM elements
- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react)** - React support for Vite
- **[@vitest/coverage-v8](https://vitest.dev/guide/coverage.html)** - Code coverage provider

## Test Configuration

### Vitest Configuration (`vitest.config.ts`)
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['__tests__/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        '__tests__/',
        '*.config.*',
        'coverage/',
        '.next/',
        'public/',
      ],
      thresholds: {
        global: {
          statements: 70,
          branches: 70,
          functions: 70,
          lines: 70
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
})
```

### Test Setup (`__tests__/setup.ts`)
```typescript
import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from './utils'

// Start MSW server before all tests
beforeAll(() => server.listen())

// Clean up after each test case
afterEach(() => {
  cleanup()
  server.resetHandlers()
})

// Close server after all tests
afterAll(() => server.close())
```

## Test Structure

### File Organization
```
__tests__/
├── setup.ts                    # Global test configuration
├── utils.tsx                   # Test utilities and helpers
└── components/                 # Component test files
    ├── empty-state.test.tsx
    ├── filters.test.tsx
    ├── footer.test.tsx
    ├── header.test.tsx
    ├── issue-card.test.tsx
    ├── issue-grid.test.tsx
    ├── mode-toggle.test.tsx
    ├── profile-dropdown.test.tsx
    ├── providers.test.tsx
    ├── theme-provider.test.tsx
    └── dashboard/
        └── [dashboard-components].test.tsx
```

### Test Utilities (`__tests__/utils.tsx`)
```typescript
import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from '@/components/theme-provider'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

// Custom render with providers
export const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {ui}
    </ThemeProvider>
  )
}

// MSW server setup
export const server = setupServer(
  rest.get('/api/issues', (req, res, ctx) => {
    return res(ctx.json(mockIssues))
  })
)

// Mock data
export const mockIssues = [
  {
    id: 1,
    title: 'Test Issue 1',
    state: 'open',
    // ... more properties
  }
]
```

## Test Categories

### 1. Component Tests
Tests individual React components in isolation.

**Example: Header Component Test**
```typescript
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/header'

describe('Header', () => {
  it('renders the logo and navigation', () => {
    render(<Header />)
    expect(screen.getByAltText('IssueScout')).toBeInTheDocument()
    expect(screen.getByText('Issues')).toBeInTheDocument()
  })

  it('shows sign in button when not authenticated', () => {
    render(<Header />)
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })
})
```

### 2. Interaction Tests
Tests user interactions like clicks, form submissions, and navigation.

**Example: Filter Component Test**
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Filters } from '@/components/filters'

describe('Filters', () => {
  it('filters issues by language when language is selected', async () => {
    const user = userEvent.setup()
    const onLanguageChange = vi.fn()
    
    render(<Filters onLanguageChange={onLanguageChange} />)
    
    const javascriptCheckbox = screen.getByLabelText('JavaScript')
    await user.click(javascriptCheckbox)
    
    expect(onLanguageChange).toHaveBeenCalledWith(['JavaScript'])
  })
})
```

### 3. Integration Tests
Tests component interactions and data flow.

**Example: Issue Grid Integration Test**
```typescript
describe('IssueGrid Integration', () => {
  it('displays issues and handles bookmarking', async () => {
    const user = userEvent.setup()
    
    render(<IssueGrid />)
    
    // Wait for issues to load
    await waitFor(() => {
      expect(screen.getByText('Test Issue 1')).toBeInTheDocument()
    })
    
    // Test bookmarking
    const bookmarkButton = screen.getByLabelText('Bookmark issue')
    await user.click(bookmarkButton)
    
    expect(screen.getByText('Bookmarked!')).toBeInTheDocument()
  })
})
```

### 4. Error Boundary Tests
Tests error handling and graceful failures.

```typescript
describe('Error Handling', () => {
  it('displays error message when API fails', async () => {
    server.use(
      rest.get('/api/issues', (req, res, ctx) => {
        return res(ctx.status(500))
      })
    )
    
    render(<IssueGrid />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load issues')).toBeInTheDocument()
    })
  })
})
```

## Coverage Requirements

### Global Thresholds
- **Statements**: 70% minimum
- **Branches**: 70% minimum
- **Functions**: 70% minimum
- **Lines**: 70% minimum

### Current Coverage (Latest)
```
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   85.2  |   78.4   |   82.1  |   85.2  |
 components/          |   91.5  |   85.2   |   89.7  |   91.5  |
 components/ui/       |   76.8  |   68.9   |   74.3  |   76.8  |
 lib/                 |   65.4  |   55.7   |   61.2  |   65.4  |
```

### Coverage Reports
- **HTML Report**: `coverage/index.html` (local development)
- **LCOV Report**: `coverage/lcov.info` (CI/CD integration)
- **JSON Report**: `coverage/coverage-final.json` (programmatic access)

## Running Tests

### Local Development

```bash
# Run all tests
pnpm test

# Run tests in watch mode (re-runs on file changes)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run tests with interactive UI
pnpm test:ui

# Run specific test file
pnpm test filters.test.tsx

# Run tests matching a pattern
pnpm test --grep "authentication"
```

### CI/CD Integration

Tests are automatically executed in GitHub Actions:

```yaml
# .github/workflows/ci.yml
test:
  name: Test
  runs-on: ubuntu-latest
  steps:
    - name: Run tests
      run: pnpm run test:coverage
      
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v4
      with:
        token: ${{ secrets.CODECOV_TOKEN }}
        file: ./coverage/lcov.info
```

## Writing Tests

### Best Practices

1. **Follow the AAA Pattern**
   ```typescript
   it('should do something', () => {
     // Arrange - Set up test data and conditions
     const props = { user: mockUser }
     
     // Act - Execute the behavior being tested
     render(<Component {...props} />)
     
     // Assert - Verify the expected outcome
     expect(screen.getByText('Welcome')).toBeInTheDocument()
   })
   ```

2. **Test User Behavior, Not Implementation**
   ```typescript
   // ✅ Good - tests what user sees/does
   expect(screen.getByText('Sign In')).toBeInTheDocument()
   fireEvent.click(screen.getByText('Submit'))
   
   // ❌ Bad - tests implementation details
   expect(component.state.isVisible).toBe(true)
   expect(component.find('.button')).toHaveLength(1)
   ```

3. **Use Descriptive Test Names**
   ```typescript
   // ✅ Good - describes the scenario and expected outcome
   it('displays error message when login fails with invalid credentials', () => {})
   
   // ❌ Bad - vague and unclear
   it('should work', () => {})
   it('test login', () => {})
   ```

4. **Mock External Dependencies**
   ```typescript
   // Mock API calls
   vi.mock('@/lib/github', () => ({
     GitHubService: {
       getIssues: vi.fn().mockResolvedValue(mockIssues),
       getUser: vi.fn().mockResolvedValue(mockUser)
     }
   }))
   
   // Mock Next.js router
   vi.mock('next/navigation', () => ({
     useRouter: () => ({
       push: vi.fn(),
       back: vi.fn()
     })
   }))
   ```

5. **Test Edge Cases and Error States**
   ```typescript
   describe('Edge Cases', () => {
     it('handles empty issue list gracefully', () => {
       render(<IssueGrid issues={[]} />)
       expect(screen.getByText('No issues found')).toBeInTheDocument()
     })
     
     it('handles network errors during loading', async () => {
       // Test error scenarios
     })
   })
   ```

### Component Test Template

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { ComponentName } from '@/components/component-name'

// Mock dependencies
vi.mock('@/lib/some-service', () => ({
  someFunction: vi.fn()
}))

describe('ComponentName', () => {
  const defaultProps = {
    // Define default props
  }

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
  })

  it('renders correctly with default props', () => {
    render(<ComponentName {...defaultProps} />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('handles user interaction correctly', async () => {
    const user = userEvent.setup()
    const mockCallback = vi.fn()
    
    render(<ComponentName {...defaultProps} onAction={mockCallback} />)
    
    await user.click(screen.getByRole('button'))
    
    expect(mockCallback).toHaveBeenCalledWith(expectedArguments)
  })

  it('displays loading state', () => {
    render(<ComponentName {...defaultProps} loading={true} />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('handles error state gracefully', () => {
    render(<ComponentName {...defaultProps} error="Something went wrong" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })
})
```

## Debugging Tests

### Common Issues and Solutions

1. **Test Timeouts**
   ```typescript
   // Increase timeout for slow operations
   it('handles slow operation', async () => {
     await waitFor(() => {
       expect(screen.getByText('Loaded')).toBeInTheDocument()
     }, { timeout: 5000 })
   })
   ```

2. **Async/Await Issues**
   ```typescript
   // Always await async operations
   await waitFor(() => {
     expect(screen.getByText('Success')).toBeInTheDocument()
   })
   
   // Use findBy for elements that appear asynchronously
   const element = await screen.findByText('Async Content')
   ```

3. **Mock Issues**
   ```typescript
   // Reset mocks between tests
   beforeEach(() => {
     vi.clearAllMocks()
   })
   
   // Check mock calls
   expect(mockFunction).toHaveBeenCalledTimes(1)
   expect(mockFunction).toHaveBeenCalledWith(expectedArgs)
   ```

### Debugging Commands

```bash
# Run tests with verbose output
pnpm test --reporter=verbose

# Debug specific test
pnpm test --grep "specific test name" --reporter=verbose

# Run tests with debugging enabled
pnpm test --inspect-brk

# Generate coverage report and open in browser
pnpm test:coverage && open coverage/index.html
```

## Contributing to Tests

### Adding New Tests

1. **Create test file**: Follow naming convention `[component-name].test.tsx`
2. **Use test template**: Start with the component test template above
3. **Cover main scenarios**: Happy path, error states, edge cases
4. **Maintain coverage**: Ensure new code maintains 70%+ coverage
5. **Update documentation**: Add test descriptions to relevant docs

### Test Review Checklist

- [ ] Tests are readable and well-named
- [ ] Tests cover the main user scenarios
- [ ] Error states and edge cases are tested
- [ ] Mocks are properly configured and reset
- [ ] Tests pass locally and in CI
- [ ] Coverage thresholds are maintained
- [ ] No implementation details are tested
- [ ] Tests are fast and reliable

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [MSW Documentation](https://mswjs.io/docs/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom#custom-matchers)
