class MarkdownParser {
    constructor() {
        this.rules = {
            // Block elements
            heading: /^(#{1,6})\s+(.+)$/gm,
            codeBlock: /```(\w*)[\r\n]?([\s\S]*?)[\r\n]?```/g,
            blockquote: /^>\s*(.+)$/gm,
            horizontalRule: /^-{3,}|^\*{3,}|^_{3,}$/gm,
            list: /^(\s*)([*+-]|\d+\.)\s+(.+)$/gm,
            table: /\|(.+)\|/g,
            paragraph: /^(?!#{1,6}\s|>\s|```|\s*([*+-]|\d+\.)\s|\|).+$/gm,

            // Inline elements
            bold: /\*\*(.+?)\*\*|__(.+?)__/g,
            italic: /\*(.+?)\*|_(.+?)_/g,
            inlineCode: /`([^`]+)`/g,
            link: /\[([^\]]+)\]\(([^)]+)\)/g,
            image: /!\[([^\]]*)\]\(([^)]+)\)/g,
            strikethrough: /~~(.+?)~~/g
        };
    }

    parse(markdown) {
        if (!markdown) return '';
        
        let html = markdown;
        
        html = this.removeFrontmatter(html);
        
        // Store code blocks with placeholders
        const codeBlocks = [];
        html = html.replace(this.rules.codeBlock, (match, language, code) => {
            const lang = language || '';
            let cleanCode = code;
            cleanCode = cleanCode.replace(/^\s+/, '').replace(/\s+$/, '');
            
            const escapedCode = this.escapeHtml(cleanCode);
            const highlightedCode = lang ? this.highlightCode(cleanCode, lang) : escapedCode;
            const codeBlockHtml = `<div class="code-wrapper">
                <button class="copy-button" onclick="copyToClipboard(this)" aria-label="Copy code">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span class="copy-text">Copy</span>
                    <span class="copy-success" style="display: none;">Copied!</span>
                </button>
                <pre><code class="language-${lang}">${highlightedCode}</code></pre>
            </div>`;
            const placeholder = `<!--CODEBLOCK${codeBlocks.length}-->`;
            codeBlocks.push(codeBlockHtml);
            return placeholder;
        });
        
        // Store tables with placeholders
        const tables = [];
        html = this.parseTablesWithPlaceholders(html, tables);
        
        html = this.parseHeadings(html);
        html = this.parseBlockquotes(html);
        html = this.parseHorizontalRules(html);
        html = this.parseLists(html);
        
        html = this.parseInlineElements(html);
        
        html = this.parseParagraphs(html);
        
        // Restore code blocks
        codeBlocks.forEach((codeBlockHtml, index) => {
            const placeholder = `<!--CODEBLOCK${index}-->`;
            html = html.replace(new RegExp(placeholder, 'g'), codeBlockHtml);
        });
        
        // Restore tables
        tables.forEach((tableHtml, index) => {
            const placeholder = `<!--TABLE${index}-->`;
            html = html.replace(new RegExp(placeholder, 'g'), tableHtml);
        });

        return html.trim();
    }

    parseHeadings(text) {
        return text.replace(this.rules.heading, (match, hashes, content) => {
            const level = hashes.length;
            const id = this.generateId(content);
            return `<h${level} id="${id}">${this.parseInlineElements(content)}</h${level}>`;
        });
    }

    parseBlockquotes(text) {
        const lines = text.split('\n');
        let result = [];
        let inBlockquote = false;
        let blockquoteContent = [];

        for (let line of lines) {
            if (line.match(/^>\s*/)) {
                if (!inBlockquote) {
                    inBlockquote = true;
                    blockquoteContent = [];
                }
                blockquoteContent.push(line.replace(/^>\s*/, ''));
            } else {
                if (inBlockquote) {
                    result.push(`<blockquote>${blockquoteContent.join('\n')}</blockquote>`);
                    inBlockquote = false;
                    blockquoteContent = [];
                }
                result.push(line);
            }
        }

        if (inBlockquote) {
            result.push(`<blockquote>${blockquoteContent.join('\n')}</blockquote>`);
        }

        return result.join('\n');
    }

    parseHorizontalRules(text) {
        return text.replace(this.rules.horizontalRule, '<hr>');
    }

    parseLists(text) {
        const lines = text.split('\n');
        let result = [];
        let inList = false;
        let listType = null;
        let listItems = [];
        let currentIndent = 0;

        for (let line of lines) {
            const listMatch = line.match(/^(\s*)([*+-]|\d+\.)\s+(.+)$/);

            if (listMatch) {
                const [, indent, marker, content] = listMatch;
                const indentLevel = indent.length;
                const isOrdered = /\d+\./.test(marker);
                const currentListType = isOrdered ? 'ol' : 'ul';

                if (!inList || listType !== currentListType || indentLevel !== currentIndent) {
                    if (inList) {
                        result.push(`</${listType}>`);
                    }
                    listType = currentListType;
                    currentIndent = indentLevel;
                    result.push(`<${listType}>`);
                    inList = true;
                }

                result.push(`<li>${this.parseInlineElements(content)}</li>`);
            } else {
                if (inList) {
                    result.push(`</${listType}>`);
                    inList = false;
                    listType = null;
                }
                result.push(line);
            }
        }

        if (inList) {
            result.push(`</${listType}>`);
        }

        return result.join('\n');
    }

    parseTables(text) {
        const lines = text.split('\n');
        let result = [];
        let inTable = false;
        let tableRows = [];

        for (let line of lines) {
            if (line.trim().match(/^\|.*\|$/)) {
                if (!inTable) {
                    inTable = true;
                    tableRows = [];
                }
                tableRows.push(line);
            } else {
                if (inTable) {
                    const tableHtml = this.buildTable(tableRows);
                    result.push(tableHtml);
                    inTable = false;
                    tableRows = [];
                }
                result.push(line);
            }
        }

        if (inTable) {
            const tableHtml = this.buildTable(tableRows);
            result.push(tableHtml);
        }

        return result.join('\n');
    }

    parseTablesWithPlaceholders(text, tables) {
        const lines = text.split('\n');
        let result = [];
        let inTable = false;
        let tableRows = [];

        for (let line of lines) {
            if (line.trim().match(/^\|.*\|$/)) {
                if (!inTable) {
                    inTable = true;
                    tableRows = [];
                }
                tableRows.push(line);
            } else {
                if (inTable) {
                    const tableHtml = this.buildTable(tableRows);
                    const placeholder = `<!--TABLE${tables.length}-->`;
                    tables.push(tableHtml);
                    result.push(placeholder);
                    inTable = false;
                    tableRows = [];
                }
                result.push(line);
            }
        }

        if (inTable) {
            const tableHtml = this.buildTable(tableRows);
            const placeholder = `<!--TABLE${tables.length}-->`;
            tables.push(tableHtml);
            result.push(placeholder);
        }

        return result.join('\n');
    }

    buildTable(rows) {
        if (rows.length < 2) return rows.join('\n');

        let html = '<table>\n';

        // Header row
        const headerCells = rows[0].trim().split('|').slice(1, -1).map(cell => cell.trim());
        html += '<thead>\n<tr>\n';
        headerCells.forEach(cell => {
            html += `<th>${this.escapeHtml(cell)}</th>\n`;
        });
        html += '</tr>\n</thead>\n';

        // Skip separator row (index 1) and process data rows
        if (rows.length > 2) {
            html += '<tbody>\n';
            for (let i = 2; i < rows.length; i++) {
                const dataCells = rows[i].trim().split('|').slice(1, -1).map(cell => cell.trim());
                html += '<tr>\n';
                dataCells.forEach(cell => {
                    html += `<td>${this.escapeHtml(cell)}</td>\n`;
                });
                html += '</tr>\n';
            }
            html += '</tbody>\n';
        }

        html += '</table>';
        return html;
    }

    parseInlineElements(text) {
        if (!text) return '';

        // Parse in order: images, links, bold, italic, strikethrough, inline code
        text = text.replace(this.rules.image, (match, alt, src) => {
            return `<img src="${src}" alt="${alt}" />`;
        });

        text = text.replace(this.rules.link, (match, text, url) => {
            return `<a href="${url}">${text}</a>`;
        });

        text = text.replace(this.rules.bold, (match, content1, content2) => {
            const content = content1 || content2;
            return `<strong>${content}</strong>`;
        });

        text = text.replace(this.rules.italic, (match, content1, content2) => {
            const content = content1 || content2;
            return `<em>${content}</em>`;
        });

        text = text.replace(this.rules.strikethrough, (match, content) => {
            return `<del>${content}</del>`;
        });

        text = text.replace(this.rules.inlineCode, (match, content) => {
            return `<code>${this.escapeHtml(content)}</code>`;
        });

        return text;
    }

    parseParagraphs(text) {
        const lines = text.split('\n');
        let result = [];
        let inParagraph = false;
        let paragraphContent = [];

        for (let line of lines) {
            const trimmedLine = line.trim();

            // Skip empty lines and already processed elements (including code block and table placeholders)
            if (!trimmedLine ||
                trimmedLine.startsWith('<') ||
                trimmedLine.match(/^#{1,6}\s/) ||
                trimmedLine.match(/^>\s/) ||
                trimmedLine.match(/^(\s*)([*+-]|\d+\.)\s/) ||
                trimmedLine.match(/^\|/) ||
                trimmedLine.match(/^-{3,}|^\*{3,}|^_{3,}$/) ||
                trimmedLine.match(/^<!--CODEBLOCK\d+-->$/) ||
                trimmedLine.match(/^<!--TABLE\d+-->$/)) {

                if (inParagraph) {
                    result.push(`<p>${this.parseInlineElements(paragraphContent.join(' '))}</p>`);
                    inParagraph = false;
                    paragraphContent = [];
                }
                result.push(line);
            } else {
                if (!inParagraph) {
                    inParagraph = true;
                    paragraphContent = [];
                }
                paragraphContent.push(trimmedLine);
            }
        }

        if (inParagraph) {
            result.push(`<p>${this.parseInlineElements(paragraphContent.join(' '))}</p>`);
        }

        return result.join('\n');
    }

    generateId(text) {
        return text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();
    }

    highlightCode(code, language) {
        const languagePatterns = {
            javascript: {
                keywords: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|this|typeof|instanceof|in|of|class|extends|super|static|import|export|default|from|as|async|await|yield|true|false|null|undefined)\b/g,
                strings: /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
                comments: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
                numbers: /\b\d+\.?\d*\b/g,
                functions: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g
            },
            typescript: {
                keywords: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|this|typeof|instanceof|in|of|class|extends|super|static|import|export|default|from|as|async|await|yield|true|false|null|undefined|interface|type|enum|namespace|declare|public|private|protected|readonly|abstract)\b/g,
                strings: /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
                comments: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
                numbers: /\b\d+\.?\d*\b/g,
                functions: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g
            },
            python: {
                keywords: /\b(def|class|if|elif|else|for|while|try|except|finally|with|as|import|from|return|yield|lambda|and|or|not|is|in|True|False|None|self|pass|break|continue|global|nonlocal|assert|del|raise)\b/g,
                strings: /(["']{1,3})(?:(?!\1)[^\\]|\\.)*\1/g,
                comments: /#.*$/gm,
                numbers: /\b\d+\.?\d*\b/g,
                functions: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g
            },
            java: {
                keywords: /\b(public|private|protected|static|final|abstract|class|interface|extends|implements|package|import|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|new|this|super|return|void|int|double|float|boolean|char|byte|short|long|String|true|false|null)\b/g,
                strings: /(["'])(?:(?!\1)[^\\]|\\.)*\1/g,
                comments: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
                numbers: /\b\d+\.?\d*[fFdDlL]?\b/g,
                functions: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g
            },
            css: {
                keywords: /\b(color|background|font|margin|padding|border|width|height|display|position|top|left|right|bottom|z-index|opacity|transform|transition|animation|flex|grid|important)\b/g,
                strings: /(["'])(?:(?!\1)[^\\]|\\.)*\1/g,
                comments: /(\/\*[\s\S]*?\*\/)/g,
                numbers: /\b\d+\.?\d*(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax|fr)?\b/g,
                selectors: /([.#]?[a-zA-Z_-][a-zA-Z0-9_-]*)\s*(?={)/g
            },
            html: {
                keywords: /\b(html|head|body|div|span|p|a|img|ul|ol|li|h1|h2|h3|h4|h5|h6|table|tr|td|th|form|input|button|textarea|select|option|script|style|link|meta|title)\b/g,
                strings: /(["'])(?:(?!\1)[^\\]|\\.)*\1/g,
                comments: /(<!--[\s\S]*?-->)/g,
                attributes: /\b([a-zA-Z-]+)(?==)/g,
                tags: /(<\/?[a-zA-Z][a-zA-Z0-9]*(?:\s[^>]*)?>)/g
            },
            json: {
                keywords: /\b(true|false|null)\b/g,
                strings: /(")(?:(?!\1)[^\\]|\\.)*\1/g,
                numbers: /\b-?\d+\.?\d*\b/g
            },
            bash: {
                keywords: /\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|exit|export|source|alias|echo|cd|ls|pwd|mkdir|rm|cp|mv|grep|find|awk|sed|sort|uniq|head|tail|cat|less|more)\b/g,
                strings: /(["'])(?:(?!\1)[^\\]|\\.)*\1/g,
                comments: /#.*$/gm,
                variables: /\$[a-zA-Z_][a-zA-Z0-9_]*/g
            },
            sh: {
                keywords: /\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|exit|export|source|alias|echo|cd|ls|pwd|mkdir|rm|cp|mv|grep|find|awk|sed|sort|uniq|head|tail|cat|less|more)\b/g,
                strings: /(["'])(?:(?!\1)[^\\]|\\.)*\1/g,
                comments: /#.*$/gm,
                variables: /\$[a-zA-Z_][a-zA-Z0-9_]*/g
            }
        };

        const patterns = languagePatterns[language] || languagePatterns.javascript;
        let highlightedCode = code;

        // Create a list of matches with their positions to avoid overlaps
        const matches = [];

        // Collect all matches with their positions
        if (patterns.comments) {
            let match;
            const regex = new RegExp(patterns.comments.source, patterns.comments.flags);
            while ((match = regex.exec(code)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'comment',
                    priority: 1 // Highest priority
                });
            }
        }

        if (patterns.strings) {
            let match;
            const regex = new RegExp(patterns.strings.source, patterns.strings.flags);
            while ((match = regex.exec(code)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'string',
                    priority: 2
                });
            }
        }

        if (patterns.keywords) {
            let match;
            const regex = new RegExp(patterns.keywords.source, patterns.keywords.flags);
            while ((match = regex.exec(code)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'keyword',
                    priority: 4
                });
            }
        }

        if (patterns.numbers) {
            let match;
            const regex = new RegExp(patterns.numbers.source, patterns.numbers.flags);
            while ((match = regex.exec(code)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'number',
                    priority: 3
                });
            }
        }

        // Sort by position and priority (higher priority first for same position)
        matches.sort((a, b) => {
            if (a.start !== b.start) return a.start - b.start;
            return a.priority - b.priority;
        });

        // Remove overlapping matches (keep higher priority ones)
        const filteredMatches = [];
        for (const match of matches) {
            const hasOverlap = filteredMatches.some(existing => 
                (match.start < existing.end && match.end > existing.start)
            );
            if (!hasOverlap) {
                filteredMatches.push(match);
            }
        }

        // Apply highlighting from end to beginning to preserve positions
        filteredMatches.reverse();
        for (const match of filteredMatches) {
            const before = highlightedCode.substring(0, match.start);
            const after = highlightedCode.substring(match.end);
            const escapedMatchText = this.escapeHtml(match.text);
            const highlighted = `<span class="syntax-${match.type}">${escapedMatchText}</span>`;
            highlightedCode = before + highlighted + after;
        }

        // Escape any remaining unmatched text
        return this.escapeHighlightedCode(highlightedCode);
    }

    escapeHighlightedCode(code) {
        // Split by spans to avoid escaping HTML inside them
        const parts = code.split(/(<span class="syntax-[^"]*">[^<]*<\/span>)/);
        
        for (let i = 0; i < parts.length; i++) {
            // Only escape parts that are not span elements
            if (!parts[i].startsWith('<span class="syntax-')) {
                parts[i] = this.escapeHtml(parts[i]);
            }
        }
        
        return parts.join('');
    }

    removeFrontmatter(text) {
        const frontmatterMatch = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
        if (frontmatterMatch) {
            return text.substring(frontmatterMatch[0].length);
        }
        return text;
    }

    escapeHtml(text) {
        const htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '`': '&#96;'
        };
        return text.replace(/[&<>"'`]/g, char => htmlEscapes[char]);
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.MarkdownParser = MarkdownParser;
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarkdownParser;
}
