'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ThemeConfig } from '@/components/ThemeSelector';
export type { ThemeConfig };

// Ornate Classical Corner SVG Component matching Victorian/Baroque frame design
export const ClassicalCornerSVG = ({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) => (
    <svg viewBox="0 0 120 120" className={className} style={style} fill="currentColor">
        <g fill="currentColor">
            {/* Double Border Parallel Lines inside Corner */}
            <path d="M 8,8 L 115,8 L 115,11 L 11,11 L 11,115 L 8,115 Z" opacity="0.95" />
            <path d="M 15,15 L 110,15 L 110,17.5 L 17.5,17.5 L 17.5,110 L 15,110 Z" opacity="0.85" />

            {/* Main Corner Floral Scroll & Leafwork */}
            <path d="M 22,22 C 32,12 50,16 58,26 C 66,36 54,52 40,44 C 28,38 34,24 45,22 C 54,20 58,32 48,36 C 40,40 34,30 42,24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 22,22 C 12,32 16,50 26,58 C 36,66 52,54 44,40 C 38,28 24,34 22,45 C 20,54 32,58 36,48 C 40,40 30,34 24,42" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />

            {/* Central Ornate Crest Motif */}
            <path d="M 26,26 C 18,18 12,26 18,36 C 24,46 36,54 48,50 C 56,48 60,38 52,30 C 44,22 34,30 28,26 Z" />
            <path d="M 38,12 C 52,16 68,14 82,12 C 74,22 62,24 54,34 C 46,26 44,16 38,12 Z" />
            <path d="M 12,38 C 16,52 14,68 12,82 C 22,74 24,62 34,54 C 26,46 16,44 12,38 Z" />

            {/* Filigree Accent Circles */}
            <circle cx="28" cy="28" r="3.5" />
            <circle cx="48" cy="18" r="2.8" />
            <circle cx="18" cy="48" r="2.8" />
            <circle cx="75" cy="14" r="2.2" />
            <circle cx="14" cy="75" r="2.2" />
        </g>
    </svg>
);

interface BookFrameProps {
    selectedBorderId: string;
    activeTheme: ThemeConfig;
    swipeOffset?: number;
    isSwiping?: boolean;
    pageNumber?: number;
    totalPages?: number;
    onTouchStart?: (e: React.TouchEvent<HTMLDivElement>) => void;
    onTouchMove?: (e: React.TouchEvent<HTMLDivElement>) => void;
    onTouchEnd?: () => void;
    children: React.ReactNode;
}

export default function BookFrame({
    selectedBorderId,
    activeTheme,
    swipeOffset = 0,
    isSwiping = false,
    pageNumber = 1,
    totalPages = 1,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    children,
}: BookFrameProps) {
    const commonProps = {
        onTouchStart,
        onTouchMove,
        onTouchEnd,
    };

    const transformStyle: React.CSSProperties = {
        transform: `translateX(${swipeOffset}px)`,
        transition: isSwiping ? 'none' : 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), background-color 300ms, border-color 300ms',
        willChange: 'transform',
    };

    const renderSwipePill = () => {
        if (swipeOffset === 0) return null;
        return (
            <div className={`absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold shadow-xl transition-all flex items-center gap-1.5 z-30 backdrop-blur-md ${
                swipeOffset < 0 ? 'bg-indigo-600 text-white' : 'bg-teal-600 text-white'
            }`}>
                {swipeOffset < 0 ? (
                    <>Next Page {pageNumber < totalPages ? pageNumber + 1 : ''} <ChevronRight className="w-3.5 h-3.5" /></>
                ) : (
                    <><ChevronLeft className="w-3.5 h-3.5" /> Previous Page {pageNumber > 1 ? pageNumber - 1 : ''}</>
                )}
            </div>
        );
    };

    switch (selectedBorderId) {
        case 'royal-filigree':
            return (
                <div
                    {...commonProps}
                    className="relative p-8 sm:p-14 md:p-20 rounded-2xl transition-all duration-300 shadow-2xl overflow-hidden touch-pan-y"
                    style={{
                        borderColor: activeTheme.borderColor,
                        backgroundColor: activeTheme.isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.4)',
                        boxShadow: activeTheme.isDark
                            ? '0 20px 40px -15px rgba(0,0,0,0.7), inset 0 0 30px rgba(0,0,0,0.3)'
                            : '0 20px 40px -15px rgba(0,0,0,0.08), inset 0 0 30px rgba(255,255,255,0.5)',
                        ...transformStyle,
                    }}
                >
                    <div className="absolute top-2 left-2 text-current opacity-85 pointer-events-none select-none">
                        <ClassicalCornerSVG className="w-16 h-16 sm:w-24 sm:h-24" />
                    </div>
                    <div className="absolute top-2 right-2 text-current opacity-85 pointer-events-none select-none scale-x-[-1]">
                        <ClassicalCornerSVG className="w-16 h-16 sm:w-24 sm:h-24" />
                    </div>
                    <div className="absolute bottom-2 left-2 text-current opacity-85 pointer-events-none select-none scale-y-[-1]">
                        <ClassicalCornerSVG className="w-16 h-16 sm:w-24 sm:h-24" />
                    </div>
                    <div className="absolute bottom-2 right-2 text-current opacity-85 pointer-events-none select-none scale-[-1]">
                        <ClassicalCornerSVG className="w-16 h-16 sm:w-24 sm:h-24" />
                    </div>

                    <div className="absolute top-[18px] left-20 right-20 sm:left-28 sm:right-28 pointer-events-none flex flex-col gap-[3px] opacity-85">
                        <div className="w-full h-[1.5px] bg-current" />
                        <div className="w-full h-[1.5px] bg-current" />
                    </div>
                    <div className="absolute bottom-[18px] left-20 right-20 sm:left-28 sm:right-28 pointer-events-none flex flex-col gap-[3px] opacity-85">
                        <div className="w-full h-[1.5px] bg-current" />
                        <div className="w-full h-[1.5px] bg-current" />
                    </div>
                    <div className="absolute top-20 bottom-20 sm:top-28 sm:bottom-28 left-[18px] pointer-events-none flex gap-[3px] opacity-85 h-[calc(100%-160px)] sm:h-[calc(100%-224px)]">
                        <div className="h-full w-[1.5px] bg-current" />
                        <div className="h-full w-[1.5px] bg-current" />
                    </div>
                    <div className="absolute top-20 bottom-20 sm:top-28 sm:bottom-28 right-[18px] pointer-events-none flex gap-[3px] opacity-85 h-[calc(100%-160px)] sm:h-[calc(100%-224px)]">
                        <div className="h-full w-[1.5px] bg-current" />
                        <div className="h-full w-[1.5px] bg-current" />
                    </div>

                    {renderSwipePill()}
                    {children}
                </div>
            );

        case 'double-classic':
            return (
                <div
                    {...commonProps}
                    className="relative p-6 sm:p-10 md:p-14 rounded-3xl border-4 border-double shadow-2xl overflow-hidden touch-pan-y"
                    style={{
                        borderColor: activeTheme.borderColor,
                        backgroundColor: activeTheme.isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.4)',
                        ...transformStyle,
                    }}
                >
                    <div className="absolute inset-3 border border-dashed rounded-2xl pointer-events-none opacity-30" style={{ borderColor: activeTheme.borderColor }} />
                    <div className="flex items-center justify-center gap-3 mb-8 opacity-50 select-none">
                        <span className="h-[1px] w-12 bg-current opacity-40" />
                        <span className="text-xs tracking-widest font-serif">❖  ⚜  ❖</span>
                        <span className="h-[1px] w-12 bg-current opacity-40" />
                    </div>
                    {renderSwipePill()}
                    {children}
                    <div className="flex items-center justify-center gap-3 mt-10 opacity-50 select-none">
                        <span className="h-[1px] w-16 bg-current opacity-40" />
                        <span className="text-xs font-serif tracking-widest">✦ ❦ ✦</span>
                        <span className="h-[1px] w-16 bg-current opacity-40" />
                    </div>
                </div>
            );

        case 'gold-inset':
            return (
                <div
                    {...commonProps}
                    className="relative p-8 sm:p-12 md:p-16 rounded-3xl border-2 border-amber-500/60 shadow-amber-500/10 shadow-2xl overflow-hidden touch-pan-y"
                    style={{
                        backgroundColor: activeTheme.isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)',
                        ...transformStyle,
                    }}
                >
                    <div className="absolute inset-3 border-2 border-amber-400/40 rounded-2xl pointer-events-none" />
                    <div className="absolute top-4 left-4 text-amber-500 text-sm opacity-80 pointer-events-none select-none font-serif">⚜</div>
                    <div className="absolute top-4 right-4 text-amber-500 text-sm opacity-80 pointer-events-none select-none font-serif">⚜</div>
                    <div className="absolute bottom-4 left-4 text-amber-500 text-sm opacity-80 pointer-events-none select-none font-serif">⚜</div>
                    <div className="absolute bottom-4 right-4 text-amber-500 text-sm opacity-80 pointer-events-none select-none font-serif">⚜</div>
                    {renderSwipePill()}
                    {children}
                </div>
            );

        case 'vintage-parchment':
            return (
                <div
                    {...commonProps}
                    className="relative p-6 sm:p-10 md:p-14 rounded-2xl border-2 border-dashed shadow-xl overflow-hidden touch-pan-y"
                    style={{
                        borderColor: activeTheme.borderColor,
                        backgroundColor: activeTheme.isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.35)',
                        ...transformStyle,
                    }}
                >
                    <div className="absolute top-2 left-3 text-sm opacity-60 font-serif pointer-events-none select-none">╔</div>
                    <div className="absolute top-2 right-3 text-sm opacity-60 font-serif pointer-events-none select-none">╗</div>
                    <div className="absolute bottom-2 left-3 text-sm opacity-60 font-serif pointer-events-none select-none">╚</div>
                    <div className="absolute bottom-2 right-3 text-sm opacity-60 font-serif pointer-events-none select-none">╝</div>
                    {renderSwipePill()}
                    {children}
                </div>
            );

        case 'baroque-scroll':
            return (
                <div
                    {...commonProps}
                    className="relative p-8 sm:p-12 md:p-16 rounded-3xl border-2 shadow-2xl overflow-hidden touch-pan-y"
                    style={{
                        borderColor: activeTheme.borderColor,
                        backgroundColor: activeTheme.isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.4)',
                        ...transformStyle,
                    }}
                >
                    <div className="absolute inset-3 border-2 border-dotted rounded-2xl opacity-60 pointer-events-none" style={{ borderColor: activeTheme.borderColor }} />
                    <div className="absolute top-4 left-5 text-lg opacity-70 pointer-events-none select-none">❦</div>
                    <div className="absolute top-4 right-5 text-lg opacity-70 pointer-events-none select-none scale-x-[-1]">❦</div>
                    <div className="absolute bottom-4 left-5 text-lg opacity-70 pointer-events-none select-none scale-y-[-1]">❦</div>
                    <div className="absolute bottom-4 right-5 text-lg opacity-70 pointer-events-none select-none scale-[-1]">❦</div>
                    {renderSwipePill()}
                    {children}
                </div>
            );

        case 'minimal-crest':
            return (
                <div
                    {...commonProps}
                    className="relative p-6 sm:p-10 md:p-14 rounded-2xl border shadow-lg overflow-hidden touch-pan-y"
                    style={{
                        borderColor: activeTheme.borderColor,
                        backgroundColor: activeTheme.isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                        ...transformStyle,
                    }}
                >
                    <div className="absolute top-3 left-4 text-xs opacity-60 pointer-events-none select-none">✦</div>
                    <div className="absolute top-3 right-4 text-xs opacity-60 pointer-events-none select-none">✦</div>
                    <div className="absolute bottom-3 left-4 text-xs opacity-60 pointer-events-none select-none">✦</div>
                    <div className="absolute bottom-3 right-4 text-xs opacity-60 pointer-events-none select-none">✦</div>
                    {renderSwipePill()}
                    {children}
                </div>
            );

        case 'clean-frameless':
        default:
            return (
                <div
                    {...commonProps}
                    className="relative p-6 sm:p-10 md:p-12 rounded-3xl shadow-xl overflow-hidden touch-pan-y"
                    style={{
                        backgroundColor: activeTheme.isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                        ...transformStyle,
                    }}
                >
                    {renderSwipePill()}
                    {children}
                </div>
            );
    }
}
