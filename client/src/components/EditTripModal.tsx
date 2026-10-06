
import React, { useState } from 'react';
import type { Trip } from '../types/trip';

interface EditTripModalProps {
    isOpen: boolean;
    trip: Trip | null;
    onClose: () => void;
    onSave: (updatedTrip: Partial<Trip>) => Promise<void>;
}

export const EditTripModal: React.FC<EditTripModalProps> = ({
    isOpen,
    trip,
    onClose,
    onSave,
    }) => {

    // Initialize state with the current trip details or default values
    const [title, setTitle] = useState(trip?.title || '');
    const [destination, setDestination] = useState(trip?.destination || '');
    const [startDate, setStartDate] = useState(
        trip?.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : ''
    );
    const [endDate, setEndDate] = useState(
        trip?.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : ''
    );
    const [totalBudget, setTotalBudget] = useState<number | ''>(trip?.totalBudget ?? '');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !trip) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        await onSave({
            title,
            destination,
            startDate,
            endDate,
            totalBudget: Number(totalBudget) || 0,
        });

        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10">
                <h2 className="text-2xl font-bold text-[#132652] dark:text-[#F8FAFC] mb-6">
                    Edit Trip
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title *</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-[#059669] outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Destination *</label>
                        <input
                            type="text"
                            required
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-[#059669] outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Date *</label>
                            <input
                                type="date"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-[#059669] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">End Date *</label>
                            <input
                                type="date"
                                required
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-[#059669] outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Total Budget ($) *</label>
                        <input
                            type="number"
                            min="0"
                            required
                            value={totalBudget}
                            onChange={(e) => setTotalBudget(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-[#059669] outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl font-medium bg-[#059669] hover:bg-[#082D0F] text-white shadow-md transition-all disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};