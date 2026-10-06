import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import API from '../services/api'; 

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth(); // login(newToken, userData) from AuthProvider
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // 1. Direct API call to the backend for login
            const response = await API.post('/auth/login', { email, password });
        
            // 2. Server - response.data with { token, user }
            const { token, user } = response.data;

            // 3. Save them in our AuthProvider
            login(token, user);
            
            // 4. Navigate to the Protected route (Dashboard)
            navigate('/dashboard');
        } catch (err) {
            const errorResponse = err as { response?: { data?: { message?: string } } };
            setError(
                errorResponse.response?.data?.message || 'Failed to sign in. Please check your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#132652] text-[#132652] dark:text-[#F8FAFC] flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md bg-white dark:bg-[#0D1B3E] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm p-8">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight mb-2">
                        <div className="w-9 h-9 rounded-xl bg-[#059669] dark:bg-[#10B981] flex items-center justify-center text-white shadow-sm">
                        🗺️
                        </div>
                        <span>Pathly</span>
                    </Link>
                    <h2 className="text-2xl font-bold mt-3">Welcome back</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
                        Sign in to continue planning your journeys
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm">
                    {error}
                </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-200">
                        Email address
                    </label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-[#132652] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#059669] dark:focus:ring-[#10B981] transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-200">
                        Password
                    </label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-[#132652] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#059669] dark:focus:ring-[#10B981] transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl font-medium bg-[#059669] hover:bg-[#047857] dark:bg-[#10B981] dark:hover:bg-[#059669] text-white shadow-sm transition-all disabled:opacity-50"
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
                </form>

                {/* Footer Link */}
                <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-300">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-[#059669] dark:text-[#10B981] hover:underline">
                        Sign up
                    </Link>
                </div>

            </div>
        </div>
    );
};