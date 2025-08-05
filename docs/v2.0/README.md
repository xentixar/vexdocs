# Welcome to Vexdocs v2.0

Welcome to the **latest version** of Vexdocs! This version includes exciting new features and improvements.

## 🚀 What's New in v2.0

- **Enhanced Search**: Fast and intelligent search across all documentation
- **Improved Navigation**: Better folder structure and navigation experience
- **Mobile Optimization**: Fully responsive design for all devices
- **Custom Themes**: Advanced theming support with CSS variables
- **Performance**: Faster loading and rendering

## 🎯 Key Features

### Multi-Version Support
Our tool supports multiple documentation versions simultaneously:
- Seamless version switching
- Independent navigation for each version
- Version-specific content and structure

### Pure JavaScript Markdown Parser
- No external dependencies
- Full CommonMark support
- Custom syntax highlighting
- Table support
- Image optimization

### Modern Design
- Clean, professional interface
- Dark/light theme support
- Responsive layout
- Accessibility features

## 📖 Getting Started

1. **Quick Setup**
   ```bash
   npm start
   ```

2. **Development Mode**
   ```bash
   npm run dev
   ```

3. **Build Static Site**
   ```bash
   npm run build
   ```

## 📁 Documentation Structure

```
docs/
├── v2.0/           # Latest version
│   ├── README.md
│   ├── getting-started.md
│   └── api/
│       └── reference.md
├── v1.0/           # Stable version
│   └── ...
└── config.json    # Configuration
```

## 🎨 Customization

You can customize the appearance by modifying the `config.json`:

```json
{
  "theme": {
    "primaryColor": "#007acc",
    "sidebarWidth": "320px"
  }
}
```

## 📱 Responsive Design

The documentation tool is fully responsive and works great on:
- 🖥️ Desktop computers
- 📱 Mobile phones
- 📟 Tablets
- 🖨️ Print media

## 🔍 Advanced Search

Use the search box to quickly find content across all pages:
- Type keywords to filter navigation
- Search expands folders automatically
- Case-insensitive matching

## 🚀 Performance

- **Fast Loading**: Optimized asset delivery
- **Efficient Rendering**: Pure JavaScript parsing
- **Minimal Dependencies**: Zero external libraries
- **Static Generation**: Build for CDN deployment

---

*This documentation was generated with Vexdocs. Check out the [Getting Started](getting-started.md) guide to learn more!*
