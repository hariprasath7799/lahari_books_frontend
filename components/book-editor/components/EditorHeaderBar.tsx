'use client';

import React, { useState } from 'react';
import { Editor } from '@tiptap/core';
import {
    BookOpen,
    Eye,
    EyeOff,
    Download,
    Target,
    Sparkles,
    FileJson,
    FileCode,
    Copy,
    Check,
    ChevronDown,
} from 'lucide-react';

interface EditorHeaderBarProps {
    editor: Editor | null;
    chapterTitle: string;
    onTitleChange: (title: string) => void;
    chapterNumber: string;
    onChapterNumberChange: (num: string) => void;
    isFocusMode: boolean;
    onToggleFocusMode: () => void;
    onOpenTargetModal: () => void;
    onLoadSampleChapter: () => void;
    targetWordCount: number;
}

export const EditorHeaderBar: React.FC<EditorHeaderBarProps> = ({
    editor,
    chapterTitle,
    onTitleChange,
    chapterNumber,
    onChapterNumberChange,
    isFocusMode,
    onToggleFocusMode,
    onOpenTargetModal,
    onLoadSampleChapter,
    targetWordCount,
}) => {
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!editor) return null;

    const handleExportJSON = () => {
        const json = editor.getJSON();
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${chapterTitle.toLowerCase().replace(/\s+/g, '-') || 'chapter'}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setShowExportMenu(false);
    };

    const handleExportHTML = () => {
        const html = editor.getHTML();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${chapterTitle.toLowerCase().replace(/\s+/g, '-') || 'chapter'}.html`;
        a.click();
        URL.revokeObjectURL(url);
        setShowExportMenu(false);
    };

    const handleCopyText = () => {
        const text = editor.getText();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setShowExportMenu(false);
    };

    return (
        <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between gap-4 transition-all duration-300">
            {/* Left: Chapter Metadata Inputs */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
                    <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <input
                        type="text"
                        value={chapterNumber}
                        onChange={(e) => onChapterNumberChange(e.target.value)}
                        placeholder="Ch. 01"
                        className="w-16 font-mono text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase text-center shrink-0"
                    />
                    <input
                        type="text"
                        value={chapterTitle}
                        onChange={(e) => onTitleChange(e.target.value)}
                        placeholder="Chapter Title..."
                        className="font-serif text-lg font-bold bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-lg px-2 py-1 flex-1 min-w-0 truncate"
                    />
                </div>
            </div>

            {/* Right: Author Workspace Controls */}
            <div className="flex items-center gap-2">
                {/* Sample Content Loader */}
                <button
                    type="button"
                    onClick={onLoadSampleChapter}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-colors"
                    title="Load sample chapter content"
                >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Sample Chapter</span>
                </button>

                {/* Target Word Count setting */}
                <button
                    type="button"
                    onClick={onOpenTargetModal}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Configure target word count"
                >
                    <Target className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden md:inline">Goal:</span>
                    <span className="font-mono">{targetWordCount.toLocaleString()}w</span>
                </button>

                {/* Focus Mode Toggle */}
                <button
                    type="button"
                    onClick={onToggleFocusMode}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${isFocusMode
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    title="Toggle distraction-free writing mode"
                >
                    {isFocusMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{isFocusMode ? 'Exit Focus' : 'Focus Mode'}</span>
                </button>

                {/* Export Dropdown Menu */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white shadow-xs transition-colors"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export</span>
                        <ChevronDown className="w-3 h-3 opacity-60" />
                    </button>

                    {showExportMenu && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                            <button
                                type="button"
                                onClick={handleExportJSON}
                                className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2 font-medium"
                            >
                                <FileJson className="w-4 h-4 text-indigo-500" />
                                <span>Export Tiptap JSON</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleExportHTML}
                                className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2 font-medium"
                            >
                                <FileCode className="w-4 h-4 text-emerald-500" />
                                <span>Export Clean HTML</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleCopyText}
                                className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2 font-medium"
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-emerald-500" />
                                ) : (
                                    <Copy className="w-4 h-4 text-amber-500" />
                                )}
                                <span>{copied ? 'Copied to Clipboard!' : 'Copy Plain Text'}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
