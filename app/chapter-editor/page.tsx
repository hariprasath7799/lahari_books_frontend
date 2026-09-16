'use client';

import React from 'react';
import { BookChapterEditor } from '@/components/book-editor/BookChapterEditor';

export default function ChapterEditorPage() {
    const handleSavePayload = (payload: { json: any; html: string; title: string }) => {
        console.log('[Cloud Sync] Chapter Autosaved payload:', payload);
    };

    return (
        <BookChapterEditor
            chapterNumber="Ch. 04"
            chapterTitle="The Architecture of Imagined Worlds"
            targetWordCeiling={5000}
            onSavePayload={handleSavePayload}
        />
    );
}
