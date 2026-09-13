'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2, X, BookOpen, FileText, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import { getCoverImageUrl } from '@/lib/image';

// ==========================================
// Types & Interfaces
// ==========================================

export interface PageSnippet {
  pageNumber: number;
  contentSnippet: string;
}

export interface BookInfo {
  _id: string;
  title: string;
  author?: string;
  coverImage?: string;
  coverImageUrl?: string;
}

/** Global Search (API #1) Result Item */
export interface GlobalBookSearchResult {
  book: BookInfo;
  matchingPages: PageSnippet[];
}

export type GlobalSearchResponse = GlobalBookSearchResult[];

/** Book-Specific Search (API #2) Result */
export interface BookSpecificSearchResult {
  bookId: string;
  results: PageSnippet[];
}

export type SearchResponse = GlobalSearchResponse | BookSpecificSearchResult;

export interface SearchPopoverProps {
  /** Optional ID of a specific book. If provided, search is restricted to this book. */
  bookId?: string;
  /** Base navigation route prefix (defaults to '/read'). E.g., '/admin/books' for admin view. */
  baseRoute?: string;
  /** Placeholder text for input */
  placeholder?: string;
  /** Custom CSS class names for the top container */
  className?: string;
}

// ==========================================
// Type Guards
// ==========================================

function isGlobalSearchResponse(data: SearchResponse | undefined | null): data is GlobalSearchResponse {
  return Array.isArray(data);
}

function isBookSpecificSearchResponse(data: SearchResponse | undefined | null): data is BookSpecificSearchResult {
  return data !== null && data !== undefined && !Array.isArray(data) && 'results' in data;
}

// ==========================================
// Helper Functions
// ==========================================

/**
 * Highlights exact matches of `term` inside `snippet`
 * preserving the original text casing and wrapping matches in a styled mark tag.
 */
export function highlightMatchedText(snippet: string, term: string): React.ReactNode {
  if (!term || !term.trim()) return snippet;

  const trimmedTerm = term.trim();
  const escapedTerm = trimmedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedTerm})`, 'gi');
  const parts = snippet.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === trimmedTerm.toLowerCase();
        return isMatch ? (
          <mark key={index} className="bg-yellow-200 text-yellow-900 font-medium rounded-sm px-1">
            {part}
          </mark>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        );
      })}
    </>
  );
}

// ==========================================
// Component Definition
// ==========================================

export default function SearchPopover({
  bookId,
  baseRoute = '/read',
  placeholder,
  className = '',
}: SearchPopoverProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ------------------------------------------
  // 1. Debounce Logic (400ms)
  // ------------------------------------------
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Open popover whenever user types valid search query
  useEffect(() => {
    if (debouncedQuery.length > 0) {
      setIsOpen(true);
    }
  }, [debouncedQuery]);

  // ------------------------------------------
  // 2. Outside Click & Escape Key Handlers
  // ------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // ------------------------------------------
  // 3. React Query Data Fetching
  // ------------------------------------------
  const { data, isLoading, isFetching, isError } = useQuery<SearchResponse>({
    queryKey: ['search', { bookId, query: debouncedQuery }],
    queryFn: async () => {
      if (!debouncedQuery) return null as unknown as SearchResponse;

      if (bookId) {
        // Book-Specific Search (API #2)
        const response = await api.get<BookSpecificSearchResult>(`/books/${bookId}/search`, {
          params: { q: debouncedQuery },
        });
        return response.data;
      } else {
        // Global Search (API #1)
        const response = await api.get<GlobalSearchResponse>('/books/search', {
          params: { q: debouncedQuery },
        });
        return response.data;
      }
    },
    enabled: debouncedQuery.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });

  // ------------------------------------------
  // 4. Action Handlers
  // ------------------------------------------
  const handleItemClick = () => {
    setIsOpen(false);
    setQuery('');
    setDebouncedQuery('');
  };

  const handleClearInput = () => {
    setQuery('');
    setDebouncedQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const constructSnippetUrl = (targetBookId: string, pageNumber: number) => {
    const cleanBase = baseRoute.endsWith('/') ? baseRoute.slice(0, -1) : baseRoute;
    return `${cleanBase}/${targetBookId}?pageNumber=${pageNumber}`;
  };

  const defaultPlaceholder = bookId ? 'Search inside this book...' : 'Search entire library...';

  // ------------------------------------------
  // 5. Render Functions
  // ------------------------------------------
  const renderGlobalResults = (results: GlobalBookSearchResult[]) => {
    if (results.length === 0) {
      return renderEmptyState();
    }

    return (
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {results.map((item) => {
          const coverUrl = getCoverImageUrl(item.book.coverImageUrl || item.book.coverImage);
          return (
            <div key={item.book._id} className="p-3">
              {/* Book Header */}
              <div className="flex items-center gap-2.5 mb-2 pb-1.5 border-b border-gray-100 dark:border-gray-800/60">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={item.book.title}
                    className="w-6 h-8 object-cover rounded shadow-sm flex-shrink-0"
                  />
                ) : (
                  <div className="w-6 h-8 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {item.book.title}
                  </h4>
                  {item.book.author && (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                      by {item.book.author}
                    </p>
                  )}
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300">
                  {item.matchingPages.length} {item.matchingPages.length === 1 ? 'match' : 'matches'}
                </span>
              </div>

              {/* Snippets List */}
              <div className="space-y-1 pl-1">
                {item.matchingPages.map((snippet) => (
                  <Link
                    key={`${item.book._id}-p${snippet.pageNumber}`}
                    href={constructSnippetUrl(item.book._id, snippet.pageNumber)}
                    onClick={handleItemClick}
                    className="group flex items-start gap-2.5 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors text-left text-xs"
                  >
                    <span className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:group-hover:bg-indigo-900/50 dark:group-hover:text-indigo-300 px-1.5 py-0.5 rounded transition-colors mt-0.5">
                      <FileText className="w-3 h-3" />
                      p. {snippet.pageNumber}
                    </span>
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed flex-1">
                      {highlightMatchedText(snippet.contentSnippet, debouncedQuery)}
                    </p>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all self-center flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderBookSpecificResults = (result: BookSpecificSearchResult) => {
    if (!result.results || result.results.length === 0) {
      return renderEmptyState();
    }

    const currentBookId = bookId || result.bookId;

    return (
      <div className="p-2 space-y-1">
        <div className="px-2 py-1 flex items-center justify-between text-[11px] font-medium text-gray-400 uppercase tracking-wider">
          <span>Page Matches</span>
          <span>{result.results.length} results</span>
        </div>

        {result.results.map((snippet) => (
          <Link
            key={`p${snippet.pageNumber}`}
            href={constructSnippetUrl(currentBookId, snippet.pageNumber)}
            onClick={handleItemClick}
            className="group flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors text-left text-xs"
          >
            <span className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:group-hover:bg-indigo-900/50 dark:group-hover:text-indigo-300 px-2 py-0.5 rounded transition-colors mt-0.5">
              <FileText className="w-3 h-3" />
              Page {snippet.pageNumber}
            </span>
            <p className="text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed flex-1">
              {highlightMatchedText(snippet.contentSnippet, debouncedQuery)}
            </p>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all self-center flex-shrink-0" />
          </Link>
        ))}
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="p-8 text-center">
      <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
        <Search className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">No results found</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        We couldn&apos;t find any pages matching &quot;<span className="font-semibold text-gray-700 dark:text-gray-300">{debouncedQuery}</span>&quot;
      </p>
    </div>
  );

  // ------------------------------------------
  // Main Render
  // ------------------------------------------
  return (
    <div ref={containerRef} className={`relative w-full max-w-md ${className}`}>
      {/* Search Input Container */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none transition-colors" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (debouncedQuery.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || defaultPlaceholder}
          className="w-full pl-10 pr-9 py-2 text-sm bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 border border-transparent focus:border-indigo-500/50 dark:focus:border-indigo-500/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 rounded-xl outline-none shadow-sm transition-all duration-200"
        />

        {/* Clear Button or Spinner */}
        <div className="absolute right-3 flex items-center gap-1.5">
          {isFetching && (
            <Loader2 className="w-4 h-4 text-indigo-500 animate-spin flex-shrink-0" />
          )}

          {query && !isFetching && (
            <button
              type="button"
              onClick={handleClearInput}
              aria-label="Clear search"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 rounded-md hover:bg-gray-200/60 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {!query && (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-gray-400 bg-gray-200/50 dark:bg-gray-700/50 rounded border border-gray-300/40 dark:border-gray-600/40">
              ESC
            </kbd>
          )}
        </div>
      </div>

      {/* macOS Command Palette Style Popover Dropdown */}
      {isOpen && debouncedQuery.length > 0 && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl border border-gray-200/80 dark:border-gray-800 shadow-2xl overflow-hidden z-50 max-h-[60vh] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Subtle top indicator if fetching updated results */}
          {isFetching && (
            <div className="h-0.5 w-full bg-indigo-100 dark:bg-indigo-950 overflow-hidden">
              <div className="h-full bg-indigo-500 animate-pulse w-full" />
            </div>
          )}

          {/* Loading Skeleton / State */}
          {isLoading ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-medium">Searching matching pages...</span>
            </div>
          ) : isError ? (
            <div className="p-6 text-center text-red-500 text-xs">
              Failed to load search results. Please try again.
            </div>
          ) : isGlobalSearchResponse(data) ? (
            renderGlobalResults(data)
          ) : isBookSpecificSearchResponse(data) ? (
            renderBookSpecificResults(data)
          ) : (
            renderEmptyState()
          )}
        </div>
      )}
    </div>
  );
}
