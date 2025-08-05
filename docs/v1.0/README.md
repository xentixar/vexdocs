# Welcome to Vexdocs v1.0

This is the **stable version** of Vexdocs. It provides reliable functionality for creating and hosting documentation.

## ✨ Features

### Core Functionality
- **Markdown Parsing**: Convert markdown to HTML
- **Multi-Version Support**: Handle different documentation versions
- **Navigation**: Auto-generated sidebar navigation
- **Search**: Basic search functionality
- **Responsive Design**: Works on all devices

### Version 1.0 Highlights
- Stable and tested codebase
- Essential documentation features
- Clean, minimal interface
- Fast performance
- No external dependencies

## 📖 Quick Start

1. **Install and Run**
   ```bash
   npm start
   ```

2. **Open Browser**
   Navigate to `http://localhost:3000`

3. **Create Content**
   Add markdown files to `docs/v1.0/`

## 📁 File Structure

```
docs/
├── v1.0/
│   ├── README.md      # This file
│   ├── guide.md       # User guide
│   └── setup.md       # Setup instructions
└── config.json        # Configuration
```

## 🎨 Basic Configuration

Edit `docs/config.json`:

```json
{
  "title": "My Documentation",
  "versions": {
    "v1.0": "Stable"
  },
  "defaultVersion": "v1.0"
}
```

## 📝 Markdown Support

Version 1.0 supports standard markdown:

- **Headers** (H1-H6)
- **Bold** and *italic* text
- `Inline code` and code blocks
- Lists (ordered and unordered)
- Links and images
- Tables
- Blockquotes

## 🚀 Deployment

Build for production:

```bash
npm run build
```

The generated `dist/` folder can be deployed to any static hosting service.

## 🔄 Upgrading to v2.0

Consider upgrading to v2.0 for:
- Enhanced search capabilities
- Improved mobile experience
- Advanced theming options
- Better performance optimizations

---

*Version 1.0 provides a solid foundation for documentation needs. Check out the [setup guide](setup.md) to get started!*
