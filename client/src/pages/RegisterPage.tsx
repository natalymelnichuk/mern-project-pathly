
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import API from '../services/api'; 
import { ThemeToggle } from '../components/ThemeToggle';


export const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // 1. Send a direct API request to the backend for registration
            const response = await API.post('/users/register', { username: name, email, password });
            
            // 2. Extract the token and user object from the server response
            const { token, user } = response.data;

            // 3. Save them in AuthProvider/localStorage
            login(token, user);
            
            // 4. Navigate to the main dashboard
            navigate('/dashboard');
        } catch (err) {
            const errorResponse = err as { response?: { data?: { message?: string } } };
            setError(
                errorResponse.response?.data?.message || 'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen 
                bg-gradient-to-b from-amber-100/90 via-orange-200/60 to-sky-200 
                dark:from-rose-800/80 dark:via-rose-950/80 dark:to-[#132652] flex items-center justify-center p-6 transition-colors duration-500">
        
        {/*Toggle button */}
        <div className="absolute top-6 right-6">
            <ThemeToggle />
        </div>

        {/* Card for the form with a subtle glass-like effect */}
        <div className="w-full max-w-md bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-2xl shadow-2xl p-8">
            
            {/* Header */}
            <div className="text-center mb-8">
            <Link 
                to="/" 
                className="inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight text-[#132652] dark:text-[#F8FAFC] group"
                >
                
                <div className="w-10 h-10 rounded-xl bg-[#059669] hover:bg-[#082D0F] dark:bg-[#0d4037] dark:hover:bg-[#059669] flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:scale-105">
                    <Globe className="w-5 h-5 stroke-[2.2]" />
                </div>

                <span>Pathly</span>
            </Link>
            <h2 className="text-2xl font-bold mt-3 text-[#132652] dark:text-[#F8FAFC]">Create an account</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Start organizing your journeys today
            </p>
            </div>

            {/* Error Alert */}
            {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50/90 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm">
                {error}
            </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-200">
                    Full Name
                </label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-[#132652] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#059669] dark:focus:ring-[#10B981] transition-all"
                />
            </div>

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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-[#132652] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#059669] dark:focus:ring-[#10B981] transition-all"
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
                className="w-full px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-[#132652] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#059669] dark:focus:ring-[#10B981] transition-all"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-medium bg-[#059669] hover:bg-[#082D0F] dark:bg-[#0d4037] dark:hover:bg-[#059669] text-white shadow-sm transition-all disabled:opacity-50"
            >
                {loading ? 'Creating account...' : 'Get started'}
            </button>
            </form>

            {/* Footer Link */}
            <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-300">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#059669] dark:text-[#10B981] hover:underline">
                Sign in
            </Link>
            </div>

        </div>
        </div>
    );
};