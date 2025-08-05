---
title: "Vexdocs v1.0 API Reference"
description: "Complete API reference for Vexdocs v1.0. Learn about CLI commands, configuration options, and programmatic usage."
keywords: "vexdocs api, documentation api, cli reference, configuration, programming interface"
---

# 📚 API Reference - Vexdocs v1.0

Complete reference guide for Vexdocs v1.0 CLI commands, configuration options, and programmatic usage.

## 🖥️ CLI Commands

### Core Commands

#### `vexdocs serve`
Start the development server for live documentation preview.

```bash
vexdocs serve
```

**Examples:**
```bash
# Start server on http://localhost:3000
vexdocs serve
```

#### `vexdocs build`
Generate static site for production deployment.

```bash
vexdocs build
```

**Examples:**
```bash
# Generate static site in dist/ directory
vexdocs build
```

#### `vexdocs dev`
Development mode with enhanced logging.

```bash
vexdocs dev
```

**Examples:**
```bash
# Development mode with enhanced logging
vexdocs dev
```

### Utility Commands

#### `vexdocs help`
Display help information and available commands.

```bash
vexdocs help
```

#### `vexdocs version`
Display the current version.

```bash
vexdocs version
# or
vexdocs --version
vexdocs -v
```

#### `vexdocs --version`
Display Vexdocs version information.

```bash
vexdocs --version
```

## ⚙️ Configuration Reference

### config.json Schema

Complete configuration schema for `docs/config.json`:

```json
{
  "title": "string",
  "description": "string",
  "versions": {
    "version-key": "Display Label"
  },
  "defaultVersion": "string",
  "theme": {
    "primaryColor": "string",
    "sidebarWidth": "string"
  }
}
```

### Configuration Options

#### Basic Settings

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | "Documentation" | Site title displayed in header |
| `description` | string | "Project Documentation" | Meta description for SEO |
| `defaultVersion` | string | First version | Version to display by default |

#### Version Configuration

```json
{
  "versions": {
    "v1.0": "Latest",
    "v0.9": "Stable"
  }
}
```

- **Key**: Directory name in `docs/`
- **Value**: Display label in version selector

#### Theme Customization

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `primaryColor` | string | "#2563eb" | Primary brand color (hex format) |
| `sidebarWidth` | string | "320px" | Sidebar width (CSS units) |

## 📝 Markdown Extensions

### Frontmatter Support

Add metadata to your markdown files:

```markdown
---
title: "Page Title"
description: "Page description for SEO"
keywords: "keyword1, keyword2"
author: "Author Name"
---

# Page Content
```

### Supported Frontmatter Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Page title (overrides H1) |
| `description` | string | Meta description |
| `keywords` | string | SEO keywords |
| `author` | string | Page author |

### Code Block Features

````markdown
```javascript
const vexdocs = require('vexdocs');
const server = new vexdocs.Server({
  port: 3000,
  docs: './docs'
});
```
````

**Supported languages for syntax highlighting:**
- JavaScript, TypeScript, Python, Java
- HTML, CSS, JSON, YAML, XML
- Bash, Shell, PowerShell
- And 40+ more languages

## 🎨 Theming API

### CSS Custom Properties

Vexdocs uses CSS custom properties for theming:

```css
:root {
  /* Colors */
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --background-color: #ffffff;
  --text-color: #1f2937;
  --border-color: #e5e7eb;
  
  /* Layout */
  --sidebar-width: 320px;
  --content-max-width: 1200px;
  --header-height: 60px;
  
  /* Typography */
  --font-family: Inter, sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.6;
}
```

### Custom Styling

Override styles in your own CSS:

```css
/* Custom header styling */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Custom sidebar */
.sidebar {
  background-color: var(--primary-color);
  color: white;
}

/* Custom content area */
.content {
  font-family: 'Georgia', serif;
}
```

## 📁 File Structure API

### Navigation Generation

Vexdocs automatically generates navigation from your folder structure:

```
docs/v1.0/
├── README.md              # Homepage
├── getting-started.md     # Quick start
├── guides/               # Section: Guides
│   ├── installation.md   # → Installation
│   └── configuration.md  # → Configuration
└── api/                  # Section: API
    └── reference.md      # → Reference
```

### File Naming Conventions

| Filename | Display Name |
|----------|--------------|
| `README.md` | Home |
| `getting-started.md` | Getting Started |
| `api-reference.md` | API Reference |
| `user-guide.md` | User Guide |

### Folder Behavior

- **Folders become sections** in the navigation
- **README.md files** serve as section index pages
- **Folders are collapsible** if `expandableGroups` is enabled
- **Nested folders** create sub-sections

## 🔍 Search API

### Search Functionality

The built-in search system:

- **Real-time filtering** of navigation items
- **Case-insensitive matching**
- **Automatic folder expansion** for matches
- **Keyboard navigation** support

### Search Implementation

```javascript
// Search is automatically initialized
// No API calls needed for basic functionality

// Search input element
const searchInput = document.getElementById('searchInput');

// Programmatic search (if needed)
app.performSearch('your query');
```

## 🚀 Build Process

### Static Site Generation

The build process creates optimized static files:

```bash
npm run build
```

**Generated structure:**
```
dist/
├── index.html              # Main page
├── assets/                 # Optimized assets
│   ├── css/
│   └── js/
├── api/                    # API endpoints as JSON
│   ├── config.json
│   └── navigation.json
└── [version]/              # Version-specific content
    └── [pages].html
```

### Build Optimizations

- **HTML minification** removes unnecessary whitespace
- **CSS optimization** combines and minifies stylesheets
- **JavaScript minification** reduces file sizes
- **Asset optimization** compresses images and files

## 📱 Responsive Design API

### Breakpoints

Vexdocs uses these responsive breakpoints:

```css
/* Mobile first approach */
@media (min-width: 768px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}

@media (min-width: 1280px) {
  /* Large desktop styles */
}
```

### Mobile Navigation

Mobile-specific functionality:

- **Hamburger menu** for navigation toggle
- **Touch gestures** for sidebar interaction
- **Optimized touch targets** for better usability
- **Responsive typography** for readability

## 🔧 Error Handling

### Common Error Codes

| Error | Description | Solution |
|-------|-------------|----------|
| `ENOENT` | File not found | Check file paths and permissions |
| `EADDRINUSE` | Port already in use | Use different port with `--port` |
| `JSON Parse Error` | Invalid config.json | Validate JSON syntax |

### Debug Mode

Enable detailed logging:

```bash
vexdocs dev --verbose
```

### Error Messages

Vexdocs provides helpful error messages:

- **Configuration errors** with line numbers
- **Markdown parsing errors** with file context  
- **Server startup issues** with suggested solutions

## 🎯 Performance Optimization

### Best Practices

1. **Optimize images** - use compressed formats
2. **Minimize markdown files** - avoid extremely large files
3. **Use efficient folder structure** - logical organization
4. **Enable gzip** - on your web server for static files

### Performance Metrics

Typical performance characteristics:

- **Build time**: < 5 seconds for 100 pages
- **Page load**: < 200ms for static files
- **Search response**: < 50ms for navigation filtering
- **Memory usage**: < 50MB for development server

## 🔗 Integration Examples

### Custom Build Scripts

Integrate Vexdocs into your workflow:

```json
{
  "scripts": {
    "docs:dev": "vexdocs dev",
    "docs:build": "vexdocs build",
    "docs:deploy": "npm run docs:build && gh-pages -d dist"
  }
}
```

### CI/CD Integration

GitHub Actions example:

```yaml
name: Deploy Documentation
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Build docs
        run: |
          npm install
          npm run docs:build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

*Need more help? Check out our [Getting Started guide](getting-started.md) or explore the [configuration examples](configuration.md).*
