'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/api';
import { getCoverImageUrl } from '@/lib/image';
import SearchPopover from '@/components/SearchPopover';
import { 
  Plus, 
  Edit3, 
  BookOpen, 
  Search, 
  LayoutGrid, 
  Table as TableIcon, 
  Calendar, 
  User, 
  FileText,
  Image as ImageIcon,
  BookMarked
} from 'lucide-react';

interface Book {
  _id: string;
  title: string;
  author: string;
  publishingYear: number;
  coverImageUrl?: string;
  totalPages?: number;
  highlightedPages?: number[];
}

export default function BooksListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Fetch books from GET /api/books
  const { data: books = [], isLoading, isError, refetch } = useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: async () => {
      const { data } = await api.get<Book[]>('/books');
      return data;
    },
  });

  // Filter books by search term
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600/30 rounded-2xl border border-indigo-400/30 backdrop-blur-sm">
                <BookMarked className="w-7 h-7 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Admin Portal</h1>
                <p className="text-slate-400 text-sm mt-0.5">Manage your book catalog, cover images, and paginated content</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SearchPopover baseRoute="/admin/books" placeholder="Search pages across library..." className="w-full md:w-72" />
            <Link
              href="/admin/create"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Book</span>
            </Link>
          </div>
        </div>

        {/* Toolbar & Search Bar */}
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80 md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
              Total Books: {filteredBooks.length}
            </span>

            {/* View Switcher Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-medium transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg text-xs font-medium transition ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-sm text-slate-500 font-medium">Fetching book library...</p>
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-700">
            <p className="font-semibold text-lg">Failed to load books</p>
            <p className="text-sm mt-1 text-red-600">Please make sure the backend server is running.</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No books found</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
              {searchTerm
                ? `No books match your search "${searchTerm}". Try another search term.`
                : 'Your book catalog is currently empty. Click below to add your first book.'}
            </p>
            {!searchTerm && (
              <Link
                href="/admin/create"
                className="mt-6 inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition"
              >
                <Plus className="w-4 h-4" /> Add Book Now
              </Link>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => {
              const coverUrl = getCoverImageUrl(book.coverImageUrl);
              return (
                <div
                  key={book._id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col group"
                >
                  {/* Book Image Cover Header */}
                  <div className="h-52 bg-slate-900 relative overflow-hidden flex items-center justify-center group-hover:opacity-95 transition-opacity">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-800 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center">
                        <ImageIcon className="w-10 h-10 text-indigo-300/40 mb-2" />
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">No Cover Image</span>
                      </div>
                    )}
                    
                    {/* Badge for page count */}
                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium border border-white/10 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-indigo-400" />
                      <span>{book.totalPages || 0} Pages</span>
                    </div>
                  </div>

                  {/* Details & Actions */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {book.title}
                      </h3>
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                          <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{book.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>Published {book.publishingYear}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        href={`/admin/books/${book._id}`}
                        className="w-full inline-flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Book & Pages</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-4 px-6">Cover</th>
                    <th className="py-4 px-6">Book Title</th>
                    <th className="py-4 px-6">Author</th>
                    <th className="py-4 px-6">Year</th>
                    <th className="py-4 px-6">Pages</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {filteredBooks.map((book) => {
                    const coverUrl = getCoverImageUrl(book.coverImageUrl);
                    return (
                      <tr key={book._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-6">
                          <div className="w-12 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                            {coverUrl ? (
                              <img src={coverUrl} alt={book.title} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-6 font-semibold text-slate-900">{book.title}</td>
                        <td className="py-3 px-6 text-slate-600">{book.author}</td>
                        <td className="py-3 px-6 text-slate-500">{book.publishingYear}</td>
                        <td className="py-3 px-6">
                          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium">
                            <FileText className="w-3 h-3 text-indigo-500" />
                            {book.totalPages || 0}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-right">
                          <Link
                            href={`/admin/books/${book._id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white px-3.5 py-2 rounded-xl transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}