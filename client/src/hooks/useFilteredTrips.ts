
import { useMemo, useState } from 'react';
import type { TripStatusFilter, TripSortOption } from '../types/trip';
import type { Trip } from '../types/trip';

// Function to set a status according to date
const getTripStatus = (startDateStr: string, endDateStr: string): 'upcoming' | 'in-progress' | 'completed' => {
    const now = new Date();
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    const start = new Date(startDateStr).getTime();
    const end = new Date(endDateStr).getTime();

    if (start > today) {
        return 'upcoming';
    }
    if (end < today) {
        return 'completed';
    }
    return 'in-progress';
};

export const useFilteredTrips = (trips: Trip[]) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<TripStatusFilter>('all');
    const [sortBy, setSortBy] = useState<TripSortOption>('date-asc');

    const filteredAndSortedTrips = useMemo(() => {
        return trips
            .filter((trip) => {
                // 1. Seacrh for title and destination
                const matchesSearch =
                    trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    trip.destination.toLowerCase().includes(searchQuery.toLowerCase());

                // 2. Calculate status
                const calculatedStatus = getTripStatus(trip.startDate, trip.endDate);

                // 3. Filter by status
                let matchesStatus = true;
                if (statusFilter !== 'all') {
                    matchesStatus = calculatedStatus === statusFilter;
                }

                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                // 4. Sort
                if (sortBy === 'date-asc') {
                    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                }
                if (sortBy === 'date-desc') {
                    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
                }
                if (sortBy === 'title-asc') {
                    return a.title.localeCompare(b.title);
                }
                if (sortBy === 'title-desc') {
                    return b.title.localeCompare(a.title);
                }
                return 0;
            });
    }, [trips, searchQuery, statusFilter, sortBy]);

    return {
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        sortBy,
        setSortBy,
        filteredAndSortedTrips,
    };
};