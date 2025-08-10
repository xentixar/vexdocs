---
title: "Welcome to Vexdocs v1.0 - Modern Documentation Tool"
description: "Vexdocs v1.0 is a modern, fast, and lightweight documentation tool with multi-version support and built-in markdown rendering. Zero dependencies, maximum performance."
keywords: "vexdocs, documentation, markdown, multi-version, static-site-generator, lightweight"
---

# 🚀 Welcome to Vexdocs v1.0

Welcome to **Vexdocs** - a modern, fast, and lightweight documentation tool that makes creating beautiful documentation websites effortless. Built with zero external dependencies for maximum performance and reliability.

## ✨ Core Features

### 📚 Multi-Version Documentation Support
- **Seamless version management** - handle different documentation versions effortlessly
- **Independent navigation** for each version with automatic folder structure detection
- **Version switching** with persistent state and smooth transitions
- **Custom version labels** (Latest, Stable, Beta, etc.)

### 📝 Pure JavaScript Architecture
- **Zero external dependencies** - no jQuery, no React, just pure JavaScript
- **Custom markdown parser** with full CommonMark compliance
- **Syntax highlighting** for 50+ programming languages
- **Fast rendering** with optimized DOM manipulation
- **Lightweight bundle** for quick loading

### 🎨 Professional User Interface
- **Modern, clean design** with responsive layout
- **Mobile-first approach** - perfect on phones, tablets, and desktops
- **Intelligent sidebar navigation** auto-generated from your folder structure
- **Smart search functionality** with real-time filtering
- **Accessibility features** - ARIA labels, keyboard navigation, screen reader support

### 🔍 Smart Search System
- **Real-time search** across all navigation items
- **Intelligent folder expansion** - automatically opens relevant sections
- **Keyboard shortcuts** - quick access with intuitive controls
- **Case-insensitive matching** for better user experience

### ⚡ Performance Optimized
- **Fast static site generation** ready for CDN deployment
- **Optimized asset delivery** with minification and compression
- **Lazy loading** for images and heavy content
- **Smart caching** reduces server requests

## 📖 Getting Started

### 🚀 Quick Setup (Under 2 minutes)

1. **Start the development server**
   ```bash
npm start
# or
./vexdocs serve
   ```

2. **Open your browser**
   Navigate to `http://localhost:3000`

3. **Start writing documentation**
   Edit markdown files in `docs/v1.0/` and see changes instantly

### �️ Development Commands

```bash
# Development server with live reload
npm run dev

# Build optimized static site for production
npm run build

# Build prerendered static site with SEO optimization
npm run build:static

# Serve built static files
npm run serve

# Clean build artifacts
npm run clean
```

## 📁 Project Structure

Vexdocs follows an intuitive directory structure:

```
your-project/
├── docs/                    # Documentation source
│   ├── config.json         # Global configuration
│   ├── v1.0/               # Version 1.0 documentation
│   │   ├── README.md       # Homepage (this file)
│   │   ├── getting-started.md
│   │   ├── api-reference.md
│   │   └── guides/
│   │       ├── installation.md
│   │       └── configuration.md
│   └── assets/             # Images and static files
├── dist/                   # Generated static site (after build)
└── assets/                 # Theme assets (CSS, JS)
    ├── css/
    └── js/
```

### 🎯 Key Concepts

- **Auto-navigation**: Sidebar is generated from your folder structure
- **Markdown-first**: All content is written in standard Markdown
- **Live reload**: Changes are reflected immediately in development mode
- **SEO ready**: Automatic meta tags and structured data

## ⚙️ Configuration

Customize Vexdocs by editing `docs/config.json`:

```json
{
  "title": "Your Documentation",
  "description": "Documentation for your project",
  "baseUrl": "https://docs.yourproject.com",
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

### Available Options

| Option | Description | Default |
|--------|-------------|---------|
| `title` | Site title in header | "Documentation" |
| `description` | Meta description for SEO | "Project Documentation" |
| `baseUrl` | Base URL for sitemap and robots.txt | "http://localhost:3000" |
| `theme.primaryColor` | Primary brand color | "#2563eb" |
| `theme.sidebarWidth` | Sidebar width | "320px" |

## 📝 Markdown Support

Vexdocs includes a powerful markdown parser with extensive features:

### Core Formatting
- **Headers (H1-H6)** with auto-generated anchor links
- **Text formatting**: **Bold**, *italic*, ~~strikethrough~~, `inline code`
- **Lists**: Ordered, unordered, and nested with proper indentation
- **Links and images** with automatic optimization
- **Tables** with professional styling and responsive design
- **Blockquotes** with elegant formatting
- **Code blocks** with syntax highlighting

### Advanced Features
- **Auto-linking**: URLs become clickable automatically
- **Cross-references**: Link between documents seamlessly
- **Image optimization**: Responsive sizing and lazy loading
- **Code syntax highlighting**: 50+ languages supported
- **Frontmatter support**: SEO metadata in YAML format

### Example Markdown

```markdown
# Getting Started

Welcome to **Vexdocs**! Here's a quick example.
```

## Code Block

```javascript
const docs = new Vexdocs();
docs.serve({ port: 3000 });
```

## Feature List
- ✅ Multi-version support
- ✅ Fast rendering
- ✅ Mobile responsive

> **Tip**: Use search to quickly find content!

## 🚀 Deployment

Deploy your documentation to any static hosting platform:

### 1. Build Static Site

For regular static site generation:
```bash
npm run build
```

For SEO-optimized prerendered site:
```bash
npm run build:static
```

**Build Options:**

- **`npm run build`** - Creates a fast, client-side rendered static site ideal for:
  - Development environments
  - Internal documentation
  - Fast loading with JavaScript navigation

- **`npm run build:static`** - Creates a prerendered site optimized for:
  - SEO and search engines
  - Social media sharing
  - Better initial page load performance
  - Public-facing documentation

Both commands create an optimized `dist/` folder with:
- Minified HTML, CSS, and JavaScript
- Optimized images and assets
- SEO-friendly meta tags
- Fast-loading static files

### 2. Deploy Options

**GitHub Pages**
```bash
# Deploy to gh-pages branch
npm run build
cd dist
git init && git add . && git commit -m "Deploy docs"
git push origin main:gh-pages
```

**Netlify**
- Connect your repository
- Build command: `npm run build`
- Publish directory: `dist`

**Vercel**
```bash
vercel --prod
```

**Traditional Hosting**
Upload the `dist/` folder contents to any web server.

## � Advanced Usage

### Custom Theming
Override CSS variables for custom styling:

```css
:root {
  --primary-color: #your-brand-color;
  --sidebar-bg: #custom-background;
  --text-color: #your-text-color;
}
```

### Navigation Structure
Organize content with intuitive folder structure:

```
docs/v1.0/
├── README.md           # Homepage
├── quick-start.md      # Getting started
├── guides/            # Tutorial section
│   ├── installation.md
│   └── configuration.md
└── reference/         # API documentation
    └── api.md
```

## 🌍 Browser Support

Vexdocs works across all modern browsers:

- ✅ **Chrome/Edge** 88+ (Full support)
- ✅ **Firefox** 78+ (Full support)
- ✅ **Safari** 14+ (Full support)
- ✅ **Mobile browsers** (Optimized experience)
- ⚠️ **Internet Explorer** (Not supported)

## 💡 Pro Tips

- **Search shortcut**: Type to filter navigation instantly
- **Keyboard navigation**: Use arrow keys and Enter to navigate
- **Deep linking**: Every heading gets a permanent anchor link
- **Mobile optimization**: Swipe gestures and touch-friendly interface
- **Print friendly**: Clean print styles for documentation

## 🔗 Quick Links

- [📚 **Getting Started Guide**](getting-started.md) - Step-by-step setup instructions
- [🔧 **API Reference**](api-reference.md) - Complete API documentation
- [⚙️ **Configuration Guide**](configuration.md) - Customization and theme options
- [🛠️ **Setup Guide**](setup.md) - Installation and deployment guide
- [📝 **Markdown Guide**](guides/markdown-guide.md) - Complete formatting reference
- [🚀 **Deployment Guide**](guides/deployment.md) - Deploy to various platforms

---

*Ready to create amazing documentation? Start by checking out our [Getting Started guide](getting-started.md) or explore the [API Reference](api-reference.md)!*
