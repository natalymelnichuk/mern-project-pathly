

export type ActivityStatus = 'To Do' | 'In Progress' | 'Done';

export interface Activity {
    _id: string;
    title: string;
    category: string;
    cost: number;
    date: string;
    location?: {
        name?: string;
        lat?: number;
        lng?: number;
    };
    status: ActivityStatus;
    trip: string;
}

