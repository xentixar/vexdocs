---
title: "Getting Started with Vexdocs v1.0"
description: "Quick start guide for Vexdocs v1.0. Learn how to install, configure, and create beautiful documentation with our modern documentation tool."
keywords: "vexdocs, documentation, getting started, installation, markdown, multi-version"
---

# 📚 Getting Started with Vexdocs v1.0

This comprehensive guide will help you get up and running with Vexdocs quickly. Follow these steps to create beautiful, professional documentation in minutes.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** (version 12 or higher) - [Download here](https://nodejs.org/)
- **Basic knowledge of Markdown** - [Learn Markdown](https://guides.github.com/features/mastering-markdown/)
- **A text editor** - VS Code, Sublime Text, or any editor you prefer
- **Terminal/Command Prompt** access

## 🚀 Quick Installation

### Method 1: Clone the Repository

```bash
# Clone Vexdocs
git clone https://github.com/xentixar/vexdocs.git
cd vexdocs

# Start the development server
npm start
```

### Method 2: Download and Extract

1. Download the Vexdocs archive from GitHub
2. Extract to your desired location
3. Open terminal in the extracted folder
4. Run `npm start`

## 🎯 First Steps

### 1. Start the Server

```bash
# Start development server
npm start

# Alternative commands
./vexdocs serve
./vexdocs dev  # Development mode with enhanced logging
```

Your documentation will be available at: **http://localhost:3000**

### 2. Explore the Interface

- **Header**: Contains the site title and version selector
- **Sidebar**: Auto-generated navigation from your folder structure
- **Search Box**: Real-time search across all documentation
- **Content Area**: Rendered markdown content
- **Mobile Menu**: Touch-friendly navigation on smaller screens

### 3. Understanding the Structure

```
your-project/
├── docs/                    # Your documentation source
│   ├── config.json         # Global configuration
│   └── v1.0/               # Version 1.0 documentation
│       ├── README.md       # Homepage
│       ├── getting-started.md  # This file
│       └── guides/         # Additional guides
├── assets/                 # Theme assets (CSS, JS)
├── src/                    # Vexdocs core files
└── vexdocs                 # CLI executable
```

## 📝 Creating Your First Documentation

### 1. Edit the Homepage

Open `docs/v1.0/README.md` and customize it:

```markdown
---
title: "Welcome to My Project"
description: "Documentation for my amazing project"
---

# Welcome to My Project

This is the homepage of my documentation.

## Features

- Feature 1
- Feature 2
- Feature 3

## Quick Links

- [Getting Started](getting-started.md)
- [API Reference](api-reference.md)
```

### 2. Create Additional Pages

Create new `.md` files in `docs/v1.0/`:

```bash
# Create a new guide
echo "# Installation Guide" > docs/v1.0/installation.md

# Create a folder for organized content
mkdir docs/v1.0/guides
echo "# User Guide" > docs/v1.0/guides/user-guide.md
```

### 3. Organize with Folders

Create a logical structure:

```
docs/v1.0/
├── README.md              # Homepage
├── getting-started.md     # Quick start
├── installation.md        # Installation guide
├── guides/               # User guides
│   ├── configuration.md
│   ├── deployment.md
│   └── troubleshooting.md
├── api/                  # API documentation
│   ├── overview.md
│   └── reference.md
└── examples/             # Code examples
    └── basic-usage.md
```

## ⚙️ Configuration

### Basic Configuration

Edit `docs/config.json` to customize your site:

```json
{
  "title": "My Project Documentation",
  "description": "Comprehensive documentation for my project",
  "baseUrl": "https://docs.myproject.com",
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

### Theme Customization

Change colors and layout:

```json
{
  "theme": {
    "primaryColor": "#your-brand-color",
    "secondaryColor": "#64748b",
    "sidebarWidth": "280px",
    "maxWidth": "1200px"
  }
}
```

### SEO Optimization

Add SEO settings:

```json
{
  "seo": {
    "siteName": "My Project Docs",
    "ogImage": "/assets/og-image.png"
  }
}
```

## 📖 Writing Great Documentation

### 1. Use Frontmatter for SEO

Add metadata to your pages:

```markdown
---
title: "Page Title"
description: "Page description for search engines"
keywords: "keyword1, keyword2, keyword3"
---

# Your Content Here

### 2. Structure Your Content

Use clear headings and organization:

# Main Title (H1) - Use only once per page

## Section Title (H2)

### Subsection (H3)

#### Details (H4)
```

### 3. Include Code Examples

Use syntax highlighting:

```javascript
const vexdocs = require('vexdocs');
const server = new vexdocs.Server();
server.start();
```

### 4. Add Images and Assets

Place images in an `assets` folder:

```markdown
![Screenshot](../assets/screenshot.png)
```

## 🔍 Search Functionality

Vexdocs includes built-in search:

- **Real-time filtering**: Type to filter navigation items
- **Case-insensitive**: Searches work regardless of case
- **Folder expansion**: Automatically opens relevant sections
- **Keyboard navigation**: Use arrow keys to navigate results

### Search Tips

- Use descriptive filenames (they become searchable titles)
- Include keywords in your content
- Organize content logically with folders

## 🚀 Building for Production

### 1. Build Static Site

For regular static site generation:
```bash
# Generate optimized static site
npm run build
```

For SEO-optimized prerendered site:
```bash
# Generate prerendered site with full SEO optimization
npm run build:static
```

**Choose the Right Build:**

- **`npm run build`** - Client-side rendered static site
  - ✅ Fast navigation with JavaScript
  - ✅ Smaller initial bundle size
  - ✅ Great for internal documentation
  - ❌ Limited SEO capabilities

- **`npm run build:static`** - Prerendered static site
  - ✅ Full SEO optimization
  - ✅ Better social media sharing
  - ✅ Faster initial page loads
  - ✅ Works without JavaScript
  - ✅ Search engine friendly

Both create a `dist/` folder with:
- Minified HTML, CSS, and JavaScript
- Optimized images and assets
- SEO-friendly meta tags
- Fast-loading static files

### 2. Deploy Your Site

**GitHub Pages:**
```bash
npm run build
cd dist
git init && git add . && git commit -m "Deploy docs"
git push origin main:gh-pages
```

**Netlify:**
- Connect your repository
- Set build command: `npm run build`
- Set publish directory: `dist`

**Any Static Host:**
Upload the contents of the `dist/` folder to your web server.

## 🛠️ Development Workflow

### Daily Development

```bash
# Start development server
npm run dev

# Make changes to markdown files
# Browser automatically refreshes

# Build for testing
npm run build

# Serve built files locally
npm run serve
```

### File Watching

In development mode, Vexdocs automatically:
- Watches for file changes
- Rebuilds navigation
- Refreshes the browser
- Shows helpful error messages

## 🎨 Customization Options

### CSS Variables

Override default styles:

```css
/* In your custom CSS */
:root {
  --primary-color: #your-color;
  --sidebar-bg: #custom-bg;
  --text-color: #your-text;
}
```

### Navigation Behavior

Control folder expansion:

```json
{
  "navigation": {
    "expandableGroups": true
  }
}
```

## 📱 Mobile Optimization

Vexdocs is mobile-first:

- **Responsive design** works on all screen sizes
- **Touch-friendly navigation** with swipe gestures
- **Collapsible sidebar** for mobile devices
- **Optimized typography** for reading on small screens

## 🔧 Troubleshooting

### Common Issues

**Server won't start:**
```bash
# Check Node.js version
node --version  # Should be 12+

# Try alternative start method
./vexdocs serve --port 3001
```

**Navigation not updating:**
```bash
# Restart the development server
npm run dev
```

**Build fails:**
```bash
# Clean and rebuild
npm run clean
npm run build
```

### Getting Help

- Check the [API Reference](api-reference.md) for detailed options
- Look at example markdown files for formatting guidance
- Use browser developer tools to debug styling issues

## 🎯 Next Steps

Now that you're set up:

1. **Customize your homepage** (`docs/v1.0/README.md`)
2. **Create your first guide** in the `guides/` folder
3. **Configure themes** in `config.json`
4. **Add your content** with markdown files
5. **Build and deploy** your documentation

### Additional Resources

- [📚 API Reference](api-reference.md) - Complete feature documentation
- [🎨 Configuration Guide](configuration.md) - Advanced customization
- [🔗 Markdown Guide](markdown-guide.md) - Formatting reference

---

*Ready to create amazing documentation? Start writing your content and watch Vexdocs bring it to life!*
