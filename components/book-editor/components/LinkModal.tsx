'use client';

import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, ExternalLink, Unlink, X } from 'lucide-react';

interface LinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (url: string) => void;
    onUnlink?: () => void;
    initialUrl?: string;
}

export const LinkModal: React.FC<LinkModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    onUnlink,
    initialUrl = '',
}) => {
    const [url, setUrl] = useState(initialUrl);
    const [error, setError] = useState('');

    useEffect(() => {
        setUrl(initialUrl);
        setError('');
    }, [initialUrl, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let formattedUrl = url.trim();
        if (!formattedUrl) {
            setError('Please enter a valid URL');
            return;
        }

        if (!/^https?:\/\//i.test(formattedUrl) && !/^mailto:/i.test(formattedUrl)) {
            formattedUrl = `https://${formattedUrl}`;
        }

        onSubmit(formattedUrl);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
                        <LinkIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            {initialUrl ? 'Edit Hyperlink' : 'Insert Hyperlink'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Add a web link reference to the selected chapter text.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Destination URL
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => {
                                    setUrl(e.target.value);
                                    setError('');
                                }}
                                placeholder="https://example.com/source-reference"
                                className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                autoFocus
                            />
                            <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        </div>
                        {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        {onUnlink && initialUrl ? (
                            <button
                                type="button"
                                onClick={() => {
                                    onUnlink();
                                    onClose();
                                }}
                                className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            >
                                <Unlink className="w-3.5 h-3.5" />
                                Remove Link
                            </button>
                        ) : (
                            <div />
                        )}

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                            >
                                {initialUrl ? 'Update Link' : 'Insert Link'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
