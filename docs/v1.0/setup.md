# Setup Guide v1.0

This guide covers the basic setup and configuration for Vexdocs v1.0.

## 📋 Requirements

- Node.js 12+ 
- Basic understanding of Markdown
- Text editor

## 🏗️ Installation Steps

### 1. Get the Code
Download or clone Vexdocs to your local machine.

### 2. Navigate to Directory
```bash
cd versioning-tool
```

### 3. Start the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📝 Creating Documentation

### Basic Structure
Create your documentation files in the `docs/v1.0/` directory:

```
docs/
├── v1.0/
│   ├── README.md      # Home page
│   ├── guide.md       # User guide
│   └── setup.md       # This file
└── config.json        # Configuration
```

### Writing Content
Create markdown files with `.md` extension:

```markdown
# Page Title

Your content here with **markdown** formatting.

## Sections
- List items
- More items

```code blocks```
```

### Configuration File
The `docs/config.json` file controls the documentation settings:

```json
{
  "title": "My Documentation",
  "description": "Project documentation",
  "versions": {
    "v1.0": "Stable"
  },
  "defaultVersion": "v1.0",
  "theme": {
    "primaryColor": "#007acc"
  }
}
```

## 🎨 Customization

### Colors
Change the primary color in `config.json`:

```json
{
  "theme": {
    "primaryColor": "#e74c3c"
  }
}
```

### Layout
The layout is fixed in v1.0 but provides a clean, professional appearance.

## 📱 Responsive Design

The v1.0 interface works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔍 Search Feature

Basic search functionality:
- Type in the search box
- Filter navigation items
- Case-insensitive matching

## 🚀 Building for Production

Create a static version for hosting:

```bash
npm run build
```

This generates:
- Static HTML files
- Optimized CSS and JavaScript
- All documentation content

## 📡 Hosting

Deploy the `dist/` folder to:
- GitHub Pages
- Netlify
- Vercel
- Any static host

## 🔧 Troubleshooting

### Common Issues

**Server won't start**
- Check Node.js installation
- Verify port 3000 is available

**Content not showing**
- Check markdown file syntax
- Ensure files are in `docs/v1.0/`

**Styling problems**
- Clear browser cache
- Check `config.json` syntax

## 📈 Performance

Version 1.0 is optimized for:
- Fast loading times
- Minimal resource usage
- Smooth navigation
- Efficient markdown parsing

## 🔄 Version Management

To add new versions:
1. Create new folder (e.g., `docs/v1.1/`)
2. Update `config.json`:
   ```json
   {
     "versions": {
       "v1.1": "Latest",
       "v1.0": "Stable"
     }
   }
   ```

## 📚 Next Steps

After basic setup:
1. Customize your `config.json`
2. Add your documentation content
3. Test the navigation and search
4. Build and deploy

---

*This guide covers the essentials for v1.0. For advanced features, consider upgrading to v2.0.*
