'use client';

import React, { useState } from 'react';
import { Target, X, Check } from 'lucide-react';

interface TargetWordModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTarget: number;
    onSaveTarget: (target: number) => void;
}

export const TargetWordModal: React.FC<TargetWordModalProps> = ({
    isOpen,
    onClose,
    currentTarget,
    onSaveTarget,
}) => {
    const [target, setTarget] = useState(currentTarget);

    if (!isOpen) return null;

    const quickTargets = [2500, 4000, 5000, 7500, 10000];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveTarget(Number(target) || 5000);
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
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-xl">
                        <Target className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            Set Soft Target Word Ceiling
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Define your chapter writing goal to track real-time progress.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Target Word Count
                        </label>
                        <input
                            type="number"
                            min="500"
                            max="50000"
                            step="500"
                            value={target}
                            onChange={(e) => setTarget(Number(e.target.value))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                            Standard Publishing Presets
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {quickTargets.map((val) => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setTarget(val)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1 ${target === val
                                            ? 'bg-amber-500 text-white font-semibold shadow-xs'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                                        }`}
                                >
                                    {val.toLocaleString()} words
                                    {target === val && <Check className="w-3 h-3" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors"
                        >
                            Save Target
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
