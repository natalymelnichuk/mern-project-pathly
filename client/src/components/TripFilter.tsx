
import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import type { TripStatusFilter, TripSortOption ,TripFiltersProps } from '../types/trip'


export const TripFilters: React.FC<TripFiltersProps> = ({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    sortBy,
    onSortByChange,
}) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-4 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
            {/* Search input */}
            <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search trips or destinations..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                />
            </div>

            {/* Status Filter and Sort */}
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full  justify-end">
                {/* Status Filter */}
                <div className="flex items-center justify-center w-full sm:w-auto gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                    <SlidersHorizontal className="w-4 h-4 text-slate-400 ml-2 hidden sm:block" />
                    {(['all', 'upcoming', 'in-progress', 'completed'] as TripStatusFilter[]).map((status) => (
                        <button
                            key={status}
                            onClick={() => onStatusFilterChange(status)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                                statusFilter === status
                                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                        >
                            {status === 'all' ? 'All' : status.replace('-', ' ')}
                        </button>
                    ))}
                </div>

                {/* Sort */}
                <div className="relative">
                    <select
                        value={sortBy}
                        onChange={(e) => onSortByChange(e.target.value as TripSortOption)}
                        className="pl-9 pr-4 py-2 text-xs font-semibold rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer appearance-none"
                    >
                        <option value="date-asc">Date (Earliest first)</option>
                        <option value="date-desc">Date (Latest first)</option>
                        <option value="title-asc">Title (A - Z)</option>
                        <option value="title-desc">Title (Z - A)</option>
                    </select>
                    <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
            </div>
        </div>
    );
};