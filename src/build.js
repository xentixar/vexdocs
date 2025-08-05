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

        return this.buildDirectoryTree(versionDir, version);
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
                    items.push({
                        type: 'file',
                        name: entry.name.replace('.md', ''),
                        path: itemRelativePath
                    });
                }
            });
        } catch (error) {
            console.error('Error building directory tree:', error);
        }
        
        return items;
    }

    generateContentFiles(version, apiDir) {
        const versionDir = path.join(this.docsDir, version);
        const contentDir = path.join(apiDir, 'content', version);
        
        if (!fs.existsSync(versionDir)) return;
        
        fs.mkdirSync(contentDir, { recursive: true });
        
        this.processMarkdownFiles(versionDir, contentDir, '');
    }

    processMarkdownFiles(sourceDir, outputDir, relativePath) {
        const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
        
        entries.forEach(entry => {
            const sourcePath = path.join(sourceDir, entry.name);
            const entryRelativePath = path.join(relativePath, entry.name);
            
            if (entry.isDirectory()) {
                const subOutputDir = path.join(outputDir, entry.name);
                fs.mkdirSync(subOutputDir, { recursive: true });
                this.processMarkdownFiles(sourcePath, subOutputDir, entryRelativePath);
            } else if (entry.name.endsWith('.md')) {
                const content = fs.readFileSync(sourcePath, 'utf8');
                const outputPath = path.join(outputDir, entry.name + '.json');
                
                fs.writeFileSync(outputPath, JSON.stringify({
                    content,
                    path: entryRelativePath
                }, null, 2));
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
            const pagePath = `${version}/${page.path.replace('.md', '')}`;
            const outputPath = path.join(this.outputDir, pagePath);
            
            // Create directory structure
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            
            // Generate HTML
            const html = this.generateHTML();
            fs.writeFileSync(path.join(outputPath, 'index.html'), html);
        });
        
        // Generate version root page
        const versionPath = path.join(this.outputDir, version);
        fs.mkdirSync(versionPath, { recursive: true });
        fs.writeFileSync(path.join(versionPath, 'index.html'), this.generateHTML());
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
    <title>${this.config.title}</title>
    <meta name="description" content="${this.config.description}">
    <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
    <div id="app">
        <header class="header">
            <div class="header-content">
                <h1 class="header-title">${this.config.title}</h1>
                <div class="version-selector">
                    <select id="versionSelect">
                        <!-- Versions will be populated by JavaScript -->
                    </select>
                </div>
            </div>
        </header>
        
        <div class="container">
            <aside class="sidebar">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Search documentation...">
                </div>
                <nav class="navigation" id="navigation">
                    <!-- Navigation will be populated by JavaScript -->
                </nav>
            </aside>
            
            <main class="content">
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
