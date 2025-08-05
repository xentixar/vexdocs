---
title: "Vexdocs v1.0 Setup Guide"
description: "Complete setup and configuration guide for Vexdocs v1.0. Learn how to install, configure, and deploy your documentation."
keywords: "vexdocs setup, installation, configuration, deployment, documentation setup"
---

# 🛠️ Setup Guide - Vexdocs v1.0

This comprehensive guide covers everything you need to know about setting up, configuring, and deploying Vexdocs v1.0 for your documentation needs.

## 📋 System Requirements

### Minimum Requirements
- **Node.js** 12.0.0 or higher
- **npm** 6.0.0 or higher (comes with Node.js)
- **Operating System**: Windows, macOS, or Linux
- **RAM**: 512MB available memory
- **Storage**: 100MB free disk space

### Recommended Requirements
- **Node.js** 16.0.0 or higher
- **npm** 8.0.0 or higher
- **RAM**: 1GB available memory
- **Storage**: 500MB free disk space

### Check Your Environment

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Should show versions >= 12.0.0 and >= 6.0.0 respectively
```

## 🏗️ Installation Methods

### Method 1: Clone Repository (Recommended)

```bash
# Clone the repository
git clone https://github.com/xentixar/vexdocs.git

# Navigate to the directory
cd vexdocs

# Start the development server
npm start
```

### Method 2: Download Archive

1. **Download** the latest release from GitHub
2. **Extract** the archive to your desired location
3. **Open terminal** in the extracted folder
4. **Run** `npm start`

### Method 3: Use as Template

```bash
# Create new project using Vexdocs as template
git clone https://github.com/xentixar/vexdocs.git my-docs
cd my-docs

# Remove git history to start fresh
rm -rf .git
git init

# Customize and start
npm start
```

## ⚙️ Initial Configuration

### 1. Basic Configuration

Edit `docs/config.json` to set up your documentation:

```json
{
  "title": "My Project Documentation",
  "description": "Comprehensive documentation for my project",
  "versions": {
    "v1.0": "Latest"
  },
  "defaultVersion": "v1.0",
  "theme": {
    "primaryColor": "#2563eb",
    "sidebarWidth": "320px"
  }
}
```

### 2. Directory Structure Setup

Create your documentation structure:

```bash
# Create main documentation folder
mkdir -p docs/v1.0

# Create organized subfolders
mkdir -p docs/v1.0/guides
mkdir -p docs/v1.0/api
mkdir -p docs/v1.0/examples
mkdir -p docs/assets
```

### 3. Essential Files

Create these essential files:

```bash
# Homepage
echo "# Welcome to My Documentation" > docs/v1.0/README.md

# Getting started guide
echo "# Getting Started" > docs/v1.0/getting-started.md

# Configuration reference
echo "# Configuration" > docs/v1.0/configuration.md
```

## 📝 Content Creation Workflow

### 1. Planning Your Documentation

Before writing, plan your structure:

```
docs/v1.0/
├── README.md              # Homepage - project overview
├── getting-started.md     # Quick start guide
├── installation.md        # Detailed installation
├── guides/               # User guides
│   ├── basic-usage.md
│   ├── advanced-features.md
│   └── troubleshooting.md
├── api/                  # API documentation
│   ├── overview.md
│   ├── authentication.md
│   └── endpoints.md
└── examples/             # Code examples
    ├── basic-example.md
    └── advanced-example.md
```

### 2. Writing Guidelines

**File Naming:**
- Use lowercase with hyphens: `getting-started.md`
- Be descriptive: `user-authentication-guide.md`
- Avoid spaces and special characters

**Content Structure:**
```markdown
---
title: "Descriptive Page Title"
description: "Page description for SEO"
---

# Main Heading (H1)

Brief introduction paragraph.

## Section 1 (H2)

Content for section 1.

### Subsection 1.1 (H3)

Detailed content.

## Section 2 (H2)

More content.
```

### 3. Navigation Organization

Vexdocs automatically generates navigation from your folder structure:

- **Folders** become collapsible sections
- **Files** become navigation links
- **README.md** files serve as section index pages
- **Alphabetical ordering** within each folder

## 🎨 Theme Customization

### 1. Color Scheme

Customize colors in `config.json`:

```json
{
  "theme": {
    "primaryColor": "#your-brand-color",
    "secondaryColor": "#accent-color",
    "sidebarWidth": "300px",
    "maxWidth": "1200px"
  }
}
```

### 2. Typography

Set custom fonts:

```json
{
  "theme": {
    "fontFamily": "Your Font, -apple-system, BlinkMacSystemFont, sans-serif"
  }
}
```

### 3. Layout Options

Adjust layout settings:

```json
{
  "theme": {
    "sidebarWidth": "280px",    # Sidebar width
    "maxWidth": "1400px",       # Maximum content width
    "headerHeight": "60px"      # Header height
  }
}
```

### 4. Custom CSS

Create custom styles by overriding CSS variables:

```css
/* In your custom CSS file */
:root {
  --primary-color: #your-color;
  --sidebar-bg: #f8f9fa;
  --text-color: #2d3748;
  --link-color: var(--primary-color);
}
```

## 🔧 Advanced Configuration

### 1. SEO Optimization

Configure SEO settings:

```json
{
  "seo": {
    "siteName": "My Documentation Site",
    "ogImage": "/assets/og-image.png"
  }
}
```

### 2. Navigation Behavior

Control navigation features:

```json
{
  "navigation": {
    "expandableGroups": true
  }
}
```

## 🚀 Development Workflow

### 1. Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Serve built files
npm run serve

# Clean build artifacts
npm run clean
```

### 2. File Watching

In development mode:
- **Auto-reload** when files change
- **Live navigation updates** when structure changes
- **Error reporting** for invalid markdown or config

### 3. Testing Your Documentation

Before deploying:

1. **Test all links** work correctly
2. **Check responsive design** on different screen sizes
3. **Verify search functionality** finds your content
4. **Test navigation** on mobile devices
5. **Validate build process** completes without errors

## 🌐 Deployment Setup

### 1. Build Preparation

```bash
# Clean previous builds
npm run clean

# Build optimized static site
npm run build

# Verify build completed successfully
ls dist/
```

### 2. Static Hosting Deployment

**GitHub Pages:**
```bash
# Build and deploy to gh-pages branch
npm run build
cd dist
git init
git add .
git commit -m "Deploy documentation v1.0"
git remote add origin https://github.com/yourusername/your-repo.git
git push origin main:gh-pages
```

**Netlify:**
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on every push

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## � Troubleshooting Common Issues

### Installation Problems

**Node.js Version Issues:**
```bash
# Check Node version
node --version

# Update Node.js if needed
# Visit https://nodejs.org for latest version
```

**Permission Errors:**
```bash
# On macOS/Linux, avoid using sudo
# Instead, configure npm to use a different directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Configuration Issues

**Invalid JSON:**
```bash
# Validate your config.json
cat docs/config.json | python -m json.tool
```

**Theme Not Applying:**
- Check CSS property names match documentation
- Ensure color values are valid CSS colors
- Clear browser cache and reload

### Build Problems

**Build Fails:**
```bash
# Clear cache and try again
npm run clean
npm run build

# Check for syntax errors in markdown files
# Look at console output for specific error messages
```

**Missing Files:**
- Verify all referenced images exist
- Check file paths are correct (case-sensitive on Linux/macOS)
- Ensure all internal links point to existing files

## � Performance Optimization

### 1. Content Optimization

- **Optimize images**: Use compressed formats (WebP, optimized PNG/JPEG)
- **Minimize file sizes**: Keep markdown files under 1MB
- **Organize efficiently**: Use logical folder structure

### 2. Build Optimization

```bash
# Build with optimization flags
npm run build

# Verify file sizes in dist/ folder
du -sh dist/*
```

### 3. Hosting Optimization

- **Enable gzip compression** on your web server
- **Use CDN** for faster global access
- **Set cache headers** for static assets

---

*Your Vexdocs setup is now complete! Check out the [Getting Started guide](getting-started.md) to begin creating your documentation, or explore the [API Reference](api-reference.md) for advanced features.*
