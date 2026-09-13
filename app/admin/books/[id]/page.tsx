'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/api';
import { getCoverImageUrl } from '@/lib/image';
import RichTextEditor from '@/components/RichTextEditor';
import SearchPopover from '@/components/SearchPopover';
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
  ChevronLeft
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
      alert('Book details updated successfully!');
      setSelectedFile(null);
      setLocalPreviewUrl(null);
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || 'Failed to update book details.');
    },
  });

  const handleUpdateBookSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !publishingYear) {
      alert('Please fill out all required book details.');
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
      alert(isEditingPage ? `Page ${pageNumber} updated successfully!` : `Page ${pageNumber} created successfully!`);
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || 'Failed to save page content.');
    },
  });

  const handleSavePageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const strippedContent = pageContent.replace(/<[^>]*>/g, '').trim();
    if (!strippedContent) {
      alert('Please enter text content for the page before saving.');
      return;
    }
    savePageMutation.mutate(pageContent);
  };

  // Determine current effective image preview:
  // 1. Local file preview if user uploaded a new image
  // 2. Existing coverImageUrl from backend
  // 3. Fallback placeholder
  const activeImagePreview = localPreviewUrl || getCoverImageUrl(book?.coverImageUrl);

  // Total pages from book query
  const totalPagesCount = book?.totalPages || 0;
  const maxSelectablePages = Math.max(totalPagesCount + 1, pageNumber);
  const pageOptions = Array.from({ length: maxSelectablePages }, (_, i) => i + 1);

  if (bookLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium text-sm">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (bookError || !book) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-12">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-red-200 p-8 text-center shadow-sm">
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
    <div className="min-h-screen bg-slate-50/60 p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Top Header */}
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Books List</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{book.title}</h1>
                <span className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-bold">
                  {book.totalPages || 0} Pages
                </span>
              </div>
              <p className="text-slate-500 text-sm mt-1">
                Author: <span className="font-semibold text-slate-700">{book.author}</span> • Published: <span className="font-semibold text-slate-700">{book.publishingYear}</span>
              </p>
            </div>
            <SearchPopover bookId={bookId} baseRoute="/admin/books" className="w-full md:w-80" />
          </div>
        </div>

        {/* SECTION A: EDIT BOOK DETAILS */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Section A: Edit Book Details
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">Update book information or upload a new cover image.</p>
          </div>

          <form onSubmit={handleUpdateBookSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Image Preview & Upload Box */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">Cover Image Preview</label>
              
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 w-full h-72 flex items-center justify-center group shadow-inner">
                {activeImagePreview ? (
                  <img
                    src={activeImagePreview}
                    alt={book.title}
                    className="w-full h-full object-cover"
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
                    New File Selected
                  </div>
                ) : book.coverImageUrl ? (
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white font-medium text-[10px] px-2.5 py-1 rounded-md border border-white/20">
                    Existing Cover
                  </div>
                ) : null}
              </div>

              {/* Upload New Image Input Button */}
              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition border border-slate-200">
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
                    className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition"
                    title="Cancel new image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Book Info Text Inputs */}
            <div className="md:col-span-2 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Book Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Author Name
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Publishing Year
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    max="2100"
                    value={publishingYear}
                    onChange={(e) => setPublishingYear(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 text-sm transition"
                  />
                </div>
              </div>

              {/* Submit Update Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={updateBookMutation.isPending}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm disabled:opacity-50"
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
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Section B: Manage & Edit Paginated Content
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">Select a page number to write or edit page content for this book.</p>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              {isEditingPage ? (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Page {pageNumber} Exists (Update Mode)
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Page {pageNumber} Not Found (New Page Mode)
                </span>
              )}
            </div>
          </div>

          {/* Page Selector Toolbar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                Select Page:
              </label>

              {/* Page Number Select Dropdown */}
              <select
                value={pageNumber}
                onChange={(e) => setPageNumber(Number(e.target.value))}
                className="bg-white px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              >
                {pageOptions.map((num) => (
                  <option key={num} value={num}>
                    Page {num} {num <= totalPagesCount ? '' : '(New)'}
                  </option>
                ))}
              </select>

              {/* Direct Page Number Input */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400">or type:</span>
                <input
                  type="number"
                  min="1"
                  value={pageNumber}
                  onChange={(e) => setPageNumber(Math.max(1, Number(e.target.value)))}
                  className="w-16 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-center font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Quick Previous / Next Page Stepper */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous Page
              </button>

              <button
                type="button"
                onClick={() => setPageNumber((p) => p + 1)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center gap-1"
              >
                Next Page <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Form with Large Textarea */}
          <form onSubmit={handleSavePageSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-slate-700">
                  Page {pageNumber} Content Text:
                </label>
                {pageLoading && (
                  <span className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Loading page text...
                  </span>
                )}
              </div>

              {/* Rich Text Editor */}
              <RichTextEditor
                value={pageContent}
                onChange={(content) => setPageContent(content)}
                placeholder={`Write the story or content for Page ${pageNumber} here...`}
                minHeight="340px"
              />
            </div>

            {/* Action Button: "Update Page" vs "Save New Page" */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                {isEditingPage
                  ? `Editing existing page (ID: ${editingPageId})`
                  : `Creating a new page for page number ${pageNumber}`}
              </span>

              <button
                type="submit"
                disabled={savePageMutation.isPending}
                className={`inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all ${
                  isEditingPage
                    ? 'bg-slate-900 hover:bg-slate-800'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                } disabled:opacity-50`}
              >
                {savePageMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
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
