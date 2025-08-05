# API Reference

Complete API documentation for Vexdocs.

## 🌐 Server API

### Configuration Endpoint

**GET** `/api/config`

Returns the current documentation configuration.

**Response:**
```json
{
  "title": "Documentation Title",
  "description": "Documentation description",
  "versions": {
    "v2.0": "Latest",
    "v1.0": "Stable"
  },
  "defaultVersion": "v2.0",
  "theme": {
    "primaryColor": "#007acc",
    "sidebarWidth": "300px"
  }
}
```

### Versions Endpoint

**GET** `/api/versions`

Returns available documentation versions.

**Response:**
```json
["v2.0", "v1.0"]
```

### Navigation Endpoint

**GET** `/api/navigation?version=v2.0`

Returns navigation structure for a specific version.

**Parameters:**
- `version` (string): Documentation version

**Response:**
```json
[
  {
    "type": "file",
    "name": "README",
    "path": "README.md"
  },
  {
    "type": "folder",
    "name": "api",
    "path": "api",
    "children": [
      {
        "type": "file",
        "name": "reference",
        "path": "api/reference.md"
      }
    ]
  }
]
```

### Content Endpoint

**GET** `/api/content?version=v2.0&path=README.md`

Returns markdown content for a specific file.

**Parameters:**
- `version` (string): Documentation version
- `path` (string): File path relative to version directory

**Response:**
```json
{
  "content": "# Welcome\n\nThis is the content...",
  "path": "README.md"
}
```

## 🎨 Client API

### MarkdownParser Class

Pure JavaScript markdown parser without dependencies.

#### Constructor
```javascript
const parser = new MarkdownParser();
```

#### Methods

**parse(markdown)**
- **Parameters:** `markdown` (string) - Raw markdown content
- **Returns:** (string) - Parsed HTML
- **Description:** Converts markdown to HTML

```javascript
const html = parser.parse('# Hello World\n\nThis is **bold** text.');
```

**parseHeadings(text)**
- **Parameters:** `text` (string) - Text with headers
- **Returns:** (string) - HTML with header tags
- **Description:** Converts markdown headers to HTML

**parseInlineElements(text)**
- **Parameters:** `text` (string) - Text with inline markdown
- **Returns:** (string) - HTML with inline elements
- **Description:** Processes bold, italic, links, etc.

#### Supported Features

| Feature | Syntax | HTML Output |
|---------|--------|-------------|
| Headers | `# Header` | `<h1>Header</h1>` |
| Bold | `**text**` | `<strong>text</strong>` |
| Italic | `*text*` | `<em>text</em>` |
| Code | `` `code` `` | `<code>code</code>` |
| Links | `[text](url)` | `<a href="url">text</a>` |
| Images | `![alt](src)` | `<img alt="alt" src="src">` |

### DocsApp Class

Main application controller for the documentation interface.

#### Constructor
```javascript
const app = new DocsApp();
```

#### Methods

**loadConfig()**
- **Returns:** Promise
- **Description:** Loads documentation configuration

**changeVersion(version)**
- **Parameters:** `version` (string) - Target version
- **Returns:** Promise
- **Description:** Switches to a different documentation version

**navigateToPath(path)**
- **Parameters:** `path` (string) - Target file path
- **Returns:** Promise
- **Description:** Navigates to a specific documentation page

**performSearch(query)**
- **Parameters:** `query` (string) - Search query
- **Description:** Filters navigation based on search terms

## 🔧 Build API

### StaticSiteBuilder Class

Generates static HTML files for hosting.

#### Constructor
```javascript
const builder = new StaticSiteBuilder({
  docsDir: './docs',
  outputDir: './dist'
});
```

#### Methods

**build()**
- **Returns:** Promise
- **Description:** Builds complete static site

**generateApiFiles()**
- **Description:** Creates JSON API endpoints

**generatePages()**
- **Description:** Creates HTML pages for all routes

## 📝 Configuration Schema

### Root Configuration

```typescript
interface Config {
  title: string;           // Site title
  description: string;     // Site description
  versions: {              // Available versions
    [version: string]: string;  // version: label
  };
  defaultVersion: string;  // Default version to load
  theme: {                 // Theme configuration
    primaryColor: string;  // Primary color (hex)
    sidebarWidth: string;  // Sidebar width (CSS units)
  };
}
```

### Navigation Item

```typescript
interface NavigationItem {
  type: 'file' | 'folder';
  name: string;            // Display name
  path: string;            // File/folder path
  children?: NavigationItem[];  // Folder children
}
```

## 🎯 Usage Examples

### Basic Setup

```javascript
// Initialize the application
const app = new DocsApp();

// Listen for version changes
document.getElementById('versionSelect').addEventListener('change', (e) => {
  app.changeVersion(e.target.value);
});
```

### Custom Markdown Processing

```javascript
const parser = new MarkdownParser();

// Parse custom markdown
const customMarkdown = `
# Custom Content
This content includes **custom** formatting.
`;

const html = parser.parse(customMarkdown);
document.getElementById('content').innerHTML = html;
```

### Building Static Site

```javascript
const builder = new StaticSiteBuilder({
  docsDir: './my-docs',
  outputDir: './public'
});

builder.build().then(() => {
  console.log('Site built successfully!');
});
```

## 🚀 Advanced Features

### Custom Themes

Override CSS variables for custom theming:

```css
:root {
  --primary-color: #e74c3c;
  --sidebar-width: 250px;
  --header-height: 70px;
}
```

### Plugin Architecture

Extend the markdown parser with custom rules:

```javascript
class CustomMarkdownParser extends MarkdownParser {
  constructor() {
    super();
    this.rules.customSyntax = /\[\[([^\]]+)\]\]/g;
  }
  
  parseInlineElements(text) {
    text = text.replace(this.rules.customSyntax, (match, content) => {
      return `<span class="custom">${content}</span>`;
    });
    return super.parseInlineElements(text);
  }
}
```

### Custom Navigation

Override navigation generation:

```javascript
class CustomDocsApp extends DocsApp {
  buildNavigationHTML(items) {
    // Custom navigation rendering
    return super.buildNavigationHTML(items);
  }
}
```

---

*This API reference covers all public methods and configurations. For implementation details, check the source code.*
