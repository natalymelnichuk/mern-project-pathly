

export type ActivityStatus = 'To Do' | 'In Progress' | 'Done';

export interface ActivityLocation {
    name?: string;
    lat?: number;
    lng?: number;
}

export interface Activity {
    _id: string;
    title: string;
    category: string;
    cost: number;
    date: string;
    location?: ActivityLocation;
    status: ActivityStatus;
    trip: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ActivityFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    categories: string[];
}
