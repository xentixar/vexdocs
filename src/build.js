const fs = require('fs');
const path = require('path');

class StaticSiteBuilder {
    constructor(options = {}) {
        this.docsDir = options.docsDir || path.join(process.cwd(), 'docs');
        this.outputDir = options.outputDir || path.join(process.cwd(), 'dist');
        this.config = this.loadConfig();
    }

    loadConfig() {
        const configPath = path.join(this.docsDir, 'config.json');
        try {
            const configContent = fs.readFileSync(configPath, 'utf8');
            return JSON.parse(configContent);
        } catch (error) {
            console.warn('No config.json found, using defaults');
            return {
                title: 'Documentation',
                description: 'Project Documentation',
                baseUrl: 'http://localhost:3000',
                versions: { 'v1.0': 'Latest' },
                defaultVersion: 'v1.0',
                theme: {
                    primaryColor: '#007acc',
                    sidebarWidth: '300px'
                }
            };
        }
    }

    async build() {
        console.log('🏗️  Building static documentation site...');
        
        // Clean output directory
        this.cleanOutputDir();
        
        // Create output directory structure
        fs.mkdirSync(this.outputDir, { recursive: true });
        fs.mkdirSync(path.join(this.outputDir, 'assets'), { recursive: true });
        
        // Copy assets
        this.copyAssets();
        
        // Generate API endpoints as JSON files
        this.generateApiFiles();
        
        // Generate HTML pages for each route
        this.generatePages();
        
        // Generate sitemap.xml
        this.generateSitemap();
        
        // Generate robots.txt
        this.generateRobotsTxt();
        
        console.log('✅ Static site built successfully!');
        console.log(`📁 Output directory: ${this.outputDir}`);
    }

    cleanOutputDir() {
        if (fs.existsSync(this.outputDir)) {
            fs.rmSync(this.outputDir, { recursive: true, force: true });
        }
    }

    copyAssets() {
        const assetsDir = path.join(__dirname, '..', 'assets');
        const outputAssetsDir = path.join(this.outputDir, 'assets');
        
        this.copyDirectory(assetsDir, outputAssetsDir);
    }

    copyDirectory(src, dest) {
        if (!fs.existsSync(src)) return;
        
        fs.mkdirSync(dest, { recursive: true });
        
        const entries = fs.readdirSync(src, { withFileTypes: true });
        
        entries.forEach(entry => {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            
            if (entry.isDirectory()) {
                this.copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        });
    }

    generateApiFiles() {
        const apiDir = path.join(this.outputDir, 'api');
        fs.mkdirSync(apiDir, { recursive: true });
        
        // Generate config.json
        fs.writeFileSync(
            path.join(apiDir, 'config.json'),
            JSON.stringify(this.config, null, 2)
        );
        
        // Generate versions.json
        fs.writeFileSync(
            path.join(apiDir, 'versions.json'),
            JSON.stringify(Object.keys(this.config.versions), null, 2)
        );
        
        // Generate navigation and content for each version
        Object.keys(this.config.versions).forEach(version => {
            this.generateVersionFiles(version, apiDir);
        });
    }

    generateVersionFiles(version, apiDir) {
        // Generate navigation
        const navigation = this.buildNavigation(version);
        fs.writeFileSync(
            path.join(apiDir, `navigation-${version}.json`),
            JSON.stringify(navigation, null, 2)
        );
        
        // Generate content files
        this.generateContentFiles(version, apiDir);
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

        if (!folderOrder) {
            const readmeIndex = unorderedItems.findIndex(item => 
                item.type === 'file' && (item.path === 'README.md' || item.name === 'README')
            );
            if (readmeIndex !== -1) {
                orderedNavigation.push(unorderedItems[readmeIndex]);
                unorderedItems.splice(readmeIndex, 1);
            }
        }

        orderConfig.forEach(orderItem => {
            if (typeof orderItem === 'string') {
                const index = unorderedItems.findIndex(item => {
                    if (item.type === 'file') {
                        return item.path === orderItem || item.name === orderItem.replace('.md', '');
                    }
                    if (item.type === 'folder') {
                        return item.name === orderItem;
                    }
                    return false;
                });
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

    generateContentFiles(version, apiDir) {
        const versionDir = path.join(this.docsDir, version);
        const contentDir = path.join(apiDir, 'content', version);
        const seoDir = path.join(apiDir, 'seo', version);
        
        if (!fs.existsSync(versionDir)) return;
        
        fs.mkdirSync(contentDir, { recursive: true });
        fs.mkdirSync(seoDir, { recursive: true });
        
        this.processMarkdownFiles(versionDir, contentDir, seoDir, '');
    }

    processMarkdownFiles(sourceDir, outputDir, seoDir, relativePath) {
        const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
        
        entries.forEach(entry => {
            const sourcePath = path.join(sourceDir, entry.name);
            const entryRelativePath = path.join(relativePath, entry.name);
            
            if (entry.isDirectory()) {
                const subOutputDir = path.join(outputDir, entry.name);
                const subSeoDir = path.join(seoDir, entry.name);
                fs.mkdirSync(subOutputDir, { recursive: true });
                fs.mkdirSync(subSeoDir, { recursive: true });
                this.processMarkdownFiles(sourcePath, subOutputDir, subSeoDir, entryRelativePath);
            } else if (entry.name.endsWith('.md')) {
                const content = fs.readFileSync(sourcePath, 'utf8');
                const seoData = this.extractSEOFromMarkdown(sourcePath);
                
                // Generate content file
                const outputPath = path.join(outputDir, entry.name + '.json');
                fs.writeFileSync(outputPath, JSON.stringify({
                    content,
                    path: entryRelativePath
                }, null, 2));
                
                // Generate SEO file
                const seoOutputPath = path.join(seoDir, entry.name + '.json');
                
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
                
                fs.writeFileSync(seoOutputPath, JSON.stringify(seoData, null, 2));
            }
        });
    }

    generatePages() {
        // Generate index.html
        const indexHTML = this.generateHTML();
        fs.writeFileSync(path.join(this.outputDir, 'index.html'), indexHTML);
        
        // Generate pages for each version and path combination
        Object.keys(this.config.versions).forEach(version => {
            this.generateVersionPages(version);
        });
    }

    generateVersionPages(version) {
        const navigation = this.buildNavigation(version);
        const pages = this.extractPages(navigation);
        
        pages.forEach(page => {
            // Remove .md extension and create proper path
            let pagePath = page.path.replace(/\.md$/, '');
            
            // Special handling for README files - they should be at the directory root
            if (path.basename(pagePath) === 'README') {
                pagePath = path.dirname(pagePath);
                if (pagePath === '.') {
                    pagePath = version; // Root README goes to version root
                } else {
                    pagePath = path.join(version, path.dirname(pagePath));
                }
            } else {
                pagePath = path.join(version, pagePath);
            }
            
            const outputPath = path.join(this.outputDir, pagePath);
            
            // Create directory structure
            fs.mkdirSync(outputPath, { recursive: true });
            
            // Generate HTML
            const html = this.generateHTML();
            fs.writeFileSync(path.join(outputPath, 'index.html'), html);
        });
        
        const versionPath = path.join(this.outputDir, version);
        fs.mkdirSync(versionPath, { recursive: true });
        
        const versionIndexPath = path.join(versionPath, 'index.html');
        if (!fs.existsSync(versionIndexPath)) {
            fs.writeFileSync(versionIndexPath, this.generateHTML());
        }
    }

    extractPages(navigation) {
        const pages = [];
        
        navigation.forEach(item => {
            if (item.type === 'file') {
                pages.push(item);
            } else if (item.type === 'folder' && item.children) {
                pages.push(...this.extractPages(item.children));
            }
        });
        
        return pages;
    }

    generateHTML() {
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
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/main.css?v=1.0">
    
    <!-- Favicon and App Icons -->
    <link rel="icon" type="image/x-icon" href="/assets/images/favicon.ico">
    <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/favicon-16x16.png">
    <link rel="manifest" href="/assets/site.webmanifest">
    <meta name="theme-color" content="#2563eb">
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
    
    <script>
        // Override fetch for static site
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            if (url.startsWith('/api/')) {
                return handleStaticApiRequest(url);
            }
            return originalFetch(url, options);
        };
        
        async function handleStaticApiRequest(url) {
            const apiPath = url.replace('/api/', '');
            const [endpoint, ...params] = apiPath.split('?');
            const queryParams = new URLSearchParams(params.join('?'));
            
            let jsonUrl;
            
            switch (endpoint) {
                case 'config':
                    jsonUrl = '/api/config.json';
                    break;
                case 'versions':
                    jsonUrl = '/api/versions.json';
                    break;
                case 'navigation':
                    const version = queryParams.get('version') || '${this.config.defaultVersion}';
                    jsonUrl = \`/api/navigation-\${version}.json\`;
                    break;
                case 'content':
                    const contentVersion = queryParams.get('version') || '${this.config.defaultVersion}';
                    const contentPath = queryParams.get('path') || 'README.md';
                    jsonUrl = \`/api/content/\${contentVersion}/\${contentPath}.json\`;
                    break;
                case 'seo':
                    const seoVersion = queryParams.get('version') || '${this.config.defaultVersion}';
                    const seoPath = queryParams.get('path') || 'README.md';
                    jsonUrl = \`/api/seo/\${seoVersion}/\${seoPath}.json\`;
                    break;
                default:
                    throw new Error('API endpoint not found');
            }
            
            try {
                const response = await originalFetch(jsonUrl);
                if (!response.ok) {
                    throw new Error(\`HTTP error! status: \${response.status}\`);
                }
                return response;
            } catch (error) {
                // Fallback for missing files
                if (endpoint === 'content') {
                    return new Response(JSON.stringify({
                        content: '# Page Not Found\\n\\nThe requested page could not be found.',
                        path: queryParams.get('path') || 'README.md'
                    }), {
                        ok: true,
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    });
                } else if (endpoint === 'seo') {
                    return new Response(JSON.stringify({
                        title: 'Page Not Found',
                        description: 'The requested page could not be found.',
                        keywords: null,
                        author: null,
                        canonical: null,
                        ogTitle: 'Page Not Found',
                        ogDescription: 'The requested page could not be found.',
                        ogImage: null,
                        twitterCard: 'summary',
                        twitterTitle: 'Page Not Found',
                        twitterDescription: 'The requested page could not be found.',
                        twitterImage: null
                    }), {
                        ok: true,
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                throw error;
            }
        }
    </script>
    <script src="/assets/js/markdown-parser.js"></script>
    <script src="/assets/js/app.js"></script>
</body>
</html>`;
    }

    generateSitemap() {
        console.log('🗺️  Generating sitemap.xml...');
        
        const baseUrl = this.config.baseUrl || 'https://example.com';
        const urls = [];
        
        // Add main homepage
        urls.push({
            loc: baseUrl,
            priority: '1.0',
            changefreq: 'daily'
        });
        
        // Add version pages
        Object.keys(this.config.versions).forEach(version => {
            const navigation = this.buildNavigation(version);
            const pages = this.extractPages(navigation);
            
            // Add version homepage
            urls.push({
                loc: `${baseUrl}/${version}`,
                priority: '0.8',
                changefreq: 'weekly'
            });
            
            // Add all pages for this version
            pages.forEach(page => {
                let pagePath = page.path.replace(/\.md$/, '');
                
                // Special handling for README files
                if (path.basename(pagePath) === 'README') {
                    pagePath = path.dirname(pagePath);
                    if (pagePath === '.') {
                        return; // Skip root README as it's already added as version homepage
                    } else {
                        pagePath = path.join(version, path.dirname(pagePath));
                    }
                } else {
                    pagePath = path.join(version, pagePath);
                }
                
                urls.push({
                    loc: `${baseUrl}/${pagePath}`,
                    priority: '0.7',
                    changefreq: 'weekly'
                });
            });
        });
        
        // Generate XML sitemap
        const sitemap = this.generateSitemapXml(urls);
        fs.writeFileSync(path.join(this.outputDir, 'sitemap.xml'), sitemap);
    }

    generateSitemapXml(urls) {
        const urlElements = urls.map(url => {
            const lastmod = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
            return `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
        }).join('\n');

        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
    }

    generateRobotsTxt() {
        console.log('🤖 Generating robots.txt...');
        
        const baseUrl = this.config.baseUrl || 'https://example.com';
        const robotsContent = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow API endpoints from indexing
Disallow: /api/

# Allow assets
Allow: /assets/`;

        fs.writeFileSync(path.join(this.outputDir, 'robots.txt'), robotsContent);
    }
}

// Run the builder
if (require.main === module) {
    const builder = new StaticSiteBuilder();
    builder.build().catch(error => {
        console.error('Build failed:', error);
        process.exit(1);
    });
}

module.exports = StaticSiteBuilder;
