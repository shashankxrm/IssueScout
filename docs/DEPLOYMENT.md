# Deployment Setup Guide

This document explains how to configure the CI/CD pipeline for automatic deployment to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Project Connected**: Your GitHub repository should be connected to Vercel
3. **GitHub Repository Secrets**: Configure the required secrets in your repository

## Required GitHub Secrets

To enable automatic deployment, you need to configure these secrets in your GitHub repository:

### 1. VERCEL_TOKEN
- **Purpose**: Authenticates with Vercel API for deployment
- **How to get it**:
  1. Go to [Vercel Account Tokens](https://vercel.com/account/tokens)
  2. Click "Create Token"
  3. Give it a name (e.g., "GitHub Actions")
  4. Copy the generated token

### 2. NEXTAUTH_SECRET
- **Purpose**: Signs and encrypts NextAuth.js session tokens
- **How to generate**: 
  ```bash
  openssl rand -base64 32
  ```
- **Example**: `your-super-secret-key-here`

### 3. MONGODB_URI
- **Purpose**: Connection string for MongoDB database
- **Format**: `mongodb+srv://username:password@cluster.mongodb.net/database`
- **How to get it**: From your MongoDB Atlas cluster connection settings

### 4. CODECOV_TOKEN (Optional)
- **Purpose**: Upload test coverage reports to Codecov
- **How to get it**: Sign up at [codecov.io](https://codecov.io) and connect your repository

## Adding Secrets to GitHub

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the exact name and value

Direct link: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`

## Environment Setup

### Local Development (.env.local)
```env
NEXTAUTH_SECRET=your-local-secret-key
NEXTAUTH_URL=http://localhost:3000
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret
MONGODB_URI=your-mongodb-connection-string
```

### Production Environment (Vercel)
These are automatically configured through GitHub secrets, but you can also set them directly in Vercel:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the same variables as above

## Workflow Overview

### CI Pipeline (`.github/workflows/ci.yml`)
Runs on every push and pull request:
- ✅ ESLint checking
- ✅ TypeScript type checking  
- ✅ Test suite with coverage
- ✅ Build verification
- ✅ Security audit

### CD Pipeline (`.github/workflows/cd.yml`)
Runs on pushes to `main` branch:
- ✅ Run full CI pipeline first
- 🚀 Deploy to Vercel production

### Preview Deployments (`.github/workflows/preview.yml`)
Runs on pull requests:
- 🔍 Deploy preview version
- 💬 Comment with preview URL

## Troubleshooting

### "No existing credentials found" Error
This means `VERCEL_TOKEN` is not configured. Follow the steps above to add it.

### Build Failures
1. Check that all environment variables are properly set
2. Verify your MongoDB connection string is correct
3. Ensure your Vercel project is properly linked

### Test Failures
1. Run tests locally: `pnpm test`
2. Check ESLint: `pnpm lint`
3. Verify TypeScript: `pnpm type-check`

## Manual Deployment

If you need to deploy manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```
