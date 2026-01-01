// components/ui/TextEditor.tsx
'use client'
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type EditorMode = 'plain' | 'rich' | 'markdown' | 'readonly' | 'preview';
type OutputFormat = 'html' | 'markdown' | 'text' | 'json';
type TextAlign = 'left' | 'center' | 'right' | 'justify';
type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
type ListType = 'ordered' | 'unordered' | 'checklist';

interface ToolbarConfig {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    code?: boolean;
    headings?: boolean;
    lists?: boolean;
    links?: boolean;
    images?: boolean;
    tables?: boolean;
    blockquote?: boolean;
    codeBlock?: boolean;
    alignment?: boolean;
    colors?: boolean;
    undo?: boolean;
    clear?: boolean;
}

interface FileUploadConfig {
    enabled: boolean;
    maxSize?: number;
    allowedTypes?: string[];
    onUpload?: (file: File) => Promise<string>;
}

interface ValidationConfig {
    maxLength?: number;
    minLength?: number;
    required?: boolean;
    allowedTags?: string[];
    blockedTags?: string[];
}

interface SanitizationConfig {
    enabled: boolean;
    allowedTags?: string[];
    allowedAttributes?: { [key: string]: string[] };
    stripScripts?: boolean;
}

interface SearchConfig {
    enabled: boolean;
    caseSensitive?: boolean;
    wholeWord?: boolean;
}

interface LocaleConfig {
    language?: string;
    rtl?: boolean;
    placeholderText?: string;
}

interface TextEditorProps {
    mode?: EditorMode;
    outputFormat?: OutputFormat;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string, format: OutputFormat) => void;
    toolbarConfig?: ToolbarConfig;
    customToolbar?: React.ReactNode;
    floatingToolbar?: boolean;
    stickyToolbar?: boolean;
    defaultFontSize?: number;
    defaultFontFamily?: string;
    allowedHeadings?: HeadingLevel[];
    fileUpload?: FileUploadConfig;
    dragDropEnabled?: boolean;
    validation?: ValidationConfig;
    error?: string;
    sanitization?: SanitizationConfig;
    cleanPasteFormatting?: boolean;
    searchConfig?: SearchConfig;
    historyLimit?: number;
    enableUndo?: boolean;
    showCharCount?: boolean;
    showWordCount?: boolean;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    loading?: boolean;
    className?: string;
    editorClassName?: string;
    toolbarClassName?: string;
    minHeight?: number;
    maxHeight?: number;
    locale?: LocaleConfig;
    ariaLabel?: string;
    ariaDescribedBy?: string;
    id?: string;
    name?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    onSelectionChange?: (selection: Selection | null) => void;
    onPaste?: (e: ClipboardEvent) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    preset?: 'simple' | 'comment' | 'description' | 'email' | 'notes' | 'markdown';
    mobileSimplified?: boolean;
    autoFocus?: boolean;
    spellCheck?: boolean;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const sanitizeHTML = (html: string, config?: SanitizationConfig): string => {
    if (!config?.enabled) return html;

    const allowedTags = config.allowedTags || [
        'p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre',
        'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'hr'
    ];

    const allowedAttrs = config.allowedAttributes || {
        a: ['href', 'target', 'rel'],
        img: ['src', 'alt', 'width', 'height'],
        td: ['colspan', 'rowspan'],
        th: ['colspan', 'rowspan'],
    };

    if (config.stripScripts !== false) {
        html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }

    const temp = document.createElement('div');
    temp.innerHTML = html;

    const sanitize = (node: Element): string => {
        const tagName = node.tagName.toLowerCase();

        if (!allowedTags.includes(tagName)) {
            return Array.from(node.childNodes).map(child =>
                child.nodeType === 1 ? sanitize(child as Element) : child.textContent || ''
            ).join('');
        }

        const attrs = Array.from(node.attributes)
            .filter(attr => {
                const allowed = allowedAttrs[tagName as keyof typeof allowedAttrs];
                return allowed && allowed.includes(attr.name);
            })
            .map(attr => `${attr.name}="${attr.value}"`)
            .join(' ');

        const children = Array.from(node.childNodes).map(child =>
            child.nodeType === 1 ? sanitize(child as Element) : child.textContent || ''
        ).join('');

        return `<${tagName}${attrs ? ' ' + attrs : ''}>${children}</${tagName}>`;
    };

    return Array.from(temp.children).map(child => sanitize(child)).join('');
};

const htmlToMarkdown = (html: string): string => {
    let md = html;
    md = md.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n');
    md = md.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n');
    md = md.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n');
    md = md.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
    md = md.replace(/<b>(.*?)<\/b>/gi, '**$1**');
    md = md.replace(/<em>(.*?)<\/em>/gi, '*$1*');
    md = md.replace(/<i>(.*?)<\/i>/gi, '*$1*');
    md = md.replace(/<a href="(.*?)">(.*?)<\/a>/gi, '[$2]($1)');
    md = md.replace(/<img src="(.*?)" alt="(.*?)".*?>/gi, '![$2]($1)');
    md = md.replace(/<li>(.*?)<\/li>/gi, '- $1\n');
    md = md.replace(/<\/?[uo]l>/gi, '\n');
    md = md.replace(/<code>(.*?)<\/code>/gi, '`$1`');
    md = md.replace(/<pre><code>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n');
    md = md.replace(/<\/p>/gi, '\n\n');
    md = md.replace(/<br\s*\/?>/gi, '\n');
    md = md.replace(/<[^>]+>/g, '');
    return md.trim();
};

const markdownToHTML = (md: string): string => {
    let html = md;
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    return `<p>${html}</p>`;
};

const stripHTML = (html: string): string => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
};

const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const getPresetConfig = (preset: string): Partial<TextEditorProps> => {
    const presets: Record<string, Partial<TextEditorProps>> = {
        simple: {
            toolbarConfig: { bold: true, italic: true, links: true },
            minHeight: 100,
        },
        comment: {
            toolbarConfig: { bold: true, italic: true, code: true },
            validation: { maxLength: 1000 },
            minHeight: 80,
        },
        description: {
            toolbarConfig: { headings: true, lists: true, bold: true, italic: true },
            minHeight: 150,
        },
        email: {
            toolbarConfig: { bold: true, italic: true, underline: true, lists: true, images: true, tables: true },
            minHeight: 300,
        },
        notes: {
            mode: 'markdown',
            toolbarConfig: { bold: true, italic: true, headings: true, lists: true, codeBlock: true },
            minHeight: 200,
        },
        markdown: {
            mode: 'markdown',
            outputFormat: 'markdown',
            minHeight: 200,
        },
    };

    return presets[preset] || {};
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TextEditor = forwardRef<HTMLDivElement, TextEditorProps>((props, ref) => {
    const presetConfig = props.preset ? getPresetConfig(props.preset) : {};
    const mergedProps = { ...presetConfig, ...props };

    const {
        mode = 'rich',
        outputFormat = 'html',
        value,
        defaultValue = '',
        onChange,
        toolbarConfig = {
            bold: true,
            italic: true,
            underline: true,
            headings: true,
            lists: true,
            links: true,
            alignment: true,
            undo: true,
        },
        customToolbar,
        fileUpload,
        dragDropEnabled = true,
        validation,
        error,
        sanitization = { enabled: true, stripScripts: true },
        cleanPasteFormatting = true,
        historyLimit = 50,
        enableUndo = true,
        showCharCount = false,
        showWordCount = false,
        placeholder = 'Start typing...',
        disabled = false,
        readOnly = false,
        loading = false,
        className = '',
        editorClassName = '',
        toolbarClassName = '',
        minHeight = 200,
        maxHeight,
        ariaLabel,
        ariaDescribedBy,
        id,
        name,
        onFocus,
        onBlur,
        onSelectionChange,
        autoFocus = false,
        spellCheck = true,
    } = mergedProps;

    const [content, setContent] = useState(value || defaultValue);
    const [history, setHistory] = useState<string[]>([value || defaultValue]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [selectedText, setSelectedText] = useState('');
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const editorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => editorRef.current!);

    useEffect(() => {
        if (value !== undefined && value !== content) {
            setContent(value);
            if (editorRef.current && mode === 'rich') {
                editorRef.current.innerHTML = value;
            }
        }
    }, [value]);

    useEffect(() => {
        if (autoFocus && editorRef.current) {
            editorRef.current.focus();
        }
    }, []);

    const addToHistory = (newContent: string) => {
        if (!enableUndo) return;
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newContent);
        if (newHistory.length > historyLimit) {
            newHistory.shift();
        } else {
            setHistoryIndex(historyIndex + 1);
        }
        setHistory(newHistory);
    };

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            const prevContent = history[newIndex];
            setContent(prevContent);
            if (editorRef.current && mode === 'rich') {
                editorRef.current.innerHTML = prevContent;
            }
            onChange?.(prevContent, outputFormat);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            const nextContent = history[newIndex];
            setContent(nextContent);
            if (editorRef.current && mode === 'rich') {
                editorRef.current.innerHTML = nextContent;
            }
            onChange?.(nextContent, outputFormat);
        }
    };

    const execCommand = (command: string, value?: string) => {
        if (mode !== 'rich' || readOnly || disabled) return;
        document.execCommand(command, false, value);
        handleContentChange();
    };

    const formatText = (tag: string) => {
        execCommand('formatBlock', tag);
    };

    const insertLink = () => {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
            setSelectedText(selection.toString());
            setShowLinkModal(true);
        }
    };

    const applyLink = () => {
        if (linkUrl) {
            execCommand('createLink', linkUrl);
            setShowLinkModal(false);
            setLinkUrl('');
        }
    };

    const insertImage = () => {
        setShowImageModal(true);
    };

    const applyImage = () => {
        if (imageUrl) {
            execCommand('insertImage', imageUrl);
            setShowImageModal(false);
            setImageUrl('');
        }
    };

    const insertTable = () => {
        const rows = 3;
        const cols = 3;
        let table = '<table border="1" style="border-collapse: collapse; width: 100%;"><tbody>';
        for (let i = 0; i < rows; i++) {
            table += '<tr>';
            for (let j = 0; j < cols; j++) {
                table += '<td style="padding: 8px; border: 1px solid #ddd;">Cell</td>';
            }
            table += '</tr>';
        }
        table += '</tbody></table><p><br></p>';
        execCommand('insertHTML', table);
    };

    const clearFormatting = () => {
        execCommand('removeFormat');
        execCommand('formatBlock', 'p');
    };

    const handleContentChange = () => {
        if (!editorRef.current || readOnly || disabled) return;

        let newContent = '';
        if (mode === 'rich') {
            newContent = editorRef.current.innerHTML;
        } else if (mode === 'plain' || mode === 'markdown') {
            newContent = editorRef.current.textContent || '';
        }

        if (validation?.maxLength && newContent.length > validation.maxLength) {
            return;
        }

        if (mode === 'rich' && sanitization.enabled) {
            newContent = sanitizeHTML(newContent, sanitization);
        }

        setContent(newContent);
        addToHistory(newContent);

        let outputValue = newContent;
        if (outputFormat === 'markdown' && mode === 'rich') {
            outputValue = htmlToMarkdown(newContent);
        } else if (outputFormat === 'html' && mode === 'markdown') {
            outputValue = markdownToHTML(newContent);
        } else if (outputFormat === 'text') {
            outputValue = stripHTML(newContent);
        }

        onChange?.(outputValue, outputFormat);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        if (cleanPasteFormatting && mode === 'rich') {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        if (!dragDropEnabled || !fileUpload?.enabled) return;
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (!fileUpload?.enabled || !fileUpload.onUpload) return;
        const files = Array.from(e.dataTransfer.files);
        const imageFile = files.find(f => f.type.startsWith('image/'));
        if (imageFile) {
            const url = await fileUpload.onUpload(imageFile);
            execCommand('insertImage', url);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!fileUpload?.enabled || !fileUpload.onUpload) return;
        const file = e.target.files?.[0];
        if (!file) return;
        if (fileUpload.maxSize && file.size > fileUpload.maxSize) {
            alert(`File size must be less than ${fileUpload.maxSize / 1024 / 1024}MB`);
            return;
        }
        if (fileUpload.allowedTypes && !fileUpload.allowedTypes.includes(file.type)) {
            alert('File type not allowed');
            return;
        }
        const url = await fileUpload.onUpload(file);
        execCommand('insertImage', url);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (enableUndo) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                redo();
            }
        }
        if (e.key === 'Tab') {
            e.preventDefault();
            execCommand('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
        }
    };

    const handleSelectionChange = () => {
        const selection = window.getSelection();
        onSelectionChange?.(selection);
    };

    const renderToolbar = () => {
        if (mode === 'readonly' || mode === 'preview' || customToolbar) {
            return customToolbar;
        }

        return (
            <div
                className={`
    flex flex-wrap items-center gap-1 p-2
    border-b border-gray-200
    bg-gray-50

    text-gray-700
    [&_svg]:text-gray-700
    [&_button]:text-gray-700

    ${toolbarClassName}
  `}
            >

                {toolbarConfig.undo && enableUndo && (
                    <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
                        <button type="button" onClick={undo} disabled={historyIndex === 0} className="p-2 hover:bg-gray-200 rounded disabled:opacity-40 disabled:cursor-not-allowed" title="Undo">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                        </button>
                        <button type="button" onClick={redo} disabled={historyIndex === history.length - 1} className="p-2 hover:bg-gray-200 rounded disabled:opacity-40 disabled:cursor-not-allowed" title="Redo">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                            </svg>
                        </button>
                    </div>
                )}
                {toolbarConfig.bold && <button type="button" onClick={() => execCommand('bold')} className="p-2 hover:bg-gray-200 rounded font-bold" title="Bold">B</button>}
                {toolbarConfig.italic && <button type="button" onClick={() => execCommand('italic')} className="p-2 hover:bg-gray-200 rounded italic" title="Italic">I</button>}
                {toolbarConfig.underline && <button type="button" onClick={() => execCommand('underline')} className="p-2 hover:bg-gray-200 rounded underline" title="Underline">U</button>}
                {toolbarConfig.strikethrough && <button type="button" onClick={() => execCommand('strikeThrough')} className="p-2 hover:bg-gray-200 rounded line-through" title="Strikethrough">S</button>}
                {toolbarConfig.headings && (
                    <select onChange={(e) => formatText(e.target.value)} className="px-2 py-1 border border-gray-300 rounded text-sm" defaultValue="p">
                        <option value="p">Paragraph</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                        <option value="h4">Heading 4</option>
                        <option value="h5">Heading 5</option>
                        <option value="h6">Heading 6</option>
                    </select>
                )}
                {toolbarConfig.lists && (
                    <>
                        <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded" title="Bullet List">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-2 hover:bg-gray-200 rounded" title="Numbered List">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </button>
                    </>
                )}
                {toolbarConfig.alignment && (
                    <div className="flex gap-1 border-l border-gray-300 pl-2 ml-2">
                        <button type="button" onClick={() => execCommand('justifyLeft')} className="p-2 hover:bg-gray-200 rounded" title="Align Left">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8M4 18h12" />
                            </svg>
                        </button>
                        <button type="button" onClick={() => execCommand('justifyCenter')} className="p-2 hover:bg-gray-200 rounded" title="Align Center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h8M6 18h12" />
                            </svg>
                        </button>
                        <button type="button" onClick={() => execCommand('justifyRight')} className="p-2 hover:bg-gray-200 rounded" title="Align Right">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M12 12h8M6 18h16" />
                            </svg>
                        </button>
                    </div>
                )}
                {toolbarConfig.links && (
                    <button type="button" onClick={insertLink} className="p-2 hover:bg-gray-200 rounded" title="Insert Link">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </button>
                )}
                {toolbarConfig.images && (
                    <button type="button" onClick={insertImage} className="p-2 hover:bg-gray-200 rounded" title="Insert Image">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </button>
                )}
                {toolbarConfig.tables && (
                    <button type="button" onClick={insertTable} className="p-2 hover:bg-gray-200 rounded" title="Insert Table">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                )}
                {toolbarConfig.blockquote && (
                    <button type="button" onClick={() => formatText('blockquote')} className="p-2 hover:bg-gray-200 rounded" title="Blockquote">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </button>
                )}
                {toolbarConfig.code && (
                    <button type="button" onClick={() => execCommand('formatBlock', 'pre')} className="p-2 hover:bg-gray-200 rounded font-mono text-sm" title="Code Block">{'</>'}</button>
                )}
                {toolbarConfig.clear && (
                    <button type="button" onClick={clearFormatting} className="p-2 hover:bg-gray-200 rounded border-l border-gray-300 ml-2 pl-2" title="Clear Formatting">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        );
    };

    const charCount = stripHTML(content).length;
    const wordCount = countWords(stripHTML(content));
    const isReadOnly = mode === 'readonly' || mode === 'preview' || readOnly;

    return (
        <div className={`relative ${className}`}>
            {!isReadOnly && renderToolbar()}

            <div
                ref={editorRef}
                contentEditable={!isReadOnly && !disabled && !loading}
                data-placeholder={placeholder}
                onInput={handleContentChange}
                onPaste={handlePaste}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={handleKeyDown}
                onSelect={handleSelectionChange}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                role="textbox"
                aria-label={ariaLabel || 'Text editor'}
                aria-describedby={ariaDescribedBy}
                aria-multiline="true"
                id={id}
                data-name={name}
                spellCheck={spellCheck}
                suppressContentEditableWarning
                className={`
                    w-full px-4 py-3
                    border border-gray-300
                    rounded-b-xl
                    bg-white
                    text-gray-900

                    focus:outline-none
                    focus:ring-2 focus:ring-blue-500
                    focus:border-blue-500

                    transition-all
                    leading-relaxed

                    overflow-y-auto
                    ${editorClassName}

                    ${isReadOnly ? 'bg-gray-50 cursor-default' : ''}
                    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
                    ${loading ? 'animate-pulse' : ''}
                    ${isDragging ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                    ${error ? 'border-red-500 focus:ring-red-500' : ''}
                    `}


                style={{
                    minHeight: `${minHeight}px`,
                    maxHeight: maxHeight ? `${maxHeight}px` : undefined,
                }}
            >
            </div>

            {(showCharCount || showWordCount) && (
                <div className="flex justify-end gap-4 px-4 py-2 text-xs text-gray-500 border-t border-gray-200">
                    {showCharCount && (
                        <span>
                            Characters: {charCount}
                            {validation?.maxLength && ` / ${validation.maxLength}`}
                        </span>
                    )}
                    {showWordCount && <span>Words: {wordCount}</span>}
                </div>
            )}

            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            {showLinkModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                        <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                                <input
                                    type="text"
                                    value={selectedText}
                                    onChange={(e) => setSelectedText(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Link text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                                <input
                                    type="url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://example.com"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowLinkModal(false);
                                        setLinkUrl('');
                                    }}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={applyLink}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Insert
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showImageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                        <h3 className="text-lg font-semibold mb-4">Insert Image</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            {fileUpload?.enabled && (
                                <>
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-300"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-gray-500">OR</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-gray-600"
                                    >
                                        Upload from computer
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </>
                            )}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowImageModal(false);
                                        setImageUrl('');
                                    }}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={applyImage}
                                    disabled={!imageUrl}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Insert
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-gray-600">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Loading...</span>
                    </div>
                </div>
            )}
        </div>
    );
});

TextEditor.displayName = 'TextEditor';

export default TextEditor;