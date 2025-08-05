# 🚀 Vexdocs Quick Start Guide

Welcome to Vexdocs! Here's everything you need to know to get started with your modern documentation tool.

## 📚 What You've Built

You now have Vexdocs - a fully functional documentation tool with these features:

### ✨ Key Features
- **🔄 Multi-Version Support**: Handle multiple documentation versions (v1.0, v2.0, etc.)
- **📝 Pure JavaScript Markdown Parser**: No external dependencies
- **🎨 Custom CSS**: Beautiful, responsive design
- **🔍 Real-time Search**: Filter navigation and content
- **📱 Mobile-Friendly**: Works perfectly on all devices
- **⚡ Fast Static Generation**: Build for CDN deployment
- **🌐 Clean URLs**: SEO-friendly routing

## 🏃‍♂️ Getting Started

### 1. Start the Server
```bash
cd /home/xentixar/Programming/Sockeon/versioning-tool
npm start
```

### 2. Open Your Browser
Navigate to: **http://localhost:3000**

### 3. Explore the Interface
- **Header**: Shows title and version selector
- **Sidebar**: Navigation with search box
- **Main Content**: Rendered markdown content
- **Version Switcher**: Toggle between different versions

## 📁 Project Structure

```
versioning-tool/
├── src/
│   ├── server.js           # Main server file
│   └── build.js           # Static site builder
├── assets/
│   ├── css/
│   │   └── main.css       # Custom styling
│   └── js/
│       ├── app.js         # Main application
│       └── markdown-parser.js  # Custom parser
├── docs/
│   ├── config.json        # Configuration
│   ├── v2.0/              # Latest version docs
│   │   ├── README.md
│   │   ├── getting-started.md
│   │   └── api/
│   │       └── reference.md
│   └── v1.0/              # Stable version docs
│       ├── README.md
│       └── setup.md
├── package.json           # Project config
└── README.md             # Main documentation
```

## 📝 Adding Your Content

### 1. Edit Configuration
Modify `docs/config.json`:
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
    "primaryColor": "#your-color",
    "sidebarWidth": "300px"
  }
}
```

### 2. Create Documentation
Add markdown files to version folders:
```
docs/
├── v2.0/
│   ├── README.md          # Home page
│   ├── installation.md    # Installation guide
│   ├── tutorials/         # Tutorial folder
│   │   ├── basic.md
│   │   └── advanced.md
│   └── api/              # API documentation
│       ├── overview.md
│       └── reference.md
```

### 3. Use Markdown Features
Your custom parser supports:
- Headers (H1-H6)
- **Bold** and *italic* text
- `inline code` and code blocks
- Lists and tables
- Links and images
- Blockquotes
- Horizontal rules

## 🎨 Customization

### Theme Colors
Change colors in `docs/config.json`:
```json
{
  "theme": {
    "primaryColor": "#e74c3c",
    "sidebarWidth": "280px"
  }
}
```

### Custom CSS
Edit `assets/css/main.css` to modify styling:
```css
:root {
  --custom-accent: #3498db;
}

.markdown-content h1 {
  color: var(--custom-accent);
  border-bottom: 3px solid var(--custom-accent);
}
```

## 🚀 Deployment Options

### Static Site Generation
Build for hosting on CDNs:
```bash
npm run build
```

This creates a `dist/` folder ready for deployment.

### Hosting Options
- **GitHub Pages**: Free hosting for public repos
- **Netlify**: Drag-and-drop deployment
- **Vercel**: Automatic deployments
- **AWS S3**: Scalable static hosting
- **Any Web Server**: Copy `dist/` folder

### Server Deployment
Deploy the entire project to:
- Heroku
- DigitalOcean
- AWS EC2
- Any Node.js hosting

## 📱 Features in Action

### Version Switching
- Use the dropdown in the header
- Each version has independent navigation
- Clean URLs for each version

### Search Functionality
- Type in the sidebar search box
- Automatically filters navigation
- Expands relevant folders
- Case-insensitive matching

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly navigation
- Optimized typography

## 🔧 Development

### Development Mode
```bash
npm run dev
```
Enables enhanced logging and debugging.

### File Structure
- `src/server.js`: Main HTTP server
- `src/build.js`: Static site generator
- `assets/js/app.js`: Frontend application
- `assets/js/markdown-parser.js`: Markdown to HTML converter
- `assets/css/main.css`: All styling

### API Endpoints
- `/api/config`: Configuration data
- `/api/versions`: Available versions
- `/api/navigation?version=v2.0`: Navigation structure
- `/api/content?version=v2.0&path=README.md`: Page content

## 🛠️ Advanced Usage

### Adding New Versions
1. Create new folder: `docs/v3.0/`
2. Add content files
3. Update `config.json`:
   ```json
   {
     "versions": {
       "v3.0": "Beta",
       "v2.0": "Latest", 
       "v1.0": "Stable"
     }
   }
   ```

### Custom Markdown Extensions
Extend the parser in `assets/js/markdown-parser.js`:
```javascript
class CustomMarkdownParser extends MarkdownParser {
  parseCustomSyntax(text) {
    // Add your custom markdown syntax
    return text;
  }
}
```

### Integration with Build Tools
- Add to CI/CD pipelines
- Auto-deploy on git push
- Generate from API documentation
- Sync with external sources

## 🎯 Use Cases

Perfect for:
- **Project Documentation**: API docs, user guides
- **Team Wikis**: Internal knowledge bases
- **Product Manuals**: User instructions
- **Tutorial Sites**: Step-by-step guides
- **Change Logs**: Version history
- **Developer Portals**: Technical documentation

## 🚀 Performance Features

- **Zero Dependencies**: Pure JavaScript implementation
- **Fast Parsing**: Efficient markdown processing
- **Optimized CSS**: Minimal, clean styles
- **Static Generation**: CDN-ready output
- **Lazy Loading**: Only load what's needed
- **Mobile Optimized**: Fast on all devices

## 🔍 Troubleshooting

### Common Issues

**Server won't start**
- Check if port 3000 is in use
- Ensure Node.js is installed
- Verify file permissions

**Content not displaying**
- Check markdown syntax
- Verify file paths
- Ensure proper JSON in config

**Styling issues**
- Clear browser cache
- Check CSS file paths
- Verify theme configuration

### Getting Help

1. Check browser console for errors
2. Verify markdown file formatting
3. Test with simple content first
4. Review configuration syntax

## 🎉 Next Steps

Now that your documentation tool is running:

1. **Customize the theme** to match your brand
2. **Add your content** by replacing the example docs
3. **Configure versions** based on your project needs
4. **Test the search** and navigation features
5. **Build and deploy** to share with your team

---

**Vexdocs is ready! Start creating amazing documentation! 📚✨**
