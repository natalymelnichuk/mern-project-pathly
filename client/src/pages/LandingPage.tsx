import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Menu, X, ArrowRight, Compass, MapPin, Calendar } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-amber-100/90 via-orange-200/60 to-sky-200  dark:from-rose-800/80 dark:via-rose-950/80 dark:to-[#132652] text-slate-800 dark:text-slate-100 transition-colors duration-500 overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="relative z-30 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight text-[#132652] dark:text-[#F8FAFC] group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#059669] hover:bg-[#082D0F] dark:bg-[#0d4037] dark:hover:bg-[#059669] flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:scale-105">
            <Globe className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span>Pathly</span>
        </Link>

        {/* Desktop Nav Links & Controls */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium hover:text-[#059669] dark:hover:text-[#10B981] transition-colors">
            Features
          </a>
          <a href="#about" className="text-sm font-medium hover:text-[#059669] dark:hover:text-[#10B981] transition-colors">
            About
          </a>
          
          <ThemeToggle />

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-800/40 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-xl text-sm font-medium bg-[#059669] hover:bg-[#082D0F] dark:bg-[#0d4037] dark:hover:bg-[#059669] text-white shadow-md transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/50 border border-white/50 dark:border-slate-700/50 backdrop-blur-md text-slate-700 dark:text-slate-200"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* --- MOBILE OVERLAY & MENU (Поверх страницы + темная дымка) --- */}
      {mobileMenuOpen && (
        <>
          {/* Тёмная дымка (Backdrop Overlay) */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Выплывающее поверх меню */}
          <div className="fixed top-4 right-4 left-4 z-50 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border border-white/40 dark:border-slate-800 rounded-3xl p-6 shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-2.5 text-xl font-bold text-[#132652] dark:text-[#F8FAFC]"
              >
                <div className="w-9 h-9 rounded-xl bg-[#059669] flex items-center justify-center text-white">
                  <Globe className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span>Pathly</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-center">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 font-medium text-slate-700 dark:text-slate-200 hover:text-[#059669]"
              >
                Features
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 font-medium text-slate-700 dark:text-slate-200 hover:text-[#059669]"
              >
                About
              </a>

              <hr className="border-slate-200 dark:border-slate-800 my-1" />

              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl font-medium bg-[#059669] hover:bg-[#082D0F] dark:bg-[#0d4037] dark:hover:bg-[#059669] text-white shadow-md transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </>
      )}

      {/* --- HERO SECTION --- */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 text-center flex flex-col items-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/50 dark:border-slate-700/50 text-xs font-semibold text-slate-700 dark:text-slate-200 mb-8 shadow-sm">
          <Compass className="w-4 h-4 text-[#059669] dark:text-[#10B981]" />
          <span>Your ultimate travel companion</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl text-[#132652] dark:text-[#F8FAFC] leading-[1.15]">
          Plan, organize, and experience <br />
          <span className="text-[#059669] dark:text-[#10B981]">your perfect trips</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl">
          Pathly brings all your itineraries, destinations, and travel ideas together in one beautiful, intuitive space.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold bg-[#059669] hover:bg-[#082D0F] dark:bg-[#0d4037] dark:hover:bg-[#059669] text-white shadow-lg shadow-emerald-900/10 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <span>Start Planning Free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all shadow-sm"
          >
            Sign in to Account
          </Link>
        </div>

        {/* Feature Cards Grid (Glassmorphism) */}
        <div id="features" className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          
          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-700/50 p-6 rounded-2xl shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#059669]/10 text-[#059669] dark:text-[#10B981] flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-[#132652] dark:text-[#F8FAFC]">Smart Destinations</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Keep track of spots, places, and attractions you want to visit on every single trip.
            </p>
          </div>

          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-700/50 p-6 rounded-2xl shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#059669]/10 text-[#059669] dark:text-[#10B981] flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-[#132652] dark:text-[#F8FAFC]">Flexible Schedules</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Organize your days seamlessly without the stress of rigid spreadsheets.
            </p>
          </div>

          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-700/50 p-6 rounded-2xl shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#059669]/10 text-[#059669] dark:text-[#10B981] flex items-center justify-center mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-[#132652] dark:text-[#F8FAFC]">All-in-One Dashboard</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Access your saved journeys anytime, anywhere, on both desktop and mobile devices.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};