'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setFontSize, setTheme } from '@/lib/store';
import api from '@/lib/api';
import { ChevronLeft, ChevronRight, Bookmark, Sparkles, BookOpen, Palette, Check, Frame, Volume2, Square, Play } from 'lucide-react';
import BookFrame from '@/components/BookFrame';
import ThemeSelector, { THEME_PRESETS, ThemeConfig } from '@/components/ThemeSelector';
import SearchPopover from '@/components/SearchPopover';
import SIX_POINTED_STAR from "@/public/six_pointed_star_sunburst.png"
import Image from 'next/image';

interface PageData {
    _id: string;
    bookId: string;
    pageNumber: number;
    content: string;
    totalPages: number;
    highlightedPages: number[];
}



export interface BorderPreset {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export const BORDER_PRESETS: BorderPreset[] = [
    {
        id: 'royal-filigree',
        name: 'Royal Victorian Filigree',
        description: 'Ornate SVG corner scrollwork & double lines',
        icon: '⚜️'
    },
    {
        id: 'double-classic',
        name: 'Classic Double Line',
        description: 'Traditional double border with Fleur-de-lis',
        icon: '═'
    },
    {
        id: 'gold-inset',
        name: 'Golden Inset Frame',
        description: 'Luxurious gold double border & corner crests',
        icon: '❖'
    },
    {
        id: 'vintage-parchment',
        name: 'Vintage Bookbindery',
        description: 'Dashed inner margins & bracket corners',
        icon: '╔═╗'
    },
    {
        id: 'baroque-scroll',
        name: 'Baroque Scrollwork',
        description: 'Dotted accent frame with scroll corners',
        icon: '❦'
    },
    {
        id: 'minimal-crest',
        name: 'Minimal Royal Crest',
        description: 'Clean double rule with subtle crest dots',
        icon: '✦'
    },
    {
        id: 'clean-frameless',
        name: 'Clean Modern (Frameless)',
        description: 'Minimalist borderless canvas for focused reading',
        icon: '▢'
    }
];

export default function ReaderPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const bookId = (params?.id || params?.bookId) as string;
    const [pageNumber, setPageNumber] = useState(1);

    // Sync pageNumber when ?pageNumber= URL param changes (e.g. from SearchPopover click)
    const urlPageParam = searchParams.get('pageNumber');
    useEffect(() => {
        if (urlPageParam) {
            const parsed = parseInt(urlPageParam, 10);
            if (!isNaN(parsed) && parsed > 0) {
                setPageNumber(parsed);
            }
        }
    }, [urlPageParam]);

    // Redux State
    const reduxTheme = useSelector((state: any) => state.reader.theme);
    const fontSize = useSelector((state: any) => state.reader.fontSize);

    // Local Theme & Border State
    const [selectedThemeId, setSelectedThemeId] = useState<string>(() => {
        if (reduxTheme === 'dark') return 'dark-slate';
        if (reduxTheme === 'light') return 'light-white';
        return reduxTheme || 'light-white';
    });
    const [selectedBorderId, setSelectedBorderId] = useState<string>('royal-filigree');

    // Read Aloud (Web Speech API) States
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
    const [speechRate, setSpeechRate] = useState<number>(0.9);
    const activeUtterancesRef = useRef<SpeechSynthesisUtterance[]>([]);

    // Helper to split long text into small chunks (< 180 chars) for Mobile SpeechSynthesis compatibility
    const splitTextIntoChunks = (text: string, maxChunkLen: number = 180): string[] => {
        const cleaned = text.replace(/\s+/g, ' ').trim();
        if (!cleaned) return [];

        const rawSentences = cleaned.match(/[^.!?\n|।]+[.!?\n|.]?/g) || [cleaned];
        const chunks: string[] = [];
        let currentChunk = '';

        for (const sentence of rawSentences) {
            const trimmed = sentence.trim();
            if (!trimmed) continue;

            if ((currentChunk + ' ' + trimmed).length <= maxChunkLen) {
                currentChunk = currentChunk ? `${currentChunk} ${trimmed}` : trimmed;
            } else {
                if (currentChunk) chunks.push(currentChunk);

                if (trimmed.length > maxChunkLen) {
                    const subParts = trimmed.match(/[^,;:]+[,;:]?/g) || [trimmed];
                    let subChunk = '';
                    for (const part of subParts) {
                        const pTrimmed = part.trim();
                        if (!pTrimmed) continue;
                        if ((subChunk + ' ' + pTrimmed).length <= maxChunkLen) {
                            subChunk = subChunk ? `${subChunk} ${pTrimmed}` : pTrimmed;
                        } else {
                            if (subChunk) chunks.push(subChunk);
                            subChunk = pTrimmed;
                        }
                    }
                    if (subChunk) chunks.push(subChunk);
                    currentChunk = '';
                } else {
                    currentChunk = trimmed;
                }
            }
        }
        if (currentChunk) chunks.push(currentChunk);
        return chunks;
    };

    // 1. Voice Loading Logic (useEffect)
    useEffect(() => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            const filteredVoices = availableVoices.filter(v =>
                v.lang.startsWith('en') ||
                v.lang.startsWith('ta') ||
                v.lang.startsWith('hi') ||
                v.lang.startsWith('te')
            );
            const voiceList = filteredVoices.length > 0 ? filteredVoices : availableVoices;
            setVoices(voiceList);
        };

        loadVoices();

        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    // 2. Speech Cleanup when navigating page number or unmounting
    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                activeUtterancesRef.current = [];
                setIsSpeaking(false);
            }
        };
    }, [pageNumber]);

    // 3. Stop Speech Function
    const handleStopSpeech = () => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        activeUtterancesRef.current = [];
        setIsSpeaking(false);
    };

    // 4. Play Speech Function (Strip HTML and Speak with Selected Voice, Lang & Speed)
    const handlePlaySpeech = (rateOverride?: number) => {
        if (!pageData?.content) return;

        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            activeUtterancesRef.current = [];

            // 1. Replace block HTML tags with periods and newlines before stripping HTML
            let formattedHtml = pageData.content
                .replace(/<\/(p|h1|h2|h3|h4|h5|h6|li|div|blockquote)>/gi, '.\n')
                .replace(/<br\s*\/?>/gi, '.\n');

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = formattedHtml;
            const cleanTextToRead = tempDiv.textContent || tempDiv.innerText || "";

            if (!cleanTextToRead.trim()) return;

            // 2. Split text into short chunks (< 180 characters) for mobile TTS compatibility
            const chunks = splitTextIntoChunks(cleanTextToRead, 180);
            if (chunks.length === 0) return;

            // 3. Detect language
            const isTamil = /[\u0B80-\u0BFF]/.test(cleanTextToRead);
            const isTelugu = /[\u0C00-\u0C7F]/.test(cleanTextToRead);

            let targetLang = 'en-US';
            if (isTamil) targetLang = 'ta-IN';
            else if (isTelugu) targetLang = 'te-IN';
            else if (voices.length > 0 && voices[selectedVoiceIndex]) {
                targetLang = voices[selectedVoiceIndex].lang;
            }

            let matchedVoice: SpeechSynthesisVoice | undefined;
            if (voices.length > 0) {
                const selectedVoice = voices[selectedVoiceIndex];
                if (
                    (isTamil && selectedVoice?.lang?.startsWith('ta')) ||
                    (isTelugu && selectedVoice?.lang?.startsWith('te')) ||
                    (!isTamil && !isTelugu)
                ) {
                    matchedVoice = selectedVoice;
                } else {
                    matchedVoice = voices.find(v => v.lang.startsWith(targetLang));
                }
            }

            const currentRate = rateOverride ?? speechRate;

            // 4. Create Utterance objects for all chunks and store in Ref (prevents mobile JS Garbage Collection)
            const utterances = chunks.map((chunkText) => {
                const utterance = new SpeechSynthesisUtterance(chunkText);
                utterance.lang = targetLang;
                if (matchedVoice) {
                    utterance.voice = matchedVoice;
                }
                utterance.rate = currentRate;
                utterance.pitch = 1;
                return utterance;
            });

            activeUtterancesRef.current = utterances;

            // 5. Play chunks sequentially using onend callback (Mobile Safe)
            const speakChunkAtIndex = (index: number) => {
                if (index >= utterances.length) {
                    setIsSpeaking(false);
                    return;
                }

                const currentUtterance = utterances[index];

                currentUtterance.onstart = () => {
                    setIsSpeaking(true);
                };

                currentUtterance.onend = () => {
                    if (index + 1 < utterances.length) {
                        speakChunkAtIndex(index + 1);
                    } else {
                        setIsSpeaking(false);
                    }
                };

                currentUtterance.onerror = (e) => {
                    console.warn('TTS Chunk error:', e);
                    if (index + 1 < utterances.length) {
                        speakChunkAtIndex(index + 1);
                    } else {
                        setIsSpeaking(false);
                    }
                };

                window.speechSynthesis.speak(currentUtterance);
            };

            speakChunkAtIndex(0);
        }
    };

    // 5. Handle Live Playback Rate / Speed Changes
    const handleRateChange = (newRate: number) => {
        setSpeechRate(newRate);
        if (isSpeaking || (typeof window !== 'undefined' && window.speechSynthesis?.speaking)) {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            setIsSpeaking(false);
            setTimeout(() => {
                handlePlaySpeech(newRate);
            }, 50);
        }
    };

    // Restore Theme & Border selection from localStorage safely on mount after hydration
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const savedTheme = localStorage.getItem('reader_selected_theme');
        if (savedTheme) {
            setSelectedThemeId(savedTheme);
        }
        const savedBorder = localStorage.getItem('reader_selected_border');
        if (savedBorder) {
            setSelectedBorderId(savedBorder);
        }
    }, []);
    const [isBorderMenuOpen, setIsBorderMenuOpen] = useState(false);
    const borderMenuRef = useRef<HTMLDivElement>(null);

    // Touch Swipe Gesture State for Mobile Page Turning
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchStartY, setTouchStartY] = useState<number | null>(null);
    const [swipeOffset, setSwipeOffset] = useState<number>(0);
    const [isSwiping, setIsSwiping] = useState<boolean>(false);

    // Get active theme preset
    const activeTheme = useMemo(() => {
        return THEME_PRESETS.find(t => t.id === selectedThemeId) || THEME_PRESETS[0];
    }, [selectedThemeId]);

    // Get active border preset
    const activeBorder = useMemo(() => {
        return BORDER_PRESETS.find(b => b.id === selectedBorderId) || BORDER_PRESETS[0];
    }, [selectedBorderId]);

    // Touch Event Handlers for Mobile Swipe
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length !== 1) return;
        setTouchStartX(e.touches[0].clientX);
        setTouchStartY(e.touches[0].clientY);
        setIsSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (touchStartX === null || touchStartY === null) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;

        const diffX = currentX - touchStartX;
        const diffY = currentY - touchStartY;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
            const maxOffset = 130;
            const dampened = Math.sign(diffX) * Math.min(Math.abs(diffX) * 0.65, maxOffset);
            setSwipeOffset(dampened);
        }
    };

    // Close border menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (borderMenuRef.current && !borderMenuRef.current.contains(event.target as Node)) {
                setIsBorderMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 1. Fetch Current Page Data
    const { data: pageData, isLoading: pageLoading, isError: pageError } = useQuery<PageData>({
        queryKey: ['page', bookId, pageNumber],
        queryFn: async () => {
            const { data } = await api.get(`/books/${bookId}/pages?pageNumber=${pageNumber}`);
            return data;
        },
        enabled: !!bookId,
        retry: 1
    });

    // 2. Fetch Highlights for Current Page
    const { data: highlightedIndices = [] } = useQuery<number[]>({
        queryKey: ['highlights', pageData?._id],
        queryFn: async () => {
            if (!pageData?._id) return [];
            const { data } = await api.get(`/highlights/${pageData._id}`);
            return data;
        },
        enabled: !!pageData?._id
    });

    // 3. Highlight Mutation
    const toggleHighlightMutation = useMutation({
        mutationFn: async (sentenceIndex: number) => {
            const isHighlighted = highlightedIndices.includes(sentenceIndex);
            if (isHighlighted) {
                await api.delete('/highlights', { data: { pageId: pageData?._id, sentenceIndex } });
            } else {
                await api.post('/highlights', { bookId, pageId: pageData?._id, sentenceIndex });
            }
            return { sentenceIndex, isHighlighted };
        },
        onMutate: async (sentenceIndex) => {
            await queryClient.cancelQueries({ queryKey: ['highlights', pageData?._id] });
            const previousHighlights = queryClient.getQueryData<number[]>(['highlights', pageData?._id]);

            queryClient.setQueryData<number[]>(['highlights', pageData?._id], (old = []) =>
                old.includes(sentenceIndex)
                    ? old.filter(i => i !== sentenceIndex)
                    : [...old, sentenceIndex]
            );
            return { previousHighlights };
        },
        onError: (err, newTodo, context) => {
            queryClient.setQueryData(['highlights', pageData?._id], context?.previousHighlights);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['highlights', pageData?._id] });
            queryClient.invalidateQueries({ queryKey: ['page', bookId, pageNumber] });
        }
    });

    // Touch Swipe Release Handler
    const handleTouchEnd = () => {
        if (touchStartX === null) return;
        const minSwipeDistance = 45;
        const total = pageData?.totalPages || 1;

        if (swipeOffset < -minSwipeDistance) {
            if (pageNumber < total && !pageLoading) {
                setPageNumber(p => p + 1);
            }
        } else if (swipeOffset > minSwipeDistance) {
            if (pageNumber > 1 && !pageLoading) {
                setPageNumber(p => p - 1);
            }
        }

        setSwipeOffset(0);
        setIsSwiping(false);
        setTouchStartX(null);
        setTouchStartY(null);
    };

    // Keyboard Arrow Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
            if (e.key === 'ArrowRight') {
                if (pageNumber < (pageData?.totalPages || 1) && !pageLoading) {
                    setPageNumber(p => p + 1);
                }
            } else if (e.key === 'ArrowLeft') {
                if (pageNumber > 1 && !pageLoading) {
                    setPageNumber(p => p - 1);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [pageNumber, pageData?.totalPages, pageLoading]);

    // 1. Restore last visited page number on mount for this bookId
    useEffect(() => {
        if (!bookId || typeof window === 'undefined') return;
        const savedPage = localStorage.getItem(`reader_last_page_${bookId}`);
        if (savedPage) {
            const parsed = parseInt(savedPage, 10);
            if (!isNaN(parsed) && parsed > 0) {
                setPageNumber(parsed);
            }
        }
    }, [bookId]);

    // 2. Save current page & track scroll height continuously to localStorage
    useEffect(() => {
        if (!bookId || typeof window === 'undefined') return;

        localStorage.setItem(`reader_last_page_${bookId}`, pageNumber.toString());

        let timeoutId: NodeJS.Timeout;
        const handleScroll = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const scrollY = window.scrollY;
                if (scrollY > 0) {
                    localStorage.setItem(`reader_scroll_${bookId}_page_${pageNumber}`, scrollY.toString());
                }
            }, 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('scroll', handleScroll);
            const scrollY = window.scrollY;
            if (scrollY > 0) {
                localStorage.setItem(`reader_scroll_${bookId}_page_${pageNumber}`, scrollY.toString());
            }
        };
    }, [bookId, pageNumber]);

    // 3. Smoothly scroll to last saved height when page finishes rendering
    useEffect(() => {
        if (pageLoading || typeof window === 'undefined' || !bookId) return;

        const savedScroll = localStorage.getItem(`reader_scroll_${bookId}_page_${pageNumber}`);
        const targetY = savedScroll ? parseInt(savedScroll, 10) : 0;

        const timer = setTimeout(() => {
            window.scrollTo({
                top: !isNaN(targetY) && targetY > 0 ? targetY : 0,
                behavior: 'smooth'
            });
        }, 120);

        return () => clearTimeout(timer);
    }, [pageData?._id, pageNumber, pageLoading, bookId]);

    // Handle Theme Selection
    const handleSelectTheme = (themeId: string) => {
        setSelectedThemeId(themeId);
        dispatch(setTheme(themeId));
        if (typeof window !== 'undefined') {
            localStorage.setItem('reader_selected_theme', themeId);
        }
    };

    // Handle Border Selection
    const handleSelectBorder = (borderId: string) => {
        setSelectedBorderId(borderId);
        setIsBorderMenuOpen(false);
        if (typeof window !== 'undefined') {
            localStorage.setItem('reader_selected_border', borderId);
        }
    };

    // Process content into interactive highlightable sentence elements
    const processedHtml = useMemo(() => {
        if (!pageData?.content) return '';
        if (typeof window === 'undefined') return pageData.content;

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(pageData.content, 'text/html');
            let sentenceCount = 0;

            const processNode = (node: Node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent || '';
                    if (!text.trim()) return;

                    const sentenceMatches = text.match(/[^.!?]+[.!?]+|\s+$/g) || [text];

                    const fragment = doc.createDocumentFragment();
                    sentenceMatches.forEach((sentenceText) => {
                        if (!sentenceText) return;
                        const idx = sentenceCount++;
                        const isMarked = highlightedIndices.includes(idx);

                        const span = doc.createElement('span');
                        span.setAttribute('data-sentence-index', idx.toString());
                        span.className = 'cursor-pointer transition-colors duration-200 rounded-sm inline px-0.5';
                        span.style.color = isMarked ? activeTheme.highlightText : activeTheme.textColor;
                        span.style.backgroundColor = isMarked ? activeTheme.highlightBg : 'transparent';

                        if (isMarked) {
                            span.style.fontWeight = '600';
                        }

                        span.textContent = sentenceText;
                        fragment.appendChild(span);
                    });
                    node.parentNode?.replaceChild(fragment, node);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const tagName = (node as Element).tagName.toLowerCase();
                    if (tagName !== 'script' && tagName !== 'style') {
                        Array.from(node.childNodes).forEach((child) => processNode(child));
                    }
                }
            };

            Array.from(doc.body.childNodes).forEach((child) => processNode(child));
            return doc.body.innerHTML;
        } catch (e) {
            return pageData.content;
        }
    }, [pageData?.content, highlightedIndices, activeTheme]);

    // Handle delegated sentence click
    const handleArticleClick = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        const sentenceSpan = target.closest('[data-sentence-index]');
        if (sentenceSpan) {
            const indexAttr = sentenceSpan.getAttribute('data-sentence-index');
            if (indexAttr !== null) {
                const sentenceIdx = parseInt(indexAttr, 10);
                if (!isNaN(sentenceIdx)) {
                    toggleHighlightMutation.mutate(sentenceIdx);
                }
            }
        }
    };

    // Generate page numbers array for pagination
    const totalPages = pageData?.totalPages || 1;
    const highlightedPages = pageData?.highlightedPages || [];

    const renderPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (pageNumber > 3) pages.push('...');
            const start = Math.max(2, pageNumber - 1);
            const end = Math.min(totalPages - 1, pageNumber + 1);
            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }
            if (pageNumber < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }

        return pages.map((p, idx) => {
            if (typeof p === 'string') {
                return (
                    <span key={`ellipsis-${idx}`} className="px-1.5 sm:px-2 py-1 text-white/50 select-none text-xs sm:text-sm font-medium">
                        ...
                    </span>
                );
            }

            const isActive = p === pageNumber;
            const hasHighlights = highlightedPages.includes(p);

            return (
                <button
                    key={`page-${p}`}
                    onClick={() => setPageNumber(p)}
                    disabled={pageLoading}
                    className={`relative px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center min-w-[34px] sm:min-w-[42px] ${isActive
                        ? 'bg-white text-slate-900 shadow-xl ring-4 ring-amber-400/60 scale-105 font-extrabold'
                        : 'bg-white/15 hover:bg-white/30 text-white border border-white/20 backdrop-blur-sm'
                        }`}
                >
                    {p}
                    {hasHighlights && !isActive && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-amber-400 rounded-full ring-2 ring-slate-900 animate-pulse" title="Contains highlights" />
                    )}
                </button>
            );
        });
    };


    return (
        <div
            className="min-h-screen transition-all duration-500 scroll-smooth"
            style={{
                background: activeTheme.bgCss.replace('background-color: ', '').replace('background: ', '').replace(';', ''),
                color: activeTheme.textColor
            }}
        >
            {/* Reader Top Toolbar - Responsive for Mobile & Desktop */}
            <div
                className="sticky top-0 z-40 px-2 sm:px-6 py-1.5 sm:py-2.5 flex flex-wrap sm:flex-nowrap items-center justify-between shadow-sm backdrop-blur-md border-b transition-colors gap-1 sm:gap-3 max-w-full"
                style={{
                    backgroundColor: activeTheme.toolbarBg,
                    borderColor: activeTheme.borderColor,
                    color: activeTheme.textColor
                }}
            >
                {/* Back to Library */}
                <button
                    onClick={() => router.push('/')}
                    className="px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-transparent hover:border-current/15 text-xs sm:text-sm font-semibold hover:opacity-80 transition flex items-center gap-1 flex-shrink-0"
                    title="Back to Library"
                >
                    <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Library</span>
                </button>

                {/* Right Action Controls: Search, Font Controls, Speech Controls, Border Selector, Theme Selector */}
                <div className="flex items-center gap-1 sm:gap-2.5 flex-wrap sm:flex-nowrap justify-end flex-1 min-w-0">
                    <SearchPopover
                        bookId={bookId}
                        baseRoute="/reader/read"
                        variant="icon"
                        borderColor={activeTheme.borderColor}
                    />
                    {/* Compact Segmented Font Size Pill */}
                    <div
                        className="flex items-center rounded-xl border p-0.5 shadow-xs flex-shrink-0"
                        style={{ borderColor: activeTheme.borderColor }}
                    >
                        <button
                            onClick={() => dispatch(setFontSize(Math.max(14, fontSize - 2)))}
                            className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-bold hover:bg-current/10 transition"
                            title="Decrease Font Size"
                        >
                            A-
                        </button>
                        <span className="w-[1px] h-3 opacity-25 bg-current" />
                        <button
                            onClick={() => dispatch(setFontSize(Math.min(32, fontSize + 2)))}
                            className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-bold hover:bg-current/10 transition"
                            title="Increase Font Size"
                        >
                            A+
                        </button>
                    </div>

                    {/* Read Aloud Speech Controls: Voice Selector, Speed Selector & Play/Stop Button */}
                    <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                        {voices.length > 0 && (
                            <select
                                value={selectedVoiceIndex}
                                onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
                                className="px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-xl border text-xs font-medium hover:opacity-80 transition shadow-xs max-w-[65px] xs:max-w-[95px] sm:max-w-[150px] truncate outline-none cursor-pointer"
                                style={{
                                    borderColor: activeTheme.borderColor,
                                    backgroundColor: activeTheme.toolbarBg,
                                    color: activeTheme.textColor
                                }}
                                title="Select Voice"
                            >
                                {voices.map((voice, idx) => (
                                    <option key={`${voice.name}-${idx}`} value={idx} className="text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900">
                                        {voice.name.replace(/Google|Microsoft|Apple|Desktop|Natural/gi, '').trim() || voice.name} ({voice.lang})
                                    </option>
                                ))}
                            </select>
                        )}

                        {/* Speech Speed / Playback Rate Selector Dropdown */}
                        <select
                            value={speechRate}
                            onChange={(e) => handleRateChange(Number(e.target.value))}
                            className="px-1 py-1 sm:px-2 sm:py-1.5 rounded-xl border text-xs font-medium hover:opacity-80 transition shadow-xs outline-none cursor-pointer flex-shrink-0"
                            style={{
                                borderColor: activeTheme.borderColor,
                                backgroundColor: activeTheme.toolbarBg,
                                color: activeTheme.textColor
                            }}
                            title="Playback Speed"
                        >
                            <option value={0.5} className="text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900">0.5x</option>
                            <option value={0.75} className="text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900">0.75x</option>
                            <option value={0.9} className="text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900">0.9x</option>
                            <option value={1.0} className="text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900">1.0x</option>
                            <option value={1.25} className="text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900">1.25x</option>
                            <option value={1.5} className="text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900">1.5x</option>
                            <option value={2.0} className="text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900">2.0x</option>
                        </select>

                        {isSpeaking ? (
                            <button
                                onClick={handleStopSpeech}
                                className="px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900 transition flex items-center gap-1 shadow-xs flex-shrink-0"
                                title="Stop Reading Aloud"
                            >
                                <Square className="w-3.5 h-3.5 fill-current flex-shrink-0" />
                                <span className="hidden xs:inline">Stop</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => handlePlaySpeech()}
                                className="px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-medium hover:opacity-80 transition flex items-center gap-1 shadow-xs flex-shrink-0"
                                style={{ borderColor: activeTheme.borderColor }}
                                title="Read Aloud"
                            >
                                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500 opacity-90 flex-shrink-0" />
                                <span className="hidden xs:inline">Listen</span>
                            </button>
                        )}
                    </div>

                    {/* Border Design Selector Dropdown */}
                    <div className="relative" ref={borderMenuRef}>
                        <button
                            onClick={() => setIsBorderMenuOpen(!isBorderMenuOpen)}
                            className="px-1.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl border text-xs sm:text-sm font-medium hover:opacity-80 transition flex items-center gap-1 sm:gap-2 shadow-xs flex-shrink-0"
                            style={{ borderColor: activeTheme.borderColor }}
                            title="Border Style"
                        >
                            <span className="text-xs sm:text-base leading-none">{activeBorder.icon}</span>
                            <span className="hidden md:inline">{activeBorder.name}</span>
                            <Frame className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-70 flex-shrink-0" />
                        </button>

                        {isBorderMenuOpen && (
                            <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-24px)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 py-3 px-2 z-50 max-h-[85vh] overflow-y-auto text-gray-900 dark:text-gray-100 animate-in fade-in zoom-in-95 duration-150">
                                <div className="px-3 py-1.5 border-b border-gray-100 dark:border-slate-800 mb-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider opacity-60">Classical Border Design</h4>
                                </div>

                                <div className="space-y-1">
                                    {BORDER_PRESETS.map((preset) => {
                                        const isSelected = preset.id === selectedBorderId;
                                        return (
                                            <button
                                                key={preset.id}
                                                onClick={() => handleSelectBorder(preset.id)}
                                                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${isSelected
                                                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold border border-amber-200/50'
                                                    : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-sm font-serif border border-gray-200 dark:border-slate-700">
                                                        {preset.icon}
                                                    </span>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 dark:text-gray-100">{preset.name}</div>
                                                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{preset.description}</div>
                                                    </div>
                                                </div>
                                                {isSelected && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Reusable Theme Selector Dropdown Component */}
                    <ThemeSelector
                        selectedThemeId={selectedThemeId}
                        onSelectTheme={handleSelectTheme}
                        activeTheme={activeTheme}
                    />
                </div>
            </div>

            {/* Reader Canvas */}
            <div className="max-w-8xl mx-auto px-4 py-2">
                {/* Highlighted Pages Section - Compact Glassmorphism Badge */}
                {highlightedPages.length > 0 && (
                    <div className="flex justify-end mb-3">
                        <div className="px-3.5 py-1.5 rounded-2xl bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl border border-white/35 dark:border-white/15 shadow-lg flex items-center gap-2.5 transition-all hover:bg-white/25 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase opacity-90">
                                <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
                                <span className="hidden xs:inline">Highlights:</span>
                            </div>
                            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-xs sm:max-w-md no-scrollbar">
                                {highlightedPages.map((pageNum) => (
                                    <button
                                        key={`hl-page-${pageNum}`}
                                        onClick={() => setPageNumber(pageNum)}
                                        className={`px-2.5 py-0.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0 ${pageNum === pageNumber
                                            ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300/60 scale-105 font-extrabold'
                                            : 'bg-white/20 hover:bg-white/35 border border-white/25 backdrop-blur-sm'
                                            }`}
                                    >
                                        <Sparkles className="w-3 h-3 text-amber-300" /> {pageNum}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {pageLoading ? (
                    <div className="flex justify-center h-64 items-center">
                        <div className="animate-pulse flex items-center gap-3 font-medium opacity-80">
                            <BookOpen className="w-5 h-5 animate-bounce" /> Loading page {pageNumber}...
                        </div>
                    </div>
                ) : pageError ? (
                    <div className="text-center py-20 rounded-2xl p-8 border shadow-sm" style={{ borderColor: activeTheme.borderColor }}>
                        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
                        <p className="opacity-70 text-sm">Page {pageNumber} is not available in this book yet.</p>
                        <button
                            onClick={() => setPageNumber(1)}
                            className="mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition"
                        >
                            Return to Page 1
                        </button>
                    </div>
                ) : (
                    <BookFrame
                        selectedBorderId={selectedBorderId}
                        activeTheme={activeTheme}
                        swipeOffset={swipeOffset}
                        isSwiping={isSwiping}
                        pageNumber={pageNumber}
                        totalPages={totalPages}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="w-full flex justify-center m-0 p-0">
                            <Image src={SIX_POINTED_STAR.src} alt="six pointed star" height={100} width={100} className="w-25 h-25 sm:w-32 sm:h-32 opacity-100" />
                        </div>
                        <article
                            className="leading-relaxed font-serif tracking-wide transition-all duration-300 prose max-w-none min-h-[380px]"
                            style={{ fontSize: `${fontSize}px`, color: activeTheme.textColor }}
                            onClick={handleArticleClick}
                            dangerouslySetInnerHTML={{ __html: processedHtml }}
                        />
                    </BookFrame>
                )}

                {/* Premium Smart & Compact Multi-Stop Gradient Bottom Pagination Bar */}
                <div
                    className="mt-12 sm:mt-16 p-2 sm:p-3.5 rounded-3xl shadow-2xl flex flex-row items-center justify-between gap-2 sm:gap-6 border border-white/25 text-white backdrop-blur-xl transition-all duration-300 max-w-4xl mx-auto"
                    style={{
                        background: 'linear-gradient(90deg, #a47451 0.000%, #9c9881 16.667%, #73a09d 33.333%, #3b899a 50.000%, #095b79 66.667%, #002847 83.333%, #000116 100.000%)',
                    }}
                >
                    <button
                        disabled={pageNumber <= 1 || pageLoading}
                        onClick={() => setPageNumber(p => p - 1)}
                        className="h-10 px-3 sm:px-5 rounded-2xl border border-white/30 font-semibold transition-all flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-30 disabled:cursor-not-allowed bg-white/10 hover:bg-white/25 active:scale-95 text-white backdrop-blur-md shadow-md flex-shrink-0 text-xs sm:text-sm"
                        title="Previous Page"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Previous</span>
                    </button>

                    {/* Numeric Page List */}
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center overflow-x-auto max-w-[65vw] sm:max-w-none py-1 no-scrollbar">
                        {renderPageNumbers()}
                    </div>

                    <button
                        disabled={pageNumber >= totalPages || pageLoading}
                        onClick={() => setPageNumber(p => p + 1)}
                        className="h-10 px-3 sm:px-5 rounded-2xl border border-white/30 font-semibold transition-all flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-30 disabled:cursor-not-allowed bg-white/10 hover:bg-white/25 active:scale-95 text-white backdrop-blur-md shadow-md flex-shrink-0 text-xs sm:text-sm"
                        title="Next Page"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}