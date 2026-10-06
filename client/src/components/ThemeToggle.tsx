
import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
    const [isDark, setIsDark] = useState(() => {
        return (
            localStorage.getItem('theme') === 'dark' ||
            (!('theme' in localStorage) &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)
        );
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            type="button"
            className="relative inline-flex h-9 w-16 items-center rounded-full p-1 transition-colors duration-300 focus:outline-none bg-white/40 dark:bg-slate-800/60 backdrop-blur-md border border-white/30 dark:border-slate-700/50 shadow-sm"
            aria-label="Toggle theme"
        >
        
        <span
            className={`flex h-7 w-7 transform items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow-md transition-transform duration-300 ease-in-out ${
            isDark ? 'translate-x-7' : 'translate-x-0'
            }`}
        >
            {isDark ? (
            <Moon className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
            ) : (
            <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
            )}
        </span>
        </button>
    );
};