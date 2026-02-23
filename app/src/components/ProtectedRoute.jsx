import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './layout/Navbar';

const ProtectedRoute = () => {
    // Check localStorage for the login flag directly as requested
    const isAuthenticated = localStorage.getItem('auth') !== null;

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 pb-12 w-full max-w-7xl animate-fade-in">
                <Outlet />
            </main>
        </div>
    );
};

export default ProtectedRoute;
