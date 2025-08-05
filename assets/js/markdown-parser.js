class MarkdownParser {
    constructor() {
        this.rules = {
            // Block elements
            heading: /^(#{1,6})\s+(.+)$/gm,
            codeBlock: /```(\w+)?\n([\s\S]*?)```/g,
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
        
        // Process block elements first
        html = this.parseCodeBlocks(html);
        html = this.parseHeadings(html);
        html = this.parseBlockquotes(html);
        html = this.parseHorizontalRules(html);
        html = this.parseLists(html);
        html = this.parseTables(html);
        
        // Process inline elements
        html = this.parseInlineElements(html);
        
        // Process paragraphs last
        html = this.parseParagraphs(html);
        
        return html.trim();
    }

    parseHeadings(text) {
        return text.replace(this.rules.heading, (match, hashes, content) => {
            const level = hashes.length;
            const id = this.generateId(content);
            return `<h${level} id="${id}">${this.parseInlineElements(content)}</h${level}>`;
        });
    }

    parseCodeBlocks(text) {
        return text.replace(this.rules.codeBlock, (match, language, code) => {
            const lang = language || '';
            const escapedCode = this.escapeHtml(code.trim());
            return `<pre><code class="language-${lang}">${escapedCode}</code></pre>`;
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
            if (line.match(/\|(.+)\|/)) {
                if (!inTable) {
                    inTable = true;
                    tableRows = [];
                }
                tableRows.push(line);
            } else {
                if (inTable) {
                    result.push(this.buildTable(tableRows));
                    inTable = false;
                    tableRows = [];
                }
                result.push(line);
            }
        }

        if (inTable) {
            result.push(this.buildTable(tableRows));
        }

        return result.join('\n');
    }

    buildTable(rows) {
        if (rows.length < 2) return rows.join('\n');

        let html = '<table>\n';
        
        // Header row
        const headerCells = rows[0].split('|').slice(1, -1).map(cell => cell.trim());
        html += '<thead>\n<tr>\n';
        headerCells.forEach(cell => {
            html += `<th>${this.parseInlineElements(cell)}</th>\n`;
        });
        html += '</tr>\n</thead>\n';

        // Skip separator row (index 1) and process data rows
        if (rows.length > 2) {
            html += '<tbody>\n';
            for (let i = 2; i < rows.length; i++) {
                const dataCells = rows[i].split('|').slice(1, -1).map(cell => cell.trim());
                html += '<tr>\n';
                dataCells.forEach(cell => {
                    html += `<td>${this.parseInlineElements(cell)}</td>\n`;
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
            
            // Skip empty lines and already processed elements
            if (!trimmedLine || 
                trimmedLine.startsWith('<') || 
                trimmedLine.match(/^#{1,6}\s/) ||
                trimmedLine.match(/^>\s/) ||
                trimmedLine.match(/^(\s*)([*+-]|\d+\.)\s/) ||
                trimmedLine.match(/^\|/) ||
                trimmedLine.match(/^-{3,}|^\*{3,}|^_{3,}$/)) {
                
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

    escapeHtml(text) {
        const htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return text.replace(/[&<>"']/g, char => htmlEscapes[char]);
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.MarkdownParser = MarkdownParser;
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarkdownParser;
}
