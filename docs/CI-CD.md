# CI/CD Documentation

## 🚀 Continuous Integration & Deployment Setup

This project uses GitHub Actions for automated CI/CD pipelines to ensure code quality, run tests, and deploy applications.

## 📋 Workflows Overview

### 1. **CI Workflow** (`.github/workflows/ci.yml`)
**Triggers:** Push to `main`/`develop`, Pull Requests
**Jobs:**
- **Lint** - ESLint code quality checks
- **Type Check** - TypeScript type validation
- **Test** - Run test suite with coverage reporting
- **Build** - Verify application builds successfully
- **Security** - Dependency vulnerability scanning

### 2. **CD Workflow** (`.github/workflows/cd.yml`)
**Triggers:** Push to `main`, Manual dispatch
**Jobs:**
- **Test** - Reuse CI workflow
- **Deploy** - Deploy to Vercel production
- **Lighthouse** - Performance auditing

### 3. **Preview Deployment** (`.github/workflows/preview.yml`)
**Triggers:** Pull Requests
**Jobs:**
- **Preview** - Deploy PR to preview environment
- **Comment** - Post preview URL in PR comments

### 4. **Dependency Updates** (`.github/workflows/dependency-updates.yml`)
**Triggers:** Weekly schedule (Mondays 9 AM UTC), Manual dispatch
**Jobs:**
- **Update** - Automated dependency updates
- **Security Audit** - Weekly security vulnerability checks

## 🔧 Required GitHub Secrets

### Repository Secrets
Add these secrets in GitHub repo settings (`Settings > Secrets and variables > Actions`):

```bash
# Vercel Deployment
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://your-domain.vercel.app

# Database
MONGODB_URI=your_production_mongodb_uri
MONGODB_URI_PREVIEW=your_preview_mongodb_uri

# GitHub API
GITHUB_TOKEN=your_github_personal_access_token

# Code Coverage (Optional)
CODECOV_TOKEN=your_codecov_token
```

### Environment Setup
Create environments in GitHub (`Settings > Environments`):
- **production** - For main branch deployments
- **preview** - For PR preview deployments

## 🎯 Workflow Details

### CI Pipeline Steps
1. **Code Checkout** - Get latest code
2. **Node.js Setup** - Install Node.js 20
3. **Dependencies** - Install npm packages
4. **Lint** - Run ESLint checks
5. **Type Check** - Validate TypeScript
6. **Tests** - Run test suite with coverage
7. **Build** - Verify build process
8. **Security** - Audit dependencies

### Deployment Pipeline Steps
1. **Tests Pass** - Ensure CI passes
2. **Build Artifacts** - Create optimized build
3. **Deploy to Vercel** - Push to production
4. **Performance Audit** - Run Lighthouse checks
5. **Notifications** - Update PR with status

### Preview Deployment Features
- 🔗 **Automatic Preview URLs** - Each PR gets unique preview
- 💬 **PR Comments** - Deployment status in PR comments  
- ✅ **Status Checks** - Prevent merging if deployment fails
- 🔄 **Auto Updates** - New commits update preview

## 📊 Quality Gates

### Required Checks
- ✅ All tests must pass
- ✅ Lint checks must pass  
- ✅ TypeScript must compile
- ✅ Build must succeed
- ✅ No high/critical security vulnerabilities

### Coverage Requirements
- **Minimum**: 70% code coverage
- **Target**: 80%+ code coverage
- **Reports**: Generated and uploaded to Codecov

### Performance Standards
- **Performance**: > 80 Lighthouse score
- **Accessibility**: > 90 Lighthouse score
- **Best Practices**: > 80 Lighthouse score
- **SEO**: > 80 Lighthouse score

## 🛠 Local Development

### Run CI Checks Locally
```bash
# Install dependencies
npm ci

# Run all CI checks
npm run lint              # ESLint
npm run type-check        # TypeScript
npm run test:coverage     # Tests with coverage
npm run build            # Build verification
npm run audit            # Security audit
```

### Test Workflow
```bash
# Watch mode for development
npm run test:watch

# Run once with coverage
npm run test:coverage

# Visual test UI
npm run test:ui
```

## 🚨 Troubleshooting

### Common Issues

**1. Build Failures**
```bash
# Check environment variables
echo $NEXTAUTH_SECRET
echo $GITHUB_TOKEN

# Verify dependencies
npm ci
npm run build
```

**2. Test Failures**
```bash
# Run tests locally
npm run test:coverage

# Check specific test
npm run test -- filters.test.tsx
```

**3. Deployment Issues**
```bash
# Verify Vercel setup
vercel --version
vercel login
vercel link
```

### Debug Commands
```bash
# View workflow logs
gh run list
gh run view [run-id]

# Check deployment status
vercel list
vercel logs [deployment-url]
```

## 📈 Monitoring & Alerts

### Automated Notifications
- ❌ **Build Failures** - GitHub notifications
- 🚨 **Security Issues** - Auto-created GitHub issues
- 📊 **Coverage Drops** - Codecov comments
- ⚡ **Performance Regressions** - Lighthouse reports

### Weekly Reports
- 🔄 **Dependency Updates** - Automated PRs
- 🛡️ **Security Audits** - Vulnerability scans
- 📊 **Performance Trends** - Lighthouse tracking

## 🔄 Maintenance

### Regular Tasks
- **Weekly**: Review dependency update PRs
- **Monthly**: Update workflow actions versions
- **Quarterly**: Review and optimize CI/CD performance

### Updating Workflows
1. Test changes in feature branch
2. Update workflow files
3. Test with actual PR
4. Merge to main

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Guide](https://vercel.com/docs/git)
- [Lighthouse CI Guide](https://github.com/GoogleChrome/lighthouse-ci)
- [Codecov Integration](https://docs.codecov.com/docs/github-actions)
