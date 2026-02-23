import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, Lock, MapIcon, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please fill in both username and password.');
            toast.error('Credentials are required');
            return;
        }

        setIsLoading(true);

        // Simulate network delay for the loading animation
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (username === 'testuser' && password === 'Test123') {
            login(username);
            toast.success('Successfully logged in');
            navigate('/list');
        } else {
            setError('Invalid username or password.');
            toast.error('Invalid credentials');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-primary-900/20 flex items-center justify-center p-4 transition-colors duration-500">
            {/* Abstract Background Shapes */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 dark:bg-primary-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob transition-colors duration-500"></div>
            <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000 transition-colors duration-500"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass dark:glass-dark rounded-2xl p-8 space-y-8 relative overflow-hidden shadow-2xl border border-white/50 dark:border-white/5">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="flex justify-center items-center mb-6"
                        >
                            <div className="bg-primary-500 dark:bg-primary-600 p-3 rounded-2xl shadow-lg ring-4 ring-primary-100 dark:ring-primary-900/40">
                                <MapIcon className="text-white" size={32} />
                            </div>
                        </motion.div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Welcome Back</h1>
                        <p className="text-slate-500 dark:text-slate-400">Sign in to your DataLens account</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center space-x-2 text-sm border border-red-100 dark:border-red-900/50"
                            >
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            {/* Username Input */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100 disabled:opacity-50"
                                    placeholder="Username"
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100 disabled:opacity-50"
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        {/* Login Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium transition-colors shadow-[0_8px_20px_rgb(59,130,246,0.25)] dark:shadow-none disabled:bg-primary-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <LogIn size={20} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="text-center pt-2">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Use credentials: <span className="font-semibold text-slate-700 dark:text-slate-300">testuser</span> / <span className="font-semibold text-slate-700 dark:text-slate-300">Test123</span>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
