
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Plus, LogOut, Calendar, MapPin, Trash2, ArrowRight, Compass } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from '../components/ThemeToggle';
import type { Trip } from '../types/trip';  
import { slugify } from '../services/slug';


export const DashboardPage: React.FC = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalBudget, setTotalBudget] = useState<number>(0);
    const [createLoading, setCreateLoading] = useState(false);

    const { logout, user } = useAuth();
    const navigate = useNavigate();

    // Fetch trips from backend
    const fetchTrips = async () => {
        try {
            const response = await API.get('/trips');
            setTrips(response.data);
        } catch (err) {
            console.error('Failed to fetch trips:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loadTrips = async () => {
            try {
                const response = await API.get('/trips');
                if (isMounted) {
                    setTrips(response.data);
                }
            } catch (err) {
                console.error('Failed to fetch trips:', err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadTrips();

        return () => {
            isMounted = false;
        };
    }, []);

    // Handle Create Trip
    const handleCreateTrip = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateLoading(true);

        try {
            await API.post('/trips', {
                title,
                destination,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                totalBudget: +totalBudget || undefined,
            });

            // Reset Form & Close Modal
            setTitle('');
            setDestination('');
            setStartDate('');
            setEndDate('');
            setTotalBudget(0);
            setIsModalOpen(false);

            // Refresh Trips
            fetchTrips();
        } catch (err) {
            console.error('Failed to create trip:', err);
        } finally {
            setCreateLoading(false);
        }
    };

    // Handle Delete Trip
    const handleDeleteTrip = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); 
        if (!window.confirm('Are you sure you want to delete this trip?')) return;

        try {
            await API.delete(`/trips/${id}`);
            setTrips((prev) => prev.filter((t) => t._id !== id));
        } catch (err) {
            console.error('Failed to delete trip:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-100/90 via-orange-200/60 to-sky-200 dark:from-rose-800/80 dark:via-rose-950/80 dark:to-[#132652] text-slate-800 dark:text-slate-100 transition-colors duration-500 pb-16">
        
        {/* Top Navbar */}
        <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <Link
            to="/dashboard"
            className="inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight text-[#132652] dark:text-[#F8FAFC] group"
            >
            <div className="w-10 h-10 rounded-xl bg-[#059669] hover:bg-[#082D0F] dark:bg-[#0d4037] dark:hover:bg-[#059669] flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:scale-105">
                <Globe className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span>Pathly</span>
            </Link>

            <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors text-slate-700 dark:text-slate-200"
            >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
            </button>
            </div>
        </nav>

        {/* Main Container */}
        <main className="max-w-7xl mx-auto px-6 pt-6">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#132652] dark:text-[#F8FAFC]">
                My Journeys
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-1">
                Welcome back{user?.name ? `, ${user.name}` : ''}! Ready for your next adventure?
                </p>
            </div>

            <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold bg-[#059669] hover:bg-[#082D0F] dark:bg-[#0d4037] dark:hover:bg-[#059669] text-white shadow-lg transition-all duration-300 group"
            >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                <span>New Trip</span>
            </button>
            </div>

            {/* Loading Spinner */}
            {loading ? (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#059669]"></div>
            </div>
            ) : trips.length === 0 ? (
            /* Empty State */
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-xl my-12">
                <div className="w-16 h-16 rounded-2xl bg-[#059669]/10 text-[#059669] dark:text-[#10B981] flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#132652] dark:text-[#F8FAFC] mb-2">
                No trips planned yet
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
                Start creating your travel itinerary by adding your very first destination.
                </p>
                <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-[#059669] hover:bg-[#082D0F] dark:bg-[#0d4037] dark:hover:bg-[#059669] text-white shadow-md transition-all duration-300"
                >
                <Plus className="w-5 h-5" />
                <span>Create First Trip</span>
                </button>
            </div>
            ) : (
            /* Trips Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                <div
                    key={trip._id}
                    onClick={() => navigate(`/trips/${slugify(trip.title)}`, { state: { tripId: trip._id } })}
                    className="group relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                    <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-xl font-bold text-[#132652] dark:text-[#F8FAFC] group-hover:text-[#059669] dark:group-hover:text-[#10B981] transition-colors line-clamp-1">
                        {trip.title}
                        </h3>
                        <button
                        onClick={(e) => handleDeleteTrip(e, trip._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Delete trip"
                        >
                        <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-medium text-[#059669] dark:text-[#10B981] mb-3">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="line-clamp-1">{trip.destination}</span>
                    </div>

                    {trip.totalBudget !== undefined && (
                        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
                        Total Budget: ${trip.totalBudget.toFixed(2)}
                        </p>
                    )}
                    </div>

                    <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-4">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                        {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'TBD'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-[#059669] dark:text-[#10B981] group-hover:translate-x-1 transition-transform">
                        <span>View Trip</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </main>

        {/* --- CREATE TRIP MODAL --- */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark Overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Box */}
            <div className="relative w-full max-w-lg bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-fade-in">
                <h2 className="text-2xl font-bold text-[#132652] dark:text-[#F8FAFC] mb-6">
                Create New Trip
                </h2>

                <form onSubmit={handleCreateTrip} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-200">
                    Trip Title *
                    </label>
                    <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Summer Vacation in Italy"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-[#132652] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-200">
                    Destination *
                    </label>
                    <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Rome, Amalfi Coast"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-[#132652] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-200">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-[#132652] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-200">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-[#132652] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                    />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-200">
                    Total Budget
                    </label>
                    <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                    placeholder="Enter total budget..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-[#132652] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                    />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    disabled={createLoading}
                    className="px-6 py-2.5 rounded-xl font-medium bg-[#059669] hover:bg-[#082D0F] dark:bg-[#0d4037] dark:hover:bg-[#059669] text-white shadow-md transition-all duration-300 disabled:opacity-50"
                    >
                    {createLoading ? 'Creating...' : 'Create Trip'}
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}

        </div>
    );
};