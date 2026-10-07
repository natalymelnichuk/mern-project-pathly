
import React from 'react';
import { useAuth } from '../hooks/useAuth'; 
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
    className?: string;
    showIcon?: boolean;
    text?: string;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
    className = '',
    showIcon = true,
    text = 'Logout',
}) => {
    const { logout, isAuthenticated } = useAuth();

    // If user is not autenticated the btn is not shown
    if (!isAuthenticated) return null;

    return (
        <button
            type="button"
            onClick={logout}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-sm font-medium text-rose-600 dark:text-rose-400 bg-orange-200 dark:bg-[#470024] hover:bg-rose-50 dark:hover:bg-rose-200/10 transition-all cursor-pointer ${className}`}
        >
            {showIcon && <LogOut className="w-4 h-4" />}
            {text && <span>{text}</span>}
        </button>
    );
};