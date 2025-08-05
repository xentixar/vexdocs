# Getting Started with Vexdocs v2.0

This guide will help you get up and running with Vexdocs quickly.

## 📋 Prerequisites

- Node.js (version 12 or higher)
- Basic knowledge of Markdown
- A text editor

## 🏗️ Installation

1. **Clone or download** Vexdocs
2. **Navigate** to the project directory
3. **Start the server**:
   ```bash
   npm start
   ```

## 📝 Creating Documentation

### Basic Structure

Create your documentation in the `docs/` directory:

```
docs/
├── config.json        # Main configuration
├── v2.0/              # Version 2.0 docs
│   ├── README.md      # Home page
│   ├── guide.md       # Guide pages
│   └── api/           # API documentation
│       └── methods.md
└── v1.0/              # Version 1.0 docs
    └── README.md
```

### Configuration

Edit `docs/config.json` to customize your documentation:

```json
{
  "title": "My Project Documentation",
  "description": "Comprehensive documentation for my project",
  "versions": {
    "v2.0": "Latest",
    "v1.0": "Stable"
  },
  "defaultVersion": "v2.0",
  "theme": {
    "primaryColor": "#2c3e50",
    "sidebarWidth": "280px"
  }
}
```

## ✍️ Writing Content

### Supported Markdown Features

Our parser supports all standard Markdown features:

#### Headers
```markdown
# H1 Header
## H2 Header
### H3 Header
```

#### Text Formatting
```markdown
**Bold text**
*Italic text*
~~Strikethrough~~
`inline code`
```

#### Lists
```markdown
- Bullet point 1
- Bullet point 2
  - Nested item
  - Another nested item

1. Numbered item 1
2. Numbered item 2
```

#### Code Blocks
```javascript
function hello() {
    console.log("Hello, world!");
}
```

#### Tables
```markdown
| Feature | Status | Notes |
|---------|--------|-------|
| Parsing | ✅ | Full support |
| Styling | ✅ | Custom CSS |
| Search  | ✅ | Built-in |
```

#### Links and Images
```markdown
[Link text](https://example.com)
![Alt text](image.png)
```

#### Blockquotes
```markdown
> This is a blockquote
> It can span multiple lines
```

## 🚀 Development Mode

Run in development mode for auto-refresh:

```bash
npm run dev
```

This enables:
- Hot reloading
- Enhanced error messages
- Development logging

## 🏗️ Building for Production

Generate a static site for hosting:

```bash
npm run build
```

This creates a `dist/` folder with:
- Static HTML files
- Optimized assets
- JSON API endpoints
- All documentation versions

## 🎨 Customizing Appearance

### Theme Colors
Modify colors in `config.json`:

```json
{
  "theme": {
    "primaryColor": "#e74c3c",
    "sidebarWidth": "350px"
  }
}
```

### Custom CSS
Add custom styles by modifying `assets/css/main.css`:

```css
:root {
  --custom-color: #3498db;
}

.markdown-content h1 {
  color: var(--custom-color);
}
```

## 🔧 Advanced Configuration

### Multiple Versions
Add new versions by:

1. Creating a new folder in `docs/` (e.g., `v3.0/`)
2. Adding the version to `config.json`:
   ```json
   {
     "versions": {
       "v3.0": "Beta",
       "v2.0": "Latest",
       "v1.0": "Stable"
     }
   }
   ```

### Custom Navigation
The navigation is auto-generated from your folder structure:
- Folders become collapsible sections
- `.md` files become navigation links
- File names are used as display names

## 📱 Mobile Support

The documentation tool is fully responsive:
- Collapsible sidebar on mobile
- Touch-friendly navigation
- Optimized typography
- Fast loading on all devices

## 🔍 Search Functionality

The built-in search feature:
- Filters navigation items
- Expands relevant folders
- Highlights matching content
- Works across all versions

## 🚀 Deployment

### Static Hosting
After running `npm run build`, deploy the `dist/` folder to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

### Server Hosting
For dynamic features, deploy the entire project with Node.js support.

## 🆘 Troubleshooting

### Common Issues

**Server won't start**
- Check if port 3000 is available
- Ensure Node.js is installed
- Verify all files are present

**Content not loading**
- Check markdown file formatting
- Verify file paths in navigation
- Ensure `config.json` is valid JSON

**Styling issues**
- Clear browser cache
- Check CSS file paths
- Verify custom theme settings

### Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify your markdown syntax
3. Ensure all file paths are correct
4. Review the configuration file

---

*Ready to create amazing documentation? Start by editing this file and see the changes in real-time!*
