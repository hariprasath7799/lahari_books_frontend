'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X, Sparkles } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none transition-all">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-4 ${
              isSuccess
                ? 'bg-slate-900/95 text-slate-100 border-emerald-500/30 shadow-emerald-950/20'
                : isError
                ? 'bg-slate-900/95 text-slate-100 border-rose-500/30 shadow-rose-950/20'
                : 'bg-slate-900/95 text-slate-100 border-indigo-500/30 shadow-indigo-950/20'
            }`}
          >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {isSuccess && (
                <div className="p-1.5 bg-emerald-500/10 rounded-xl text-emerald-400 ring-1 ring-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              {isError && (
                <div className="p-1.5 bg-rose-500/10 rounded-xl text-rose-400 ring-1 ring-rose-500/20">
                  <AlertCircle className="w-5 h-5" />
                </div>
              )}
              {!isSuccess && !isError && (
                <div className="p-1.5 bg-indigo-500/10 rounded-xl text-indigo-400 ring-1 ring-indigo-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 text-sm pr-2">
              {toast.title && (
                <h4 className="font-semibold text-white tracking-wide text-xs uppercase mb-0.5">
                  {toast.title}
                </h4>
              )}
              <p className="text-slate-300 font-medium leading-snug">{toast.message}</p>
            </div>

            {/* Dismiss button */}
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="flex-shrink-0 p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
