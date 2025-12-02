# Git Setup & Deployment Instructions

## Step 1: Install Git (if not already installed)

Download and install Git for Windows from: https://git-scm.com/download/win

Or use GitHub Desktop: https://desktop.github.com/

## Step 2: Initialize Git and Push to Repository

Once Git is installed, open a terminal in this directory and run these commands:

```bash
# Initialize git repository (if not already initialized)
git init

# Add the remote repository
git remote add origin https://github.com/Ehsan104/StryvOS.git

# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: Stryvos marketing site"

# Push to GitHub (you'll be prompted for credentials)
git push -u origin main
```

If the repository already has content, you might need to pull first:
```bash
git pull origin main --allow-unrelated-histories
```

## Step 3: Deploy to Vercel

1. Go to https://vercel.com and sign in with your GitHub account
2. Click "Add New Project"
3. Import the repository: `Ehsan104/StryvOS`
4. Vercel will auto-detect Next.js settings
5. Add environment variables:
   - `RESEND_API_KEY` - Your Resend API key
   - `CONTACT_TO` - info@stryvos.org
   - `NEXT_PUBLIC_BASE_URL` - Your Vercel domain (or custom domain)
6. Click "Deploy"

## Alternative: Using GitHub Desktop

1. Open GitHub Desktop
2. File → Add Local Repository
3. Select this folder
4. Click "Publish repository" 
5. Choose the repository: Ehsan104/StryvOS
6. Click "Publish repository"

