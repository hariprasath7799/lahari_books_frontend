'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/api';
import { getCoverImageUrl } from '@/lib/image';
import SearchPopover from '@/components/SearchPopover';

interface Book {
    _id: string;
    title: string;
    author: string;
    publishingYear: number;
    coverImageUrl?: string;
    totalPages: number;
    highlightedPages: number[];
}

export default function BookLibrary() {
    const { data: books = [], isLoading } = useQuery<Book[]>({
        queryKey: ['books'],
        queryFn: async () => {
            const { data } = await api.get<Book[]>('/books');
            return data;
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 border-b border-gray-200 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Library</h1>
                        <p className="text-gray-500 mt-2 text-lg">Select a book to continue reading</p>
                    </div>
                    <div className="w-full md:w-80">
                        <SearchPopover baseRoute="/reader/read" />
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {books.map((book) => {
                            const coverUrl = getCoverImageUrl(book.coverImageUrl);
                            return (
                                <Link href={`/reader/read/${book._id}`} key={book._id} className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="h-52 relative overflow-hidden bg-slate-900 flex items-end p-5">
                                        {coverUrl ? (
                                            <>
                                                <img
                                                    src={coverUrl}
                                                    alt={book.title}
                                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                {/* Half gradient color mixing */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-900/20" />
                                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-transparent to-slate-950/80 mix-blend-overlay" />
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-indigo-900" />
                                        )}
                                        <h2 className="relative z-10 text-xl font-bold text-white leading-snug drop-shadow-lg">{book.title}</h2>
                                    </div>
                                <div className="p-5 flex-grow flex flex-col justify-between bg-white">
                                    <div>
                                        <p className="text-sm font-medium text-indigo-600 uppercase tracking-wider mb-1">Author</p>
                                        <p className="text-gray-900 font-semibold">{book.author}</p>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-4">
                                        <span>{book.totalPages} Pages</span>
                                        {book.highlightedPages.length > 0 && (
                                            <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs font-semibold">
                                                {book.highlightedPages.length} Highlighted
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-4 flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-4">
                                        <span>{book.publishingYear}</span>
                                        <span className="font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            Read Now <span>→</span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}

                        {books.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
                                No books available. Add some in the Admin portal!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}