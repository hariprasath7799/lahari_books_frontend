'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/api';
import { getCoverImageUrl } from '@/lib/image';
import RichTextEditor from '@/components/RichTextEditor';
import SearchPopover from '@/components/SearchPopover';
import { ToastContainer, ToastItem } from '@/components/Toast';
import {
  ArrowLeft,
  BookOpen,
  Save,
  Upload,
  Image as ImageIcon,
  X,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  ScanLine,
  Sparkles,
  Trash2,
  BookMarked,
  Edit3,
} from 'lucide-react';

interface Book {
  _id: string;
  title: string;
  author: string;
  publishingYear: number;
  coverImageUrl?: string;
  totalPages?: number;
}

interface PageData {
  _id: string;
  bookId: string;
  pageNumber: number;
  content: string;
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const bookId = (params?.id as string) || '';

  // -------------------------------------------------------------
  // Toast Notification System
  // -------------------------------------------------------------
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success', title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // -------------------------------------------------------------
  // SECTION A: Book Details State & Query
  // -------------------------------------------------------------
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishingYear, setPublishingYear] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  // Fetch Book Details via GET /api/books/:id
  const { data: book, isLoading: bookLoading, isError: bookError } = useQuery<Book>({
    queryKey: ['book', bookId],
    queryFn: async () => {
      const { data } = await api.get<Book>(`/books/${bookId}`);
      return data;
    },
    enabled: !!bookId,
  });

  // Pre-fill form when book data arrives
  useEffect(() => {
    if (book) {
      setTitle(book.title || '');
      setAuthor(book.author || '');
      setPublishingYear(book.publishingYear ? String(book.publishingYear) : '');
    }
  }, [book]);

  // Clean up object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (localPreviewUrl && localPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setLocalPreviewUrl(objectUrl);
    }
  };

  const handleRemoveNewImage = () => {
    if (localPreviewUrl && localPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    setSelectedFile(null);
    setLocalPreviewUrl(null);
  };

  // Mutation to PUT /api/books/:id
  const updateBookMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.put(`/books/${bookId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      addToast('Book details updated successfully!', 'success');
      setSelectedFile(null);
      setLocalPreviewUrl(null);
    },
    onError: (error: any) => {
      addToast(error?.response?.data?.message || 'Failed to update book details.', 'error');
    },
  });

  const handleUpdateBookSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !publishingYear) {
      addToast('Please fill out all required book details.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('author', author.trim());
    formData.append('publishingYear', publishingYear.toString());

    if (selectedFile) {
      formData.append('coverImage', selectedFile);
    }

    updateBookMutation.mutate(formData);
  };

  // -------------------------------------------------------------
  // SECTION B: Manage & Edit Paginated Content State & Query
  // -------------------------------------------------------------
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageContent, setPageContent] = useState<string>('');
  const [isEditingPage, setIsEditingPage] = useState<boolean>(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  // Scan Page Image State
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [scanPreviewUrl, setScanPreviewUrl] = useState<string | null>(null);
  const [isScanningPage, setIsScanningPage] = useState<boolean>(false);
  const [isDraggingScanFile, setIsDraggingScanFile] = useState<boolean>(false);
  const scanFileInputRef = useRef<HTMLInputElement>(null);

  // Sync pageNumber when ?pageNumber= URL query param changes
  const urlPageParam = searchParams.get('pageNumber');
  useEffect(() => {
    if (urlPageParam) {
      const parsed = parseInt(urlPageParam, 10);
      if (!isNaN(parsed) && parsed > 0) {
        setPageNumber(parsed);
      }
    }
  }, [urlPageParam]);

  // Fetch GET /api/books/:id/pages?pageNumber=N
  const {
    data: pageData,
    isLoading: pageLoading,
    isError: pageIsError,
    error: pageError,
  } = useQuery<PageData>({
    queryKey: ['book-page', bookId, pageNumber],
    queryFn: async () => {
      const { data } = await api.get<PageData>(`/books/${bookId}/pages?pageNumber=${pageNumber}`);
      return data;
    },
    enabled: !!bookId && pageNumber > 0,
    retry: false,
  });

  // Handle page query response or 404
  useEffect(() => {
    if (pageData) {
      setPageContent(pageData.content || '');
      setIsEditingPage(true);
      setEditingPageId(pageData._id || null);
    } else if (pageIsError) {
      // 404 or page doesn't exist yet -> prepare for saving new page
      setPageContent('');
      setIsEditingPage(false);
      setEditingPageId(null);
    }
  }, [pageData, pageIsError, pageError]);

  // Clean up object URL for scanned image preview
  useEffect(() => {
    return () => {
      if (scanPreviewUrl && scanPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(scanPreviewUrl);
      }
    };
  }, [scanPreviewUrl]);

  // Handle page scan file select
  const handleScanFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (scanPreviewUrl && scanPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(scanPreviewUrl);
      }
      setScanFile(file);
      setScanPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Drag & drop handlers for page scan image
  const handleScanDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingScanFile(true);
  };

  const handleScanDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingScanFile(false);
  };

  const handleScanDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingScanFile(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addToast('Please drop a valid image file.', 'error');
        return;
      }
      if (scanPreviewUrl && scanPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(scanPreviewUrl);
      }
      setScanFile(file);
      setScanPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle clear scan file & preview
  const handleClearScanImage = () => {
    if (scanPreviewUrl && scanPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(scanPreviewUrl);
    }
    setScanFile(null);
    setScanPreviewUrl(null);
    if (scanFileInputRef.current) {
      scanFileInputRef.current.value = '';
    }
  };

  // Handle API POST /books/scan-page
  const handleConvertScanImageToText = async () => {
    if (!scanFile) {
      addToast('Please select a page image file first.', 'error');
      return;
    }

    setIsScanningPage(true);
    try {
      const formData = new FormData();
      formData.append('pageImage', scanFile);

      const response = await api.post('/books/scan-page', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Response contains html text in content key
      const returnedHtml =
        response.data?.content ||
        response.data?.data?.content ||
        (typeof response.data === 'string' ? response.data : '');

      if (!returnedHtml) {
        throw new Error('No content returned from server scan.');
      }

      // Append to setPageContent without replacing existing content
      setPageContent((prev) => {
        if (!prev || prev.trim() === '' || prev.trim() === '<p></p>') {
          return returnedHtml;
        }
        return `${prev}<p></p>${returnedHtml}`;
      });

      addToast('Image converted to text and appended to page content!', 'success');
    } catch (err: any) {
      console.error('Scan page error:', err);
      const message =
        err?.response?.data?.message || err?.message || 'Failed to convert image to text.';
      addToast(message, 'error');
    } finally {
      setIsScanningPage(false);
    }
  };

  // Mutation for saving / updating page content
  const savePageMutation = useMutation({
    mutationFn: async (contentToSave: string) => {
      if (isEditingPage && editingPageId) {
        // PUT /api/books/pages/:pageId
        const { data } = await api.put(`/books/pages/${editingPageId}`, {
          content: contentToSave,
        });
        return data;
      } else {
        // POST /api/books/:id/pages
        const { data } = await api.post(`/books/${bookId}/pages`, {
          pageNumber: Number(pageNumber),
          content: contentToSave,
        });
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-page', bookId, pageNumber] });
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      addToast(isEditingPage ? `Page ${pageNumber} updated successfully!` : `Page ${pageNumber} created successfully!`, 'success');
    },
    onError: (error: any) => {
      addToast(error?.response?.data?.message || 'Failed to save page content.', 'error');
    },
  });

  const handleSavePageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const strippedContent = pageContent.replace(/<[^>]*>/g, '').trim();
    if (!strippedContent) {
      addToast('Please enter text content for the page before saving.', 'error');
      return;
    }
    savePageMutation.mutate(pageContent);
  };

  // Determine current effective image preview:
  const activeImagePreview = localPreviewUrl || getCoverImageUrl(book?.coverImageUrl);

  // Total pages from book query
  const totalPagesCount = book?.totalPages || 0;
  const maxSelectablePages = Math.max(totalPagesCount + 1, pageNumber);
  const pageOptions = Array.from({ length: maxSelectablePages }, (_, i) => i + 1);

  if (bookLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-9 h-9 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-semibold text-sm">Loading book workspace...</p>
        </div>
      </div>
    );
  }

  if (bookError || !book) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-12">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-red-200 p-8 text-center shadow-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800">Book Not Found</h2>
          <p className="text-slate-500 text-sm mt-1">The requested book ID could not be retrieved from the server.</p>
          <Link
            href="/admin"
            className="mt-6 inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Admin Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 p-3 sm:p-5 md:p-8 lg:p-10 relative w-full">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <div className="w-full space-y-6 md:space-y-8">
        
        {/* Top Header Banner - Full Width Premium Glass Container */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-7 md:p-8 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-slate-800">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-300 hover:text-white transition-colors mb-3 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Admin Books Portal</span>
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">{book.title}</h1>
              <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm">
                {book.totalPages || 0} Pages Cataloged
              </span>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>Author: <strong className="text-white font-semibold">{book.author}</strong></span>
              <span className="hidden sm:inline">•</span>
              <span>Published: <strong className="text-white font-semibold">{book.publishingYear}</strong></span>
            </p>
          </div>

          <div className="w-full lg:w-80 flex-shrink-0">
            <SearchPopover bookId={bookId} baseRoute="/admin/books" placeholder="Search book pages..." className="w-full" />
          </div>
        </div>


        {/* SECTION A: EDIT BOOK DETAILS */}
        <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-lg transition-all p-5 sm:p-7 md:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <BookOpen className="w-5 h-5" />
                </div>
                Section A: Edit Book Details
              </h2>
              <p className="text-slate-500 text-xs mt-1">Update book metadata or upload a new cover image.</p>
            </div>
          </div>

          <form onSubmit={handleUpdateBookSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Image Preview & Upload Box */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Cover Image Preview
              </label>
              
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 w-full h-72 sm:h-80 flex items-center justify-center group shadow-inner">
                {activeImagePreview ? (
                  <img
                    src={activeImagePreview}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <ImageIcon className="w-12 h-12 text-slate-600 mb-2" />
                    <span className="text-xs font-semibold text-slate-400">No Cover Uploaded</span>
                  </div>
                )}

                {/* Badge for Image Source */}
                {localPreviewUrl ? (
                  <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                    New Image Selected
                  </div>
                ) : book.coverImageUrl ? (
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white font-medium text-[10px] px-2.5 py-1 rounded-md border border-white/20">
                    Current Cover
                  </div>
                ) : null}
              </div>

              {/* Upload New Image Input Button */}
              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition border border-slate-200 min-h-[44px]">
                  <Upload className="w-4 h-4 text-indigo-600" />
                  <span>Choose New Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {localPreviewUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveNewImage}
                    className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition border border-rose-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Cancel new image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Book Info Text Inputs */}
            <div className="lg:col-span-2 space-y-5 flex flex-col justify-between">
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Book Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter book title"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 text-sm font-medium transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Author Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter author name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 text-sm font-medium transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Publishing Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    max="2100"
                    value={publishingYear}
                    onChange={(e) => setPublishingYear(e.target.value)}
                    placeholder="e.g. 2024"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 text-sm font-medium transition"
                  />
                </div>
              </div>

              {/* Submit Update Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={updateBookMutation.isPending}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3 rounded-xl font-bold text-sm transition shadow-md hover:shadow-indigo-500/25 disabled:opacity-50 min-h-[46px]"
                >
                  {updateBookMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Update Book Details</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>


        {/* SECTION B: MANAGE & EDIT PAGINATED CONTENT */}
        <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-lg transition-all p-5 sm:p-7 md:p-8 space-y-6">
          
          {/* Header & Status Indicator */}
          <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                Section B: Manage & Edit Paginated Content
              </h2>
              <p className="text-slate-500 text-xs mt-1">Select any page number to write, edit, or scan content with OCR.</p>
            </div>

            {/* Status indicator badge */}
            <div className="flex items-center gap-2">
              {isEditingPage ? (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Page {pageNumber} Exists (Update Mode)
                </span>
              ) : (
                <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Page {pageNumber} Not Found (New Page Mode)
                </span>
              )}
            </div>
          </div>

          {/* Page Selector Toolbar - Fully Responsive */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                Select Page:
              </label>

              {/* Page Number Select Dropdown */}
              <select
                value={pageNumber}
                onChange={(e) => setPageNumber(Number(e.target.value))}
                className="bg-white px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 shadow-xs cursor-pointer min-h-[42px]"
              >
                {pageOptions.map((num) => (
                  <option key={num} value={num}>
                    Page {num} {num <= totalPagesCount ? '' : '(New Page)'}
                  </option>
                ))}
              </select>

              {/* Direct Page Number Input */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">or type:</span>
                <input
                  type="number"
                  min="1"
                  value={pageNumber}
                  onChange={(e) => setPageNumber(Math.max(1, Number(e.target.value)))}
                  className="w-20 px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm text-center font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 shadow-xs min-h-[42px]"
                />
              </div>
            </div>

            {/* Quick Previous / Next Page Stepper */}
            <div className="flex items-center gap-2.5 w-full lg:w-auto justify-between sm:justify-end">
              <button
                type="button"
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition flex items-center justify-center gap-1.5 shadow-xs min-h-[42px]"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Page
              </button>

              <button
                type="button"
                onClick={() => setPageNumber((p) => p + 1)}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center justify-center gap-1.5 shadow-xs min-h-[42px]"
              >
                Next Page <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SCAN PAGE IMAGE (OCR / TEXT EXTRACTOR) WIDGET */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl ring-1 ring-indigo-500/30">
                  <ScanLine className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    Scan Page Image (AI OCR Extractor)
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Select or drag & drop a scanned page image. Extracted text will append to the editor without overwriting existing content.
                  </p>
                </div>
              </div>
            </div>

            {/* Select File & Image Preview Box */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">

              {/* Upload Input & File Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Select Page Image
                </label>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <label
                    onDragOver={handleScanDragOver}
                    onDragLeave={handleScanDragLeave}
                    onDrop={handleScanDrop}
                    className={`flex-1 cursor-pointer inline-flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl transition border shadow-sm group min-h-[48px] ${
                      isDraggingScanFile
                        ? 'bg-indigo-600/40 border-indigo-400 text-white ring-2 ring-indigo-400/50'
                        : 'bg-slate-800 hover:bg-slate-700/80 text-white border-slate-700'
                    }`}
                  >
                    <Upload className={`w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform ${isDraggingScanFile ? 'animate-bounce text-indigo-300' : ''}`} />
                    <span className="text-xs font-semibold">
                      {isDraggingScanFile
                        ? 'Drop Image Here...'
                        : scanFile
                        ? 'Change Image (or Drag & Drop)'
                        : 'Choose or Drag & Drop Page Image'}
                    </span>
                    <input
                      ref={scanFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleScanFileChange}
                      className="hidden"
                    />
                  </label>

                  {scanFile && (
                    <button
                      type="button"
                      onClick={handleClearScanImage}
                      className="px-4 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition text-xs font-bold flex items-center justify-center gap-1.5 min-h-[48px]"
                      title="Clear selected image"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>

                {scanFile && (
                  <p className="text-[11px] text-slate-400 truncate">
                    Selected: <span className="text-indigo-300 font-mono">{scanFile.name}</span> ({(scanFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              {/* Preview & Convert Action */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                {scanPreviewUrl ? (
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0 bg-slate-900 group shadow-md">
                    <img
                      src={scanPreviewUrl}
                      alt="Scan page preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-600 flex-shrink-0 bg-slate-900/50">
                    <ImageIcon className="w-8 h-8 mb-1 opacity-50 text-indigo-400" />
                    <span className="text-[10px] font-medium text-slate-500 text-center px-1">No Image Selected</span>
                  </div>
                )}

                <div className="flex-1 space-y-2 w-full">
                  <button
                    type="button"
                    disabled={!scanFile || isScanningPage}
                    onClick={handleConvertScanImageToText}
                    className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold text-xs transition shadow-lg shadow-indigo-600/25 disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
                  >
                    {isScanningPage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Converting as Text...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                        <span>Convert as Text</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-400 text-center sm:text-left">
                    {scanFile
                      ? 'Click button to convert image & append HTML content below.'
                      : 'Select an image to preview and convert as text.'}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Form with Rich Text Editor */}
          <form onSubmit={handleSavePageSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Page {pageNumber} Content Text:
                </label>
                {pageLoading && (
                  <span className="text-xs text-indigo-600 font-medium flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading page text...
                  </span>
                )}
              </div>

              {/* Rich Text Editor - Responsive Full Width Container */}
              <div className="w-full">
                <RichTextEditor
                  value={pageContent}
                  onChange={(content) => setPageContent(content)}
                  placeholder={`Write or paste content for Page ${pageNumber} here...`}
                  minHeight="380px"
                />
              </div>
            </div>

            {/* Action Button: "Update Page" vs "Save New Page" */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-xs text-slate-500 font-medium order-2 sm:order-1 text-center sm:text-left">
                {isEditingPage
                  ? `Editing existing page (ID: ${editingPageId})`
                  : `Creating a new page for page number ${pageNumber}`}
              </span>

              <button
                type="submit"
                disabled={savePageMutation.isPending}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all order-1 sm:order-2 min-h-[48px] ${
                  isEditingPage
                    ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                } disabled:opacity-50`}
              >
                {savePageMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Page...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isEditingPage ? 'Update Page' : 'Save New Page'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}
