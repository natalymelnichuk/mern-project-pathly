
export interface User {
    id: string;
    name: string;
    email: string;
    categories: string[];
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (updatedUser: User) => void;
}

export interface AuthResponse {
    token: string;
    user: User;
}
