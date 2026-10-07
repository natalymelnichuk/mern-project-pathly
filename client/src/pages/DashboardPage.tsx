
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus,
    Calendar,
    DollarSign,
    MapPin,
    Pencil,
    Trash2,
    Sparkles,
} from 'lucide-react';
import API from '../services/api';
import { ThemeToggle } from '../components/ThemeToggle';
import { EditTripModal } from '../components/EditTripModal';
import { CreateTripModal } from '../components/CreateTripModal'
import type { Trip } from '../types/trip';
import { LogoutButton } from '../components/LogoutBtn';
import { TripFilters } from '../components/TripFilter';
import { useFilteredTrips } from '../hooks/useFilteredTrips';


export const DashboardPage: React.FC = () => {

    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    const {
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        sortBy,
        setSortBy,
        filteredAndSortedTrips,
    } = useFilteredTrips(trips);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchTrips = async () => {

        try {
            const res = await API.get('/trips');
            setTrips(res.data);
        } catch (err) {
            console.error('Failed to fetch trips:', err);
        } finally {
            setLoading(false);
        }
        };

        fetchTrips();
    }, []);


    // Open the edit modal and set the trip to be edited
    const handleOpenEditModal = (e: React.MouseEvent, trip: Trip) => {
        e.stopPropagation();
        setEditingTrip(trip);
        setIsEditModalOpen(true);
    };

    // Save changes made in the edit modal
    const handleUpdateTrip = async (updatedData: Partial<Trip>) => {
        if (!editingTrip) return;

        try {
            const res = await API.put(`/trips/${editingTrip._id}`, updatedData);
            setTrips((prev) =>
                prev.map((t) => (t._id === editingTrip._id ? res.data : t))
            );
            setIsEditModalOpen(false);
            setEditingTrip(null);
        } catch (err) {
            console.error('Failed to update trip:', err);
        }
    };

    // Delete trip
    const handleDeleteTrip = async (e: React.MouseEvent, tripId: string) => {
        e.stopPropagation();

        if (!window.confirm('Are you sure you want to delete this trip?')) return;

        try {
            await API.delete(`/trips/${tripId}`);
            setTrips((prev) => prev.filter((t) => t._id !== tripId));
        } catch (err) {
            console.error('Failed to delete trip:', err);
        }
    };

    // Handle creation of a new trip
    const handleCreateTrip = async (newTripData: Partial<Trip>) => {
        try {
            const res = await API.post('/trips', newTripData);
            setTrips((prev) => [res.data, ...prev]);
            setIsCreateModalOpen(false);
        } catch (err) {
            console.error('Failed to create trip:', err);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-100/90 via-orange-200/60 to-sky-200 dark:from-rose-800/80 dark:via-rose-950/80 dark:to-[#132652] text-slate-800 dark:text-slate-100 transition-colors duration-500 p-6 sm:p-10 pb-16">
            <div className="max-w-7xl mx-auto space-y-8">
            
                {/* Header */}
                <div className="flex justify-between gap-2">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#132652] dark:text-[#F8FAFC] tracking-tight">
                            My Trips
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                            Manage your upcoming travel plans and itineraries.
                        </p>
                    </div>
                    <div className='flex items-center gap-4'> 
                        <ThemeToggle />

                        <LogoutButton />
                    </div>                   
                </div>

                
                {/* Create new Trip Section */}
                <div className="flex items-center gap-4">
                        
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#059669] hover:bg-[#082D0F] text-white font-semibold shadow-lg transition-all duration-300"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Create New Trip</span>
                        </button>
                </div>

                <TripFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    sortBy={sortBy}
                    onSortByChange={setSortBy}
                />



                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
                    </div>
                    ) : trips.length === 0 ? (
                    /* If no trips are planned */
                    <div className="text-center py-20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/50 dark:border-slate-700/50 shadow-xl">
                        <Sparkles className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                            No trips planned yet
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-6">
                            Start by creating your first trip to organize itinerary, activities, and budget.
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#082D0F] text-white font-medium text-sm transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Trip</span>
                        </button>
                    </div>
                    ) : (
                /* Grid with trip cards */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedTrips.length > 0 ? (filteredAndSortedTrips.map((trip) => (
                    <Link
                        key={trip._id}
                        to={`/trips/${trip._id}`}
                        state={{ tripId: trip._id }}
                        className="group relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <h2 className="text-xl font-bold text-[#132652] dark:text-[#F8FAFC] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                                {trip.title}
                                </h2>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1 shrink-0 z-10">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent navigation when clicking the button
                                            e.stopPropagation(); // Prevent click event from bubbling up
                                            handleOpenEditModal(e, trip);
                                        }}
                                        className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
                                        title="Edit Trip"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent navigation when clicking the button
                                            e.stopPropagation(); // Prevent click event from bubbling up
                                            handleDeleteTrip(e, trip._id);
                                        }}
                                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
                                        title="Delete Trip"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300 mb-6">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>{trip.destination}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>
                                        {new Date(trip.startDate).toLocaleDateString()} -{' '}
                                        {new Date(trip.endDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                                        ${trip.totalBudget.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full py-2.5 px-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 group-hover:bg-[#059669] group-hover:text-white dark:group-hover:bg-[#059669] text-center font-semibold text-sm text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50 transition-all">
                            View Details
                        </div>
                    </Link>
                )) 
                ) : (
                    <div className="col-span-full text-center py-12 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md rounded-3xl border border-white/40 dark:border-slate-800">
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                                No trips match your search or filter criteria.
                            </p>
                    </div>
                )}
            </div>
        )}
        </div>
            
        {/* Edit Trip Modal */}
        <EditTripModal
            key={editingTrip?._id || 'edit-modal'}
            isOpen={isEditModalOpen}
            trip={editingTrip}
            onClose={() => {
            setIsEditModalOpen(false);
            setEditingTrip(null);
            }}
            onSave={handleUpdateTrip}
        />

        {/* Create Trip Modal */}        
        <CreateTripModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSave={handleCreateTrip}
        />
        </div>
    );
};

export default DashboardPage;
