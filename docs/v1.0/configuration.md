---
title: "Configuration Guide - Vexdocs v1.0"
description: "Complete configuration reference for Vexdocs v1.0. Learn how to customize themes, navigation, SEO, and more."
keywords: "vexdocs configuration, theme customization, navigation setup, seo configuration"
---

# ⚙️ Configuration Guide - Vexdocs v1.0

This comprehensive guide covers all configuration options available in Vexdocs v1.0, helping you customize your documentation site to match your brand and requirements.

## 📋 Configuration Overview

Vexdocs uses a single configuration file `docs/config.json` to control all aspects of your documentation site. This file follows standard JSON format and supports various configuration sections.

### Basic Configuration Structure

```json
{
  "title": "My Documentation",
  "description": "Complete guide to my project",
  "baseUrl": "https://docs.myproject.com",
  "versions": {
    "v1.0": "Latest",
    "v0.9": "Previous"
  },
  "defaultVersion": "v1.0",
  "theme": {
    "primaryColor": "#2563eb",
    "sidebarWidth": "320px"
  },
  "sidebarOrder": {
    "v1.0": [
      "getting-started.md",
      {
        "folder": "guides",
        "items": [
          "deployment.md",
          "markdown-guide.md",
          "troubleshooting.md"
        ]
      },
      "api-reference.md",
      "configuration.md"
    ]
  }
}
```

## 🎯 Core Settings

### Site Information

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | "Documentation" | Main site title shown in header and browser title |
| `description` | string | "Project Documentation" | Site description used for SEO meta tags |
| `baseUrl` | string | "http://localhost:3000" | Base URL for your documentation site (used for sitemap and robots.txt generation) |

**Example:**
```json
{
  "title": "Awesome Project Docs",
  "description": "Complete documentation for the Awesome Project - installation, configuration, and API reference",
  "baseUrl": "https://docs.myproject.com"
}
```

**Base URL Guidelines:**
- Use the full URL including protocol (https:// or http://)
- Do not include trailing slash
- Use production URL for deployed sites
- Use localhost for development

### Version Management

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `versions` | object | `{"v1.0": "Latest"}` | Available documentation versions |
| `defaultVersion` | string | First version key | Default version to display |
| `sidebarOrder` | object | `{}` | Custom ordering for sidebar items (version-specific) |

**Version Configuration:**
```json
{
  "versions": {
    "v1.0": "Latest",
    "v0.9": "Stable", 
    "v0.8": "Legacy"
  },
  "defaultVersion": "v1.0"
}
```

**Version Labels:**
- Use descriptive labels: "Latest", "Stable", "Beta", "Legacy"
- Keep labels concise (under 20 characters)
- Consider your audience when naming versions

## 🎨 Theme Configuration

### Color Scheme

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `primaryColor` | string | "#2563eb" | Primary brand color (headers, links, highlights) |

**Color Examples:**
```json
{
  "theme": {
    "primaryColor": "#e74c3c",     // Red
    "primaryColor": "#2ecc71",     // Green  
    "primaryColor": "#3498db",     // Blue
    "primaryColor": "#9b59b6",     // Purple
    "primaryColor": "#f39c12"      // Orange
  }
}
```

**Brand Color Guidelines:**
- Use hex colors (#RRGGBB format)
- Ensure sufficient contrast for accessibility
- Test colors in both light and dark modes
- Consider color-blind users

### Layout Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `sidebarWidth` | string | "320px" | Width of the navigation sidebar |

**Layout Examples:**
```json
{
  "theme": {
    "sidebarWidth": "280px",      // Narrow sidebar
    "sidebarWidth": "360px"       // Wide sidebar
  }
}
```

## 🧭 Navigation & Sidebar Ordering

Navigation is automatically generated from your file structure, with powerful customization options for controlling the order of sidebar items.

### Automatic Navigation

Navigation is generated from your folder structure:
- **Folders** become expandable/collapsible sections
- **Top-level folders** are expanded by default
- **Nested folders** are collapsed by default
- **File titles** are extracted from frontmatter `title:` or first H1 heading
- **File names** are automatically formatted (kebab-case → Title Case)

### 📋 Custom Sidebar Ordering

Control the order of sidebar items by adding a `sidebarOrder` configuration to your `config.json`:

```json
{
  "sidebarOrder": {
    "v1.0": [
      "getting-started.md",
      {
        "folder": "guides",
        "items": [
          "deployment.md",
          "markdown-guide.md",
          "troubleshooting.md"
        ]
      },
      "api-reference.md",
      "configuration.md"
    ]
  }
}
```

#### Ordering Features

- **README Always First**: README files are automatically placed at the top
- **Custom File Order**: List files in your desired order
- **Folder Content Ordering**: Control the order of files within folders
- **Mixed Structure**: Combine files and folders in any order
- **Fallback Behavior**: Items not in the order list appear at the end

#### Ordering Rules

1. **README Priority**: README files are always placed first, regardless of configuration
2. **Custom Order**: Files and folders are ordered according to your configuration
3. **Nested Ordering**: Files within folders can be ordered using the `items` array
4. **Version-Specific**: Each version can have its own ordering configuration
5. **Graceful Fallback**: Any items not specified in the order appear at the end

#### Configuration Examples

**Simple File Ordering:**
```json
{
  "sidebarOrder": {
    "v1.0": [
      "getting-started.md",
      "installation.md",
      "configuration.md",
      "api-reference.md"
    ]
  }
}
```

**Folder with Ordered Contents:**
```json
{
  "sidebarOrder": {
    "v1.0": [
      "getting-started.md",
      {
        "folder": "guides",
        "items": [
          "deployment.md",
          "markdown-guide.md",
          "troubleshooting.md"
        ]
      },
      "api-reference.md"
    ]
  }
}
```

**Mixed Structure:**
```json
{
  "sidebarOrder": {
    "v1.0": [
      "getting-started.md",
      "quick-start.md",
      {
        "folder": "tutorials",
        "items": [
          "basic-tutorial.md",
          "advanced-tutorial.md"
        ]
      },
      {
        "folder": "api",
        "items": [
          "authentication.md",
          "endpoints.md",
          "examples.md"
        ]
      },
      "troubleshooting.md"
    ]
  }
}
```

### Folder Structure Impact

```
docs/v1.0/
├── README.md              # Home (always first)
├── getting-started.md     # Getting Started
├── guides/               # 📁 Guides (expandable)
│   ├── deployment.md     #   → Deployment (ordered)
│   ├── markdown-guide.md #   → Markdown Guide (ordered)
│   └── troubleshooting.md #   → Troubleshooting (ordered)
└── api/                  # 📁 API (expandable)
    └── reference.md      #   → Reference
```

### Customization Tips

- Use descriptive folder names (they become section headers)
- Organize content logically (most important first)
- Keep folder nesting to 2-3 levels maximum
- Use README.md files as section overviews
- Leverage sidebar ordering for better user experience

## 🔍 SEO & Meta Tags

SEO settings are handled through individual page frontmatter in markdown files. Each page can have its own SEO configuration.

### Page-Level SEO with Frontmatter

Use frontmatter in markdown files for page-specific SEO:

```markdown
---
title: "Custom Page Title"
description: "Specific page description for search engines"
keywords: "documentation, api, guide, tutorial"
author: "Your Name"
canonical: "https://docs.myproject.com/custom-page"
og_title: "Custom Open Graph Title"
og_description: "Custom Open Graph Description"
og_image: "/assets/custom-og-image.png"
twitter_title: "Custom Twitter Title"
twitter_description: "Custom Twitter Description"
twitter_image: "/assets/custom-twitter-image.png"
---

# Page Content
```

**Frontmatter Options:**
- `title`: Override page title
- `description`: Page-specific description
- `keywords`: Comma-separated keywords
- `author`: Content author
- `canonical`: Canonical URL (if different)
- `og_title`: Open Graph title
- `og_description`: Open Graph description
- `og_image`: Open Graph image URL
- `twitter_title`: Twitter Card title
- `twitter_description`: Twitter Card description
- `twitter_image`: Twitter Card image URL

### Image Guidelines for Social Media

When using `og_image` and `twitter_image` in frontmatter:

**Recommended Specifications:**
- **Size**: 1200x630 pixels (Open Graph), 1200x600 pixels (Twitter)
- **Format**: PNG or JPEG
- **Content**: Include site/brand name and key visual
- **Text**: Large, readable fonts
- **Location**: Place images in `/docs/assets/` or `/assets/`

**Example:**
```markdown
---
title: "API Reference"
og_image: "/assets/api-reference-og.png"
twitter_image: "/assets/api-reference-twitter.png"
---
```



### Sitemap & Robots.txt Generation

Vexdocs automatically generates `sitemap.xml` and `robots.txt` files during the build process to help search engines discover and index your documentation.

**Automatic Generation:**
- **Sitemap**: Lists all documentation pages with proper priority and change frequency
- **Robots.txt**: Allows search engine crawling with sitemap reference
- **Base URL**: Uses the `baseUrl` configuration for absolute URLs

**Generated Files:**
```
vexdocs/
├── sitemap.xml      # XML sitemap for search engines
└── robots.txt       # Robot crawling instructions
```

**Sitemap Features:**
- **Page Priority**: Higher priority for main pages (README.md files)
- **Change Frequency**: Optimized based on content type
- **Last Modified**: Uses file modification time
- **Clean URLs**: Proper URL structure for better SEO

**robots.txt Content:**
```
User-agent: *
Allow: /

Sitemap: https://your-domain.com/sitemap.xml
```

**SEO Benefits:**
- Faster search engine discovery
- Better indexing of all documentation pages
- Improved search visibility
- Professional SEO setup

## 🎛️ Advanced Configuration

### Complete Configuration Example

```json
{
  "title": "MyProject Documentation",
  "description": "Comprehensive documentation for MyProject - installation guides, API reference, tutorials, and best practices",
  "baseUrl": "https://docs.myproject.com",
  "versions": {
    "v1.0": "Latest",
    "v0.9": "Stable"
  },
  "defaultVersion": "v1.0",
  "theme": {
    "primaryColor": "#2563eb",
    "sidebarWidth": "320px"
  },
  "sidebarOrder": {
    "v1.0": [
      "getting-started.md",
      {
        "folder": "guides",
        "items": [
          "deployment.md",
          "markdown-guide.md",
          "troubleshooting.md"
        ]
      },
      "api-reference.md",
      "configuration.md"
    ]
  }
}
```



## 🔧 Configuration Validation

### JSON Validation

**Validate your configuration:**
```bash
# Check JSON syntax
cat docs/config.json | python -m json.tool

# Or use Node.js
node -e "console.log(JSON.parse(require('fs').readFileSync('docs/config.json')))"
```

### Common Configuration Errors

**Invalid JSON Syntax:**
```json
{
  "title": "My Docs",
  "theme": {
    "primaryColor": "#ff0000",  // ✅ Correct: comma after property
  }  // ❌ Error: trailing comma
}
```

**Incorrect Color Format:**
```json
{
  "theme": {
    "primaryColor": "red",      // ❌ Error: use hex format
    "primaryColor": "#ff0000"   // ✅ Correct: hex format
  }
}
```

**Missing Required Properties:**
```json
{
  // ❌ Error: missing title and versions
  "theme": {
    "primaryColor": "#ff0000"
  }
}

{
  // ✅ Correct: includes required properties
  "title": "My Docs",
  "versions": {"v1.0": "Latest"},
  "theme": {
    "primaryColor": "#ff0000"
  }
}
```

## 🎨 Styling Customization

### CSS Custom Properties

Vexdocs uses CSS custom properties that you can override:

```css
:root {
  /* Colors from config.json */
  --primary-color: #2563eb;
  
  /* Layout from config.json */
  --sidebar-width: 320px;
  
  /* Additional customizable properties */
  --header-height: 70px;
  --border-radius: 6px;
  --box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

### Custom CSS Integration

**Method 1: Override in assets/css/main.css**
```css
/* Add custom styles to existing CSS file */
.header {
  background: linear-gradient(135deg, var(--primary-color), #667eea);
}

.sidebar {
  border-right: 2px solid var(--primary-color);
}
```

**Method 2: Create custom CSS file**
```html
<!-- Add to custom template -->
<link rel="stylesheet" href="/assets/css/custom.css">
```

## 📱 Responsive Configuration

### Mobile-First Design

Vexdocs is mobile-first by default, with responsive design built-in:

```css
/* Tablet adjustments */
@media (min-width: 768px) {
  :root {
    --sidebar-width: 280px;
  }
}

/* Desktop adjustments */  
@media (min-width: 1024px) {
  :root {
    --sidebar-width: 320px;
  }
}
```

### Touch-Friendly Configuration

For mobile-heavy audiences:

```json
{
  "theme": {
    "sidebarWidth": "280px",     // Narrower for more content space
    "primaryColor": "#3498db"     // High contrast color
  }
}
```

## 🔄 Configuration Management

### Version Control

**Track configuration changes:**
```bash
# Add config to git
git add docs/config.json

# Commit with descriptive message
git commit -m "Update theme colors and navigation settings"
```

### Configuration Backup

**Backup before major changes:**
```bash
# Create backup
cp docs/config.json docs/config.json.backup

# Restore if needed
cp docs/config.json.backup docs/config.json
```

### Environment Variables

**Use environment-specific settings:**
```bash
# Development
export VEXDOCS_THEME_COLOR="#orange"

# Production  
export VEXDOCS_THEME_COLOR="#2563eb"
```

## 🚀 Performance Considerations

### Optimal Configuration

**For best performance:**
```json
{
  "theme": {
    "sidebarWidth": "320px",     // Standard width
    "primaryColor": "#2563eb"    // Brand color
  }
}
```

### Configuration Impact on Build

- **Large images**: Optimize before adding to assets
- **Many versions**: Affects build time
- **Sidebar ordering**: Minimal impact on performance

## 🎯 Best Practices

### 1. Start Simple

```json
{
  "title": "My Documentation",
  "versions": {"v1.0": "Latest"},
  "theme": {
    "primaryColor": "#your-brand-color",
    "sidebarWidth": "320px"
  }
}
```

### 2. Test Thoroughly

- **Validate JSON syntax** before deploying
- **Test on mobile devices** after theme changes
- **Check color contrast** for accessibility
- **Verify all links work** after structural changes

### 3. Document Changes

Keep a changelog of configuration updates:

```markdown
## Configuration Changes

### 2024-01-15
- Updated primary color to match new brand guidelines
- Increased sidebar width for better navigation

### 2024-01-10
- Added SEO configuration with Open Graph image
- Updated site title and description
```

### 4. Gradual Customization

1. **Start with basic settings** (title, colors)
2. **Add theme customization** gradually
3. **Configure sidebar ordering** for better UX
4. **Test each change** before proceeding
5. **Get user feedback** on major changes

---

*Master these configuration options to create a documentation site that perfectly matches your project's needs and brand identity. Check out the [Setup Guide](setup.md) for implementation details or the [API Reference](api-reference.md) for programmatic usage.*
