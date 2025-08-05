# 🚀 Vexdocs

A modern, fast, and lightweight documentation tool with multi-version support and built-in markdown rendering. Create beautiful documentation websites without any external dependencies.

## ✨ Features

- 📚 **Multi-version documentation support** - Seamlessly manage and switch between different documentation versions
- 📝 **Pure JavaScript markdown renderer** - Zero external dependencies for fast, reliable rendering
- 🎨 **Professional UI** - Modern, clean design with responsive layout and light theme support
- 🔍 **Smart search functionality** - Real-time filtering with intelligent navigation and keyboard shortcuts
- 📱 **Mobile-first responsive design** - Optimized experience across all devices and screen sizes
- 🚀 **Fast static site generation** - Build optimized static sites ready for CDN deployment
- 🌲 **Intelligent sidebar navigation** - Auto-generated navigation tree from your folder structure
- ⌨️ **Keyboard shortcuts** - Ctrl+K for search, arrow keys for navigation, and more
- ♿ **Accessibility features** - ARIA labels, focus management, high contrast support, and screen reader friendly
- 🎯 **Zero configuration** - Works out of the box with sensible defaults
- 🔧 **Highly customizable** - Flexible theming and configuration options

## 🚀 Quick Start

Vexdocs is designed to get you up and running in seconds. No complex setup, no heavy dependencies.

### Option 1: Using the Vexdocs CLI (Recommended)

```bash
# Start development server (auto-opens http://localhost:3000)
./vexdocs serve

# Development mode with enhanced logging and hot reload
./vexdocs dev

# Build static site for production deployment
./vexdocs build

# Show help and all available commands
./vexdocs help
```

### Option 2: Using npm scripts

```bash
# Quick start - install and run
npm start

# Development mode with detailed logging
npm run dev

# Build optimized static site
npm run build

# Start production server
npm run serve
```

### 🌐 Access Your Documentation

Once started, your documentation will be available at:
**http://localhost:3000**

The server will automatically detect changes and reload your browser in development mode.

## 📁 Project Structure

Vexdocs follows a simple, intuitive directory structure:

```
your-project/
├── docs/                    # Your documentation source
│   ├── config.json         # Global configuration
│   ├── v1.0/               # Version 1.0 docs
│   │   ├── README.md       # Version homepage
│   │   ├── getting-started.md
│   │   └── api/
│   │       └── reference.md
│   ├── v2.0/               # Version 2.0 docs
│   │   ├── README.md
│   │   ├── guide.md
│   │   └── advanced/
│   │       └── configuration.md
│   └── assets/             # Images and static files
├── dist/                   # Generated static site (after build)
├── assets/                 # Theme assets (CSS, JS)
│   ├── css/
│   │   └── main.css
│   └── js/
│       ├── app.js
│       └── markdown-parser.js
├── src/                    # Vexdocs core files
│   ├── server.js          # Development server
│   └── build.js           # Static site builder
├── vexdocs                 # CLI executable
└── package.json
```

### 🎯 Key Concepts

- **Versions**: Each subdirectory in `docs/` represents a documentation version
- **Automatic Navigation**: Sidebar is generated from your folder structure
- **Markdown-First**: All content is written in standard Markdown
- **Asset Management**: Images and files can be placed in any `assets/` folder

## ⚙️ Configuration

Configure Vexdocs by creating a `docs/config.json` file. Here's a complete example:

```json
{
  "title": "Your Project Documentation",
  "description": "Comprehensive documentation for your amazing project",
  "versions": {
    "v2.1": "Latest",
    "v2.0": "Stable",
    "v1.0": "Legacy"
  },
  "defaultVersion": "v2.1",
  "theme": {
    "primaryColor": "#2563eb",
    "sidebarWidth": "320px"
  },
}
```

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `title` | Site title displayed in header | "Documentation" |
| `description` | Meta description for SEO | "Project Documentation" |
| `versions` | Available versions with labels | `{"v1.0": "Latest"}` |
| `defaultVersion` | Version to show by default | First version |
| `theme.primaryColor` | Primary brand color | "#007acc" |
| `theme.sidebarWidth` | Sidebar width | "300px" |

## 📝 Markdown Support

Vexdocs includes a powerful, custom-built markdown parser with extensive feature support:

### Core Features
- **Headers (H1-H6)** with auto-generated anchor links and IDs
- **Text formatting**: **Bold**, *italic*, ~~strikethrough~~, `inline code`
- **Code blocks** with syntax highlighting (JavaScript, Python, JSON, HTML, CSS, and more)
- **Lists**: Ordered, unordered, and nested lists with proper indentation
- **Links and images** with automatic optimization and lazy loading
- **Tables** with professional styling and responsive design
- **Blockquotes** with elegant formatting and nested support
- **Horizontal rules** for content separation
- **Line breaks** and paragraph handling

### Advanced Features
- **Auto-linking**: URLs automatically become clickable links
- **Image optimization**: Automatic alt text and responsive sizing
- **Table of contents**: Auto-generated from headers
- **Cross-references**: Link between documents and versions
- **Code syntax highlighting**: 5+ programming languages supported
- **Custom containers**: Warning, info, tip, and danger callouts

## Features List

- ✅ Multi-version support
- ✅ Fast rendering
- ✅ Mobile responsive

> **Tip**: Use the search function (Ctrl+K) to quickly find content!
```

## 🛠️ CLI Commands

Vexdocs provides a comprehensive CLI for all your documentation needs:

```bash
# Development
./vexdocs serve     # Start development server on http://localhost:3000
./vexdocs dev       # Development mode with hot reload and enhanced logging

# Production
./vexdocs build     # Generate optimized static site in dist/ folder
./vexdocs serve --production  # Serve built static files

# Utilities
./vexdocs help      # Show all available commands and options
./vexdocs --version # Show Vexdocs version
./vexdocs clean     # Clean build artifacts and cache
```

### Command Options

| Command | Options | Description |
|---------|---------|-------------|
| `serve` | `--port <number>` | Specify custom port (default: 3000) |
| `serve` | `--host <string>` | Specify host address (default: localhost) |
| `build` | `--output <path>` | Custom output directory (default: dist/) |
| `dev` | `--watch` | Enable file watching for auto-reload |

## 🚀 Deployment

Deploy your Vexdocs site to any static hosting service in just a few steps:

### 1. Build Your Site

```bash
./vexdocs build
```

This generates an optimized static site in the `dist/` directory with:
- Minified HTML, CSS, and JavaScript
- Optimized images and assets
- Pre-generated search indices
- SEO-friendly meta tags and sitemaps

### 2. Deploy to Your Platform

#### GitHub Pages
```bash
# Build and push to gh-pages branch
./vexdocs build
cd dist
git init
git add .
git commit -m "Deploy documentation"
git push origin main:gh-pages
```

#### Netlify
- Connect your repository
- Set build command: `./vexdocs build`
- Set publish directory: `dist`
- Deploy automatically on every push

#### Vercel
```bash
# Using Vercel CLI
vercel --prod
# Or connect via Vercel dashboard
```

#### AWS S3 + CloudFront
```bash
# Upload to S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete
# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

#### Docker
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Performance Optimization

The built site includes:
- **Gzipped assets** for faster loading
- **Service worker** for offline access
- **Lazy loading** for images and components
- **CDN-ready** with proper cache headers

## 🔧 Advanced Features

### Custom Themes
Create custom themes by overriding CSS variables:

```css
:root {
  --primary-color: #your-color;
  --sidebar-bg: #custom-bg;
  --text-color: #your-text-color;
}
```

## 🌍 Browser Support

Vexdocs is built with modern web standards and supports:

- ✅ **Chrome/Edge** 88+ (Full support)
- ✅ **Firefox** 78+ (Full support)  
- ✅ **Safari** 14+ (Full support)
- ✅ **Mobile Chrome** (Optimized experience)
- ✅ **Mobile Safari** (Optimized experience)
- ⚠️ **Internet Explorer** (Not supported)

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Run tests**: `npm test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Setup

```bash
# Clone the repository
git clone https://github.com/xentixar/vexdocs.git
cd vexdocs

# Install development dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

## 📞 Support

- 📖 **Documentation**: Check out our comprehensive [documentation](docs/)
- 🐛 **Bug Reports**: [Open an issue](https://github.com/xentixar/vexdocs/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/xentixar/vexdocs/discussions)

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by the Xentixar**

[Documentation](docs/) • [GitHub](https://github.com/xentixar/vexdocs)

</div>
