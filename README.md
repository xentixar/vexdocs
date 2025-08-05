# Vexdocs

A modern documentation tool with multi-version support and markdown rendering, built without external dependencies.

## Features

- 📚 **Multi-version documentation support** - Handle different doc versions seamlessly
- 📝 **Pure JavaScript markdown renderer** - No external dependencies, lightning fast
- 🎨 **Professional UI** - Modern design with responsive layout
- 🔍 **Smart search functionality** - Real-time filtering with intelligent navigation
- 📱 **Mobile-first responsive design** - Outstanding experience on all devices
- 🚀 **Fast static site generation** - Build for CDN deployment
- 🌲 **Intelligent sidebar navigation** - Auto-generated from folder structure
- ⌨️ **Keyboard shortcuts** - Ctrl+K for search, arrow keys for navigation
- ♿ **Accessibility features** - ARIA labels, focus management, high contrast support

## Quick Start

### Using Vexdocs CLI (Recommended)

1. **Start development server:**
   ```bash
   ./vexdocs serve
   ```

2. **Development mode with enhanced logging:**
   ```bash
   ./vexdocs dev
   ```

3. **Build static site for deployment:**
   ```bash
   ./vexdocs build
   ```

4. **Show help and available commands:**
   ```bash
   ./vexdocs help
   ```

### Using npm scripts

1. **Install and run:**
   ```bash
   npm start
   ```

2. **Development mode:**
   ```bash
   npm run dev
   ```

3. **Build static site:**
   ```bash
   npm run build
   ```

### Access your documentation
Open your browser and navigate to: **http://localhost:3000**

## Directory Structure

```
docs/
├── v1.0/
│   ├── README.md
│   ├── getting-started.md
│   └── api/
│       └── reference.md
├── v2.0/
│   ├── README.md
│   └── ...
└── config.json
```

## Configuration

Create a `docs/config.json` file to customize Vexdocs:

```json
{
  "title": "Your Project Documentation",
  "description": "Documentation for your amazing project",
  "versions": {
    "v2.0": "Latest",
    "v1.0": "Stable"
  },
  "defaultVersion": "v2.0",
  "theme": {
    "primaryColor": "#2563eb",
    "sidebarWidth": "320px"
  }
}
```

## Markdown Support

Vexdocs includes a powerful custom markdown parser that supports:

- **Headers** (H1-H6) with auto-generated IDs
- **Text formatting**: **Bold**, *italic*, ~~strikethrough~~
- **Code**: `inline code` and syntax-highlighted code blocks
- **Lists**: Ordered and unordered with nesting support
- **Links and images** with automatic optimization
- **Tables** with professional styling
- **Blockquotes** with elegant formatting
- **Horizontal rules** for content separation

## CLI Commands

```bash
./vexdocs serve    # Start development server (http://localhost:3000)
./vexdocs dev      # Development mode with enhanced logging
./vexdocs build    # Generate static site in dist/ folder
./vexdocs help     # Show all available commands
```

## Deployment

1. **Build static site:**
   ```bash
   ./vexdocs build
   ```

2. **Deploy the `dist/` folder to:**
   - GitHub Pages
   - Netlify
   - Vercel
   - AWS S3
   - Any static hosting service

## Browser Support

- ✅ Chrome/Edge 88+
- ✅ Firefox 78+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT
