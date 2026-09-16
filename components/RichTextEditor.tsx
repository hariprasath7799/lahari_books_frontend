'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Link as LinkExtension } from '@tiptap/extension-link';
import { Image as ImageExtension } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';

import { AuthorComment } from './book-editor/extensions/AuthorComment';
import { BubbleMenuToolbar } from './book-editor/components/BubbleMenuToolbar';
import { SlashFloatingMenu } from './book-editor/components/SlashFloatingMenu';
import { LinkModal } from './book-editor/components/LinkModal';
import { ImageModal } from './book-editor/components/ImageModal';
import { EditorStatusBar } from './book-editor/components/EditorStatusBar';
import { TargetWordModal } from './book-editor/components/TargetWordModal';

import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Quote,
    Heading2,
    Heading3,
    Heading4,
    Undo,
    Redo,
    RemoveFormatting,
    Pilcrow,
    Subscript as SubIcon,
    Superscript as SuperIcon,
    Highlighter,
    Palette,
    Link as LinkIcon,
    Image as ImageIcon,
    Table as TableIcon,
    MessageSquarePlus,
    ChevronDown,
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    minHeight?: string;
    maxHeight?: string;
    targetWordCeiling?: number;
    showStatusBar?: boolean;
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = 'Paste or type book text here...',
    minHeight = '320px',
    maxHeight = '650px',
    targetWordCeiling = 5000,
    showStatusBar = true,
}: RichTextEditorProps) {
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
    const [targetWordCount, setTargetWordCount] = useState(targetWordCeiling);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showHighlightPicker, setShowHighlightPicker] = useState(false);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3, 4],
                },
                codeBlock: false,
            }),
            Underline,
            Subscript,
            Superscript,
            Color,
            TextStyle,
            Highlight.configure({
                multicolor: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass: 'is-editor-empty',
            }),
            CharacterCount,
            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    class: 'text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-800 transition-colors',
                },
            }),
            ImageExtension.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-2xl shadow-lg my-6 max-w-full border border-slate-200 dark:border-slate-800 mx-auto block',
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'w-full border-collapse my-6 rounded-xl overflow-hidden shadow-xs border border-slate-200 dark:border-slate-800',
                },
            }),
            TableRow,
            TableHeader,
            TableCell,
            AuthorComment,
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class: 'prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-full font-serif leading-relaxed text-lg',
            },
        },
        onUpdate: ({ editor: currentEditor }) => {
            onChange(currentEditor.getHTML());
        },
    });

    // Synchronize editor content when value prop changes externally
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    if (!editor) {
        return (
            <div className="w-full h-48 border border-slate-300 dark:border-slate-700 rounded-2xl flex items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading Rich Text Editor...</span>
                </div>
            </div>
        );
    }

    const colors = [
        { name: 'Default Dark', value: '#1e293b' },
        { name: 'Indigo Royalty', value: '#4f46e5' },
        { name: 'Crimson Rose', value: '#e11d48' },
        { name: 'Emerald Forest', value: '#059669' },
        { name: 'Amber Gold', value: '#d97706' },
        { name: 'Purple Plum', value: '#9333ea' },
    ];

    const highlights = [
        { name: 'Warm Yellow', value: '#fef08a' },
        { name: 'Soft Emerald', value: '#a7f3d0' },
        { name: 'Sky Cyan', value: '#bae6fd' },
        { name: 'Blush Pink', value: '#fbcfe8' },
        { name: 'Lavender Violet', value: '#ddd6fe' },
    ];

    const ToolbarButton = ({
        onClick,
        isActive = false,
        disabled = false,
        title,
        children,
    }: {
        onClick: () => void;
        isActive?: boolean;
        disabled?: boolean;
        title: string;
        children: React.ReactNode;
    }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            aria-label={title}
            className={`p-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center ${isActive
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    );

    const Separator = () => (
        <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1 self-center shrink-0" />
    );

    const handleSetLink = (url: string) => {
        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url, target: '_blank' })
            .run();
    };

    const handleUnlink = () => {
        editor.chain().focus().unsetLink().run();
    };

    const handleInsertImage = (src: string, alt?: string, title?: string) => {
        editor
            .chain()
            .focus()
            .setImage({ src, alt: alt || '', title: title || '' })
            .run();
    };

    const handleInsertAuthorComment = () => {
        editor.chain().focus().setAuthorComment({
            comment: 'Editorial note: Check paragraph flow and phrasing.',
            author: 'Senior Editor',
            color: 'amber',
        }).run();
    };

    const currentLinkUrl = editor.getAttributes('link').href || '';

    return (
        <div className="flex flex-col w-full border border-slate-300 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all relative">
            {/* Top Fixed Formatting Toolbar */}
            <div className="sticky top-0 z-20 flex flex-wrap items-center gap-0.5 p-2.5 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 select-none flex-shrink-0 shadow-xs">
                {/* Text Marks */}
                <div className="flex items-center gap-0.5">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Bold (Ctrl+B)"
                    >
                        <Bold className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Italic (Ctrl+I)"
                    >
                        <Italic className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        title="Underline (Ctrl+U)"
                    >
                        <UnderlineIcon className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="Strikethrough"
                    >
                        <Strikethrough className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleSubscript().run()}
                        isActive={editor.isActive('subscript')}
                        title="Subscript"
                    >
                        <SubIcon className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleSuperscript().run()}
                        isActive={editor.isActive('superscript')}
                        title="Superscript"
                    >
                        <SuperIcon className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                <Separator />

                {/* Highlight & Text Color */}
                <div className="flex items-center gap-0.5">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setShowHighlightPicker(!showHighlightPicker);
                                setShowColorPicker(false);
                            }}
                            className={`p-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-0.5 ${editor.isActive('highlight')
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold'
                                    : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                                }`}
                            title="Text Highlight"
                        >
                            <Highlighter className="w-4 h-4" />
                            <ChevronDown className="w-3 h-3 opacity-60" />
                        </button>

                        {showHighlightPicker && (
                            <div className="absolute left-0 top-full mt-1 p-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl flex items-center gap-1.5 z-50 animate-in fade-in zoom-in-95">
                                {highlights.map((hl) => (
                                    <button
                                        key={hl.value}
                                        type="button"
                                        onClick={() => {
                                            editor.chain().focus().toggleHighlight({ color: hl.value }).run();
                                            setShowHighlightPicker(false);
                                        }}
                                        className="w-5 h-5 rounded-full border border-slate-600 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: hl.value }}
                                        title={hl.name}
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        editor.chain().focus().unsetHighlight().run();
                                        setShowHighlightPicker(false);
                                    }}
                                    className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-700"
                                >
                                    Clear
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setShowColorPicker(!showColorPicker);
                                setShowHighlightPicker(false);
                            }}
                            className="p-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors flex items-center gap-0.5"
                            title="Text Color"
                        >
                            <Palette className="w-4 h-4" />
                            <ChevronDown className="w-3 h-3 opacity-60" />
                        </button>

                        {showColorPicker && (
                            <div className="absolute left-0 top-full mt-1 p-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl flex items-center gap-1.5 z-50 animate-in fade-in zoom-in-95">
                                {colors.map((c) => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onClick={() => {
                                            editor.chain().focus().setColor(c.value).run();
                                            setShowColorPicker(false);
                                        }}
                                        className="w-5 h-5 rounded-full border border-slate-600 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: c.value }}
                                        title={c.name}
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        editor.chain().focus().unsetColor().run();
                                        setShowColorPicker(false);
                                    }}
                                    className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-700"
                                >
                                    Reset
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Paragraph Alignment */}
                <div className="flex items-center gap-0.5">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        isActive={editor.isActive({ textAlign: 'left' })}
                        title="Align Left"
                    >
                        <AlignLeft className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        isActive={editor.isActive({ textAlign: 'center' })}
                        title="Align Center"
                    >
                        <AlignCenter className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        isActive={editor.isActive({ textAlign: 'right' })}
                        title="Align Right"
                    >
                        <AlignRight className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        isActive={editor.isActive({ textAlign: 'justify' })}
                        title="Justify Paragraph"
                    >
                        <AlignJustify className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                <Separator />

                {/* Headings & Paragraph */}
                <div className="flex items-center gap-0.5">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setParagraph().run()}
                        isActive={editor.isActive('paragraph') && !editor.isActive('heading')}
                        title="Paragraph Text"
                    >
                        <Pilcrow className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        title="Section Heading (H2)"
                    >
                        <Heading2 className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        title="Subheading (H3)"
                    >
                        <Heading3 className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                        isActive={editor.isActive('heading', { level: 4 })}
                        title="Minor Heading (H4)"
                    >
                        <Heading4 className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                <Separator />

                {/* Lists & Blockquote */}
                <div className="flex items-center gap-0.5">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Bullet List"
                    >
                        <List className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Numbered List"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="Blockquote / Pull Quote"
                    >
                        <Quote className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                <Separator />

                {/* Advanced Media, Tables & Editorial Notes */}
                <div className="flex items-center gap-0.5">
                    <ToolbarButton
                        onClick={() => setIsLinkModalOpen(true)}
                        isActive={editor.isActive('link')}
                        title="Insert Hyperlink"
                    >
                        <LinkIcon className="w-4 h-4" />
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => setIsImageModalOpen(true)}
                        title="Insert Book Illustration"
                    >
                        <ImageIcon className="w-4 h-4" />
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                                .run()
                        }
                        title="Insert Table (3x3)"
                    >
                        <TableIcon className="w-4 h-4" />
                    </ToolbarButton>

                    <button
                        type="button"
                        onClick={handleInsertAuthorComment}
                        className="p-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 hover:bg-amber-200 transition-colors flex items-center gap-1 text-xs font-semibold px-2"
                        title="Insert Editorial Inline Note"
                    >
                        <MessageSquarePlus className="w-3.5 h-3.5" />
                        <span>Note</span>
                    </button>
                </div>

                <Separator />

                {/* Formatting Clean & History */}
                <div className="flex items-center gap-0.5">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                        title="Clear Formatting"
                    >
                        <RemoveFormatting className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo className="w-4 h-4" />
                    </ToolbarButton>
                </div>
            </div>

            {/* Floating Formatting Bubble Menu (on text highlight) */}
            <BubbleMenuToolbar editor={editor} />

            {/* Slash Command Dropdown Floating Menu (on empty line / slash) */}
            <SlashFloatingMenu editor={editor} />

            {/* Scrollable Editable Content Area */}
            <div
                className="p-6 text-slate-800 dark:text-slate-100 text-lg leading-relaxed cursor-text overflow-y-auto flex-1 font-serif"
                style={{ minHeight, maxHeight: maxHeight || '650px' }}
            >
                <EditorContent
                    editor={editor}
                    className="prose dark:prose-invert max-w-none focus:outline-none min-h-full"
                />
            </div>

            {/* Optional Embedded Live Metrics Status Bar */}
            {showStatusBar && (
                <EditorStatusBar
                    editor={editor}
                    saveStatus="saved"
                    targetWordCount={targetWordCount}
                    onOpenTargetModal={() => setIsTargetModalOpen(true)}
                />
            )}

            {/* Modals */}
            <LinkModal
                isOpen={isLinkModalOpen}
                onClose={() => setIsLinkModalOpen(false)}
                onSubmit={handleSetLink}
                onUnlink={handleUnlink}
                initialUrl={currentLinkUrl}
            />

            <ImageModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                onSubmit={handleInsertImage}
            />

            <TargetWordModal
                isOpen={isTargetModalOpen}
                onClose={() => setIsTargetModalOpen(false)}
                currentTarget={targetWordCount}
                onSaveTarget={setTargetWordCount}
            />
        </div>
    );
}
