---
title: "Markdown Guide for Vexdocs v1.0"
description: "Complete guide to using Markdown in Vexdocs v1.0. Learn formatting, syntax highlighting, and best practices."
keywords: "markdown guide, vexdocs markdown, formatting, syntax highlighting, documentation writing"
---

# 📝 Markdown Guide - Vexdocs v1.0

This comprehensive guide covers all the Markdown features supported by Vexdocs v1.0, helping you create beautiful, well-formatted documentation.

## 📚 Markdown Basics

### Headers

Use `#` symbols to create headers. Vexdocs automatically generates anchor links for all headers.

```markdown
# Header 1 (H1) - Page Title
## Header 2 (H2) - Main Sections  
### Header 3 (H3) - Subsections
#### Header 4 (H4) - Details
##### Header 5 (H5) - Fine Details
###### Header 6 (H6) - Smallest Header
```

**Result:**
# Header 1 (H1) - Page Title
## Header 2 (H2) - Main Sections  
### Header 3 (H3) - Subsections
#### Header 4 (H4) - Details
##### Header 5 (H5) - Fine Details
###### Header 6 (H6) - Smallest Header

**Best Practices:**
- Use only one H1 per page (page title)
- Keep headers descriptive and concise
- Use logical hierarchy (don't skip levels)
- Headers automatically get anchor links for deep linking

### Text Formatting

```markdown
**Bold text** or __Bold text__
*Italic text* or _Italic text_
~~Strikethrough text~~
`Inline code` with backticks

You can **combine *formatting* styles** together.
```

**Result:**
**Bold text** or __Bold text__
*Italic text* or _Italic text_
~~Strikethrough text~~
`Inline code` with backticks

You can **combine *formatting* styles** together.

### Paragraphs and Line Breaks

```markdown
This is a paragraph. Paragraphs are separated by blank lines.

This is another paragraph. To create a line break within a paragraph,  
end the line with two spaces and then press enter.

Or simply leave a blank line between paragraphs.
```

## 📋 Lists

### Unordered Lists

```markdown
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
    - Double nested item
- Item 3

* Alternative syntax with asterisks
* Another item
  * Nested with asterisk

+ Yet another syntax with plus
+ Another item
```

**Result:**
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
    - Double nested item
- Item 3

### Ordered Lists

```markdown
1. First item
2. Second item
   1. Nested numbered item
   2. Another nested item
3. Third item

1. You can use all 1's
1. And they'll auto-number
1. Makes reordering easier
```

**Result:**
1. First item
2. Second item
   1. Nested numbered item
   2. Another nested item
3. Third item

### Task Lists

```markdown
- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task
- [ ] Work in progress
```

**Result:**
- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task
- [ ] Work in progress

## 🔗 Links and References

### Basic Links

```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Hover title")

# Internal documentation links
[Getting Started](getting-started.md)
[API Reference](api-reference.md)
[Configuration Guide](configuration.md)

# Links to specific sections
[Setup Requirements](setup.md#system-requirements)
[Theme Configuration](configuration.md#theme-configuration)
```

### Reference-Style Links

```markdown
Here's a [reference link][ref1] and another [reference link][ref2].

[ref1]: https://example.com "Optional title"
[ref2]: https://vexdocs.dev "Vexdocs Homepage"
```

### Automatic Links

```markdown
https://vexdocs.dev becomes a clickable link automatically
Email: support@vexdocs.dev also becomes clickable
```

## 🖼️ Images

### Basic Image Syntax

```markdown
![Alt text](path/to/image.png)
![Image with title](path/to/image.png "Image title")

# Relative paths work best
![Screenshot](../assets/screenshot.png)
![Logo](assets/logo.svg)
```

### Image Best Practices

```markdown
![Descriptive alt text for accessibility](../assets/feature-screenshot.png "Feature demonstration")
```

**Guidelines:**
- Always include alt text for accessibility
- Use descriptive filenames
- Optimize images for web (compress before adding)
- Prefer SVG for logos and icons
- Use WebP format for photos when possible

## 💻 Code

### Inline Code

```markdown
Use `backticks` for inline code like `npm install` or `const variable`.

File names like `package.json` and commands like `npm start` look better with backticks.
```

### Code Blocks

#### Basic Code Blocks

```
# Code block without syntax highlighting
function hello() {
  console.log("Hello, World!");
}
```

#### Syntax Highlighted Code Blocks

```javascript
// JavaScript example
function greet(name) {
  return `Hello, ${name}!`;
}

const message = greet("Vexdocs");
console.log(message);
```

```python
# Python example
def greet(name):
    return f"Hello, {name}!"

message = greet("Vexdocs")
print(message)
```

```bash
# Bash/Shell commands
npm install
npm start
./vexdocs serve --port 3000
```

```json
{
  "title": "Configuration Example",
  "theme": {
    "primaryColor": "#2563eb"
  }
}
```

#### Supported Languages

Vexdocs v1.0 supports syntax highlighting for 50+ languages:

**Popular Languages:**
- `javascript`, `typescript`, `python`, `java`, `csharp`
- `html`, `css`, `scss`, `less`
- `json`, `yaml`, `xml`, `toml`
- `bash`, `shell`, `powershell`, `batch`
- `sql`, `mongodb`, `graphql`
- `markdown`, `latex`, `plaintext`

**Example with multiple languages:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Vexdocs Example</title>
</head>
<body>
  <h1>Hello, World!</h1>
</body>
</html>
```

```css
.header {
  background-color: var(--primary-color);
  padding: 1rem;
  color: white;
}
```

```javascript
document.addEventListener('DOMContentLoaded', function() {
  console.log('Vexdocs loaded successfully!');
});
```

## 📊 Tables

### Basic Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1    | Data     | More data|
| Row 2    | Data     | More data|
| Row 3    | Data     | More data|
```

**Result:**
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1    | Data     | More data|
| Row 2    | Data     | More data|
| Row 3    | Data     | More data|

## 💬 Blockquotes

### Basic Blockquotes

```markdown
> This is a blockquote.
> It can span multiple lines.

> **Note:** Blockquotes are great for highlighting important information.
```

**Result:**
> This is a blockquote.
> It can span multiple lines.

> **Note:** Blockquotes are great for highlighting important information.

### Nested Blockquotes

```markdown
> This is a blockquote.
> 
> > This is a nested blockquote.
> > It's indented further.
> 
> Back to the main blockquote.
```

### Blockquotes with Other Elements

```markdown
> ## Blockquote with Header
> 
> You can include **formatting** and other elements:
> 
> - List item 1
> - List item 2
> 
```

## 🔗 Horizontal Rules

```markdown
Use three or more hyphens, asterisks, or underscores:

---

***

___

Separate sections of content:

---
```

## 📄 Frontmatter (Metadata)

Add metadata to your pages using YAML frontmatter:

```markdown
---
title: "Custom Page Title"
description: "Page description for SEO and social media"
keywords: "keyword1, keyword2, keyword3"
author: "Your Name"
date: "2024-01-01"
---

# Your Content Starts Here

The frontmatter above won't be displayed but will be used for SEO.
```

### Frontmatter Properties

| Property | Type | Description |
|----------|------|-------------|
| `title` | string | Page title (overrides H1 for SEO) |
| `description` | string | Meta description for search engines |
| `keywords` | string | SEO keywords (comma-separated) |
| `author` | string | Content author |
| `date` | string | Publication or update date |

## 📱 Responsive Images

Make images responsive for mobile:

```markdown
![Responsive image](../assets/screenshot.png)
<!-- Image will automatically scale on mobile -->
```

## ⚠️ Special Containers (Custom Extensions)

While not standard Markdown, you can create visually distinct sections:

```markdown
> **💡 Tip:** Use consistent formatting throughout your documentation.

> **⚠️ Warning:** Be careful with configuration changes in production.

> **📝 Note:** This feature requires additional setup.

> **🚀 Pro Tip:** Use keyboard shortcuts for faster navigation.
```

## 📋 Best Practices

### 1. Document Structure

```markdown
---
title: "Descriptive Page Title"
description: "Clear description of page content"
---

# Main Page Title

Brief introduction paragraph explaining what this page covers.

## Major Section 1

Content for the first major section.

### Subsection 1.1

Detailed information.

## Major Section 2

Content for the second major section.

## Next Steps

Links to related documentation or next actions.
```

### 2. Writing Guidelines

**Be Clear and Concise:**
```markdown
# ✅ Good
## Installation Requirements

You need Node.js 12+ to run Vexdocs.

# ❌ Avoid
## Requirements and Prerequisites and Dependencies

You might need to have Node.js installed on your system, possibly version 12 or higher, depending on your setup.
```

**Use Consistent Formatting:**
```markdown
# Commands
Use `code formatting` for commands: `npm install`

# File names  
Reference files with `backticks`: `package.json`

# UI elements
Use **bold** for UI elements: Click the **Save** button
```

### 3. Navigation-Friendly Content

```markdown
# Use descriptive headers that work well in navigation
## Quick Start Guide
## Configuration Options  
## Troubleshooting Common Issues

# Avoid generic headers
## Overview
## Details
## Other
```

### 4. Cross-References

```markdown
# Link to other documentation pages
See the [API Reference](api-reference.md) for detailed method documentation.

# Link to specific sections
Check the [installation requirements](setup.md#system-requirements) before proceeding.

# Link to external resources
Learn more about [Markdown syntax](https://daringfireball.net/projects/markdown/).
```

## 🔍 SEO Optimization

### Page Titles and Descriptions

```markdown
---
title: "How to Install Vexdocs v1.0 - Complete Guide"
description: "Step-by-step installation guide for Vexdocs v1.0. Covers requirements, setup, and troubleshooting for all platforms."
keywords: "vexdocs installation, setup guide, documentation tool, node.js"
---

# Installing Vexdocs v1.0

This guide walks you through installing Vexdocs...
```

### Header Hierarchy

```markdown
# Main Topic (H1) - Used for page title
## Major Sections (H2) - Main navigation points
### Subsections (H3) - Detailed breakdowns
#### Details (H4) - Specific points
```

---

*Master these Markdown techniques to create professional, accessible documentation that looks great and works perfectly with Vexdocs v1.0. Check out the [Configuration Guide](configuration.md) for customization options.*
