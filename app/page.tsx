import Link from 'next/link';

export const metadata = {
    title: 'Book Reader & Library Portal',
    description: 'Welcome to the Digital Library. Choose between User Reader Portal and Admin Backoffice.',
};

export default function Home() {
    return (
        <main className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
            {/* Fullscreen Background Image with Dark & Glass Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/library_bg.jpg"
                    alt="Digital Library Background"
                    className="w-full h-full object-cover object-center scale-105 filter brightness-75 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
                <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]" />
            </div>

            {/* Top Navigation / Brand Header */}
            <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/80 backdrop-blur-md border border-indigo-400/30 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white/90">Lumina Library</span>
                </div>

                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-medium text-white/80">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    System Online
                </div>
            </header>

            {/* Main Content Area */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-md mb-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Welcome to Lumina</span>
                </div>

                {/* Hero Title */}
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                    Select Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-sky-300 to-indigo-100">Portal</span>
                </h1>
                <p className="text-base sm:text-xl text-slate-300 max-w-2xl mb-12 font-normal leading-relaxed">
                    Access the reader experience to explore books and highlights, or enter the administrator portal to manage your digital catalog.
                </p>

                {/* Navigation Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    {/* User / Reader Card */}
                    <Link
                        id="user-portal-btn"
                        href="/reader"
                        className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white/10 hover:bg-white/[0.15] border border-white/20 hover:border-indigo-400/50 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1.5 text-left"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
                        
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                                    Reader Mode
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">
                                User / Reader
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed mb-8">
                                Browse the library, read books, customize reading themes, and save sentence highlights seamlessly.
                            </p>
                        </div>

                        <div className="flex items-center text-sm font-semibold text-indigo-300 group-hover:text-white transition-colors">
                            <span>Navigate to Reader</span>
                            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </Link>

                    {/* Admin Card */}
                    <Link
                        id="admin-portal-btn"
                        href="/admin"
                        className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white/10 hover:bg-white/[0.15] border border-white/20 hover:border-slate-300/50 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-slate-400/20 hover:-translate-y-1.5 text-left"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-400/10 rounded-full blur-2xl group-hover:bg-slate-400/20 transition-all"></div>

                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/50 group-hover:scale-110 transition-transform border border-slate-600">
                                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-200 border border-slate-400/30">
                                    Management
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-slate-200 transition-colors">
                                Admin Portal
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed mb-8">
                                Add new books to the database, compose and edit book page contents, and manage platform data.
                            </p>
                        </div>

                        <div className="flex items-center text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                            <span>Navigate to Admin</span>
                            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-400">
                Lumina Books Platform &copy; {new Date().getFullYear()} &bull; Built with Next.js &amp; Tailwind CSS
            </footer>
        </main>
    );
}
