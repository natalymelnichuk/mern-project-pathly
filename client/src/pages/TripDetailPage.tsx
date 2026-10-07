

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Plus,
    MapPin,
    Calendar,
    // DollarSign,
    Pencil,
    Trash2,
    Wallet,
    PiggyBank,
    Receipt,
    Loader2,
    Tag,
} from 'lucide-react';
import API from '../services/api';
import { ThemeToggle } from '../components/ThemeToggle';
import type { Trip } from '../types/trip';
import type { Activity, ActivityStatus } from '../types/activity';
import { useAuth } from '../hooks/useAuth';
import { ManageCategoriesModal } from '../components/ManageCategModal';
import { LogoutButton } from '../components/LogoutBtn';


export const TripDetailPage: React.FC = () => {
    // Get the trip ID from the URL parameters
    const { id } = useParams<{ id: string }>();
    const { user, updateUser } = useAuth();

    // Default categories if user profile doesn't have any yet
    const defaultCategories = ['Sightseeing', 'Food', 'Transport', 'Accommodation', 'Entertainment', 'Shopping'];
    
    const categories = user?.categories?.length ? user.categories : defaultCategories;
    

    // Call states
    const [trip, setTrip] = useState<Trip | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);


    // Modals visibility
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);

    // New Activity Form State
    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newCost, setNewCost] = useState<number | ''>('');
    const [newDate, setNewDate] = useState('');
    const [newStatus, setNewStatus] = useState<ActivityStatus>('To Do');

    
    // Editing state for activities
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
    const [isEditActivityModalOpen, setIsEditActivityModalOpen] = useState(false);

    
    // Fetch trip and activities data when the component mounts or when the ID changes
    useEffect(() => {
        const fetchTripAndActivities = async () => {
        try {
            setLoading(true);
            
            const [tripRes, activitiesRes] = await Promise.all([
            API.get(`/trips/${id}`),
            API.get(`/trips/${id}/activities`),
            ]);

            setTrip(tripRes.data);
            setActivities(activitiesRes.data);
        } catch (err) {
            console.error('Failed to fetch trip data:', err);
        } finally {
            setLoading(false);
        }
        };

        if (id) {
            fetchTripAndActivities();
        }
    }, [id]);


    // Count totalBudget and remainingBudget based on activities
    const totalBudget = trip?.totalBudget || 0;
    const spentBudget = activities.reduce((sum, activity) => sum + (activity.cost || 0), 0);
    const remainingBudget = totalBudget - spentBudget;


    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-amber-100/90 via-orange-200/60 to-sky-200 dark:from-rose-800/80 dark:via-rose-950/80 dark:to-[#132652] text-slate-700 dark:text-slate-200">
                <div className="relative flex items-center justify-center">
                
                    <div className="w-12 h-12 rounded-full border-4 border-emerald-400/30 dark:border-emerald-500/20 animate-ping absolute" />
            
                    <Loader2 className="w-10 h-10 animate-spin text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-medium animate-pulse text-slate-600 dark:text-slate-300">
                    Loading trip details...
                </p>
            </div>
        );
    }


    // Function to handle the addition of a new activity
    const handleCreateActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !newTitle.trim()) return;

        try {
            const res = await API.post(`/trips/${id}/activities`, {
                title: newTitle,
                category: newCategory || categories[0] || 'Other',
                cost: Number(newCost) || 0,
                date: newDate || new Date().toISOString(),
                status: newStatus,
                trip: id,
            });

            // Add the newly created activity to the activities state
            setActivities((prev) => [...prev, res.data]);

            // Clear the form and close the modal
            setNewTitle('');
            setNewCost('');
            setNewDate('');
            setIsActivityModalOpen(false);
        } catch (err) {
        console.error('Failed to create activity:', err);
        }
    };


    // Update the activities state when an activity is edited
    const handleMoveStatus = async (activity: Activity, newStatus: ActivityStatus) => {
        try {
            const res = await API.put(`/activities/${activity._id}`, { status: newStatus });
            setActivities((prev) =>
                prev.map((act) => (act._id === activity._id ? res.data : act))
            );
        } catch (err) {
            console.error('Failed to update activity status:', err);
        }
    };

    // Delete an activity
    const handleDeleteActivity = async (activityId: string) => {
        if (!window.confirm('Are you sure you want to delete this activity?')) return;

        try {
            await API.delete(`/activities/${activityId}`);
            setActivities((prev) => prev.filter((act) => act._id !== activityId));
        } catch (err) {
            console.error('Failed to delete activity:', err);
        }
    };

    // Save the edited activity
    const handleUpdateActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingActivity) return;

        try {
            const res = await API.put(`/activities/${editingActivity._id}`, editingActivity);
                setActivities((prev) =>
                    prev.map((act) => (act._id === editingActivity._id ? res.data : act))
            );
            setIsEditActivityModalOpen(false);
            setEditingActivity(null);
        } catch (err) {
            console.error('Failed to update activity:', err);
        }
    };

    // Add/Delete category
    const handleAddCategory = async (newCategory: string) => {
        if (!newCategory.trim() || categories.includes(newCategory.trim())) return;

        const updatedCategories = [...categories, newCategory.trim()];

        try {
            const res = await API.put('/users/profile', { categories: updatedCategories});

            
            const updatedUSer = res.data.user || res.data;
            updateUser(updatedUSer);

        } catch (err) {
            console.error('Failed to add category to user profile', err);
            
        }

    };

    const handleDeleteCategory = async (categoryToDelete: string) => {
        const filteredCategories = categories.filter((cat) => cat !== categoryToDelete);

        try {
            const res = await API.put('/users/profile', { categories: filteredCategories});
            
            const updatedUser = res.data.user || res.data;
            updateUser(updatedUser);
        } catch (err) {
            console.error('Failed to delete category:', err);
        }
    };

    if (!trip) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-amber-100/90 via-orange-200/60 to-sky-200 dark:from-rose-800/80 dark:via-rose-950/80 dark:to-[#132652] text-slate-800 dark:text-slate-100">
                <h2 className="text-xl font-bold">Trip not found</h2>
                <Link to="/dashboard" className="text-emerald-600 hover:underline">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-100/90 via-orange-200/60 to-sky-200 dark:from-rose-800/80 dark:via-rose-950/80 dark:to-[#132652] text-slate-800 dark:text-slate-100 transition-colors duration-500 p-6 sm:p-10 pb-16">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Back Button and Theme Toggle */}
                <div className="flex items-center justify-between">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all text-sm font-medium shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Back to Dashboard
                    </Link>
                    <div className='flex items-center gap-4'>
                        <ThemeToggle />
                        <LogoutButton />
                    </div>
                    
                </div>

                {/* Trip Header */}
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/40 dark:border-slate-700/50 shadow-xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 dark:from-emerald-400 dark:via-teal-300 dark:to-sky-400 bg-clip-text text-transparent">
                                {trip.title}
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                                <MapPin className="w-4 h-4" />
                                <span>{trip.destination}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Financial Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        
                        {/* Total Budget */}
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                                    Total Budget
                                </p>
                                <p className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-200 mt-1">
                                    ${trip.totalBudget?.toLocaleString() || 0}
                                </p>
                            </div>
                            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                                <Wallet className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Spent budget according to the activities */}
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                                    Activities Total
                                </p>
                                <p className="text-2xl font-extrabold text-amber-800 dark:text-amber-200 mt-1">
                                    ${spentBudget.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-300">
                                <Receipt className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Remaining Budget */}
                        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                            remainingBudget >= 0 
                                ? 'bg-sky-500/10 border-sky-500/20' 
                                : 'bg-rose-500/10 border-rose-500/20'
                        }`}>
                            <div>
                                <p className={`text-xs font-semibold uppercase tracking-wider ${
                                    remainingBudget >= 0 ? 'text-sky-700 dark:text-sky-300' : 'text-rose-700 dark:text-rose-300'
                                }`}>
                                    Remaining Balance
                                </p>
                                <p className={`text-2xl font-extrabold mt-1 ${
                                    remainingBudget >= 0 ? 'text-sky-800 dark:text-sky-200' : 'text-rose-800 dark:text-rose-200'
                                }`}>
                                    ${remainingBudget.toLocaleString()}
                                </p>
                            </div>
                            <div className={`p-3 rounded-2xl ${
                                remainingBudget >= 0 
                                    ? 'bg-sky-500/20 text-sky-600 dark:text-sky-300' 
                                    : 'bg-rose-500/20 text-rose-600 dark:text-rose-300'
                            }`}>
                                <PiggyBank className="w-6 h-6" />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Activities Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-[#132652] dark:text-[#F8FAFC]">
                            Itinerary Activities
                        </h2>
                        <div className="flex items-center gap-2">
                            {/* ДОБАВЛЕНА НОВАЯ КНОПКА КАТЕГОРИЙ: */}
                            <button
                                type="button"
                                onClick={() => setIsCategoriesModalOpen(true)}
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 text-sm font-semibold shadow-sm transition-all"
                            >
                                <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span>Categories</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setNewCategory(categories[0] || 'Other');
                                    setIsActivityModalOpen(true)}}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Activity</span>
                            </button>
                        </div>
                    </div>

                    {/* Grid of 3 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(['To Do', 'In Progress', 'Done'] as ActivityStatus[]).map((status) => {
                            const columnActivities = activities.filter((act) => act.status === status);

                            return (
                                <div
                                    key={status}
                                    className="h-[500px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-800 rounded-3xl p-4 flex flex-col shadow-lg"
                                >
                                    {/* Column Header */}
                                    <div className="flex items-center justify-between mb-3 px-2 shrink-0">
                                        <span className="font-bold text-sm text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                            {status}
                                        </span>
                                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                            {columnActivities.length}
                                        </span>
                                    </div>

                                    {/* Scrollable Activities Container */}
                                    <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
                                        {columnActivities.length === 0 ? (
                                            <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-400">
                                                No activities
                                            </div>
                                        ) : (
                                            columnActivities.map((act) => (
                                                <div
                                                    key={act._id}
                                                    className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/60 dark:border-slate-700/60 shadow-md hover:shadow-lg transition-all space-y-3 shrink-0 group relative overflow-hidden"
                                                >
                                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-500 via-teal-500 to-sky-500 rounded-l-2xl" />

                                                    <div className="flex items-start justify-between gap-2 pl-1">
                                                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-2">
                                                            {act.title}
                                                        </h4>

                                                        {/* Edit & Delete Buttons */}
                                                        <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setEditingActivity(act);
                                                                    setIsEditActivityModalOpen(true);
                                                                }}
                                                                className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteActivity(act._id)}
                                                                className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Category & Cost */}
                                                    <div className="flex items-center justify-between text-xs pl-1">
                                                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium">
                                                            {act.category || 'Other'}
                                                        </span>
                                                        <span className="font-extrabold bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-lg text-amber-700 dark:text-amber-300">
                                                            ${act.cost || 0}
                                                        </span>
                                                    </div>

                                                    {/* Move Status Controls */}
                                                    <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 pl-1 flex items-center justify-between">
                                                        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                                            <Calendar className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                            <span>
                                                                {act.date ? new Date(act.date).toLocaleDateString() : 'No date'}
                                                            </span>
                                                        </div>
                                                        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                                            Status
                                                        </span>
                                                        <select
                                                            value={act.status}
                                                            onChange={(e) =>
                                                                handleMoveStatus(act, e.target.value as ActivityStatus)
                                                            }
                                                            className="px-2 py-1 rounded-xl bg-white/80 dark:bg-slate-700/80 border border-slate-200/60 dark:border-slate-600/60 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer transition-all"
                                                        >
                                                            <option value="To Do">To Do</option>
                                                            <option value="In Progress">In Progress</option>
                                                            <option value="Done">Done</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* --- Create Activity Modal --- */}
            {isActivityModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 border border-white/50 dark:border-slate-800 shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                            Add New Activity
                        </h3>

                        <form onSubmit={handleCreateActivity} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Visit Colosseum"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="w-full px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        className="w-full px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
                                    >
                                        {/* <option value="" disabled>Select category</option> */}
                                        {categories.map((cat: string) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                        {/* {!categories.includes('Other') && <option value="Other">Other</option>} */}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                        Cost ($)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={newCost}
                                        onChange={(e) => setNewCost(e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        className="w-full px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value as ActivityStatus)}
                                        className="w-full px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    >
                                        <option value="To Do">To Do</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsActivityModalOpen(false)}
                                    className="px-4 py-2 rounded-2xl text-sm font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-2xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
                                >
                                    Create Activity
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- Edit Activity Modal --- */}
            {isEditActivityModalOpen && editingActivity && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 border border-white/50 dark:border-slate-800 shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                            Edit Activity
                        </h3>

                        <form onSubmit={handleUpdateActivity} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editingActivity.title}
                                    onChange={(e) =>
                                        setEditingActivity({ ...editingActivity, title: e.target.value })
                                    }
                                    className="w-full px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={editingActivity.category || 'Other'}
                                        onChange={(e) =>
                                        setEditingActivity({ ...editingActivity, category: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
                                    >
                                        {categories.map((cat: string) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                        ))}
                                        {editingActivity.category &&
                                            editingActivity.category !== 'Other' &&
                                            !categories.includes(editingActivity.category) && (
                                                <option value={editingActivity.category}>
                                                    {editingActivity.category}
                                                </option>
                                        )}

                                        
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={
                                        editingActivity.date
                                            ? new Date(editingActivity.date).toISOString().split('T')[0]
                                            : ''
                                        }
                                        onChange={(e) =>
                                        setEditingActivity({ ...editingActivity, date: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                        Cost ($)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editingActivity.cost || 0}
                                        onChange={(e) =>
                                            setEditingActivity({ ...editingActivity, cost: Number(e.target.value) })
                                        }
                                        className="w-full px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={editingActivity.status}
                                        onChange={(e) =>
                                            setEditingActivity({
                                                ...editingActivity,
                                                status: e.target.value as ActivityStatus,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    >
                                        <option value="To Do">To Do</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>
                            </div>
                            

                            <div className="flex items-center justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditActivityModalOpen(false);
                                        setEditingActivity(null);
                                    }}
                                    className="px-4 py-2 rounded-2xl text-sm font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-2xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Categories Modal */}
            <ManageCategoriesModal
                isOpen={isCategoriesModalOpen}
                onClose={() => setIsCategoriesModalOpen(false)}
                userCategories={categories}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
            />
        </div>
    );
};

export default TripDetailPage;