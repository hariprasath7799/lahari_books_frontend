'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';

export interface ThemeConfig {
    id: string;
    name: string;
    category: 'Single Light' | 'Single Dark' | 'Extreme Dark' | 'Light Gradient' | 'Dark Gradient';
    swatchColor: string;
    bgCss: string;
    textColor: string;
    subtextColor: string;
    toolbarBg: string;
    borderColor: string;
    highlightBg: string;
    highlightText: string;
    hoverBg: string;
    isDark: boolean;
}

export const THEME_PRESETS: ThemeConfig[] = [
    // --- 1. SINGLE LIGHT COLORS (7 Themes) ---
    {
        id: 'light-white',
        name: 'Pure White',
        category: 'Single Light',
        swatchColor: '#ffffff',
        bgCss: 'background-color: #ffffff;',
        textColor: '#0f172a',
        subtextColor: '#475569',
        toolbarBg: 'rgba(255, 255, 255, 0.92)',
        borderColor: 'rgba(226, 232, 240, 0.8)',
        highlightBg: '#fef08a',
        highlightText: '#0f172a',
        hoverBg: 'rgba(229, 231, 235, 0.6)',
        isDark: false
    },
    {
        id: 'light-sepia',
        name: 'Warm Sepia (Classic)',
        category: 'Single Light',
        swatchColor: '#fbf0d9',
        bgCss: 'background-color: #fbf0d9;',
        textColor: '#432818',
        subtextColor: '#7f5539',
        toolbarBg: 'rgba(251, 240, 217, 0.92)',
        borderColor: 'rgba(230, 210, 180, 0.8)',
        highlightBg: '#fde047',
        highlightText: '#432818',
        hoverBg: 'rgba(240, 220, 190, 0.6)',
        isDark: false
    },
    {
        id: 'light-cream',
        name: 'Soft Cream',
        category: 'Single Light',
        swatchColor: '#f4f4f0',
        bgCss: 'background-color: #f4f4f0;',
        textColor: '#1c1917',
        subtextColor: '#57534e',
        toolbarBg: 'rgba(244, 244, 240, 0.92)',
        borderColor: 'rgba(225, 225, 215, 0.8)',
        highlightBg: '#fef08a',
        highlightText: '#1c1917',
        hoverBg: 'rgba(230, 230, 220, 0.6)',
        isDark: false
    },
    {
        id: 'light-almond',
        name: 'Almond Parchment',
        category: 'Single Light',
        swatchColor: '#efebd8',
        bgCss: 'background-color: #efebd8;',
        textColor: '#3b2f2f',
        subtextColor: '#604d4d',
        toolbarBg: 'rgba(239, 235, 216, 0.92)',
        borderColor: 'rgba(215, 205, 185, 0.8)',
        highlightBg: '#fde047',
        highlightText: '#3b2f2f',
        hoverBg: 'rgba(225, 215, 195, 0.6)',
        isDark: false
    },
    {
        id: 'light-mint',
        name: 'Mint Mist',
        category: 'Single Light',
        swatchColor: '#e8f5e9',
        bgCss: 'background-color: #e8f5e9;',
        textColor: '#1b4332',
        subtextColor: '#2d6a4f',
        toolbarBg: 'rgba(232, 245, 233, 0.92)',
        borderColor: 'rgba(200, 230, 205, 0.8)',
        highlightBg: '#a7f3d0',
        highlightText: '#1b4332',
        hoverBg: 'rgba(210, 235, 215, 0.6)',
        isDark: false
    },
    {
        id: 'light-rose',
        name: 'Soft Rose Cream',
        category: 'Single Light',
        swatchColor: '#fff1f2',
        bgCss: 'background-color: #fff1f2;',
        textColor: '#4c0519',
        subtextColor: '#881337',
        toolbarBg: 'rgba(255, 241, 242, 0.92)',
        borderColor: 'rgba(254, 205, 211, 0.8)',
        highlightBg: '#fecdd3',
        highlightText: '#4c0519',
        hoverBg: 'rgba(253, 226, 228, 0.6)',
        isDark: false
    },
    {
        id: 'light-sky',
        name: 'Sky Blue Breeze',
        category: 'Single Light',
        swatchColor: '#f0f9ff',
        bgCss: 'background-color: #f0f9ff;',
        textColor: '#0c4a6e',
        subtextColor: '#0369a1',
        toolbarBg: 'rgba(240, 249, 255, 0.92)',
        borderColor: 'rgba(186, 230, 253, 0.8)',
        highlightBg: '#bae6fd',
        highlightText: '#0c4a6e',
        hoverBg: 'rgba(220, 240, 255, 0.6)',
        isDark: false
    },
    {
        id: 'light-peach',
        name: 'Sunlit Peach',
        category: 'Single Light',
        swatchColor: '#fff7ed',
        bgCss: 'background-color: #fff7ed;',
        textColor: '#7c2d12',
        subtextColor: '#9a3412',
        toolbarBg: 'rgba(255, 247, 237, 0.92)',
        borderColor: 'rgba(254, 215, 170, 0.8)',
        highlightBg: '#fed7aa',
        highlightText: '#7c2d12',
        hoverBg: 'rgba(254, 237, 213, 0.6)',
        isDark: false
    },
    {
        id: 'light-lavender',
        name: 'Lavender Paper',
        category: 'Single Light',
        swatchColor: '#f5f3ff',
        bgCss: 'background-color: #f5f3ff;',
        textColor: '#3b0764',
        subtextColor: '#5b21b6',
        toolbarBg: 'rgba(245, 243, 255, 0.92)',
        borderColor: 'rgba(221, 214, 254, 0.8)',
        highlightBg: '#ddd6fe',
        highlightText: '#3b0764',
        hoverBg: 'rgba(237, 233, 254, 0.6)',
        isDark: false
    },
    {
        id: 'light-sage',
        name: 'Sage Eucalyptus',
        category: 'Single Light',
        swatchColor: '#f4f7f4',
        bgCss: 'background-color: #f4f7f4;',
        textColor: '#14382c',
        subtextColor: '#275c49',
        toolbarBg: 'rgba(244, 247, 244, 0.92)',
        borderColor: 'rgba(210, 224, 216, 0.8)',
        highlightBg: '#b7e4c7',
        highlightText: '#14382c',
        hoverBg: 'rgba(225, 237, 230, 0.6)',
        isDark: false
    },
    {
        id: 'light-amber',
        name: 'Warm Ivory Amber',
        category: 'Single Light',
        swatchColor: '#fffbeb',
        bgCss: 'background-color: #fffbeb;',
        textColor: '#78350f',
        subtextColor: '#92400e',
        toolbarBg: 'rgba(255, 251, 235, 0.92)',
        borderColor: 'rgba(254, 243, 199, 0.8)',
        highlightBg: '#fde047',
        highlightText: '#78350f',
        hoverBg: 'rgba(254, 249, 195, 0.6)',
        isDark: false
    },
    {
        id: 'light-teal',
        name: 'Aquamarine Mist',
        category: 'Single Light',
        swatchColor: '#f0fdfa',
        bgCss: 'background-color: #f0fdfa;',
        textColor: '#134e4a',
        subtextColor: '#0f766e',
        toolbarBg: 'rgba(240, 253, 250, 0.92)',
        borderColor: 'rgba(204, 251, 241, 0.8)',
        highlightBg: '#99f6e4',
        highlightText: '#134e4a',
        hoverBg: 'rgba(224, 252, 247, 0.6)',
        isDark: false
    },

    // --- 2. SINGLE DARK COLORS (7 Themes) ---
    {
        id: 'dark-slate',
        name: 'Midnight Slate',
        category: 'Single Dark',
        swatchColor: '#0f172a',
        bgCss: 'background-color: #0f172a;',
        textColor: '#e2e8f0',
        subtextColor: '#94a3b8',
        toolbarBg: 'rgba(15, 23, 42, 0.92)',
        borderColor: 'rgba(51, 65, 85, 0.8)',
        highlightBg: '#312e81',
        highlightText: '#e0e7ff',
        hoverBg: 'rgba(30, 41, 59, 0.8)',
        isDark: true
    },
    {
        id: 'dark-emerald',
        name: 'Forest Emerald',
        category: 'Single Dark',
        swatchColor: '#061a14',
        bgCss: 'background-color: #061a14;',
        textColor: '#d1fae5',
        subtextColor: '#6ee7b7',
        toolbarBg: 'rgba(6, 26, 20, 0.92)',
        borderColor: 'rgba(20, 83, 65, 0.8)',
        highlightBg: '#064e3b',
        highlightText: '#a7f3d0',
        hoverBg: 'rgba(15, 45, 35, 0.8)',
        isDark: true
    },
    {
        id: 'dark-navy',
        name: 'Deep Oceanic Navy',
        category: 'Single Dark',
        swatchColor: '#0a192f',
        bgCss: 'background-color: #0a192f;',
        textColor: '#e6f1ff',
        subtextColor: '#8892b0',
        toolbarBg: 'rgba(10, 25, 47, 0.92)',
        borderColor: 'rgba(35, 53, 84, 0.8)',
        highlightBg: '#1e3a8a',
        highlightText: '#93c5fd',
        hoverBg: 'rgba(23, 42, 69, 0.8)',
        isDark: true
    },
    {
        id: 'dark-chocolate',
        name: 'Dark Espresso',
        category: 'Single Dark',
        swatchColor: '#1c120c',
        bgCss: 'background-color: #1c120c;',
        textColor: '#ebd9cb',
        subtextColor: '#b59a85',
        toolbarBg: 'rgba(28, 18, 12, 0.92)',
        borderColor: 'rgba(65, 45, 30, 0.8)',
        highlightBg: '#78350f',
        highlightText: '#fef3c7',
        hoverBg: 'rgba(40, 28, 20, 0.8)',
        isDark: true
    },
    {
        id: 'dark-plum',
        name: 'Velvet Plum',
        category: 'Single Dark',
        swatchColor: '#1a0b1c',
        bgCss: 'background-color: #1a0b1c;',
        textColor: '#f3e8ff',
        subtextColor: '#c084fc',
        toolbarBg: 'rgba(26, 11, 28, 0.92)',
        borderColor: 'rgba(70, 30, 75, 0.8)',
        highlightBg: '#581c87',
        highlightText: '#f3e8ff',
        hoverBg: 'rgba(45, 20, 50, 0.8)',
        isDark: true
    },
    {
        id: 'dark-charcoal',
        name: 'Zinc Charcoal',
        category: 'Single Dark',
        swatchColor: '#18181b',
        bgCss: 'background-color: #18181b;',
        textColor: '#f4f4f5',
        subtextColor: '#a1a1aa',
        toolbarBg: 'rgba(24, 24, 27, 0.92)',
        borderColor: 'rgba(63, 63, 70, 0.8)',
        highlightBg: '#3f3f46',
        highlightText: '#ffffff',
        hoverBg: 'rgba(39, 39, 42, 0.8)',
        isDark: true
    },
    {
        id: 'dark-github',
        name: 'GitHub Obsidian',
        category: 'Single Dark',
        swatchColor: '#0d1117',
        bgCss: 'background-color: #0d1117;',
        textColor: '#c9d1d9',
        subtextColor: '#8b949e',
        toolbarBg: 'rgba(13, 17, 23, 0.92)',
        borderColor: 'rgba(48, 54, 61, 0.8)',
        highlightBg: '#1f6feb',
        highlightText: '#ffffff',
        hoverBg: 'rgba(22, 27, 34, 0.8)',
        isDark: true
    },
    {
        id: 'dark-violet',
        name: 'Royal Violet Dark',
        category: 'Single Dark',
        swatchColor: '#13091f',
        bgCss: 'background-color: #13091f;',
        textColor: '#ede9fe',
        subtextColor: '#a78bfa',
        toolbarBg: 'rgba(19, 9, 31, 0.92)',
        borderColor: 'rgba(59, 7, 100, 0.8)',
        highlightBg: '#6d28d9',
        highlightText: '#f5f3ff',
        hoverBg: 'rgba(35, 18, 55, 0.8)',
        isDark: true
    },
    {
        id: 'dark-teal',
        name: 'Teal Abyss',
        category: 'Single Dark',
        swatchColor: '#041f1e',
        bgCss: 'background-color: #041f1e;',
        textColor: '#e6fffa',
        subtextColor: '#4fd1c5',
        toolbarBg: 'rgba(4, 31, 30, 0.92)',
        borderColor: 'rgba(13, 148, 136, 0.8)',
        highlightBg: '#14b8a6',
        highlightText: '#041f1e',
        hoverBg: 'rgba(10, 48, 46, 0.8)',
        isDark: true
    },
    {
        id: 'dark-copper',
        name: 'Burnished Copper',
        category: 'Single Dark',
        swatchColor: '#1a0f0a',
        bgCss: 'background-color: #1a0f0a;',
        textColor: '#ffedd5',
        subtextColor: '#fb923c',
        toolbarBg: 'rgba(26, 15, 10, 0.92)',
        borderColor: 'rgba(124, 45, 18, 0.8)',
        highlightBg: '#c2410c',
        highlightText: '#fff7ed',
        hoverBg: 'rgba(45, 25, 18, 0.8)',
        isDark: true
    },
    {
        id: 'dark-indigo',
        name: 'Midnight Indigo',
        category: 'Single Dark',
        swatchColor: '#0c102b',
        bgCss: 'background-color: #0c102b;',
        textColor: '#e0e7ff',
        subtextColor: '#818cf8',
        toolbarBg: 'rgba(12, 16, 43, 0.92)',
        borderColor: 'rgba(55, 48, 163, 0.8)',
        highlightBg: '#4f46e5',
        highlightText: '#ffffff',
        hoverBg: 'rgba(25, 30, 70, 0.8)',
        isDark: true
    },
    {
        id: 'dark-graphite',
        name: 'Graphite Carbon',
        category: 'Single Dark',
        swatchColor: '#121417',
        bgCss: 'background-color: #121417;',
        textColor: '#e2e8f0',
        subtextColor: '#94a3b8',
        toolbarBg: 'rgba(18, 20, 23, 0.92)',
        borderColor: 'rgba(45, 55, 72, 0.8)',
        highlightBg: '#4a5568',
        highlightText: '#ffffff',
        hoverBg: 'rgba(30, 34, 40, 0.8)',
        isDark: true
    },

    // --- 3. EXTREME DARK COLORS (7 Themes) ---
    {
        id: 'extreme-dark-oled',
        name: 'OLED Pitch Black',
        category: 'Extreme Dark',
        swatchColor: '#000000',
        bgCss: 'background-color: #000000;',
        textColor: '#cbd5e1',
        subtextColor: '#64748b',
        toolbarBg: 'rgba(0, 0, 0, 0.95)',
        borderColor: 'rgba(38, 38, 38, 0.9)',
        highlightBg: '#3f3f46',
        highlightText: '#ffffff',
        hoverBg: 'rgba(24, 24, 27, 0.9)',
        isDark: true
    },
    {
        id: 'extreme-dark-amber',
        name: 'OLED Amber Night (Warm)',
        category: 'Extreme Dark',
        swatchColor: '#000000',
        bgCss: 'background-color: #000000;',
        textColor: '#ffb703',
        subtextColor: '#fb8500',
        toolbarBg: 'rgba(0, 0, 0, 0.95)',
        borderColor: 'rgba(60, 40, 0, 0.9)',
        highlightBg: '#78350f',
        highlightText: '#fffbe8',
        hoverBg: 'rgba(30, 20, 0, 0.9)',
        isDark: true
    },
    {
        id: 'extreme-dark-red',
        name: 'OLED Submarine Red',
        category: 'Extreme Dark',
        swatchColor: '#000000',
        bgCss: 'background-color: #000000;',
        textColor: '#ef4444',
        subtextColor: '#b91c1c',
        toolbarBg: 'rgba(0, 0, 0, 0.95)',
        borderColor: 'rgba(65, 10, 10, 0.9)',
        highlightBg: '#7f1d1d',
        highlightText: '#fef2f2',
        hoverBg: 'rgba(35, 5, 5, 0.9)',
        isDark: true
    },
    {
        id: 'extreme-dark-mint',
        name: 'OLED Tactical Green',
        category: 'Extreme Dark',
        swatchColor: '#000000',
        bgCss: 'background-color: #000000;',
        textColor: '#34d399',
        subtextColor: '#059669',
        toolbarBg: 'rgba(0, 0, 0, 0.95)',
        borderColor: 'rgba(10, 50, 30, 0.9)',
        highlightBg: '#064e3b',
        highlightText: '#ecfdf5',
        hoverBg: 'rgba(5, 30, 20, 0.9)',
        isDark: true
    },
    {
        id: 'extreme-dark-cyan',
        name: 'OLED Cyber Cyan',
        category: 'Extreme Dark',
        swatchColor: '#000000',
        bgCss: 'background-color: #000000;',
        textColor: '#38bdf8',
        subtextColor: '#0284c7',
        toolbarBg: 'rgba(0, 0, 0, 0.95)',
        borderColor: 'rgba(10, 45, 65, 0.9)',
        highlightBg: '#075985',
        highlightText: '#f0f9ff',
        hoverBg: 'rgba(5, 25, 40, 0.9)',
        isDark: true
    },
    {
        id: 'extreme-dark-violet',
        name: 'OLED Neon Violet',
        category: 'Extreme Dark',
        swatchColor: '#000000',
        bgCss: 'background-color: #000000;',
        textColor: '#c084fc',
        subtextColor: '#9333ea',
        toolbarBg: 'rgba(0, 0, 0, 0.95)',
        borderColor: 'rgba(45, 10, 65, 0.9)',
        highlightBg: '#581c87',
        highlightText: '#faf5ff',
        hoverBg: 'rgba(25, 5, 40, 0.9)',
        isDark: true
    },
    {
        id: 'extreme-dark-silver',
        name: 'OLED Silver Monochrome',
        category: 'Extreme Dark',
        swatchColor: '#000000',
        bgCss: 'background-color: #000000;',
        textColor: '#94a3b8',
        subtextColor: '#64748b',
        toolbarBg: 'rgba(0, 0, 0, 0.95)',
        borderColor: 'rgba(35, 35, 40, 0.9)',
        highlightBg: '#27272a',
        highlightText: '#ffffff',
        hoverBg: 'rgba(20, 20, 25, 0.9)',
        isDark: true
    },
    {
        id: 'extreme-dark-emerald',
        name: 'OLED Emerald Glow',
        category: 'Extreme Dark',
        swatchColor: '#000000',
        bgCss: 'background-color: #000000;',
        textColor: '#6ee7b7',
        subtextColor: '#10b981',
        toolbarBg: 'rgba(0, 0, 0, 0.95)',
        borderColor: 'rgba(6, 78, 59, 0.9)',
        highlightBg: '#047857',
        highlightText: '#ecfdf5',
        hoverBg: 'rgba(5, 35, 25, 0.9)',
        isDark: true
    },
    {
        id: 'extreme-dark-gold',
        name: 'OLED Imperial Gold',
        category: 'Extreme Dark',
        swatchColor: '#000000',
        bgCss: 'background-color: #000000;',
        textColor: '#fde047',
        subtextColor: '#eab308',
        toolbarBg: 'rgba(0, 0, 0, 0.95)',
        borderColor: 'rgba(113, 63, 18, 0.9)',
        highlightBg: '#ca8a04',
        highlightText: '#fefce8',
        hoverBg: 'rgba(40, 25, 5, 0.9)',
        isDark: true
    },
    {
        id: 'extreme-dark-rose',
        name: 'OLED Neon Rose',
        category: 'Extreme Dark',
        swatchColor: '#000000',
        bgCss: 'background-color: #000000;',
        textColor: '#fda4af',
        subtextColor: '#f43f5e',
        toolbarBg: 'rgba(0, 0, 0, 0.95)',
        borderColor: 'rgba(136, 19, 55, 0.9)',
        highlightBg: '#be123c',
        highlightText: '#fff1f2',
        hoverBg: 'rgba(40, 10, 20, 0.9)',
        isDark: true
    },
    {
        id: 'extreme-dark-blue',
        name: 'OLED Electric Blue',
        category: 'Extreme Dark',
        swatchColor: '#000000',
        bgCss: 'background-color: #000000;',
        textColor: '#60a5fa',
        subtextColor: '#3b82f6',
        toolbarBg: 'rgba(0, 0, 0, 0.95)',
        borderColor: 'rgba(30, 58, 138, 0.9)',
        highlightBg: '#1d4ed8',
        highlightText: '#eff6ff',
        hoverBg: 'rgba(10, 25, 50, 0.9)',
        isDark: true
    },
    {
        id: 'extreme-dark-purple',
        name: 'OLED Deep Magenta',
        category: 'Extreme Dark',
        swatchColor: '#000000',
        bgCss: 'background-color: #000000;',
        textColor: '#f0abfc',
        subtextColor: '#d946ef',
        toolbarBg: 'rgba(0, 0, 0, 0.95)',
        borderColor: 'rgba(112, 26, 117, 0.9)',
        highlightBg: '#a21caf',
        highlightText: '#fdf4ff',
        hoverBg: 'rgba(35, 10, 40, 0.9)',
        isDark: true
    },

    // --- 4. LIGHT GRADIENT COLORS (7 Themes) ---
    {
        id: 'gradient-dawn',
        name: 'Warm Dawn Gradient',
        category: 'Light Gradient',
        swatchColor: 'linear-gradient(135deg, #fff7ed, #fed7aa)',
        bgCss: 'background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%);',
        textColor: '#451a03',
        subtextColor: '#78350f',
        toolbarBg: 'rgba(255, 247, 237, 0.88)',
        borderColor: 'rgba(254, 215, 170, 0.8)',
        highlightBg: '#fde047',
        highlightText: '#451a03',
        hoverBg: 'rgba(254, 243, 199, 0.7)',
        isDark: false
    },
    {
        id: 'gradient-nordic',
        name: 'Nordic Breeze Gradient',
        category: 'Light Gradient',
        swatchColor: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
        bgCss: 'background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);',
        textColor: '#0f172a',
        subtextColor: '#334155',
        toolbarBg: 'rgba(248, 250, 252, 0.88)',
        borderColor: 'rgba(226, 232, 240, 0.8)',
        highlightBg: '#fef08a',
        highlightText: '#0f172a',
        hoverBg: 'rgba(226, 232, 240, 0.7)',
        isDark: false
    },
    {
        id: 'gradient-meadow',
        name: 'Spring Meadow Gradient',
        category: 'Light Gradient',
        swatchColor: 'linear-gradient(135deg, #f0fdf4, #bbf7d0)',
        bgCss: 'background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%);',
        textColor: '#14532d',
        subtextColor: '#166534',
        toolbarBg: 'rgba(240, 253, 244, 0.88)',
        borderColor: 'rgba(187, 247, 208, 0.8)',
        highlightBg: '#86efac',
        highlightText: '#14532d',
        hoverBg: 'rgba(220, 252, 231, 0.7)',
        isDark: false
    },
    {
        id: 'gradient-blush',
        name: 'Rose Blush Gradient',
        category: 'Light Gradient',
        swatchColor: 'linear-gradient(135deg, #fff1f2, #fecdd3)',
        bgCss: 'background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%);',
        textColor: '#881337',
        subtextColor: '#9f1239',
        toolbarBg: 'rgba(255, 241, 242, 0.88)',
        borderColor: 'rgba(254, 205, 211, 0.8)',
        highlightBg: '#fda4af',
        highlightText: '#881337',
        hoverBg: 'rgba(254, 226, 226, 0.7)',
        isDark: false
    },
    {
        id: 'gradient-sunset',
        name: 'Golden Hour Sunset Gradient',
        category: 'Light Gradient',
        swatchColor: 'linear-gradient(135deg, #fffbeb, #fde68a)',
        bgCss: 'background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%);',
        textColor: '#713f12',
        subtextColor: '#854d0e',
        toolbarBg: 'rgba(255, 251, 235, 0.88)',
        borderColor: 'rgba(253, 230, 138, 0.8)',
        highlightBg: '#fcd34d',
        highlightText: '#713f12',
        hoverBg: 'rgba(254, 249, 195, 0.7)',
        isDark: false
    },
    {
        id: 'gradient-lavender',
        name: 'Lavender Dream Gradient',
        category: 'Light Gradient',
        swatchColor: 'linear-gradient(135deg, #faf5ff, #e9d5ff)',
        bgCss: 'background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%);',
        textColor: '#581c87',
        subtextColor: '#7e22ce',
        toolbarBg: 'rgba(250, 245, 255, 0.88)',
        borderColor: 'rgba(233, 213, 255, 0.8)',
        highlightBg: '#d8b4fe',
        highlightText: '#581c87',
        hoverBg: 'rgba(243, 232, 255, 0.7)',
        isDark: false
    },
    {
        id: 'gradient-sky',
        name: 'Azure Horizon Gradient',
        category: 'Light Gradient',
        swatchColor: 'linear-gradient(135deg, #f0f9ff, #bae6fd)',
        bgCss: 'background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%);',
        textColor: '#0c4a6e',
        subtextColor: '#0284c7',
        toolbarBg: 'rgba(240, 249, 255, 0.88)',
        borderColor: 'rgba(186, 230, 253, 0.8)',
        highlightBg: '#7dd3fc',
        highlightText: '#0c4a6e',
        hoverBg: 'rgba(224, 242, 254, 0.7)',
        isDark: false
    },
    {
        id: 'gradient-peach',
        name: 'Peach Sorbet Gradient',
        category: 'Light Gradient',
        swatchColor: 'linear-gradient(135deg, #fff7ed, #fecdd3)',
        bgCss: 'background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fecdd3 100%);',
        textColor: '#881337',
        subtextColor: '#9f1239',
        toolbarBg: 'rgba(255, 247, 237, 0.88)',
        borderColor: 'rgba(254, 205, 211, 0.8)',
        highlightBg: '#fda4af',
        highlightText: '#881337',
        hoverBg: 'rgba(254, 226, 226, 0.7)',
        isDark: false
    },
    {
        id: 'gradient-emerald',
        name: 'Mint Emerald Gradient',
        category: 'Light Gradient',
        swatchColor: 'linear-gradient(135deg, #ecfdf5, #a7f3d0)',
        bgCss: 'background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%);',
        textColor: '#064e3b',
        subtextColor: '#047857',
        toolbarBg: 'rgba(236, 253, 245, 0.88)',
        borderColor: 'rgba(167, 243, 208, 0.8)',
        highlightBg: '#6ee7b7',
        highlightText: '#064e3b',
        hoverBg: 'rgba(209, 250, 229, 0.7)',
        isDark: false
    },
    {
        id: 'gradient-violet',
        name: 'Lilac Sunset Gradient',
        category: 'Light Gradient',
        swatchColor: 'linear-gradient(135deg, #f3e8ff, #ddd6fe)',
        bgCss: 'background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 50%, #ddd6fe 100%);',
        textColor: '#4c1d95',
        subtextColor: '#5b21b6',
        toolbarBg: 'rgba(243, 232, 255, 0.88)',
        borderColor: 'rgba(221, 214, 254, 0.8)',
        highlightBg: '#c4b5fd',
        highlightText: '#4c1d95',
        hoverBg: 'rgba(233, 213, 255, 0.7)',
        isDark: false
    },
    {
        id: 'gradient-coral',
        name: 'Coral Glow Gradient',
        category: 'Light Gradient',
        swatchColor: 'linear-gradient(135deg, #fff1f2, #fed7aa)',
        bgCss: 'background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fed7aa 100%);',
        textColor: '#7c2d12',
        subtextColor: '#9a3412',
        toolbarBg: 'rgba(255, 241, 242, 0.88)',
        borderColor: 'rgba(254, 215, 170, 0.8)',
        highlightBg: '#fdba74',
        highlightText: '#7c2d12',
        hoverBg: 'rgba(254, 237, 213, 0.7)',
        isDark: false
    },
    {
        id: 'gradient-ocean',
        name: 'Coastal Breeze Gradient',
        category: 'Light Gradient',
        swatchColor: 'linear-gradient(135deg, #f0fdfa, #bae6fd)',
        bgCss: 'background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #bae6fd 100%);',
        textColor: '#0f4c5c',
        subtextColor: '#0e7490',
        toolbarBg: 'rgba(240, 253, 250, 0.88)',
        borderColor: 'rgba(186, 230, 253, 0.8)',
        highlightBg: '#67e8f9',
        highlightText: '#0f4c5c',
        hoverBg: 'rgba(204, 251, 241, 0.7)',
        isDark: false
    },

    // --- 5. DARK GRADIENT COLORS (7 Themes) ---
    {
        id: 'gradient-aurora',
        name: 'Deep Aurora Gradient',
        category: 'Dark Gradient',
        swatchColor: 'linear-gradient(135deg, #0f172a, #2e1065)',
        bgCss: 'background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #2e1065 100%);',
        textColor: '#f3e8ff',
        subtextColor: '#c084fc',
        toolbarBg: 'rgba(15, 23, 42, 0.88)',
        borderColor: 'rgba(88, 28, 135, 0.8)',
        highlightBg: '#581c87',
        highlightText: '#f3e8ff',
        hoverBg: 'rgba(46, 16, 101, 0.7)',
        isDark: true
    },
    {
        id: 'gradient-night',
        name: 'Obsidian Night Gradient',
        category: 'Dark Gradient',
        swatchColor: 'linear-gradient(135deg, #020617, #030712)',
        bgCss: 'background: linear-gradient(135deg, #020617 0%, #0f172a 50%, #030712 100%);',
        textColor: '#e0f2fe',
        subtextColor: '#38bdf8',
        toolbarBg: 'rgba(2, 6, 23, 0.92)',
        borderColor: 'rgba(15, 23, 42, 0.9)',
        highlightBg: '#075985',
        highlightText: '#e0f2fe',
        hoverBg: 'rgba(15, 23, 42, 0.8)',
        isDark: true
    },
    {
        id: 'gradient-nebula',
        name: 'Cosmic Nebula Gradient',
        category: 'Dark Gradient',
        swatchColor: 'linear-gradient(135deg, #18020c, #4c0519)',
        bgCss: 'background: linear-gradient(135deg, #18020c 0%, #3b0764 50%, #4c0519 100%);',
        textColor: '#fbcfe8',
        subtextColor: '#f472b6',
        toolbarBg: 'rgba(24, 2, 12, 0.92)',
        borderColor: 'rgba(76, 5, 25, 0.8)',
        highlightBg: '#831843',
        highlightText: '#fbcfe8',
        hoverBg: 'rgba(59, 7, 100, 0.8)',
        isDark: true
    },
    {
        id: 'gradient-peacock',
        name: 'Peacock Abyss Gradient',
        category: 'Dark Gradient',
        swatchColor: 'linear-gradient(135deg, #042f2e, #064e3b)',
        bgCss: 'background: linear-gradient(135deg, #042f2e 0%, #0d9488 50%, #064e3b 100%);',
        textColor: '#ccfbf1',
        subtextColor: '#2dd4bf',
        toolbarBg: 'rgba(4, 47, 46, 0.92)',
        borderColor: 'rgba(13, 148, 136, 0.8)',
        highlightBg: '#115e59',
        highlightText: '#ccfbf1',
        hoverBg: 'rgba(13, 148, 136, 0.7)',
        isDark: true
    },
    {
        id: 'gradient-volcano',
        name: 'Volcanic Ash Gradient',
        category: 'Dark Gradient',
        swatchColor: 'linear-gradient(135deg, #1c1917, #0c0a09)',
        bgCss: 'background: linear-gradient(135deg, #1c1917 0%, #292524 50%, #0c0a09 100%);',
        textColor: '#f5f5f4',
        subtextColor: '#a8a29e',
        toolbarBg: 'rgba(28, 25, 23, 0.92)',
        borderColor: 'rgba(41, 37, 36, 0.9)',
        highlightBg: '#44403c',
        highlightText: '#ffffff',
        hoverBg: 'rgba(41, 37, 36, 0.8)',
        isDark: true
    },
    {
        id: 'gradient-cyberpunk',
        name: 'Cyberpunk Neon Gradient',
        category: 'Dark Gradient',
        swatchColor: 'linear-gradient(135deg, #09090b, #311042)',
        bgCss: 'background: linear-gradient(135deg, #09090b 0%, #172554 50%, #311042 100%);',
        textColor: '#e0e7ff',
        subtextColor: '#818cf8',
        toolbarBg: 'rgba(9, 9, 11, 0.92)',
        borderColor: 'rgba(49, 16, 66, 0.8)',
        highlightBg: '#1e1b4b',
        highlightText: '#e0e7ff',
        hoverBg: 'rgba(23, 37, 84, 0.8)',
        isDark: true
    },
    {
        id: 'gradient-forest',
        name: 'Midnight Forest Gradient',
        category: 'Dark Gradient',
        swatchColor: 'linear-gradient(135deg, #022c22, #064e3b)',
        bgCss: 'background: linear-gradient(135deg, #022c22 0%, #064e3b 50%, #022c22 100%);',
        textColor: '#a7f3d0',
        subtextColor: '#34d399',
        toolbarBg: 'rgba(2, 44, 34, 0.92)',
        borderColor: 'rgba(6, 78, 59, 0.8)',
        highlightBg: '#047857',
        highlightText: '#a7f3d0',
        hoverBg: 'rgba(6, 78, 59, 0.8)',
        isDark: true
    },
    {
        id: 'gradient-magma',
        name: 'Molten Magma Gradient',
        category: 'Dark Gradient',
        swatchColor: 'linear-gradient(135deg, #180505, #7f1d1d)',
        bgCss: 'background: linear-gradient(135deg, #180505 0%, #450a0a 50%, #7f1d1d 100%);',
        textColor: '#fecaca',
        subtextColor: '#f87171',
        toolbarBg: 'rgba(24, 5, 5, 0.92)',
        borderColor: 'rgba(127, 29, 29, 0.8)',
        highlightBg: '#b91c1c',
        highlightText: '#fef2f2',
        hoverBg: 'rgba(69, 10, 10, 0.8)',
        isDark: true
    },
    {
        id: 'gradient-twilight',
        name: 'Violet Twilight Gradient',
        category: 'Dark Gradient',
        swatchColor: 'linear-gradient(135deg, #090514, #3b0764)',
        bgCss: 'background: linear-gradient(135deg, #090514 0%, #1e1b4b 50%, #3b0764 100%);',
        textColor: '#e9d5ff',
        subtextColor: '#c084fc',
        toolbarBg: 'rgba(9, 5, 20, 0.92)',
        borderColor: 'rgba(59, 7, 100, 0.8)',
        highlightBg: '#7e22ce',
        highlightText: '#faf5ff',
        hoverBg: 'rgba(30, 27, 75, 0.8)',
        isDark: true
    },
    {
        id: 'gradient-matrix',
        name: 'Emerald Matrix Gradient',
        category: 'Dark Gradient',
        swatchColor: 'linear-gradient(135deg, #021a12, #065f46)',
        bgCss: 'background: linear-gradient(135deg, #021a12 0%, #064e3b 50%, #065f46 100%);',
        textColor: '#a7f3d0',
        subtextColor: '#34d399',
        toolbarBg: 'rgba(2, 26, 18, 0.92)',
        borderColor: 'rgba(6, 95, 70, 0.8)',
        highlightBg: '#059669',
        highlightText: '#ecfdf5',
        hoverBg: 'rgba(6, 78, 59, 0.8)',
        isDark: true
    },
    {
        id: 'gradient-galaxy',
        name: 'Deep Galaxy Blue Gradient',
        category: 'Dark Gradient',
        swatchColor: 'linear-gradient(135deg, #030712, #1e3a8a)',
        bgCss: 'background: linear-gradient(135deg, #030712 0%, #0f172a 50%, #1e3a8a 100%);',
        textColor: '#bfdbfe',
        subtextColor: '#60a5fa',
        toolbarBg: 'rgba(3, 7, 18, 0.92)',
        borderColor: 'rgba(30, 58, 138, 0.8)',
        highlightBg: '#2563eb',
        highlightText: '#eff6ff',
        hoverBg: 'rgba(15, 23, 42, 0.8)',
        isDark: true
    },
    {
        id: 'gradient-copper',
        name: 'Burnished Bronze Gradient',
        category: 'Dark Gradient',
        swatchColor: 'linear-gradient(135deg, #180a04, #78350f)',
        bgCss: 'background: linear-gradient(135deg, #180a04 0%, #451a03 50%, #78350f 100%);',
        textColor: '#ffedd5',
        subtextColor: '#fb923c',
        toolbarBg: 'rgba(24, 10, 4, 0.92)',
        borderColor: 'rgba(120, 53, 15, 0.8)',
        highlightBg: '#d97706',
        highlightText: '#fffbe8',
        hoverBg: 'rgba(69, 26, 3, 0.8)',
        isDark: true
    }
];

export interface ThemeSelectorProps {
    selectedThemeId: string;
    onSelectTheme: (themeId: string) => void;
    activeTheme: ThemeConfig;
}

export default function ThemeSelector({
    selectedThemeId,
    onSelectTheme,
    activeTheme
}: ThemeSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const categories: Array<ThemeConfig['category']> = [
        'Single Light',
        'Single Dark',
        'Extreme Dark',
        'Light Gradient',
        'Dark Gradient'
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleThemeClick = (id: string) => {
        onSelectTheme(id);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-medium hover:opacity-80 transition flex items-center gap-1.5 sm:gap-2 shadow-xs flex-shrink-0"
                style={{ borderColor: activeTheme.borderColor }}
            >
                <span
                    className="w-3.5 h-3.5 rounded-full border shadow-xs flex-shrink-0"
                    style={{ background: activeTheme.swatchColor, borderColor: activeTheme.borderColor }}
                />
                <span className="hidden sm:inline">{activeTheme.name}</span>
                <span className="sm:hidden text-xs font-semibold">{activeTheme.name.split(' ')[0]}</span>
                <Palette className="w-3.5 h-3.5 opacity-70 ml-0.5 flex-shrink-0" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 py-3 px-2 z-50 max-h-[85vh] overflow-y-auto text-gray-900 dark:text-gray-100 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 border-b border-gray-100 dark:border-slate-800 mb-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider opacity-60">Reader Theme & Lighting</h4>
                    </div>

                    {categories.map((cat) => {
                        const presets = THEME_PRESETS.filter(t => t.category === cat);
                        if (presets.length === 0) return null;

                        return (
                            <div key={cat} className="mb-3">
                                <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                    {cat}
                                </div>
                                <div className="space-y-1 mt-1">
                                    {presets.map((preset) => {
                                        const isSelected = preset.id === selectedThemeId;
                                        return (
                                            <button
                                                key={preset.id}
                                                onClick={() => handleThemeClick(preset.id)}
                                                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${isSelected
                                                    ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold'
                                                    : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <span
                                                        className="w-4 h-4 rounded-full border shadow-sm flex-shrink-0"
                                                        style={{ background: preset.swatchColor }}
                                                    />
                                                    <span>{preset.name}</span>
                                                </div>
                                                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
