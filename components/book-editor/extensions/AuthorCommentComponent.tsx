'use client';

import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { MessageSquare, Trash2, CheckCircle2, User, Clock, Edit2 } from 'lucide-react';

export const AuthorCommentComponent: React.FC<NodeViewProps> = ({
    node,
    updateAttributes,
    deleteNode,
    selected,
}) => {
    const { comment, author, createdAt, color = 'amber' } = node.attrs;
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(comment || '');

    const themeStyles = {
        amber: {
            bg: 'bg-amber-50/90 dark:bg-amber-950/40',
            border: 'border-amber-300 dark:border-amber-700/60',
            text: 'text-amber-900 dark:text-amber-200',
            badge: 'bg-amber-200/80 text-amber-800 dark:bg-amber-900/80 dark:text-amber-300',
            accent: 'text-amber-600 dark:text-amber-400',
            hover: 'hover:bg-amber-100 dark:hover:bg-amber-900/60',
        },
        indigo: {
            bg: 'bg-indigo-50/90 dark:bg-indigo-950/40',
            border: 'border-indigo-300 dark:border-indigo-700/60',
            text: 'text-indigo-900 dark:text-indigo-200',
            badge: 'bg-indigo-200/80 text-indigo-800 dark:bg-indigo-900/80 dark:text-indigo-300',
            accent: 'text-indigo-600 dark:text-indigo-400',
            hover: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/60',
        },
        rose: {
            bg: 'bg-rose-50/90 dark:bg-rose-950/40',
            border: 'border-rose-300 dark:border-rose-700/60',
            text: 'text-rose-900 dark:text-rose-200',
            badge: 'bg-rose-200/80 text-rose-800 dark:bg-rose-900/80 dark:text-rose-300',
            accent: 'text-rose-600 dark:text-rose-400',
            hover: 'hover:bg-rose-100 dark:hover:bg-rose-900/60',
        },
    };

    const currentTheme = themeStyles[color as keyof typeof themeStyles] || themeStyles.amber;

    const handleSaveComment = () => {
        updateAttributes({ comment: editedComment });
        setIsEditing(false);
    };

    const formattedDate = createdAt
        ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Just now';

    return (
        <NodeViewWrapper className="inline-block my-1 mx-1 align-middle select-none">
            <span
                className={`group relative inline-flex flex-col gap-1 p-2.5 rounded-xl border text-xs font-sans shadow-xs transition-all duration-200 ${currentTheme.bg
                    } ${currentTheme.border} ${currentTheme.text} ${selected ? 'ring-2 ring-indigo-500 shadow-md scale-[1.01]' : ''
                    }`}
                contentEditable={false}
            >
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-3 border-b border-black/5 dark:border-white/10 pb-1.5">
                    <div className="flex items-center gap-1.5">
                        <span className={`p-1 rounded-md ${currentTheme.badge}`}>
                            <MessageSquare className="w-3 h-3" />
                        </span>
                        <span className="font-semibold tracking-tight flex items-center gap-1">
                            <User className="w-3 h-3 opacity-70" />
                            {author || 'Editor Note'}
                        </span>
                        <span className="text-[10px] opacity-60 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {formattedDate}
                        </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        {!isEditing ? (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className={`p-1 rounded-md transition-colors ${currentTheme.hover}`}
                                title="Edit editorial comment"
                            >
                                <Edit2 className="w-3 h-3" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSaveComment}
                                className="p-1 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                                title="Save note"
                            >
                                <CheckCircle2 className="w-3 h-3" />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={deleteNode}
                            className="p-1 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                            title="Resolve & Remove Note"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Body Content */}
                <div className="pt-0.5">
                    {isEditing ? (
                        <div className="flex flex-col gap-1.5 pt-1">
                            <textarea
                                value={editedComment}
                                onChange={(e) => setEditedComment(e.target.value)}
                                className="w-full text-xs p-1.5 rounded border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                rows={2}
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={handleSaveComment}
                                className="self-end px-2 py-0.5 text-[11px] font-medium rounded bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                            >
                                Update Note
                            </button>
                        </div>
                    ) : (
                        <p className="italic leading-relaxed font-serif text-[13px] opacity-95">
                            "{comment || 'No comment text added.'}"
                        </p>
                    )}
                </div>

                {/* Non-printing metadata tag indicator */}
                <span className="text-[9px] uppercase tracking-wider font-mono opacity-50 text-right pt-0.5">
                    [Non-printing Editorial Metadata]
                </span>
            </span>
        </NodeViewWrapper>
    );
};
