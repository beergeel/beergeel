# GitHub Setup Guide for Beergeel Clinic System

## Option 1: Using Cursor's Built-in Git (Recommended)

Cursor has built-in Git support. Follow these steps:

### Step 1: Install Git (if not already installed)
1. Download Git for Windows: https://git-scm.com/download/win
2. Run the installer with default settings
3. Restart Cursor after installation

### Step 2: Initialize Git Repository in Cursor
1. Open Cursor
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open Command Palette
3. Type "Git: Initialize Repository" and select it
4. This will initialize a Git repository in your project folder

### Step 3: Create GitHub Repository
1. Go to https://github.com and sign in
2. Click the "+" icon in the top right
3. Select "New repository"
4. Name it: `beergeel-clinic-system` (or your preferred name)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 4: Connect to GitHub in Cursor
1. In Cursor, open the Source Control panel (click the Git icon in the left sidebar, or press `Ctrl+Shift+G`)
2. You should see "Publish to GitHub" button - click it
3. If not visible, follow these steps:
   - Press `Ctrl+Shift+P` and type "Git: Add Remote"
   - Remote name: `origin`
   - Remote URL: `https://github.com/YOUR_USERNAME/beergeel-clinic-system.git` (replace YOUR_USERNAME)

### Step 5: Stage and Commit Files
1. In Source Control panel, click "+" next to "Changes" to stage all files
2. Enter commit message: "Initial commit"
3. Click the checkmark to commit

### Step 6: Push to GitHub
1. Click "Sync Changes" or "Push" in the Source Control panel
2. If prompted, authenticate with GitHub (you may need to use Personal Access Token)

## Option 2: Using Command Line (After Git Installation)

If Git is installed, you can run these commands in Cursor's terminal:

```bash
# Initialize repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Beergeel Clinic System"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/beergeel-clinic-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Authentication with GitHub

If you encounter authentication issues:
1. GitHub no longer accepts password authentication
2. Use a Personal Access Token instead:
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with `repo` permissions
   - Use the token as your password when pushing

## Troubleshooting

- **Git not found**: Install Git from https://git-scm.com/download/win
- **Authentication failed**: Use Personal Access Token instead of password
- **Remote already exists**: Remove it first: `git remote remove origin`, then add again

