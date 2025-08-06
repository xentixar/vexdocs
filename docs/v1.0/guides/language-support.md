---
title: "Language Support Guide"
description: "Comprehensive guide to supported programming languages and syntax highlighting features in Vexdocs v1.0"
keywords: "syntax highlighting, programming languages, PHP, JavaScript, TypeScript, Python, Java, CSS, HTML, JSON, Bash"
---

# 🌟 Language Support Guide

Vexdocs v1.0 provides comprehensive syntax highlighting for a wide range of programming languages. This guide showcases the supported languages and their highlighting features.

### PHP Syntax Highlighting

Vexdocs now includes full PHP syntax highlighting with support for:

- **Keywords**: All PHP reserved words and language constructs
- **Variables**: `$variable` syntax highlighting
- **Functions**: Function names and calls
- **Comments**: Single-line (`//`) and multi-line (`/* */`) comments
- **Strings**: Single and double quoted strings
- **Numbers**: Integer and floating-point numbers

```php
<?php
// PHP example with comprehensive syntax highlighting
class UserController {
    private $userService;
    
    public function __construct(UserService $userService) {
        $this->userService = $userService;
    }
    
    public function createUser(array $userData): User {
        try {
            $user = new User();
            $user->setName($userData['name']);
            $user->setEmail($userData['email']);
            
            return $this->userService->save($user);
        } catch (Exception $e) {
            throw new UserCreationException(
                "Failed to create user: " . $e->getMessage()
            );
        }
    }
    
    public function getUserById(int $id): ?User {
        return $this->userService->findById($id);
    }
}
?>
```

## 🚀 Enhanced Language Support

### JavaScript & TypeScript

**JavaScript Features:**
- Complete keyword highlighting
- Template literals: `` `Hello ${name}` ``
- Function declarations and calls
- String interpolation
- Modern ES6+ syntax

```javascript
// Modern JavaScript with enhanced highlighting
class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.cache = new Map();
    }
    
    async fetchData(endpoint) {
        const cacheKey = `${this.baseUrl}${endpoint}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        try {
            const response = await fetch(cacheKey);
            const data = await response.json();
            this.cache.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error(`Failed to fetch: ${error.message}`);
            throw new Error(`API request failed: ${error.message}`);
        }
    }
    
    static create(baseUrl) {
        return new ApiClient(baseUrl);
    }
}
```

**TypeScript Features:**
- Type annotations and interfaces
- Generic types
- Decorators
- Advanced type system support

```typescript
// TypeScript with comprehensive highlighting
interface User {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
}

@Injectable()
class UserService {
    private users: Map<number, User> = new Map();
    
    async createUser(userData: Partial<User>): Promise<User> {
        const user: User = {
            id: this.generateId(),
            name: userData.name || '',
            email: userData.email || '',
            isActive: userData.isActive ?? true
        };
        
        this.users.set(user.id, user);
        return user;
    }
    
    getUserById(id: number): User | undefined {
        return this.users.get(id);
    }
    
    private generateId(): number {
        return Math.floor(Math.random() * 1000000);
    }
}
```

### Python

**Python Features:**
- All Python keywords and built-ins
- Decorators (`@decorator`)
- Function and class definitions
- String formatting
- Type hints (Python 3.5+)

```python
# Python with enhanced syntax highlighting
from typing import List, Optional, Dict, Any
from dataclasses import dataclass
import asyncio
import logging

@dataclass
class User:
    id: int
    name: str
    email: str
    is_active: bool = True
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'is_active': self.is_active
        }

class UserService:
    def __init__(self, db_connection):
        self.db = db_connection
        self.logger = logging.getLogger(__name__)
    
    async def create_user(self, user_data: Dict[str, Any]) -> User:
        try:
            user = User(
                id=await self._generate_id(),
                name=user_data.get('name', ''),
                email=user_data.get('email', ''),
                is_active=user_data.get('is_active', True)
            )
            
            await self._save_user(user)
            self.logger.info(f"Created user: {user.name}")
            return user
            
        except Exception as e:
            self.logger.error(f"Failed to create user: {e}")
            raise UserCreationError(f"Failed to create user: {e}")
    
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        return await self._fetch_user(user_id)
```

### Java

**Java Features:**
- Complete Java syntax highlighting
- Annotations (`@Annotation`)
- Generics and type parameters
- Access modifiers
- Exception handling

```java
// Java with comprehensive highlighting
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserService userService;
    private final Logger logger = LoggerFactory.getLogger(UserController.class);
    
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @PostMapping
    public CompletableFuture<ResponseEntity<User>> createUser(
            @RequestBody @Valid CreateUserRequest request) {
        
        return userService.createUser(request)
            .thenApply(user -> {
                logger.info("Created user: {}", user.getName());
                return ResponseEntity.status(HttpStatus.CREATED)
                    .body(user);
            })
            .exceptionally(throwable -> {
                logger.error("Failed to create user", throwable);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
            });
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.findById(id);
        return user.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
}
```

### CSS

**CSS Features:**
- All CSS properties and values
- Pseudo-classes (`:hover`, `:focus`)
- Pseudo-elements (`::before`, `::after`)
- CSS selectors
- Media queries

```css
/* CSS with comprehensive highlighting */
.container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.button {
    position: relative;
    padding: 0.75rem 1.5rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.button:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.button:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

.button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.button:hover::before {
    opacity: 1;
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
        gap: 0.75rem;
    }
    
    .button {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
    }
}
```

### HTML

**HTML Features:**
- All HTML5 elements
- Attributes and values
- DOCTYPE declarations
- Comments and structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vexdocs - Language Support</title>
    <link rel="stylesheet" href="/assets/css/main.css">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav-brand">
                <img src="/logo.svg" alt="Vexdocs Logo" class="logo">
                <span class="brand-text">Vexdocs</span>
            </div>
            <ul class="nav-menu">
                <li><a href="/docs" class="nav-link">Documentation</a></li>
                <li><a href="/api" class="nav-link">API</a></li>
                <li><a href="/examples" class="nav-link">Examples</a></li>
            </ul>
        </nav>
    </header>
    
    <main class="main-content">
        <article class="content">
            <h1>Language Support Guide</h1>
            <p>Comprehensive syntax highlighting for modern web development.</p>
            
            <section class="code-examples">
                <h2>Code Examples</h2>
                <!-- Code blocks will be highlighted automatically -->
            </section>
        </article>
    </main>
    
    <footer class="footer">
        <p>&copy; 2024 Vexdocs. All rights reserved.</p>
    </footer>
    
    <script src="/assets/js/app.js"></script>
</body>
</html>
```

### JSON

**JSON Features:**
- Syntax highlighting for JSON structure
- Proper highlighting of keys, values, and punctuation
- Support for nested objects and arrays

```json
{
    "name": "vexdocs",
    "version": "1.0.0",
    "description": "Modern documentation tool with multi-version support",
    "keywords": [
        "documentation",
        "markdown",
        "static-site-generator",
        "multi-version"
    ],
    "author": {
        "name": "Xentixar",
        "email": "contact@vexdocs.dev"
    },
    "repository": {
        "type": "git",
        "url": "https://github.com/xentixar/vexdocs.git"
    },
    "scripts": {
        "start": "./vexdocs serve",
        "build": "./vexdocs build",
        "dev": "./vexdocs dev"
    },
    "engines": {
        "node": ">=12.0.0"
    },
    "license": "MIT"
}
```

### Bash/Shell

**Bash Features:**
- Shell commands and built-ins
- Variable expansion (`$variable`)
- Control structures
- Operators and redirections

```bash
#!/bin/bash

# Enhanced bash syntax highlighting
set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="${SCRIPT_DIR}/dist"
SOURCE_DIR="${SCRIPT_DIR}/src"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Main build function
build_project() {
    log_info "Starting build process..."
    
    if [[ ! -d "$SOURCE_DIR" ]]; then
        log_error "Source directory not found: $SOURCE_DIR"
        exit 1
    fi
    
    # Clean previous build
    if [[ -d "$BUILD_DIR" ]]; then
        log_info "Cleaning previous build..."
        rm -rf "$BUILD_DIR"
    fi
    
    # Create build directory
    mkdir -p "$BUILD_DIR"
    
    # Copy source files
    log_info "Copying source files..."
    cp -r "$SOURCE_DIR"/* "$BUILD_DIR/"
    
    # Run build steps
    for step in "compile" "optimize" "bundle"; do
        if [[ -f "${SCRIPT_DIR}/scripts/${step}.sh" ]]; then
            log_info "Running ${step} step..."
            bash "${SCRIPT_DIR}/scripts/${step}.sh"
        fi
    done
    
    log_info "Build completed successfully!"
}

# Main execution
main() {
    case "${1:-}" in
        "build")
            build_project
            ;;
        "clean")
            log_info "Cleaning build artifacts..."
            rm -rf "$BUILD_DIR"
            ;;
        "test")
            log_info "Running tests..."
            # Add test execution here
            ;;
        *)
            echo "Usage: $0 {build|clean|test}"
            exit 1
            ;;
    esac
}

# Execute main function with all arguments
main "$@"
```

## 🎨 Syntax Highlighting Features

### Supported Token Types

Vexdocs provides comprehensive syntax highlighting with the following token types:

- **Keywords**: Language-specific reserved words
- **Strings**: String literals and text
- **Comments**: Single-line and multi-line comments
- **Numbers**: Numeric literals
- **Functions**: Function names and calls
- **Variables**: Variable declarations and references
- **Types**: Type annotations and declarations
- **Decorators**: Function and class decorators
- **Annotations**: Code annotations and metadata
- **Selectors**: CSS selectors and rules
- **Pseudo-classes**: CSS pseudo-class selectors
- **Pseudo-elements**: CSS pseudo-element selectors
- **Attributes**: HTML attributes
- **Tags**: HTML element tags
- **Doctype**: HTML DOCTYPE declarations
- **Punctuation**: Code punctuation and symbols
- **Operators**: Language operators and symbols
- **Template Literals**: JavaScript template strings

### Color Scheme

The syntax highlighting uses a carefully designed color scheme:

- **Keywords**: Blue (`#0066cc`) - Language reserved words
- **Strings**: Green (`#008000`) - String literals
- **Comments**: Gray (`#6a737d`) - Comments with italic style
- **Numbers**: Red (`#d73a49`) - Numeric values
- **Functions**: Purple (`#6f42c1`) - Function names
- **Variables**: Blue (`#005cc5`) - Variable references
- **Types**: Purple (`#6f42c1`) - Type annotations
- **Selectors**: Orange (`#e36209`) - CSS selectors
- **Attributes**: Purple (`#6f42c1`) - HTML attributes
- **Tags**: Green (`#22863a`) - HTML element tags
- **Punctuation**: Gray (`#586069`) - Code symbols

## 🔧 Customization

### Adding Custom Languages

To add support for additional languages, you can extend the `languagePatterns` object in the markdown parser:

```javascript
// Example: Adding Rust support
rust: {
    keywords: /\b(fn|let|mut|const|static|struct|enum|impl|trait|use|mod|pub|extern|crate|as|break|continue|else|if|match|return|while|for|in|loop|where|type|dyn|unsafe|async|await|move|ref|self|Self|super|true|false|None|Some)\b/g,
    strings: /(["'])(?:(?!\1)[^\\]|\\.)*\1/g,
    comments: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
    numbers: /\b\d+\.?\d*\b/g,
    functions: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g,
    macros: /\b([a-zA-Z_][a-zA-Z0-9_]*!)/g
}
```

### Custom CSS Styling

You can customize the syntax highlighting colors by overriding the CSS classes:

```css
/* Custom syntax highlighting colors */
.syntax-keyword {
    color: #your-color;
    font-weight: 600;
}

.syntax-string {
    color: #your-color;
}

.syntax-comment {
    color: #your-color;
    font-style: italic;
}
```

## 📚 Best Practices

### Code Block Guidelines

1. **Always specify the language** for proper syntax highlighting
2. **Use descriptive language identifiers** (e.g., `javascript`, `typescript`, `python`)
3. **Keep code examples focused** and relevant to the documentation
4. **Include comments** to explain complex code sections
5. **Use consistent formatting** across all code examples

### Language-Specific Tips

- **JavaScript/TypeScript**: Use modern ES6+ syntax when possible
- **Python**: Include type hints for better code clarity
- **PHP**: Use proper namespacing and modern PHP 7.4+ features
- **CSS**: Include vendor prefixes and fallbacks where necessary
- **HTML**: Use semantic HTML5 elements and proper accessibility attributes
- **JSON**: Validate your JSON examples for correctness
- **Bash**: Include error handling and proper exit codes

## 🚀 Performance

The syntax highlighting system is optimized for:

- **Fast parsing**: Efficient regex patterns and token matching
- **Memory efficiency**: Minimal memory footprint for large code blocks
- **Browser compatibility**: Works across all modern browsers
- **Accessibility**: Proper contrast ratios and screen reader support

## 📖 Additional Resources

- [Markdown Guide](markdown-guide.md) - Complete markdown syntax reference
- [Configuration Guide](configuration.md) - Customizing Vexdocs settings
- [Deployment Guide](deployment.md) - Deploying your documentation
- [API Reference](../api-reference.md) - Complete API documentation

---

*This guide demonstrates the comprehensive language support available in Vexdocs v1.0. The syntax highlighting system is designed to provide clear, readable code examples that enhance the documentation experience.* 