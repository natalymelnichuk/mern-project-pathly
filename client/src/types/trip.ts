
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

