const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

class DocsServer {
    constructor(options = {}) {
        this.port = options.port || 3000;
        this.docsDir = options.docsDir || path.join(process.cwd(), 'docs');
        this.isDev = options.isDev || false;
        this.config = this.loadConfig();
    }

    loadConfig() {
        const configPath = path.join(this.docsDir, 'config.json');
        try {
            const configContent = fs.readFileSync(configPath, 'utf8');
            return JSON.parse(configContent);
        } catch (error) {
            return {
                title: 'Documentation',
                description: 'Project Documentation',
                versions: { 'v1.0': 'Latest' },
                defaultVersion: 'v1.0',
                theme: {
                    primaryColor: '#007acc',
                    sidebarWidth: '300px'
                }
            };
        }
    }

    getContentType(filePath) {
        const ext = path.extname(filePath);
        const types = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.md': 'text/markdown',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml'
        };
        return types[ext] || 'text/plain';
    }

    async handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;

        try {
            // Handle API endpoints
            if (pathname.startsWith('/api/')) {
                return this.handleApiRequest(pathname, parsedUrl.query, res);
            }

            // Handle static assets
            if (pathname.startsWith('/assets/')) {
                return this.handleStaticFile(pathname, res);
            }

            // Handle documentation pages
            return this.handleDocumentationRequest(pathname, res);
        } catch (error) {
            console.error('Request error:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    }

    handleApiRequest(pathname, query, res) {
        const apiPath = pathname.replace('/api/', '');

        switch (apiPath) {
            case 'config':
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(this.config));
                break;

            case 'versions':
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(Object.keys(this.config.versions)));
                break;

            case 'navigation':
                const version = query.version || this.config.defaultVersion;
                const navigation = this.buildNavigation(version);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(navigation));
                break;

            case 'content':
                const contentVersion = query.version || this.config.defaultVersion;
                const contentPath = query.path || 'README.md';
                const content = this.getMarkdownContent(contentVersion, contentPath);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ content, path: contentPath }));
                break;

            case 'seo':
                const seoVersion = query.version || this.config.defaultVersion;
                const seoPath = query.path || 'README.md';
                const seoData = this.getSEOData(seoVersion, seoPath);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(seoData));
                break;

            default:
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('API endpoint not found');
        }
    }

    handleStaticFile(pathname, res) {
        const filePath = path.join(__dirname, '..', pathname);
        
        if (!fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
            return;
        }

        const contentType = this.getContentType(filePath);
        const fileContent = fs.readFileSync(filePath);
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(fileContent);
    }

    handleDocumentationRequest(pathname, res) {
        // Serve the main application HTML for all documentation routes
        const htmlContent = this.generateMainHTML();
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlContent);
    }

    buildNavigation(version) {
        const versionDir = path.join(this.docsDir, version);
        
        if (!fs.existsSync(versionDir)) {
            return [];
        }

        const navigation = this.buildDirectoryTree(versionDir, version);
        return this.applySidebarOrder(navigation, version);
    }

    applySidebarOrder(navigation, version, folderOrder = null) {
        if (!this.config.sidebarOrder || !this.config.sidebarOrder[version]) {
            return navigation;
        }

        const orderConfig = folderOrder || this.config.sidebarOrder[version];
        const orderedNavigation = [];
        const unorderedItems = [...navigation];

        const readmeIndex = unorderedItems.findIndex(item => 
            item.type === 'file' && (item.path === 'README.md' || item.name === 'README')
        );
        if (readmeIndex !== -1) {
            orderedNavigation.push(unorderedItems[readmeIndex]);
            unorderedItems.splice(readmeIndex, 1);
        }

        orderConfig.forEach(orderItem => {
            if (typeof orderItem === 'string') {
                const index = unorderedItems.findIndex(item => 
                    (item.type === 'file' && item.path === orderItem) ||
                    (item.type === 'folder' && item.name === orderItem)
                );
                if (index !== -1) {
                    orderedNavigation.push(unorderedItems[index]);
                    unorderedItems.splice(index, 1);
                }
            } else if (orderItem.folder && orderItem.items) {
                const folderIndex = unorderedItems.findIndex(item => 
                    item.type === 'folder' && item.name === orderItem.folder
                );
                if (folderIndex !== -1) {
                    const folder = unorderedItems[folderIndex];
                    folder.children = this.applySidebarOrder(folder.children, version, orderItem.items);
                    orderedNavigation.push(folder);
                    unorderedItems.splice(folderIndex, 1);
                }
            }
        });

        orderedNavigation.push(...unorderedItems);
        return orderedNavigation;
    }

    buildDirectoryTree(dirPath, version, relativePath = '') {
        const items = [];
        
        try {
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });
            
            entries.forEach(entry => {
                if (entry.name.startsWith('.')) return;
                
                const fullPath = path.join(dirPath, entry.name);
                const itemRelativePath = path.join(relativePath, entry.name);
                
                if (entry.isDirectory()) {
                    items.push({
                        type: 'folder',
                        name: entry.name,
                        path: itemRelativePath,
                        children: this.buildDirectoryTree(fullPath, version, itemRelativePath)
                    });
                } else if (entry.name.endsWith('.md')) {
                    const title = this.extractTitleFromMarkdown(fullPath);
                    items.push({
                        type: 'file',
                        name: entry.name.replace('.md', ''),
                        title: title,
                        path: itemRelativePath
                    });
                }
            });
        } catch (error) {
            console.error('Error building directory tree:', error);
        }
        
        return items;
    }

    extractTitleFromMarkdown(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Check for frontmatter title
            const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
            if (frontmatterMatch) {
                const frontmatter = frontmatterMatch[1];
                const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
                if (titleMatch) {
                    return titleMatch[1].trim().replace(/^["']|["']$/g, '');
                }
            }
            
            // Check for first H1 heading
            const h1Match = content.match(/^#\s+(.+)$/m);
            if (h1Match) {
                return h1Match[1].trim();
            }
            
            return null;
        } catch (error) {
            console.error('Error extracting title from markdown:', error);
            return null;
        }
    }

    extractSEOFromMarkdown(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const seo = {
                title: null,
                description: null,
                keywords: null,
                author: null,
                canonical: null,
                ogTitle: null,
                ogDescription: null,
                ogImage: null,
                twitterCard: null,
                twitterTitle: null,
                twitterDescription: null,
                twitterImage: null
            };
            
            // Check for frontmatter
            const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
            if (frontmatterMatch) {
                const frontmatter = frontmatterMatch[1];
                
                // Extract SEO fields from frontmatter
                const fields = {
                    title: /^(?:title|seo_title):\s*(.+)$/m,
                    description: /^(?:description|seo_description):\s*(.+)$/m,
                    keywords: /^(?:keywords|seo_keywords):\s*(.+)$/m,
                    author: /^author:\s*(.+)$/m,
                    canonical: /^canonical:\s*(.+)$/m,
                    ogTitle: /^og_title:\s*(.+)$/m,
                    ogDescription: /^og_description:\s*(.+)$/m,
                    ogImage: /^og_image:\s*(.+)$/m,
                    twitterCard: /^twitter_card:\s*(.+)$/m,
                    twitterTitle: /^twitter_title:\s*(.+)$/m,
                    twitterDescription: /^twitter_description:\s*(.+)$/m,
                    twitterImage: /^twitter_image:\s*(.+)$/m
                };
                
                Object.keys(fields).forEach(key => {
                    const match = frontmatter.match(fields[key]);
                    if (match) {
                        seo[key] = match[1].trim().replace(/^["']|["']$/g, '');
                    }
                });
            }
            
            // Fallback to first H1 for title if not in frontmatter
            if (!seo.title) {
                const h1Match = content.match(/^#\s+(.+)$/m);
                if (h1Match) {
                    seo.title = h1Match[1].trim();
                }
            }
            
            // Generate description from first paragraph if not provided
            if (!seo.description) {
                const contentWithoutFrontmatter = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
                const paragraphMatch = contentWithoutFrontmatter.match(/^(?!#)(.*?)(?:\n\n|\n#|$)/m);
                if (paragraphMatch && paragraphMatch[1].trim()) {
                    seo.description = paragraphMatch[1].trim().substring(0, 160);
                }
            }
            
            return seo;
        } catch (error) {
            console.error('Error extracting SEO from markdown:', error);
            return {};
        }
    }

    getMarkdownContent(version, filePath) {
        const fullPath = path.join(this.docsDir, version, filePath);
        
        try {
            if (fs.existsSync(fullPath)) {
                return fs.readFileSync(fullPath, 'utf8');
            } else if (!filePath.endsWith('.md')) {
                // Try adding .md extension
                const mdPath = fullPath + '.md';
                if (fs.existsSync(mdPath)) {
                    return fs.readFileSync(mdPath, 'utf8');
                }
            }
        } catch (error) {
            console.error('Error reading markdown file:', error);
        }
        
        return '# Page Not Found\n\nThe requested page could not be found.';
    }

    getSEOData(version, filePath) {
        const fullPath = path.join(this.docsDir, version, filePath);
        let actualPath = fullPath;
        
        try {
            if (fs.existsSync(fullPath)) {
                actualPath = fullPath;
            } else if (!filePath.endsWith('.md')) {
                // Try adding .md extension
                const mdPath = fullPath + '.md';
                if (fs.existsSync(mdPath)) {
                    actualPath = mdPath;
                } else {
                    // Return default SEO data for non-existent files
                    return {
                        title: 'Page Not Found',
                        description: 'The requested page could not be found.',
                        keywords: null,
                        author: null,
                        canonical: null,
                        ogTitle: null,
                        ogDescription: null,
                        ogImage: null,
                        twitterCard: null,
                        twitterTitle: null,
                        twitterDescription: null,
                        twitterImage: null
                    };
                }
            }
            
            const seoData = this.extractSEOFromMarkdown(actualPath);
            
            // Set fallbacks
            if (!seoData.title) {
                seoData.title = this.config.title;
            }
            if (!seoData.description) {
                seoData.description = this.config.description;
            }
            
            // Set OpenGraph and Twitter fallbacks
            seoData.ogTitle = seoData.ogTitle || seoData.title;
            seoData.ogDescription = seoData.ogDescription || seoData.description;
            seoData.twitterTitle = seoData.twitterTitle || seoData.title;
            seoData.twitterDescription = seoData.twitterDescription || seoData.description;
            seoData.twitterCard = seoData.twitterCard || 'summary';
            
            return seoData;
        } catch (error) {
            console.error('Error getting SEO data:', error);
            return {
                title: this.config.title,
                description: this.config.description,
                keywords: null,
                author: null,
                canonical: null,
                ogTitle: this.config.title,
                ogDescription: this.config.description,
                ogImage: null,
                twitterCard: 'summary',
                twitterTitle: this.config.title,
                twitterDescription: this.config.description,
                twitterImage: null
            };
        }
    }

    generateMainHTML() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="pageTitle">${this.config.title}</title>
    <meta id="pageDescription" name="description" content="${this.config.description}">
    <meta id="pageKeywords" name="keywords" content="">
    <meta id="pageAuthor" name="author" content="">
    <link id="pageCanonical" rel="canonical" href="">
    
    <!-- Open Graph / Facebook -->
    <meta id="ogType" property="og:type" content="website">
    <meta id="ogUrl" property="og:url" content="">
    <meta id="ogTitle" property="og:title" content="${this.config.title}">
    <meta id="ogDescription" property="og:description" content="${this.config.description}">
    <meta id="ogImage" property="og:image" content="/assets/images/logo.svg">
    <meta property="og:site_name" content="${this.config.title}">
    
    <!-- Twitter -->
    <meta id="twitterCard" property="twitter:card" content="summary">
    <meta id="twitterUrl" property="twitter:url" content="">
    <meta id="twitterTitle" property="twitter:title" content="${this.config.title}">
    <meta id="twitterDescription" property="twitter:description" content="${this.config.description}">
    <meta id="twitterImage" property="twitter:image" content="/assets/images/logo.svg">
    
    <!-- Favicon and App Icons -->
    <link rel="icon" type="image/x-icon" href="/assets/images/favicon.ico">
    <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/favicon-16x16.png">
    <link rel="manifest" href="/assets/site.webmanifest">
    <meta name="theme-color" content="#2563eb">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
    <div id="app">
        <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle navigation menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        </button>
        
        <header class="header">
            <div class="header-content">
                <div class="header-title">
                    <a href="/" class="header-link">
                        <img src="/assets/images/logo.svg" alt="${this.config.title}" class="header-logo" width="40" height="40">
                        <span class="header-text">${this.config.title}</span>
                    </a>
                </div>
                <div class="version-selector">
                    <select id="versionSelect" aria-label="Select documentation version">
                        <!-- Versions will be populated by JavaScript -->
                    </select>
                </div>
            </div>
        </header>
        
        <div class="container">
            <aside class="sidebar" id="sidebar">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Search documentation..." aria-label="Search documentation">
                </div>
                <nav class="navigation" id="navigation" role="navigation" aria-label="Documentation navigation">
                    <!-- Navigation will be populated by JavaScript -->
                </nav>
            </aside>
            
            <main class="content" role="main">
                <div class="content-wrapper">
                    <div id="markdownContent" class="markdown-content">
                        <!-- Content will be populated by JavaScript -->
                    </div>
                </div>
            </main>
        </div>
    </div>
    
    <script src="/assets/js/markdown-parser.js"></script>
    <script src="/assets/js/app.js"></script>
</body>
</html>`;
    }



    start() {
        const server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        server.listen(this.port, () => {
            console.log(`\n📚 ${this.config.title} server running at http://localhost:${this.port}`);
            console.log(`📁 Serving docs from: ${this.docsDir}`);
            console.log(`🎨 Professional UI enabled`);
            if (this.isDev) {
                console.log('🔧 Development mode enabled');
            }
            console.log(`\n🚀 Ready to create amazing documentation!\n`);
        });
    }
}

// Start the server
const isDev = process.argv.includes('--dev');
const server = new DocsServer({ isDev });
server.start();
