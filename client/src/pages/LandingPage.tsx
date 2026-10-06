import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#132652] text-[#132652] dark:text-[#F8FAFC] transition-colors duration-300 flex flex-col justify-between font-sans">
        
            {/* Header */}
            <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                <div className="w-9 h-9 rounded-xl bg-[#059669] dark:bg-[#10B981] flex items-center justify-center text-white shadow-sm">
                    🗺️
                </div>
                <span className="text-[#132652] dark:text-[#F8FAFC]">Pathly</span>
                </Link>

                {/* Desktop Navigation / Auth Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        to="/login"
                        className="px-5 py-2.5 rounded-xl font-medium text-[#132652] dark:text-[#F8FAFC] hover:text-[#059669] dark:hover:text-[#10B981] transition-all"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="px-5 py-2.5 rounded-xl font-medium bg-[#059669] hover:bg-[#047857] dark:bg-[#10B981] dark:hover:bg-[#059669] text-white shadow-sm transition-all"
                    >
                        Get started
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-slate-200/60 dark:bg-[#1E3A75] text-[#132652] dark:text-[#F8FAFC]"
                aria-label="Toggle menu"
                >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
                </button>
            </header>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden px-6 py-4 bg-white dark:bg-[#0D1B3E] border-b border-slate-200 dark:border-slate-800 flex flex-col gap-3 transition-all">
                    <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full py-2.5 text-center font-medium text-[#132652] dark:text-[#F8FAFC] rounded-xl bg-slate-100 dark:bg-[#1E3A75]"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full py-2.5 text-center font-medium bg-[#059669] text-white rounded-xl shadow-sm"
                    >
                        Get started
                    </Link>
                </div>
            )}

            {/* Hero Section */}
            <main className="w-full max-w-5xl mx-auto px-6 py-12 md:py-20 text-center flex-1 flex flex-col justify-center items-center">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl leading-tight text-[#132652] dark:text-[#F8FAFC]">
                Plan, Track, and Enjoy Your Journeys
                </h1>
                <p className="text-lg md:text-xl text-slate-500 dark:text-slate-300 mb-10 max-w-2xl">
                All-in-one travel & activity planner
                </p>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-6">
                
                    {/* Card 1 */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1B3E] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-left">
                        <div className="w-12 h-12 rounded-xl bg-[#082D0F]/10 dark:bg-[#10B981]/20 text-[#082D0F] dark:text-[#10B981] flex items-center justify-center text-xl mb-4">
                        📍
                        </div>
                        <h3 className="font-semibold text-lg mb-2 text-[#132652] dark:text-[#F8FAFC]">Trip Management</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-300 leading-relaxed">
                        Create and edit custom itineraries for every destination easily.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1B3E] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-left">
                        <div className="w-12 h-12 rounded-xl bg-[#082D0F]/10 dark:bg-[#10B981]/20 text-[#082D0F] dark:text-[#10B981] flex items-center justify-center text-xl mb-4">
                        🎯
                        </div>
                        <h3 className="font-semibold text-lg mb-2 text-[#132652] dark:text-[#F8FAFC]">Activity Planning</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-300 leading-relaxed">
                        Organize events, locations, costs, and timings in one single place.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1B3E] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-left">
                        <div className="w-12 h-12 rounded-xl bg-[#082D0F]/10 dark:bg-[#10B981]/20 text-[#082D0F] dark:text-[#10B981] flex items-center justify-center text-xl mb-4">
                        🔍
                        </div>
                        <h3 className="font-semibold text-lg mb-2 text-[#132652] dark:text-[#F8FAFC]">Dual Filters</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-300 leading-relaxed">
                        Search and find specific trips or activities instantly with smart filters.
                        </p>
                    </div>

                </div>
            </main>

            {/* Footer */}
            <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-slate-200/60 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
                2026 Pathly. All rights reserved
            </footer>

        </div>
    );
};