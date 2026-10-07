
import { useMemo, useState } from 'react';
import type { Activity } from '../types/activity';

export const useFilteredActivities = (activities: Activity[]) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredActivities = useMemo(() => {
        return activities.filter((activity) => {
            // 1. Seacrh by title
            const matchesSearch = activity.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            // 2. Filter by category
            const matchesCategory =
                selectedCategory === 'All' ||
                activity.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [activities, searchQuery, selectedCategory]);

    return {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filteredActivities,
    };
};