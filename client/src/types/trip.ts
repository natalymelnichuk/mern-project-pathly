
export interface Trip {
    _id: string;
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    totalBudget: number;
    user?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type TripStatusFilter = 'all' | 'upcoming' | 'in-progress' | 'completed';
export type TripSortOption = 'date-asc' | 'date-desc' | 'title-asc' | 'title-desc';


export interface TripFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusFilter: TripStatusFilter;
    onStatusFilterChange: (status: TripStatusFilter) => void;
    sortBy: TripSortOption;
    onSortByChange: (sort: TripSortOption) => void;
}