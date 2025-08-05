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
  "versions": {
    "v1.0": "Latest",
    "v0.9": "Previous"
  },
  "defaultVersion": "v1.0",
  "theme": {
    "primaryColor": "#007acc",
    "sidebarWidth": "300px"
  }
}
```

## 🎯 Core Settings

### Site Information

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | "Documentation" | Main site title shown in header and browser title |
| `description` | string | "Project Documentation" | Site description used for SEO meta tags |

**Example:**
```json
{
  "title": "Awesome Project Docs",
  "description": "Complete documentation for the Awesome Project - installation, configuration, and API reference"
}
```

### Version Management

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `versions` | object | `{"v1.0": "Latest"}` | Available documentation versions |
| `defaultVersion` | string | First version key | Default version to display |

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

## 🧭 Navigation

Navigation is automatically generated from your file structure. Folders become expandable sections and `.md` files become navigation links.

### Folder Structure Impact

```
docs/v1.0/
├── README.md              # Home (always visible)
├── getting-started.md     # Getting Started
├── guides/               # 📁 Guides (expandable)
│   ├── installation.md   #   → Installation
│   └── configuration.md  #   → Configuration
└── api/                  # 📁 API (expandable)
    └── reference.md      #   → Reference
```

### Navigation Behavior

- **Folders** become expandable/collapsible sections
- **Top-level folders** are expanded by default
- **Nested folders** are collapsed by default
- **File titles** are extracted from frontmatter `title:` or first H1 heading
- **File names** are automatically formatted (kebab-case → Title Case)

### Customization Tips

- Use descriptive folder names (they become section headers)
- Organize content logically (most important first)
- Keep folder nesting to 2-3 levels maximum
- Use README.md files as section overviews

## 🔍 SEO & Meta Tags

SEO settings are handled through individual page frontmatter, not global configuration.

### Page-Level SEO with Frontmatter

Use frontmatter in markdown files for page-specific SEO:

```markdown
---
title: "Custom Page Title"
description: "Specific page description for search engines"
keywords: "documentation, api, guide, tutorial"
author: "Your Name"
---

# Page Content
```

**Frontmatter Options:**
- `title`: Override page title
- `description`: Page-specific description
- `keywords`: Comma-separated keywords
- `author`: Content author
- `canonical`: Canonical URL (if different)

### Social Media Optimization

**Open Graph Image Guidelines:**
- **Size**: 1200x630 pixels (recommended)
- **Format**: PNG or JPEG
- **Content**: Include site/brand name and key visual
- **Text**: Large, readable fonts
- **Location**: Place in `/docs/assets/` or `/assets/`

**Creating Effective OG Images:**
```json
{
  "seo": {
    "siteName": "MyProject Docs",
    "ogImage": "/assets/og-image.png"
  }
}
```

## 🎛️ Advanced Configuration

### Complete Configuration Example

```json
{
  "title": "MyProject Documentation",
  "description": "Comprehensive documentation for MyProject - installation guides, API reference, tutorials, and best practices",
  "versions": {
    "v1.0": "Latest",
    "v0.9": "Stable"
  },
  "defaultVersion": "v1.0",
  "theme": {
    "primaryColor": "#2563eb",
    "secondaryColor": "#64748b", 
    "sidebarWidth": "320px",
    "maxWidth": "1200px",
    "fontFamily": "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  "navigation": {
    "expandableGroups": true
  },
  "seo": {
    "siteName": "MyProject Documentation",
    "ogImage": "/assets/myproject-og.png"
  }
}
```

### Environment-Specific Configuration

**Development vs Production:**
```json
{
  "title": "MyProject Docs (Dev)",
  "description": "Development version of documentation",
  "theme": {
    "primaryColor": "#orange"
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
  --secondary-color: #64748b;
  
  /* Layout from config.json */
  --sidebar-width: 320px;
  --content-max-width: 1200px;
  
  /* Additional customizable properties */
  --header-height: 60px;
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

Vexdocs is mobile-first by default, but you can customize responsive behavior:

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
    --content-max-width: 1400px;
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
    "maxWidth": "1200px",        // Not too wide
    "fontFamily": "system-ui"    // System fonts load faster
  }
}
```

### Configuration Impact on Build

- **Large images**: Optimize before adding to assets
- **Complex themes**: May increase CSS size
- **Many versions**: Affects build time

## 🎯 Best Practices

### 1. Start Simple

```json
{
  "title": "My Documentation",
  "versions": {"v1.0": "Latest"},
  "theme": {
    "primaryColor": "#your-brand-color"
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
3. **Test each change** before proceeding
4. **Get user feedback** on major changes

---

*Master these configuration options to create a documentation site that perfectly matches your project's needs and brand identity. Check out the [Setup Guide](setup.md) for implementation details or the [API Reference](api-reference.md) for programmatic usage.*
