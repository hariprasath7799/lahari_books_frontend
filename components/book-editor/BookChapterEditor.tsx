'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Underline } from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Placeholder } from '@tiptap/extension-placeholder';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';

import { AuthorComment } from './extensions/AuthorComment';
import { BubbleMenuToolbar } from './components/BubbleMenuToolbar';
import { SlashFloatingMenu } from './components/SlashFloatingMenu';
import { EditorStatusBar } from './components/EditorStatusBar';
import { EditorHeaderBar } from './components/EditorHeaderBar';
import { TargetWordModal } from './components/TargetWordModal';
import { sampleChapterHTML } from './data/sampleChapter';

export interface BookChapterEditorProps {
    initialContent?: string | JSONContent;
    onSavePayload?: (payload: { json: JSONContent; html: string; title: string }) => void;
    chapterNumber?: string;
    chapterTitle?: string;
    targetWordCeiling?: number;
}

export function BookChapterEditor({
    initialContent,
    onSavePayload,
    chapterNumber: initialChapterNum = 'Ch. 01',
    chapterTitle: initialChapterTitle = 'The Silent Horizon',
    targetWordCeiling = 5000,
}: BookChapterEditorProps) {
    const [chapterNumber, setChapterNumber] = useState(initialChapterNum);
    const [chapterTitle, setChapterTitle] = useState(initialChapterTitle);
    const [targetWordCount, setTargetWordCount] = useState(targetWordCeiling);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const [lastSavedTime, setLastSavedTime] = useState<Date | null>(new Date());

    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Save Routine callback (extracts structured JSON + HTML)
    const executeAutoSave = useCallback(
        (editorInstance: any) => {
            if (!editorInstance) return;
            setSaveStatus('saving');

            try {
                const jsonPayload = editorInstance.getJSON();
                const htmlPayload = editorInstance.getHTML();

                if (onSavePayload) {
                    onSavePayload({
                        json: jsonPayload,
                        html: htmlPayload,
                        title: chapterTitle,
                    });
                }

                setTimeout(() => {
                    setSaveStatus('saved');
                    setLastSavedTime(new Date());
                }, 400);
            } catch (err) {
                console.error('Autosave error:', err);
                setSaveStatus('unsaved');
            }
        },
        [onSavePayload, chapterTitle]
    );

    // Initialize Tiptap useEditor Hook
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            // 1. StarterKit configured to support only levels 2, 3, and 4 headings
            StarterKit.configure({
                heading: {
                    levels: [2, 3, 4],
                },
                codeBlock: false,
            }),

            // 2. Text Styling Marks
            Subscript,
            Superscript,
            Underline,
            Color,
            TextStyle,
            Highlight.configure({
                multicolor: true,
            }),

            // 3. Advanced UI Extensions
            Placeholder.configure({
                placeholder: 'Begin typing chapter content or type / for quick commands...',
                emptyEditorClass: 'is-editor-empty',
            }),
            CharacterCount,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    class: 'text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-800 transition-colors',
                },
            }),
            Image.configure({
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

            // 4. Custom Editorial Logic Node
            AuthorComment,
        ],
        content: initialContent || sampleChapterHTML,
        editorProps: {
            attributes: {
                // Physical book page paper block styling inspired by Ulysses & Medium
                class:
                    'max-w-2xl mx-auto p-12 bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800/80 rounded-2xl min-h-[75vh] focus:outline-none prose prose-slate dark:prose-invert text-lg leading-relaxed transition-all duration-300 font-serif',
            },
        },

        // Debounced 3-second autosave routine on update
        onUpdate: ({ editor: currentEditor }) => {
            setSaveStatus('unsaved');

            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }

            saveTimerRef.current = setTimeout(() => {
                executeAutoSave(currentEditor);
            }, 3000);
        },

        // Immediate autosave trigger on blur
        onBlur: ({ editor: currentEditor }) => {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
            executeAutoSave(currentEditor);
        },
    });

    // Clean up save timer on unmount
    useEffect(() => {
        return () => {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
        };
    }, []);

    const handleLoadSampleChapter = () => {
        if (editor) {
            editor.commands.setContent(sampleChapterHTML);
            setSaveStatus('unsaved');
            executeAutoSave(editor);
        }
    };

    if (!editor) {
        return (
            <div className="w-full min-h-[600px] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-400 gap-3 rounded-3xl border border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium font-sans">Initializing Author Workspace...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
            {/* Top Workspace Header (Hidden in Distraction-Free Focus Mode) */}
            {!isFocusMode && (
                <EditorHeaderBar
                    editor={editor}
                    chapterTitle={chapterTitle}
                    onTitleChange={setChapterTitle}
                    chapterNumber={chapterNumber}
                    onChapterNumberChange={setChapterNumber}
                    isFocusMode={isFocusMode}
                    onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
                    onOpenTargetModal={() => setIsTargetModalOpen(true)}
                    onLoadSampleChapter={handleLoadSampleChapter}
                    targetWordCount={targetWordCount}
                />
            )}

            {/* Distraction-Free Focus Mode Floating Control */}
            {isFocusMode && (
                <div className="fixed top-4 right-4 z-50">
                    <button
                        type="button"
                        onClick={() => setIsFocusMode(false)}
                        className="px-4 py-2 bg-slate-900/90 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold rounded-full shadow-2xl backdrop-blur-md hover:scale-105 transition-all"
                    >
                        ✕ Exit Focus Mode
                    </button>
                </div>
            )}

            {/* Main Author Workspace Paper Canvas Area */}
            <main className="flex-1 py-10 px-4 overflow-y-auto relative flex justify-center items-start">
                {/* Floating Formatting Bubble Menu (on text selection) */}
                <BubbleMenuToolbar editor={editor} />

                {/* Slash Command Dropdown Floating Menu (on empty line / slash) */}
                <SlashFloatingMenu editor={editor} />

                {/* Main Paper Document Block */}
                <div className="w-full max-w-3xl relative">
                    <EditorContent editor={editor} />
                </div>
            </main>

            {/* Sticky Bottom Status Bar */}
            {!isFocusMode && (
                <EditorStatusBar
                    editor={editor}
                    saveStatus={saveStatus}
                    lastSavedTime={lastSavedTime}
                    targetWordCount={targetWordCount}
                    onOpenTargetModal={() => setIsTargetModalOpen(true)}
                />
            )}

            {/* Target Word Ceiling Config Modal */}
            <TargetWordModal
                isOpen={isTargetModalOpen}
                onClose={() => setIsTargetModalOpen(false)}
                currentTarget={targetWordCount}
                onSaveTarget={setTargetWordCount}
            />
        </div>
    );
}
