const fs = require('fs');
const path = require('path');

const MarkdownParser = require('../assets/js/markdown-parser.js');

class PrerenderBuilder {
    constructor(options = {}) {
        this.docsDir = options.docsDir || path.join(process.cwd(), 'docs');
        this.outputDir = options.outputDir || path.join(process.cwd(), 'dist');
        this.config = this.loadConfig();
        this.markdownParser = new MarkdownParser();
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
        console.log('🚀 Building prerendered documentation site...');
        
        // Clean output directory
        this.cleanOutputDir();
        
        // Create output directory structure
        fs.mkdirSync(this.outputDir, { recursive: true });
        fs.mkdirSync(path.join(this.outputDir, 'assets'), { recursive: true });
        
        // Copy assets
        this.copyAssets();
        
        // Generate prerendered HTML pages for each route
        await this.generatePrerenderPages();
        
        // Generate sitemap.xml
        this.generateSitemap();
        
        // Generate robots.txt
        this.generateRobotsTxt();
        
        console.log('✅ Prerendered site built successfully!');
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
        
        this.generatePrerenderApp();
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

    generatePrerenderApp() {
        const outputAppJsPath = path.join(this.outputDir, 'assets', 'js', 'app-prerendered.js');
        
        // Write a simple prerendered app directly without template literals
        const appCode = [
            '/**',
            ' * Prerendered App JavaScript',
            ' * Dedicated app for prerendered VexDocs sites - no API calls!',
            ' */',
            '',
            'class PrerenderDocsApp {',
            '    constructor() {',
            '        this.config = null;',
            '        this.currentVersion = null;',
            '        this.currentPath = "README.md";',
            '        this.navigation = [];',
            '        this.init();',
            '    }',
            '',
            '    async init() {',
            '        try {',
            '            this.loadPrerenderedData();',
            '            this.setupVersionSelector();',
            '            this.setupNavigation();',
            '            this.setupSearch();',
            '            this.setupMobileMenu();',
            '            this.setupKeyboardNavigation();',
            '            this.setupInitialState();',
            '        } catch (error) {',
            '            console.error("Failed to initialize prerendered app:", error);',
            '        }',
            '    }',
            '',
            '    loadPrerenderedData() {',
            '        if (window.__PRERENDERED_DATA__) {',
            '            this.config = window.__PRERENDERED_DATA__.config;',
            '            this.currentVersion = window.__PRERENDERED_DATA__.version;',
            '            this.currentPath = window.__PRERENDERED_DATA__.path;',
            '            this.navigation = window.__PRERENDERED_DATA__.navigation;',
            '            this.applyTheme();',
            '        }',
            '    }',
            '',
            '    applyTheme() {',
            '        if (this.config && this.config.theme) {',
            '            const root = document.documentElement;',
            '            if (this.config.theme.primaryColor) {',
            '                root.style.setProperty("--primary-color", this.config.theme.primaryColor);',
            '            }',
            '            if (this.config.theme.sidebarWidth) {',
            '                root.style.setProperty("--sidebar-width", this.config.theme.sidebarWidth);',
            '            }',
            '        }',
            '    }',
            '',
            '    setupVersionSelector() {',
            '        const versionSelect = document.getElementById("versionSelect");',
            '        if (versionSelect) {',
            '            versionSelect.addEventListener("change", (e) => {',
            '                this.changeVersion(e.target.value);',
            '            });',
            '        }',
            '    }',
            '',
            '    changeVersion(version) {',
            '        const currentPath = this.currentPath === "README.md" ? "" : this.currentPath.replace(".md", "");',
            '        const newUrl = "/" + version + (currentPath ? "/" + currentPath : "");',
            '        window.location.href = newUrl;',
            '    }',
            '',
            '    setupNavigation() {',
            '        const navigationEl = document.getElementById("navigation");',
            '        if (navigationEl) {',
            '            navigationEl.addEventListener("click", (e) => {',
            '                if (e.target.classList.contains("nav-link")) {',
            '                    e.preventDefault();',
            '                    const path = e.target.dataset.path;',
            '                    this.navigateToPath(path);',
            '                }',
            '                if (e.target.classList.contains("folder-toggle")) {',
            '                    e.preventDefault();',
            '                    const folder = e.target.closest(".nav-folder");',
            '                    if (folder) {',
            '                        folder.classList.toggle("expanded");',
            '                    }',
            '                }',
            '            });',
            '        }',
            '    }',
            '',
            '    navigateToPath(path) {',
            '        if (path === this.currentPath) return;',
            '',
            '        let href = path.replace(/\\.md$/, "");',
            '        if (path === "README.md") {',
            '            href = "/" + this.currentVersion;',
            '        } else if (href.endsWith("/README")) {',
            '            href = href.replace("/README", "");',
            '            href = "/" + this.currentVersion + "/" + href;',
            '        } else {',
            '            href = "/" + this.currentVersion + "/" + href;',
            '        }',
            '        window.location.href = href;',
            '    }',
            '',
            '    setupInitialState() {',
            '        this.updateActiveNavigation();',
            '    }',
            '',
            '    updateActiveNavigation() {',
            '        document.querySelectorAll(".nav-link").forEach(link => {',
            '            link.classList.remove("active");',
            '            if (link.getAttribute("data-path") === this.currentPath) {',
            '                link.classList.add("active");',
            '            }',
            '        });',
            '    }',
            '',
            '    setupSearch() {',
            '        const searchInput = document.getElementById("searchInput");',
            '        if (searchInput) {',
            '            let searchTimeout;',
            '            searchInput.addEventListener("input", (e) => {',
            '                clearTimeout(searchTimeout);',
            '                searchTimeout = setTimeout(() => {',
            '                    this.performSearch(e.target.value);',
            '                }, 300);',
            '            });',
            '            searchInput.addEventListener("keydown", (e) => {',
            '                if (e.key === "Escape") {',
            '                    searchInput.value = "";',
            '                    this.performSearch("");',
            '                    searchInput.blur();',
            '                }',
            '            });',
            '        }',
            '    }',
            '',
            '    performSearch(query) {',
            '        const navLinks = document.querySelectorAll(".nav-link");',
            '        const folders = document.querySelectorAll(".nav-folder");',
            '        if (!query.trim()) {',
            '            navLinks.forEach(link => link.style.display = "");',
            '            folders.forEach(folder => folder.style.display = "");',
            '            return;',
            '        }',
            '        const searchTerm = query.toLowerCase();',
            '        navLinks.forEach(link => {',
            '            const text = link.textContent.toLowerCase();',
            '            const match = text.includes(searchTerm);',
            '            link.style.display = match ? "" : "none";',
            '            if (match) {',
            '                let parent = link.closest(".nav-folder");',
            '                while (parent) {',
            '                    parent.style.display = "";',
            '                    parent.classList.add("expanded");',
            '                    parent = parent.parentElement.closest(".nav-folder");',
            '                }',
            '            }',
            '        });',
            '        folders.forEach(folder => {',
            '            const visibleChildren = folder.querySelectorAll(".nav-link[style=\\"\\"], .nav-link:not([style])");',
            '            if (visibleChildren.length === 0) {',
            '                folder.style.display = "none";',
            '            }',
            '        });',
            '    }',
            '',
            '    setupMobileMenu() {',
            '        const mobileToggle = document.getElementById("mobileMenuToggle");',
            '        const sidebar = document.getElementById("sidebar");',
            '        if (mobileToggle && sidebar) {',
            '            mobileToggle.addEventListener("click", () => {',
            '                sidebar.classList.toggle("open");',
            '                const isOpen = sidebar.classList.contains("open");',
            '                mobileToggle.setAttribute("aria-expanded", isOpen);',
            '                const icon = mobileToggle.querySelector("svg");',
            '                if (icon) {',
            '                    icon.innerHTML = isOpen',
            '                        ? "<line x1=\\"18\\" y1=\\"6\\" x2=\\"6\\" y2=\\"18\\"></line><line x1=\\"6\\" y1=\\"6\\" x2=\\"18\\" y2=\\"18\\"></line>"',
            '                        : "<line x1=\\"3\\" y1=\\"6\\" x2=\\"21\\" y2=\\"6\\"></line><line x1=\\"3\\" y1=\\"12\\" x2=\\"21\\" y2=\\"12\\"></line><line x1=\\"3\\" y1=\\"18\\" x2=\\"21\\" y2=\\"18\\"></line>";',
            '                }',
            '            });',
            '        }',
            '    }',
            '',
            '    setupKeyboardNavigation() {',
            '        document.addEventListener("keydown", (e) => {',
            '            if ((e.ctrlKey || e.metaKey) && e.key === "k") {',
            '                e.preventDefault();',
            '                const searchInput = document.getElementById("searchInput");',
            '                if (searchInput) {',
            '                    searchInput.focus();',
            '                    searchInput.select();',
            '                }',
            '            }',
            '        });',
            '    }',
            '}',
            '',
            'function copyToClipboard(button) {',
            '    const codeWrapper = button.closest(".code-wrapper");',
            '    if (!codeWrapper) return;',
            '    const codeElement = codeWrapper.querySelector("code");',
            '    if (!codeElement) return;',
            '    const text = codeElement.textContent;',
            '    navigator.clipboard.writeText(text).then(() => {',
            '        const copyText = button.querySelector(".copy-text");',
            '        const copySuccess = button.querySelector(".copy-success");',
            '        if (copyText) copyText.style.display = "none";',
            '        if (copySuccess) copySuccess.style.display = "inline";',
            '        setTimeout(() => {',
            '            if (copyText) copyText.style.display = "inline";',
            '            if (copySuccess) copySuccess.style.display = "none";',
            '        }, 2000);',
            '    }).catch(err => {',
            '        console.error("Failed to copy text: ", err);',
            '    });',
            '}',
            '',
            'document.addEventListener("DOMContentLoaded", () => {',
            '    new PrerenderDocsApp();',
            '});'
        ];
        
        fs.writeFileSync(outputAppJsPath, appCode.join('\n'));
    }

    parseMarkdown(markdown) {
        return this.markdownParser.parse(markdown);
    }

    async generatePrerenderPages() {
        console.log('📄 Generating prerendered pages...');
        
        // Generate homepage
        await this.generateHomepage();
        
        // Generate pages for each version
        for (const version of Object.keys(this.config.versions)) {
            await this.generateVersionPages(version);
        }
    }

    async generateHomepage() {
        const defaultVersion = this.config.defaultVersion;
        const navigation = this.buildNavigation(defaultVersion);
        const readmePath = path.join(this.docsDir, defaultVersion, 'README.md');
        
        let content = '# Welcome\n\nWelcome to the documentation.';
        let seoData = {
            title: this.config.title,
            description: this.config.description
        };
        
        if (fs.existsSync(readmePath)) {
            content = fs.readFileSync(readmePath, 'utf8');
            seoData = this.extractSEOFromMarkdown(readmePath);
        }
        
        const html = await this.generatePrerenderHTML({
            content,
            seoData,
            navigation,
            version: defaultVersion,
            path: 'README.md',
            isHomepage: true
        });
        
        fs.writeFileSync(path.join(this.outputDir, 'index.html'), html);
    }

    async generateVersionPages(version) {
        console.log(`📝 Generating pages for version ${version}...`);
        
        const navigation = this.buildNavigation(version);
        const pages = this.extractPages(navigation);
        
        // Generate version homepage
        const versionDir = path.join(this.outputDir, version);
        fs.mkdirSync(versionDir, { recursive: true });
        
        const versionReadmePath = path.join(this.docsDir, version, 'README.md');
        let versionContent = '# Documentation\n\nWelcome to the documentation.';
        let versionSeoData = {
            title: `${this.config.title} - ${version}`,
            description: this.config.description
        };
        
        if (fs.existsSync(versionReadmePath)) {
            versionContent = fs.readFileSync(versionReadmePath, 'utf8');
            versionSeoData = this.extractSEOFromMarkdown(versionReadmePath);
        }
        
        const versionHtml = await this.generatePrerenderHTML({
            content: versionContent,
            seoData: versionSeoData,
            navigation,
            version,
            path: 'README.md',
            isHomepage: false
        });
        
        fs.writeFileSync(path.join(versionDir, 'index.html'), versionHtml);
        
        // Generate all other pages
        for (const page of pages) {
            await this.generatePageHTML(version, page, navigation);
        }
    }

    async generatePageHTML(version, page, navigation) {
        const markdownPath = path.join(this.docsDir, version, page.path);
        
        if (!fs.existsSync(markdownPath)) {
            console.warn(`⚠️  Markdown file not found: ${markdownPath}`);
            return;
        }
        
        const content = fs.readFileSync(markdownPath, 'utf8');
        const seoData = this.extractSEOFromMarkdown(markdownPath);
        
        // Set fallbacks for SEO
        if (!seoData.title) {
            seoData.title = page.title || page.name || this.config.title;
        }
        if (!seoData.description) {
            seoData.description = this.config.description;
        }
        
        const html = await this.generatePrerenderHTML({
            content,
            seoData,
            navigation,
            version,
            path: page.path,
            isHomepage: false
        });
        
        // Determine output path
        let pagePath = page.path.replace(/\.md$/, '');
        
        // Special handling for README files
        if (path.basename(pagePath) === 'README') {
            pagePath = path.dirname(pagePath);
            if (pagePath === '.') {
                // Root README is already handled as version homepage
                return;
            }
        }
        
        const outputPath = path.join(this.outputDir, version, pagePath);
        fs.mkdirSync(outputPath, { recursive: true });
        fs.writeFileSync(path.join(outputPath, 'index.html'), html);
    }

    async generatePrerenderHTML({ content, seoData, navigation, version, path: contentPath, isHomepage }) {
        // Parse markdown to HTML using the full-featured parser
        const htmlContent = this.parseMarkdown(content);
        
        // Generate navigation HTML
        const navigationHtml = this.generateNavigationHTML(navigation, version, contentPath);
        
        // Generate structured data for SEO
        const structuredData = this.generateStructuredData(seoData, contentPath, version);
        
        // Set up SEO meta tags
        const metaTags = this.generateSEOMetaTags(seoData, contentPath, version);
        
        // Get canonical URL
        const canonicalUrl = this.getCanonicalUrl(contentPath, version, isHomepage);
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(seoData.title || this.config.title)}</title>
    <meta name="description" content="${this.escapeHtml(seoData.description || this.config.description)}">
    ${seoData.keywords ? `<meta name="keywords" content="${this.escapeHtml(seoData.keywords)}">` : ''}
    ${seoData.author ? `<meta name="author" content="${this.escapeHtml(seoData.author)}">` : ''}
    <link rel="canonical" href="${canonicalUrl}">
    
    ${metaTags}
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    ${JSON.stringify(structuredData, null, 2)}
    </script>
    
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
    <meta name="theme-color" content="${this.config.theme?.primaryColor || '#2563eb'}">
    
    <!-- Prerendered content indicator -->
    <meta name="generator" content="VexDocs Prerender">
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
                        <img src="/assets/images/logo.svg" alt="${this.escapeHtml(this.config.title)}" class="header-logo" width="40" height="40">
                        <span class="header-text">${this.escapeHtml(this.config.title)}</span>
                    </a>
                </div>
                <div class="version-selector">
                    <select id="versionSelect" aria-label="Select documentation version">
                        ${this.generateVersionOptions(version)}
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
                    ${navigationHtml}
                </nav>
            </aside>
            
            <main class="content" role="main">
                <div class="content-wrapper">
                    <div id="markdownContent" class="markdown-content">
                        ${htmlContent}
                    </div>
                </div>
            </main>
        </div>
    </div>
    
    <!-- Prerendered data for JavaScript enhancement -->
    <script>
        window.__PRERENDERED_DATA__ = {
            version: ${JSON.stringify(version)},
            path: ${JSON.stringify(contentPath)},
            config: ${JSON.stringify(this.config)},
            navigation: ${JSON.stringify(navigation)},
            seo: ${JSON.stringify(seoData)}
        };
    </script>
    
    <script src="/assets/js/markdown-parser.js"></script>
    <script src="/assets/js/app-prerendered.js"></script>
</body>
</html>`;
    }

    generateSEOMetaTags(seoData, contentPath, version) {
        const baseUrl = this.config.baseUrl || 'https://example.com';
        const url = this.getCanonicalUrl(contentPath, version);
        
        const ogTitle = seoData.ogTitle || seoData.title || this.config.title;
        const ogDescription = seoData.ogDescription || seoData.description || this.config.description;
        const ogImage = seoData.ogImage || `${baseUrl}/assets/images/logo.svg`;
        
        const twitterTitle = seoData.twitterTitle || seoData.title || this.config.title;
        const twitterDescription = seoData.twitterDescription || seoData.description || this.config.description;
        const twitterImage = seoData.twitterImage || `${baseUrl}/assets/images/logo.svg`;
        const twitterCard = seoData.twitterCard || 'summary';
        
        return `
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${this.escapeHtml(ogTitle)}">
    <meta property="og:description" content="${this.escapeHtml(ogDescription)}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:site_name" content="${this.escapeHtml(this.config.title)}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="${twitterCard}">
    <meta property="twitter:url" content="${url}">
    <meta property="twitter:title" content="${this.escapeHtml(twitterTitle)}">
    <meta property="twitter:description" content="${this.escapeHtml(twitterDescription)}">
    <meta property="twitter:image" content="${twitterImage}">`;
    }

    generateStructuredData(seoData, contentPath, version) {
        const baseUrl = this.config.baseUrl || 'https://example.com';
        const url = this.getCanonicalUrl(contentPath, version);
        
        return {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": seoData.title || this.config.title,
            "description": seoData.description || this.config.description,
            "url": url,
            "inLanguage": "en",
            "isPartOf": {
                "@type": "WebSite",
                "name": this.config.title,
                "url": baseUrl
            },
            "author": seoData.author ? {
                "@type": "Person",
                "name": seoData.author
            } : undefined,
            "publisher": {
                "@type": "Organization",
                "name": this.config.title,
                "logo": {
                    "@type": "ImageObject",
                    "url": `${baseUrl}/assets/images/logo.svg`
                }
            },
            "dateModified": new Date().toISOString(),
            "mainEntity": {
                "@type": "TechArticle",
                "headline": seoData.title || this.config.title,
                "description": seoData.description || this.config.description,
                "url": url
            }
        };
    }

    getCanonicalUrl(contentPath, version, isHomepage = false) {
        const baseUrl = this.config.baseUrl || 'https://example.com';
        
        if (isHomepage) {
            return baseUrl;
        }
        
        let pagePath = contentPath.replace(/\.md$/, '');
        
        // Special handling for README files
        if (path.basename(pagePath) === 'README') {
            pagePath = path.dirname(pagePath);
            if (pagePath === '.') {
                return `${baseUrl}/${version}`;
            } else {
                return `${baseUrl}/${version}/${pagePath}`;
            }
        }
        
        return `${baseUrl}/${version}/${pagePath}`;
    }

    generateVersionOptions(currentVersion) {
        return Object.entries(this.config.versions)
            .map(([version, label]) => 
                `<option value="${version}"${version === currentVersion ? ' selected' : ''}>${label}</option>`
            )
            .join('\n                        ');
    }

    generateNavigationHTML(navigation, version, currentPath) {
        const capitalizeWords = (str) => {
            return str.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        };
        
        const generateNavItem = (item, level = 0) => {
            const isActive = item.path === currentPath;
            
            if (item.type === 'folder') {
                const children = item.children.map(child => generateNavItem(child, level + 1)).join('\n');
                const displayName = capitalizeWords(item.name);
                return `                    <li class="nav-folder ${level === 0 ? 'expanded' : ''}">
                        <div class="folder-header">
                            <button class="folder-toggle" type="button">${this.escapeHtml(displayName)}</button>
                        </div>
                        <div class="folder-content">
                            <div class="nav-list-wrapper">
                                <ul class="nav-list">
${children}
                                </ul>
                            </div>
                        </div>
                    </li>`;
            } else {
                const href = this.getNavigationHref(item.path, version);
                const title = item.title || item.name;
                const linkClass = level === 0 ? 'nav-link nav-link-top' : 'nav-link';
                return `                    <li class="nav-item">
                        <a href="${href}" class="${linkClass}${isActive ? ' active' : ''}" data-path="${item.path}">
                            ${this.escapeHtml(title)}
                        </a>
                    </li>`;
            }
        };
        
        const navItems = navigation.map(item => generateNavItem(item)).join('\n');
        return `<ul class="nav-list">
${navItems}
                </ul>`;
    }

    getNavigationHref(itemPath, version) {
        let href = itemPath.replace(/\.md$/, '');
        
        // Special handling for README files
        if (path.basename(href) === 'README') {
            href = path.dirname(href);
            if (href === '.') {
                return `/${version}`;
            } else {
                return `/${version}/${href}`;
            }
        }
        
        return `/${version}/${href}`;
    }

    // Copy methods from the original builder for navigation and SEO extraction
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

# Allow assets
Allow: /assets/`;

        fs.writeFileSync(path.join(this.outputDir, 'robots.txt'), robotsContent);
    }

    escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }
}

// Run the prerender builder
if (require.main === module) {
    const builder = new PrerenderBuilder();
    builder.build().catch(error => {
        console.error('Prerender build failed:', error);
        process.exit(1);
    });
}

module.exports = PrerenderBuilder;
