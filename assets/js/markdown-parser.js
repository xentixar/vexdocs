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
                keywords: /\b(abstract|arguments|await|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|eval|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|let|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|var|void|volatile|while|with|yield)\b/g,
                strings: /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
                comments: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
                numbers: /\b\d+\.?\d*\b/g,
                functions: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
                templateLiterals: /\$\{[^}]+\}/g
            },
            typescript: {
                keywords: /\b(abstract|any|as|async|await|boolean|break|case|catch|class|const|constructor|continue|declare|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|set|static|string|super|switch|this|throw|true|try|type|typeof|undefined|var|void|while|with|yield)\b/g,
                strings: /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
                comments: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
                numbers: /\b\d+\.?\d*\b/g,
                functions: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
                templateLiterals: /\$\{[^}]+\}/g,
                types: /\b([A-Z][a-zA-Z0-9_]*)\b/g
            },
            python: {
                keywords: /\b(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|False|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|None|or|pass|raise|return|True|try|while|with|yield)\b/g,
                strings: /(["']{1,3})(?:(?!\1)[^\\]|\\.)*\1/g,
                comments: /#.*$/gm,
                numbers: /\b\d+\.?\d*\b/g,
                functions: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g,
                decorators: /@[a-zA-Z_][a-zA-Z0-9_]*/g
            },
            java: {
                keywords: /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|false|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|null|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|true|try|void|volatile|while)\b/g,
                strings: /(["'])(?:(?!\1)[^\\]|\\.)*\1/g,
                comments: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
                numbers: /\b\d+\.?\d*[fFdDlL]?\b/g,
                functions: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g,
                annotations: /@[a-zA-Z_][a-zA-Z0-9_]*/g
            },
            css: {
                keywords: /\b(align-content|align-items|align-self|all|animation|animation-delay|animation-direction|animation-duration|animation-fill-mode|animation-iteration-count|animation-name|animation-play-state|animation-timing-function|backface-visibility|background|background-attachment|background-clip|background-color|background-image|background-origin|background-position|background-repeat|background-size|border|border-bottom|border-bottom-color|border-bottom-left-radius|border-bottom-right-radius|border-bottom-style|border-bottom-width|border-collapse|border-color|border-image|border-image-outset|border-image-repeat|border-image-slice|border-image-source|border-image-width|border-left|border-left-color|border-left-style|border-left-width|border-radius|border-right|border-right-color|border-right-style|border-right-width|border-spacing|border-style|border-top|border-top-color|border-top-left-radius|border-top-right-radius|border-top-style|border-top-width|border-width|bottom|box-decoration-break|box-shadow|box-sizing|break-after|break-before|break-inside|caption-side|clear|clip|color|column-count|column-fill|column-gap|column-rule|column-rule-color|column-rule-style|column-rule-width|column-span|column-width|columns|content|counter-increment|counter-reset|cursor|direction|display|empty-cells|filter|flex|flex-basis|flex-direction|flex-flow|flex-grow|flex-shrink|flex-wrap|float|font|font-family|font-feature-settings|font-kerning|font-language-override|font-size|font-size-adjust|font-stretch|font-style|font-synthesis|font-variant|font-variant-alternates|font-variant-caps|font-variant-east-asian|font-variant-ligatures|font-variant-numeric|font-variant-position|font-weight|grid|grid-area|grid-auto-columns|grid-auto-flow|grid-auto-rows|grid-column|grid-column-end|grid-column-gap|grid-column-start|grid-gap|grid-row|grid-row-end|grid-row-gap|grid-row-start|grid-template|grid-template-areas|grid-template-columns|grid-template-rows|hanging-punctuation|height|hyphens|image-orientation|image-rendering|image-resolution|ime-mode|justify-content|left|letter-spacing|line-height|list-style|list-style-image|list-style-position|list-style-type|margin|margin-bottom|margin-left|margin-right|margin-top|max-height|max-width|min-height|min-width|mix-blend-mode|object-fit|object-position|opacity|order|orphans|outline|outline-color|outline-offset|outline-style|outline-width|overflow|overflow-wrap|overflow-x|overflow-y|padding|padding-bottom|padding-left|padding-right|padding-top|page-break-after|page-break-before|page-break-inside|perspective|perspective-origin|position|quotes|resize|right|tab-size|table-layout|text-align|text-align-last|text-combine-upright|text-decoration|text-decoration-color|text-decoration-line|text-decoration-style|text-indent|text-justify|text-orientation|text-overflow|text-shadow|text-transform|text-underline-position|top|transform|transform-origin|transform-style|transition|transition-delay|transition-duration|transition-property|transition-timing-function|unicode-bidi|vertical-align|visibility|white-space|width|word-break|word-spacing|word-wrap|writing-mode|z-index)\b/g,
                strings: /(["'])(?:(?!\1)[^\\]|\\.)*\1/g,
                comments: /(\/\*[\s\S]*?\*\/)/g,
                numbers: /\b\d+\.?\d*(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax|fr)?\b/g,
                selectors: /([.#]?[a-zA-Z_-][a-zA-Z0-9_-]*)\s*(?={)/g,
                pseudoClasses: /:[a-zA-Z_-][a-zA-Z0-9_-]*/g,
                pseudoElements: /::[a-zA-Z_-][a-zA-Z0-9_-]*/g
            },
            html: {
                keywords: /\b(a|abbr|acronym|address|applet|area|article|aside|audio|b|base|basefont|bdi|bdo|big|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|data|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strike|strong|style|sub|summary|sup|svg|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video|wbr)\b/g,
                strings: /(["'])(?:(?!\1)[^\\]|\\.)*\1/g,
                comments: /(<!--[\s\S]*?-->)/g,
                attributes: /\b([a-zA-Z-]+)(?==)/g,
                tags: /(<\/?[a-zA-Z][a-zA-Z0-9]*(?:\s[^>]*)?>)/g,
                doctype: /<!DOCTYPE[^>]*>/gi
            },
            json: {
                keywords: /\b(true|false|null)\b/g,
                strings: /(")(?:(?!\1)[^\\]|\\.)*\1/g,
                numbers: /\b-?\d+\.?\d*\b/g,
                punctuation: /[{}[\],:]/g
            },
            bash: {
                keywords: /\b(alias|bg|bind|break|builtin|caller|cd|command|compgen|complete|continue|declare|dirs|disown|echo|enable|eval|exec|exit|export|fc|fg|getopts|hash|help|history|if|jobs|kill|let|local|logout|mapfile|popd|printf|pushd|read|readarray|return|set|shift|shopt|source|suspend|test|then|times|trap|type|typeset|ulimit|umask|unalias|unset|until|wait|while|case|do|done|elif|else|esac|fi|for|function|in|select|until|while)\b/g,
                strings: /(["'])(?:(?!\1)[^\\]|\\.)*\1/g,
                comments: /#.*$/gm,
                variables: /\$[a-zA-Z_][a-zA-Z0-9_]*/g,
                operators: /[&|;<>()]/g
            },
            sh: {
                keywords: /\b(alias|bg|bind|break|builtin|caller|cd|command|compgen|complete|continue|declare|dirs|disown|echo|enable|eval|exec|exit|export|fc|fg|getopts|hash|help|history|if|jobs|kill|let|local|logout|mapfile|popd|printf|pushd|read|readarray|return|set|shift|shopt|source|suspend|test|then|times|trap|type|typeset|ulimit|umask|unalias|unset|until|wait|while|case|do|done|elif|else|esac|fi|for|function|in|select|until|while)\b/g,
                strings: /(["'])(?:(?!\1)[^\\]|\\.)*\1/g,
                comments: /#.*$/gm,
                variables: /\$[a-zA-Z_][a-zA-Z0-9_]*/g,
                operators: /[&|;<>()]/g
            },
            php: {
                keywords: /\b(abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|yield|yield from|__CLASS__|__DIR__|__FILE__|__FUNCTION__|__LINE__|__METHOD__|__NAMESPACE__|__TRAIT__|true|false|null)\b/g,
                strings: /(["'])(?:(?!\1)[^\\]|\\.)*\1/g,
                comments: /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm,
                numbers: /\b\d+\.?\d*\b/g,
                functions: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g,
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

        // Handle additional pattern types
        if (patterns.functions) {
            let match;
            const regex = new RegExp(patterns.functions.source, patterns.functions.flags);
            while ((match = regex.exec(code)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'function',
                    priority: 5
                });
            }
        }

        if (patterns.variables) {
            let match;
            const regex = new RegExp(patterns.variables.source, patterns.variables.flags);
            while ((match = regex.exec(code)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'variable',
                    priority: 6
                });
            }
        }

        if (patterns.templateLiterals) {
            let match;
            const regex = new RegExp(patterns.templateLiterals.source, patterns.templateLiterals.flags);
            while ((match = regex.exec(code)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'template-literal',
                    priority: 2
                });
            }
        }

        if (patterns.types) {
            let match;
            const regex = new RegExp(patterns.types.source, patterns.types.flags);
            while ((match = regex.exec(code)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'type',
                    priority: 4
                });
            }
        }

        if (patterns.decorators) {
            let match;
            const regex = new RegExp(patterns.decorators.source, patterns.decorators.flags);
            while ((match = regex.exec(code)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'decorator',
                    priority: 4
                });
            }
        }

        if (patterns.annotations) {
            let match;
            const regex = new RegExp(patterns.annotations.source, patterns.annotations.flags);
            while ((match = regex.exec(code)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'annotation',
                    priority: 4
                });
            }
        }

        if (patterns.selectors) {
            let match;
            const regex = new RegExp(patterns.selectors.source, patterns.selectors.flags);
            while ((match = regex.exec(code)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'selector',
                    priority: 4
                });
            }
        }

        if (patterns.pseudoClasses) {
            let match;
            const regex = new RegExp(patterns.pseudoClasses.source, patterns.pseudoClasses.flags);
            while ((match = regex.exec(code)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'pseudo-class',
                    priority: 4
                });
            }
        }

        if (patterns.pseudoElements) {
            let match;
            const regex = new RegExp(patterns.pseudoElements.source, patterns.pseudoElements.flags);
            while ((match = regex.exec(code)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'pseudo-element',
                    priority: 4
                });
            }
        }

        if (patterns.attributes) {
            let match;
            const regex = new RegExp(patterns.attributes.source, patterns.attributes.flags);
            while ((match = regex.exec(code)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'attribute',
                    priority: 4
                });
            }
        }

        if (patterns.tags) {
            let match;
            const regex = new RegExp(patterns.tags.source, patterns.tags.flags);
            while ((match = regex.exec(code)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'tag',
                    priority: 4
                });
            }
        }

        if (patterns.doctype) {
            let match;
            const regex = new RegExp(patterns.doctype.source, patterns.doctype.flags);
            while ((match = regex.exec(code)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'doctype',
                    priority: 4
                });
            }
        }

        if (patterns.punctuation) {
            let match;
            const regex = new RegExp(patterns.punctuation.source, patterns.punctuation.flags);
            while ((match = regex.exec(code)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'punctuation',
                    priority: 7
                });
            }
        }

        if (patterns.operators) {
            let match;
            const regex = new RegExp(patterns.operators.source, patterns.operators.flags);
            while ((match = regex.exec(code)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'operator',
                    priority: 7
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
