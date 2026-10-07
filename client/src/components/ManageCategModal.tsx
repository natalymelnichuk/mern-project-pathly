
import React, { useState } from 'react';
import { X, Trash2, Tag } from 'lucide-react';
import type { ManageCategoriesModalProps } from '../types/categories';


export const ManageCategoriesModal: React.FC<ManageCategoriesModalProps> = ({
    isOpen,
    onClose,
    userCategories,
    onAddCategory,
    onDeleteCategory,
    }) => {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
        setLoading(true);
        await onAddCategory(newCategoryName.trim());
        setNewCategoryName('');
        } catch (err) {
        console.error('Failed to add category:', err);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 border border-white/50 dark:border-slate-800 shadow-2xl space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Tag className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Manage Categories
                </h3>
            </div>
            <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
            </div>

            {/* Form to add category */}
            <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                placeholder="New category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
            <button
                type="submit"
                disabled={loading || !newCategoryName.trim()}
                className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold shadow-md transition-all shrink-0"
            >
                Add
            </button>
            </form>

            {/* Categories list */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {userCategories.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-4">
                No categories yet. Add your first one above!
                </p>
            ) : (
                userCategories.map((cat) => (
                <div
                    key={cat}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                    <span>{cat}</span>
                    <button
                    type="button"
                    onClick={() => onDeleteCategory(cat)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete Category"
                    >
                    <Trash2 className="w-4 h-4" />
                    </button>
                </div>
                ))
            )}
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-2xl text-sm font-semibold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
            >
                Done
            </button>
            </div>
        </div>
        </div>
    );
};