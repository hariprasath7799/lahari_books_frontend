'use client';

import React from 'react';
import { Editor } from '@tiptap/core';
import {
    CloudCheck,
    CloudAlert,
    Loader2,
    FileText,
    Type,
    Clock,
    Target,
    BookOpen,
} from 'lucide-react';

interface EditorStatusBarProps {
    editor: Editor | null;
    saveStatus: 'saved' | 'saving' | 'unsaved';
    lastSavedTime?: Date | null;
    targetWordCount?: number;
    onOpenTargetModal?: () => void;
}

export const EditorStatusBar: React.FC<EditorStatusBarProps> = ({
    editor,
    saveStatus,
    lastSavedTime,
    targetWordCount = 5000,
    onOpenTargetModal,
}) => {
    if (!editor) return null;

    const words = editor.storage.characterCount?.words() || 0;
    const characters = editor.storage.characterCount?.characters() || 0;
    const readingTimeMin = Math.ceil(words / 200) || 1;
    const progressPercent = Math.min(Math.round((words / targetWordCount) * 100), 100);

    const formatTime = (date?: Date | null) => {
        if (!date) return '';
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <footer className="sticky bottom-0 z-30 w-full bg-slate-900/90 text-slate-200 backdrop-blur-md border-t border-slate-800 shadow-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs font-sans select-none">
            {/* Left Metrics */}
            <div className="flex items-center gap-4 flex-wrap">
                {/* Word Count */}
                <div className="flex items-center gap-1.5 font-medium text-slate-100 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-mono text-sm">{words.toLocaleString()}</span>
                    <span className="text-slate-400 text-[11px]">words</span>
                </div>

                {/* Character Count */}
                <div className="flex items-center gap-1.5 text-slate-300">
                    <Type className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{characters.toLocaleString()}</span>
                    <span className="text-slate-500 text-[11px]">chars</span>
                </div>

                {/* Reading Time */}
                <div className="hidden sm:flex items-center gap-1.5 text-slate-400 border-l border-slate-800 pl-4">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>~{readingTimeMin} min read</span>
                </div>
            </div>

            {/* Middle Word Target Progress Bar */}
            <div className="flex-1 max-w-xs hidden md:flex items-center gap-3">
                <button
                    type="button"
                    onClick={onOpenTargetModal}
                    className="flex items-center gap-1.5 text-[11px] text-slate-300 hover:text-white transition-colors group shrink-0"
                    title="Click to set target word count"
                >
                    <Target className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
                    <span className="font-mono">{words} / {targetWordCount.toLocaleString()}</span>
                </button>
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 transition-all duration-300 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <span className="text-[10px] font-mono text-slate-400">{progressPercent}%</span>
            </div>

            {/* Right Cloud Sync State Indicator */}
            <div className="flex items-center gap-3">
                {saveStatus === 'saved' && (
                    <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-800/50 animate-in fade-in">
                        <CloudCheck className="w-3.5 h-3.5" />
                        <span className="font-medium text-[11px]">Saved to Cloud</span>
                        {lastSavedTime && (
                            <span className="text-[10px] text-emerald-500/80 font-mono hidden sm:inline">
                                ({formatTime(lastSavedTime)})
                            </span>
                        )}
                    </div>
                )}

                {saveStatus === 'saving' && (
                    <div className="flex items-center gap-1.5 text-indigo-300 bg-indigo-950/50 px-2.5 py-1 rounded-lg border border-indigo-800/50">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                        <span className="font-medium text-[11px]">Syncing to Cloud...</span>
                    </div>
                )}

                {saveStatus === 'unsaved' && (
                    <div className="flex items-center gap-1.5 text-amber-300 bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-800/50">
                        <CloudAlert className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-medium text-[11px]">Unsaved changes</span>
                    </div>
                )}
            </div>
        </footer>
    );
};
