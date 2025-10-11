import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        // Check if user has a saved preference
        const saved = localStorage.getItem('theme-preference');
        if (saved) {
            return saved === 'dark';
        }
        // Default to system preference
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        // Save preference to localStorage
        localStorage.setItem('theme-preference', isDark ? 'dark' : 'light');

        // Apply theme to document
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    const theme = {
        isDark,
        toggleTheme,
        colors: isDark ? {
            // Dark theme - eye-friendly colors
            primary: 'bg-slate-800',
            secondary: 'bg-slate-700',
            accent: 'bg-teal-600',
            surface: 'bg-slate-800',
            surfaceHover: 'hover:bg-slate-700',
            border: 'border-slate-600',
            text: {
                primary: 'text-slate-100',
                secondary: 'text-slate-300',
                muted: 'text-slate-400'
            },
            sidebar: 'bg-slate-900',
            topbar: 'bg-slate-800',
            card: 'bg-slate-800',
            cardHover: 'hover:bg-slate-700'
        } : {
            // Light theme
            primary: 'bg-white',
            secondary: 'bg-gray-50',
            accent: 'bg-teal-600',
            surface: 'bg-white',
            surfaceHover: 'hover:bg-gray-50',
            border: 'border-gray-200',
            text: {
                primary: 'text-gray-900',
                secondary: 'text-gray-700',
                muted: 'text-gray-500'
            },
            sidebar: 'bg-white',
            topbar: 'bg-white',
            card: 'bg-white',
            cardHover: 'hover:bg-gray-50'
        }
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};