
import React from 'react';
import { Search, Filter } from 'lucide-react';
import type { ActivityFiltersProps } from '../types/activity';

export const ActivityFilters: React.FC<ActivityFiltersProps> = ({
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    categories,
}) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-3.5 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <div className="relative w-full sm:w-auto">
                    <select
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="w-full sm:w-auto pl-9 pr-8 py-2 text-xs font-semibold rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer appearance-none"
                    >
                        <option value="All">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
            </div>
        </div>
    );
};