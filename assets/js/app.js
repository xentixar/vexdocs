/**
 * Main Application JavaScript
 * Handles routing, content loading, and UI interactions
 */
class DocsApp {
    constructor() {
        this.config = null;
        this.currentVersion = null;
        this.currentPath = 'README.md';
        this.markdownParser = new MarkdownParser();
        this.navigation = [];
        
        this.init();
    }

    async init() {
        try {
            await this.loadConfig();
            await this.setupVersionSelector();
            await this.setupNavigation();
            await this.setupRouting();
            await this.setupSearch();
            await this.setupMobileMenu();
            await this.loadInitialContent();
            this.setupKeyboardNavigation();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to load documentation. Please refresh the page.');
        }
    }

    async loadConfig() {
        const response = await fetch('/api/config');
        this.config = await response.json();
        this.currentVersion = this.getCurrentVersionFromUrl() || this.config.defaultVersion;
        
        // Apply theme
        this.applyTheme();
    }

    getCurrentVersionFromUrl() {
        const path = window.location.pathname;
        const segments = path.split('/').filter(s => s);
        
        if (segments.length > 0 && this.config && this.config.versions[segments[0]]) {
            return segments[0];
        }
        return null;
    }

    getCurrentPathFromUrl() {
        const path = window.location.pathname;
        const segments = path.split('/').filter(s => s);
        
        if (segments.length > 1) {
            const pathWithoutVersion = segments.slice(1).join('/');
            // Remove .md extension from URL if present, then add it back for file lookup
            const cleanPath = pathWithoutVersion.replace('.md', '');
            return cleanPath + '.md';
        }
        return 'README.md';
    }

    formatTitle(filename) {
        // Remove .md extension
        let title = filename.replace(/\.md$/, '');
        
        // Convert kebab-case and snake_case to title case
        title = title
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        
        // Handle special cases
        const specialCases = {
            'Api': 'API',
            'Cli': 'CLI',
            'Http': 'HTTP',
            'Json': 'JSON',
            'Xml': 'XML',
            'Sql': 'SQL',
            'Html': 'HTML',
            'Css': 'CSS',
            'Js': 'JS',
            'Ts': 'TS',
            'Readme': 'README'
        };
        
        Object.entries(specialCases).forEach(([key, value]) => {
            const regex = new RegExp(`\\b${key}\\b`, 'gi');
            title = title.replace(regex, value);
        });
        
        return title;
    }

    applyTheme() {
        if (this.config.theme) {
            const root = document.documentElement;
            if (this.config.theme.primaryColor) {
                root.style.setProperty('--primary-color', this.config.theme.primaryColor);
            }
            if (this.config.theme.sidebarWidth) {
                root.style.setProperty('--sidebar-width', this.config.theme.sidebarWidth);
            }
        }
    }

    async setupVersionSelector() {
        const versionSelect = document.getElementById('versionSelect');
        
        // Populate version options
        Object.entries(this.config.versions).forEach(([version, label]) => {
            const option = document.createElement('option');
            option.value = version;
            option.textContent = `${version} ${label ? `(${label})` : ''}`;
            option.selected = version === this.currentVersion;
            versionSelect.appendChild(option);
        });

        // Handle version changes
        versionSelect.addEventListener('change', (e) => {
            this.changeVersion(e.target.value);
        });
    }

    async setupNavigation() {
        await this.loadNavigation();
        this.renderNavigation();
    }

    async loadNavigation() {
        const response = await fetch(`/api/navigation?version=${this.currentVersion}`);
        this.navigation = await response.json();
    }

    renderNavigation() {
        const navigationEl = document.getElementById('navigation');
        navigationEl.innerHTML = this.buildNavigationHTML(this.navigation);
        
        // Add click handlers
        navigationEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                e.preventDefault();
                const path = e.target.dataset.path;
                this.navigateToPath(path);
            }
            
            if (e.target.classList.contains('folder-toggle')) {
                e.preventDefault();
                const folder = e.target.closest('.nav-folder');
                folder.classList.toggle('expanded');
            }
        });
    }

    buildNavigationHTML(items, level = 0) {
        let html = '<ul class="nav-list">';
        
        items.forEach(item => {
            if (item.type === 'folder') {
                const folderTitle = this.formatTitle(item.title || item.name);
                html += `
                    <li class="nav-folder ${level === 0 ? 'expanded' : ''}">
                        <div class="folder-header">
                            <button class="folder-toggle">
                                ${folderTitle}
                            </button>
                        </div>
                        <div class="folder-content">
                            <div class="nav-list-wrapper">
                                ${this.buildNavigationHTML(item.children, level + 1)}
                            </div>
                        </div>
                    </li>
                `;
            } else {
                const isActive = item.path === this.currentPath;
                const linkTitle = this.formatTitle(item.title || item.name);
                const linkClass = level === 0 ? 'nav-link nav-link-top' : 'nav-link';
                const pathWithoutMd = item.path.replace('.md', '');
                const fullUrl = `${window.location.origin}/${this.currentVersion}/${pathWithoutMd}`;
                html += `
                    <li class="nav-item">
                        <a href="${fullUrl}" class="${linkClass} ${isActive ? 'active' : ''}" data-path="${item.path}">
                            ${linkTitle}
                        </a>
                    </li>
                `;
            }
        });
        
        html += '</ul>';
        return html;
    }

    setupRouting() {
        // Handle browser navigation
        window.addEventListener('popstate', () => {
            this.handleRouteChange();
        });

        // Handle initial route
        this.handleRouteChange();
    }

    handleRouteChange() {
        const newVersion = this.getCurrentVersionFromUrl();
        const newPath = this.getCurrentPathFromUrl();
        
        if (newVersion && newVersion !== this.currentVersion) {
            this.changeVersion(newVersion, false);
        }
        
        if (newPath !== this.currentPath) {
            this.navigateToPath(newPath, false);
        }
    }

    async changeVersion(version, updateUrl = true) {
        this.currentVersion = version;
        
        // Update version selector
        document.getElementById('versionSelect').value = version;
        
        // Reload navigation and content
        await this.loadNavigation();
        this.renderNavigation();
        await this.loadContent(this.currentPath);
        
        if (updateUrl) {
            this.updateUrl();
        }
    }

    async navigateToPath(path, updateUrl = true) {
        this.currentPath = path;
        
        // Update active navigation item
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.path === path);
        });
        
        await this.loadContent(path);
        
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
        
        if (updateUrl) {
            this.updateUrl();
            this.updateCanonicalUrl();
        }
    }

    updateUrl() {
        const basePath = this.currentPath === 'README.md' ? '' : this.currentPath.replace('.md', '');
        const newPath = `/${this.currentVersion}${basePath ? '/' + basePath : ''}`;
        
        history.pushState(null, '', newPath);
    }

    updateCanonicalUrl() {
        this.updateMetaTag('pageCanonical', 'rel', window.location.href, 'href');
        this.updateMetaTag('ogUrl', 'property', window.location.href, 'content');
        this.updateMetaTag('twitterUrl', 'property', window.location.href, 'content');
    }

    async loadInitialContent() {
        const initialPath = this.getCurrentPathFromUrl();
        await this.navigateToPath(initialPath, false);
    }

    async loadContent(path) {
        try {
            // Show loading state
            const contentEl = document.getElementById('markdownContent');
            contentEl.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
                    <div style="display: inline-block; width: 40px; height: 40px; border: 3px solid var(--border-color); border-top: 3px solid var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <p style="margin-top: 16px; font-size: 14px;">Loading content...</p>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `;

            const response = await fetch(`/api/content?version=${this.currentVersion}&path=${path}`);
            const data = await response.json();
            
            await this.updateSEO(path);
            
            this.renderContent(data.content);
        } catch (error) {
            console.error('Failed to load content:', error);
            this.showError(`Failed to load "${path}"`);
        }
    }

    async updateSEO(path) {
        try {
            const response = await fetch(`/api/seo?version=${this.currentVersion}&path=${path}`);
            const seo = await response.json();
            
            // Update title
            document.title = seo.title;
            this.updateMetaTag('pageTitle', 'id', seo.title, 'textContent');
            
            // Update basic meta tags
            this.updateMetaTag('pageDescription', 'name', seo.description, 'content');
            this.updateMetaTag('pageKeywords', 'name', seo.keywords, 'content');
            this.updateMetaTag('pageAuthor', 'name', seo.author, 'content');
            
            // Update canonical URL (only if not provided in frontmatter)
            if (seo.canonical) {
                this.updateMetaTag('pageCanonical', 'rel', seo.canonical, 'href');
            }
            
            // Update Open Graph tags
            this.updateMetaTag('ogUrl', 'property', window.location.href, 'content');
            this.updateMetaTag('ogTitle', 'property', seo.ogTitle, 'content');
            this.updateMetaTag('ogDescription', 'property', seo.ogDescription, 'content');
            this.updateMetaTag('ogImage', 'property', seo.ogImage, 'content');
            
            // Update Twitter tags
            this.updateMetaTag('twitterCard', 'property', seo.twitterCard, 'content');
            this.updateMetaTag('twitterUrl', 'property', window.location.href, 'content');
            this.updateMetaTag('twitterTitle', 'property', seo.twitterTitle, 'content');
            this.updateMetaTag('twitterDescription', 'property', seo.twitterDescription, 'content');
            this.updateMetaTag('twitterImage', 'property', seo.twitterImage, 'content');
            
        } catch (error) {
            console.error('Failed to update SEO:', error);
        }
    }

    updateMetaTag(elementId, attribute, content, updateAttribute) {
        if (!content) return;
        
        const element = document.getElementById(elementId);
        if (element) {
            if (updateAttribute === 'textContent') {
                element.textContent = content;
            } else {
                element.setAttribute(updateAttribute, content);
            }
        }
    }

    renderContent(markdown) {
        const contentEl = document.getElementById('markdownContent');
        const html = this.markdownParser.parse(markdown);
        contentEl.innerHTML = html;
        
        // Add click handlers for internal links
        this.setupInternalLinks(contentEl);
        
        // Scroll to top
        contentEl.scrollTop = 0;
    }

    setupInternalLinks(container) {
        const links = container.querySelectorAll('a[href^="#"], a[href*="' + window.location.origin + '"]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            } else if (href.includes(window.location.origin)) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const url = new URL(href);
                    const pathSegments = url.pathname.split('/').filter(s => s);
                    if (pathSegments.length > 1) {
                        const pathWithoutVersion = pathSegments.slice(1).join('/');
                        const cleanPath = pathWithoutVersion.replace('.md', '');
                        this.navigateToPath(cleanPath + '.md');
                    }
                });
            }
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });

        // Clear search on escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                this.performSearch('');
                searchInput.blur();
            }
        });
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                
                // Update aria-expanded attribute
                const isOpen = sidebar.classList.contains('open');
                mobileToggle.setAttribute('aria-expanded', isOpen);
                
                // Update icon
                const icon = mobileToggle.querySelector('svg');
                if (isOpen) {
                    icon.innerHTML = `
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    `;
                } else {
                    icon.innerHTML = `
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    `;
                }
            });

            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 && 
                    !sidebar.contains(e.target) && 
                    !mobileToggle.contains(e.target) &&
                    sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    
                    // Reset icon
                    const icon = mobileToggle.querySelector('svg');
                    icon.innerHTML = `
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    `;
                }
            });

            // Close sidebar on navigation link click (mobile)
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link') && window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    
                    // Reset icon
                    const icon = mobileToggle.querySelector('svg');
                    icon.innerHTML = `
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    `;
                }
            });
        }
    }

    setupKeyboardNavigation() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Toggle search focus with Ctrl/Cmd + K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                searchInput.focus();
                searchInput.select();
            }

            // Toggle mobile menu with Ctrl/Cmd + B
            if ((e.ctrlKey || e.metaKey) && e.key === 'b' && window.innerWidth <= 768) {
                e.preventDefault();
                const mobileToggle = document.getElementById('mobileMenuToggle');
                mobileToggle.click();
            }

            // Navigate between sections with arrow keys when search is focused
            if (document.activeElement === document.getElementById('searchInput')) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const firstLink = document.querySelector('.nav-link:not([style*="none"])');
                    if (firstLink) firstLink.focus();
                }
            }
        });

        // Arrow key navigation in sidebar
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('nav-link')) {
                const links = Array.from(document.querySelectorAll('.nav-link:not([style*="none"])'));
                const currentIndex = links.indexOf(e.target);

                if (e.key === 'ArrowDown' && currentIndex < links.length - 1) {
                    e.preventDefault();
                    links[currentIndex + 1].focus();
                } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                    e.preventDefault();
                    links[currentIndex - 1].focus();
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    e.target.click();
                }
            }
        });
    }

    performSearch(query) {
        const navLinks = document.querySelectorAll('.nav-link');
        const folders = document.querySelectorAll('.nav-folder');
        
        if (!query.trim()) {
            // Reset visibility
            navLinks.forEach(link => link.style.display = '');
            folders.forEach(folder => folder.style.display = '');
            return;
        }
        
        const searchTerm = query.toLowerCase();
        
        navLinks.forEach(link => {
            const text = link.textContent.toLowerCase();
            const match = text.includes(searchTerm);
            link.style.display = match ? '' : 'none';
            
            // Show parent folders for matching items
            if (match) {
                let parent = link.closest('.nav-folder');
                while (parent) {
                    parent.style.display = '';
                    parent.classList.add('expanded');
                    parent = parent.parentElement.closest('.nav-folder');
                }
            }
        });
        
        // Hide empty folders
        folders.forEach(folder => {
            const visibleChildren = folder.querySelectorAll('.nav-link[style=""], .nav-link:not([style])');
            if (visibleChildren.length === 0) {
                folder.style.display = 'none';
            }
        });
    }

    showError(message) {
        const contentEl = document.getElementById('markdownContent');
        contentEl.innerHTML = `
            <div class="error-message">
                <h2>⚠️ Error</h2>
                <p>${message}</p>
            </div>
        `;
    }
}

function copyToClipboard(button) {
    const codeWrapper = button.closest('.code-wrapper');
    const codeElement = codeWrapper.querySelector('code');
    const text = codeElement.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const copyText = button.querySelector('.copy-text');
        const copySuccess = button.querySelector('.copy-success');
        
        copyText.style.display = 'none';
        copySuccess.style.display = 'inline';
        
        setTimeout(() => {
            copyText.style.display = 'inline';
            copySuccess.style.display = 'none';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        const copyText = button.querySelector('.copy-text');
        const copySuccess = button.querySelector('.copy-success');
        
        copyText.style.display = 'none';
        copySuccess.style.display = 'inline';
        
        setTimeout(() => {
            copyText.style.display = 'inline';
            copySuccess.style.display = 'none';
        }, 2000);
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DocsApp();
});
