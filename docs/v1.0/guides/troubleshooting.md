---
title: "Troubleshooting Guide - Vexdocs v1.0"
description: "Common issues and solutions for Vexdocs v1.0. Get help with installation, configuration, and deployment problems."
keywords: "vexdocs troubleshooting, common issues, problems, solutions, debugging"
---

# 🔧 Troubleshooting Guide - Vexdocs v1.0

This guide helps you resolve common issues you might encounter when using Vexdocs v1.0.

## 🚨 Installation Issues

### Node.js Version Problems

**Problem**: Server won't start or shows version errors.

**Solution**:
```bash
# Check your Node.js version
node --version

# Should be 12.0.0 or higher
# If not, update Node.js from https://nodejs.org
```

**Problem**: `npm` commands fail with permission errors.

**Solution** (macOS/Linux):
```bash
# Set up npm to use a different directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Add to your shell profile (.bashrc, .zshrc, etc.)
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
```

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE :::3000`

**Solution**:
```bash
# Option 1: Use npm script
npm start

# Option 2: Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Option 3: Start server normally (no port options available)
vexdocs serve
```

## 📝 Configuration Issues

### Invalid JSON Configuration

**Problem**: Site won't load due to configuration errors.

**Solution**:
```bash
# Validate your config.json syntax
cat docs/config.json | python -m json.tool

# Or use Node.js
node -e "console.log(JSON.parse(require('fs').readFileSync('docs/config.json')))"
```

**Common JSON Errors:**
```json
{
  "title": "My Docs",
  "theme": {
    "primaryColor": "#ff0000",  // ❌ Trailing comma
  }  // ❌ Extra trailing comma
}

{
  "title": "My Docs",
  "theme": {
    "primaryColor": "#ff0000"   // ✅ No trailing comma
  }
}
```

### Theme Not Applying

**Problem**: Custom colors or theme settings not visible.

**Solution**:
1. **Check CSS color format**:
```json
{
    "theme": {
        "primaryColor": "#ff0000",    // ✅ Correct hex format
        "primaryColor": "red",        // ❌ Invalid format
        "primaryColor": "rgb(255,0,0)" // ❌ Invalid format
    }
}
```

2. **Clear browser cache**:
   - Chrome: Ctrl+Shift+R (Cmd+Shift+R on Mac)
   - Firefox: Ctrl+F5 (Cmd+Shift+R on Mac)
   - Safari: Cmd+Option+R

3. **Restart development server**:
```bash
# Stop server (Ctrl+C) and restart
npm start
```

## 📄 Content Issues

### Pages Not Showing

**Problem**: Markdown files exist but don't appear in navigation.

**Solution**:
1. **Check file location**:
```bash
# Files must be in docs/v1.0/ directory
ls docs/v1.0/
```

2. **Check file extension**:
```bash
# Must be .md extension
mv docs/v1.0/page.txt docs/v1.0/page.md
```

3. **Restart server**:
```bash
npm start
```

### Broken Internal Links

**Problem**: Links between documentation pages don't work.

**Solution**:
1. **Use relative paths**:
```markdown
✅ [Getting Started](getting-started.md)
✅ [API Guide](guides/api-guide.md)
❌ [Getting Started](/docs/v1.0/getting-started.md)
```

2. **Check file case sensitivity** (Linux/macOS):
```markdown
❌ [Guide](Getting-Started.md)  // File is getting-started.md
✅ [Guide](getting-started.md)  // Correct case
```

### Images Not Loading

**Problem**: Images don't appear in documentation.

**Solution**:
1. **Check file paths**:
```markdown
✅ ![Screenshot](../assets/screenshot.png)
✅ ![Logo](assets/logo.png)
❌ ![Image](C:/Users/me/image.png)  // Absolute paths don't work
```

2. **Verify files exist**:
```bash
ls docs/assets/
ls docs/v1.0/assets/
```

3. **Check file permissions**:
```bash
chmod 644 docs/assets/*.png
```

## 🔍 Search Problems

### Search Not Working

**Problem**: Search box doesn't filter navigation.

**Solution**:
1. **Check JavaScript errors**:
   - Open browser developer tools (F12)
   - Look for errors in Console tab
   - Refresh page and check for errors

2. **Clear browser cache**:
```bash
# Hard refresh
Ctrl+Shift+R (or Cmd+Shift+R on Mac)
```

3. **Restart development server**:
```bash
npm start
```

### Search Results Empty

**Problem**: Search doesn't find any content.

**Solution**:
1. **Check navigation structure**:
```bash
# Verify files are in correct location
find docs/v1.0 -name "*.md"
```

2. **Restart server to rebuild navigation**:
```bash
npm start
```

## 🚀 Build Issues

### Build Fails

**Problem**: `npm run build` fails with errors.

**Solution**:
1. **Check Node.js version**:
```bash
node --version  # Should be 12+
```

2. **Clear dependencies and reinstall**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

3. **Check for syntax errors**:
```bash
# Validate all markdown files
find docs -name "*.md" -exec echo "Checking {}" \;
```

### Build Output Missing Files

**Problem**: Some files missing from `dist/` folder.

**Solution**:
1. **Check source files exist**:
```bash
find docs/v1.0 -name "*.md"
find assets -type f
```

2. **Clean and rebuild**:
```bash
npm run clean
npm run build
```

3. **Check build output**:
```bash
ls -la dist/
```

## 🌐 Deployment Problems

### GitHub Pages Not Working

**Problem**: Site doesn't load after deploying to GitHub Pages.

**Solution**:
1. **Check repository settings**:
   - Go to Settings → Pages
   - Ensure source is set to `gh-pages` branch
   - Check if custom domain is configured correctly

2. **Verify build output**:
```bash
# Make sure index.html exists in dist/
ls dist/index.html
```

3. **Check deployment status**:
   - Look at Actions tab in GitHub repository
   - Check for failed deployments

### 404 Errors on Deployed Site

**Problem**: Pages show 404 errors after deployment.

**Solution**:
1. **Check file paths**:
```bash
# Ensure all referenced files exist
find dist -name "*.html"
```

2. **Verify hosting configuration**:
```bash
# For SPA routing, ensure index.html fallback is configured
```

3. **Check case sensitivity**:
```markdown
# Make sure links match actual file names exactly
[Page](getting-started.md)  # File must be exactly getting-started.md
```

## 📱 Mobile Issues

### Mobile Layout Problems

**Problem**: Site doesn't look good on mobile devices.

**Solution**:
1. **Test responsive design**:
   - Use browser developer tools
   - Toggle device toolbar (Ctrl+Shift+M)
   - Test different screen sizes

2. **Check CSS issues**:
```css
/* Override mobile styles if needed */
@media (max-width: 768px) {
    .content {
    padding: 1rem;
    }
}
```

### Touch Navigation Issues

**Problem**: Navigation hard to use on touch devices.

**Solution**:
1. **Use mobile menu**:
   - Hamburger menu should appear on mobile
   - Check if JavaScript is working

2. **Test touch targets**:
   - Ensure links are large enough to tap
   - Check spacing between clickable elements

## 🔧 Performance Issues

### Slow Page Loading

**Problem**: Pages load slowly in development.

**Solution**:
1. **Optimize images**:
```bash
# Compress large images
# Use tools like ImageOptim, TinyPNG, or imagemin
```

2. **Check file sizes**:
```bash
find docs -name "*.md" -exec wc -c {} +
# Large files (>1MB) may slow things down
```

3. **Restart development server**:
```bash
npm start
```

### Build Takes Too Long

**Problem**: `npm run build` takes a very long time.

**Solution**:
1. **Check file count**:
```bash
find docs -name "*.md" | wc -l
# Very large numbers of files increase build time
```

2. **Optimize assets**:
```bash
# Remove unused images and files
find assets -name "*.png" -o -name "*.jpg" | wc -l
```

## 🐛 General Debugging

### Enable Debug Mode

```bash
# Start with verbose logging
npm run dev --verbose

# Or use debug mode
DEBUG=vexdocs* npm start
```

### Check Browser Console

1. **Open Developer Tools**: F12 (or Cmd+Option+I on Mac)
2. **Go to Console tab**
3. **Look for error messages**
4. **Check Network tab for failed requests**

### Common Error Messages

#### "Cannot read property of undefined"
- Usually a JavaScript error
- Check browser console for details
- Try clearing cache and reloading

#### "ENOENT: no such file or directory"
- File path is incorrect
- Check if file exists at specified location
- Verify case sensitivity

#### "JSON.parse: unexpected character"
- Invalid JSON in config.json
- Use JSON validator to check syntax
- Look for trailing commas or missing quotes

## 📞 Getting Help

### Before Asking for Help

1. **Check this troubleshooting guide**
2. **Search existing issues** on GitHub
3. **Try the solutions** listed above
4. **Include error messages** when reporting issues

### What to Include in Bug Reports

```
**Environment:**
- OS: [Windows/macOS/Linux]
- Node.js version: [run `node --version`]
- Vexdocs version: [from package.json]

**Problem:**
- What you expected to happen
- What actually happened
- Steps to reproduce

**Error Messages:**
- Browser console errors
- Terminal/command line errors

**Configuration:**
- Your config.json (remove sensitive info)
- File structure (`find docs -name "*.md"`)
```

### Community Resources

- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check the complete guides
- **Stack Overflow**: Search for similar problems

## 🔄 Regular Maintenance

### Prevent Common Issues

1. **Keep dependencies updated**:
```bash
npm update
```

2. **Validate configuration regularly**:
```bash
cat docs/config.json | python -m json.tool
```

3. **Test builds periodically**:
```bash
npm run clean && npm run build
```

4. **Check for broken links**:
```bash
# Use tools like markdown-link-check
npx markdown-link-check docs/**/*.md
```

---

*If you're still experiencing issues after trying these solutions, please check our [GitHub Issues](https://github.com/xentixar/vexdocs/issues) or create a new issue with detailed information about your problem.*
