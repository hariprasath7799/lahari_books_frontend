import Link from 'next/link';
import Image from 'next/image';
import SIX_POINTED_STAR from "@/public/six_pointed_star_sunburst.png";
import { PenTool, BookOpen, Settings, Sparkles } from 'lucide-react';

export const metadata = {
    title: 'Lahari Books | Author Workspace & Digital Library',
    description: 'Distraction-free author book chapter editor and digital reading portal.',
};

export default function Home() {
    return (
        <main className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
            {/* Fullscreen Background Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2000&q=80"
                    alt="Digital Library Background"
                    className="w-full h-full object-cover object-center scale-105 filter brightness-[0.35] transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
                <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]" />
            </div>

            {/* Top Header */}
            <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/80 backdrop-blur-md border border-indigo-400/30 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <PenTool className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white/90 font-serif">Lahari Books Suite</span>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/chapter-editor"
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white text-xs font-semibold shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-all flex items-center gap-1.5"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Launch Chapter Editor</span>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-md mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                        Tiptap Authoring Suite Ready
                    </span>
                </div>

                <div className="mb-4 flex justify-center items-center drop-shadow-[10px_10px_15px_rgba(194,65,12,0.85)]">
                    <Image
                        src={SIX_POINTED_STAR}
                        alt="Sunburst Star"
                        className="w-20 h-20 sm:w-24 sm:h-24 object-contain animate-spin-slow"
                    />
                </div>

                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight font-serif">
                    Next-Gen Author <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-indigo-200 to-sky-300">Workspace</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-300 max-w-2xl mb-10 font-normal leading-relaxed">
                    Production-ready, distraction-free book chapter writing workspace inspired by Ulysses and Medium, powered by React 19, TypeScript, and Tiptap.
                </p>

                {/* 3 Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {/* Chapter Editor Card */}
                    <Link
                        id="chapter-editor-btn"
                        href="/chapter-editor"
                        className="group relative flex flex-col justify-between p-6 rounded-3xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/40 hover:border-indigo-400 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1.5 text-left"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                                    <PenTool className="w-6 h-6 text-white" />
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                                    Author Suite
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2 font-serif group-hover:text-amber-200 transition-colors">
                                Book Chapter Editor
                            </h2>
                            <p className="text-xs text-slate-300 leading-relaxed mb-6">
                                Distraction-free author canvas with Bubble &amp; Slash Floating menus, real-time metrics, autosave JSON payload, and custom editorial notes.
                            </p>
                        </div>
                        <div className="flex items-center text-xs font-semibold text-amber-300 group-hover:text-white transition-colors">
                            <span>Open Author Workspace</span>
                            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </Link>

                    {/* Reader Card */}
                    <Link
                        id="user-portal-btn"
                        href="/reader"
                        className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white/10 hover:bg-white/[0.15] border border-white/20 hover:border-sky-400/50 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/20 hover:-translate-y-1.5 text-left"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-500/20 text-sky-200 border border-sky-400/30">
                                    Reader Portal
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2 font-serif group-hover:text-sky-200 transition-colors">
                                Digital Library
                            </h2>
                            <p className="text-xs text-slate-300 leading-relaxed mb-6">
                                Browse published book chapters, customize reader typography themes, and view text highlights.
                            </p>
                        </div>
                        <div className="flex items-center text-xs font-semibold text-sky-300 group-hover:text-white transition-colors">
                            <span>Explore Library</span>
                            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </Link>

                    {/* Admin Portal Card */}
                    <Link
                        id="admin-portal-btn"
                        href="/admin"
                        className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white/10 hover:bg-white/[0.15] border border-white/20 hover:border-slate-300/50 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-slate-400/20 hover:-translate-y-1.5 text-left"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border border-slate-600">
                                    <Settings className="w-6 h-6 text-white" />
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-500/20 text-slate-200 border border-slate-400/30">
                                    Management
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2 font-serif group-hover:text-slate-200 transition-colors">
                                Catalog Admin
                            </h2>
                            <p className="text-xs text-slate-300 leading-relaxed mb-6">
                                Manage published books, oversee catalog entries, and configure system database settings.
                            </p>
                        </div>
                        <div className="flex items-center text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                            <span>Open Admin Portal</span>
                            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </Link>
                </div>
            </div>

            <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-400">
                Lahari Books Author Workspace &copy; {new Date().getFullYear()} &bull; Built with Next.js, React 19, TypeScript &amp; Tiptap
            </footer>
        </main>
    );
}
