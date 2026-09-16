'use client';

import React, { useState, useEffect } from 'react';
import { FloatingMenu } from '@tiptap/react/menus';
import { Editor } from '@tiptap/core';
import {
    Heading2,
    Heading3,
    Heading4,
    List,
    ListOrdered,
    Quote,
    Table as TableIcon,
    Image as ImageIcon,
    MessageSquarePlus,
    Search,
    Sparkles,
} from 'lucide-react';
import { ImageModal } from './ImageModal';

interface SlashFloatingMenuProps {
    editor: Editor;
}

export const SlashFloatingMenu: React.FC<SlashFloatingMenuProps> = ({ editor }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    if (!editor) return null;

    const commands = [
        {
            id: 'h2',
            title: 'Section Heading (H2)',
            description: 'Major chapter section divider',
            icon: Heading2,
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
            id: 'h3',
            title: 'Subheading (H3)',
            description: 'Subsection header for topics',
            icon: Heading3,
            action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        },
        {
            id: 'h4',
            title: 'Minor Heading (H4)',
            description: 'Small subsection title',
            icon: Heading4,
            action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
        },
        {
            id: 'bullet-list',
            title: 'Bulleted List',
            description: 'Create an un-ordered bullet point list',
            icon: List,
            action: () => editor.chain().focus().toggleBulletList().run(),
        },
        {
            id: 'ordered-list',
            title: 'Numbered List',
            description: 'Create a sequential numbered list',
            icon: ListOrdered,
            action: () => editor.chain().focus().toggleOrderedList().run(),
        },
        {
            id: 'blockquote',
            title: 'Pull Quote / Blockquote',
            description: 'Highlight a memorable book passage',
            icon: Quote,
            action: () => editor.chain().focus().toggleBlockquote().run(),
        },
        {
            id: 'table',
            title: 'Insert Table (3x3)',
            description: 'Add a formatted data table to chapter',
            icon: TableIcon,
            action: () =>
                editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run(),
        },
        {
            id: 'image',
            title: 'Import Book Illustration',
            description: 'Embed high resolution image asset',
            icon: ImageIcon,
            action: () => setIsImageModalOpen(true),
        },
        {
            id: 'author-comment',
            title: 'Editorial Inline Note',
            description: 'Insert non-printing editor comment block',
            icon: MessageSquarePlus,
            action: () =>
                editor.chain().focus().setAuthorComment({
                    comment: 'Editorial note: Check citation or review phrasing.',
                    author: 'Senior Editor',
                    color: 'amber',
                }).run(),
        },
    ];

    const filteredCommands = commands.filter(
        (cmd) =>
            cmd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cmd.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInsertImage = (src: string, alt?: string, title?: string) => {
        editor
            .chain()
            .focus()
            .setImage({ src, alt: alt || '', title: title || '' })
            .run();
    };

    return (
        <>
            <FloatingMenu
                editor={editor}
                className="w-72 bg-slate-900/95 text-slate-100 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-150"
            >
                <div className="p-2 border-b border-slate-800 flex items-center gap-2 bg-slate-950/60">
                    <Search className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Type command or filter..."
                        className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none py-1"
                        autoFocus
                    />
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 mr-1.5" />
                </div>

                <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
                    {filteredCommands.length > 0 ? (
                        filteredCommands.map((cmd) => {
                            const IconComponent = cmd.icon;
                            return (
                                <button
                                    key={cmd.id}
                                    type="button"
                                    onClick={() => {
                                        cmd.action();
                                        setSearchTerm('');
                                    }}
                                    className="w-full text-left p-2 rounded-xl hover:bg-indigo-600/30 hover:border-indigo-500/30 border border-transparent transition-all flex items-start gap-2.5 group"
                                >
                                    <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-indigo-600 text-slate-300 group-hover:text-white transition-colors shrink-0">
                                        <IconComponent className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                                            {cmd.title}
                                        </p>
                                        <p className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate">
                                            {cmd.description}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div className="p-4 text-center text-xs text-slate-400">
                            No matching command found
                        </div>
                    )}
                </div>
            </FloatingMenu>

            <ImageModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                onSubmit={handleInsertImage}
            />
        </>
    );
};
