'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/api';
import { ToastContainer, ToastItem } from '@/components/Toast';
import { ArrowLeft, Upload, Image as ImageIcon, X, Check, Loader2 } from 'lucide-react';

export default function CreateBookPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Toast Notification System
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

  // Form Fields State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishingYear, setPublishingYear] = useState('');
  
  // Image Upload & Preview State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Handle Image Selection with URL.createObjectURL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreviewUrl(objectUrl);
    }
  };

  // Clean up object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleRemoveImage = () => {
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedFile(null);
    setImagePreviewUrl(null);
  };

  // React Query Mutation to POST /api/books
  const createBookMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post('/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      addToast('Book published successfully!', 'success');
      setTimeout(() => {
        router.push('/admin');
      }, 700);
    },
    onError: (error: any) => {
      addToast(error?.response?.data?.message || 'Failed to create book. Please try again.', 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !publishingYear) {
      addToast('Please fill out all required fields.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('author', author.trim());
    formData.append('publishingYear', publishingYear.toString());
    
    if (selectedFile) {
      formData.append('coverImage', selectedFile);
    }

    createBookMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 md:p-8 lg:p-12 relative">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Books List</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create New Book</h1>
          <p className="text-slate-500 text-sm mt-1">Add a new book entry to your catalog with title, author, year, and cover image.</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Book Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. To Kill a Mockingbird"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800 text-sm transition"
              />
            </div>

            {/* Author Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Author Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Harper Lee"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800 text-sm transition"
              />
            </div>

            {/* Publishing Year Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Publishing Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1000"
                max="2100"
                value={publishingYear}
                onChange={(e) => setPublishingYear(e.target.value)}
                placeholder="e.g. 1960"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800 text-sm transition"
              />
            </div>

            {/* Cover Image Upload Section */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Cover Image
              </label>

              {imagePreviewUrl ? (
                /* Local Image Preview Box */
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group w-full max-w-xs h-64 flex items-center justify-center">
                  <img
                    src={imagePreviewUrl}
                    alt="Book Cover Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center gap-1 text-xs font-semibold"
                    >
                      <X className="w-4 h-4" /> Remove
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    Local Preview
                  </div>
                </div>
              ) : (
                /* Drag/Click File Input Area */
                <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      Click to upload cover image
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      PNG, JPG, WEBP up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Actions Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                href="/admin"
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm transition"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={createBookMutation.isPending}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3 rounded-xl font-semibold text-sm transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createBookMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing Book...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Publish Book</span>
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
