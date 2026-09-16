'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, X, Link, Upload, Check } from 'lucide-react';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (src: string, alt?: string, title?: string) => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [src, setSrc] = useState('');
    const [alt, setAlt] = useState('');
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');

    const presetImages = [
        {
            name: 'Historical Manuscript',
            url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
            alt: 'Open antique leather bound book with handwritten notes',
        },
        {
            name: 'Library & Bookshelves',
            url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80',
            alt: 'Atmospheric classic library with wooden bookshelves',
        },
        {
            name: 'Vintage Typewriter',
            url: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1200&q=80',
            alt: 'Vintage mechanical typewriter on rustic wooden desk',
        },
    ];

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!src.trim()) {
            setError('Please provide an image URL or choose a preset');
            return;
        }
        onSubmit(src.trim(), alt.trim(), title.trim());
        onClose();
        setSrc('');
        setAlt('');
        setTitle('');
        setError('');
    };

    const handleSelectPreset = (preset: { url: string; alt: string; name: string }) => {
        setSrc(preset.url);
        setAlt(preset.alt);
        setTitle(preset.name);
        setError('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
                        <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            Insert Book Illustration
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Embed high-resolution images or diagrams into your chapter text.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Presets */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                            Choose Sample Asset
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {presetImages.map((preset) => (
                                <button
                                    key={preset.url}
                                    type="button"
                                    onClick={() => handleSelectPreset(preset)}
                                    className={`relative rounded-xl overflow-hidden border text-left p-1 transition-all ${src === preset.url
                                            ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                        }`}
                                >
                                    <img
                                        src={preset.url}
                                        alt={preset.name}
                                        className="w-full h-16 object-cover rounded-lg"
                                    />
                                    <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 block truncate mt-1 px-0.5">
                                        {preset.name}
                                    </span>
                                    {src === preset.url && (
                                        <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-0.5">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center my-2">
                        <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                        <span className="bg-white dark:bg-slate-900 px-2 text-[10px] uppercase font-mono text-slate-400 absolute">
                            or enter URL
                        </span>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Image URL
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={src}
                                onChange={(e) => {
                                    setSrc(e.target.value);
                                    setError('');
                                }}
                                placeholder="https://images.unsplash.com/photo-..."
                                className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <Link className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                        {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Alt Text (Accessibility)
                            </label>
                            <input
                                type="text"
                                value={alt}
                                onChange={(e) => setAlt(e.target.value)}
                                placeholder="Description of image"
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Image Title / Caption
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Figure 1.1 - Illustration"
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
                        >
                            Insert Image
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
