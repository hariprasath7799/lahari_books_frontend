'use client';

import React, { useState } from 'react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Editor } from '@tiptap/core';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Highlighter,
    Link as LinkIcon,
    Subscript as SubIcon,
    Superscript as SuperIcon,
    Palette,
    MessageSquarePlus,
    ChevronDown,
} from 'lucide-react';
import { LinkModal } from './LinkModal';

interface BubbleMenuToolbarProps {
    editor: Editor;
}

export const BubbleMenuToolbar: React.FC<BubbleMenuToolbarProps> = ({ editor }) => {
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showHighlightPicker, setShowHighlightPicker] = useState(false);

    if (!editor) return null;

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

    const currentLinkUrl = editor.getAttributes('link').href || '';

    const handleAddEditorialComment = () => {
        const selectionText = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            ' '
        );

        editor
            .chain()
            .focus()
            .setAuthorComment({
                comment: selectionText
                    ? `Review selection: "${selectionText.slice(0, 40)}..."`
                    : 'Editorial note: Check paragraph flow and tone.',
                author: 'Senior Editor',
                color: 'amber',
            })
            .run();
    };

    return (
        <>
            <BubbleMenu
                editor={editor}
                className="flex items-center gap-0.5 p-1.5 rounded-2xl bg-slate-900/95 text-slate-100 backdrop-blur-md border border-slate-700/80 shadow-2xl z-40 select-none animate-in fade-in zoom-in-95 duration-150"
            >
                {/* Text Formatting Controls */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded-xl transition-all ${editor.isActive('bold')
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="w-4 h-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded-xl transition-all ${editor.isActive('italic')
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="w-4 h-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-1.5 rounded-xl transition-all ${editor.isActive('underline')
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    title="Underline (Ctrl+U)"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </button>

                <div className="w-[1px] h-5 bg-slate-700 mx-1" />

                {/* Subscript & Superscript */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleSubscript().run()}
                    className={`p-1.5 rounded-xl transition-all ${editor.isActive('subscript')
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    title="Subscript"
                >
                    <SubIcon className="w-4 h-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleSuperscript().run()}
                    className={`p-1.5 rounded-xl transition-all ${editor.isActive('superscript')
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    title="Superscript"
                >
                    <SuperIcon className="w-4 h-4" />
                </button>

                <div className="w-[1px] h-5 bg-slate-700 mx-1" />

                {/* Highlight Picker Popover */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            setShowHighlightPicker(!showHighlightPicker);
                            setShowColorPicker(false);
                        }}
                        className={`p-1.5 rounded-xl transition-all flex items-center gap-0.5 ${editor.isActive('highlight')
                                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                        title="Text Highlight"
                    >
                        <Highlighter className="w-4 h-4" />
                        <ChevronDown className="w-3 h-3 opacity-60" />
                    </button>

                    {showHighlightPicker && (
                        <div className="absolute left-0 bottom-full mb-2 p-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl flex items-center gap-1.5 z-50 animate-in fade-in zoom-in-95">
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

                {/* Text Color Picker Popover */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            setShowColorPicker(!showColorPicker);
                            setShowHighlightPicker(false);
                        }}
                        className="p-1.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all flex items-center gap-0.5"
                        title="Text Color"
                    >
                        <Palette className="w-4 h-4" />
                        <ChevronDown className="w-3 h-3 opacity-60" />
                    </button>

                    {showColorPicker && (
                        <div className="absolute left-0 bottom-full mb-2 p-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl flex items-center gap-1.5 z-50 animate-in fade-in zoom-in-95">
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

                <div className="w-[1px] h-5 bg-slate-700 mx-1" />

                {/* Link Toggle */}
                <button
                    type="button"
                    onClick={() => setIsLinkModalOpen(true)}
                    className={`p-1.5 rounded-xl transition-all ${editor.isActive('link')
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    title="Add / Edit Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </button>

                {/* Editorial Comment Insert */}
                <button
                    type="button"
                    onClick={handleAddEditorialComment}
                    className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-white transition-all flex items-center gap-1 text-xs font-medium px-2"
                    title="Insert Editorial Note annotation block"
                >
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>Note</span>
                </button>
            </BubbleMenu>

            <LinkModal
                isOpen={isLinkModalOpen}
                onClose={() => setIsLinkModalOpen(false)}
                onSubmit={handleSetLink}
                onUnlink={handleUnlink}
                initialUrl={currentLinkUrl}
            />
        </>
    );
};
