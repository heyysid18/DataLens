import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LayoutDashboard, LogOut, Camera, BarChart3, MapIcon, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { name: 'List', path: '/list', icon: <LayoutDashboard size={20} /> },
        { name: 'Photo', path: '/photo', icon: <Camera size={20} /> },
        { name: 'Chart', path: '/chart', icon: <BarChart3 size={20} /> },
    ];

    return (
        <nav className="glass dark:glass-dark sticky top-0 z-50 px-6 py-4 flex items-center justify-between mb-8 transition-colors duration-300">
            {/* Logo */}
            <div className="flex items-center space-x-2 flex-1">
                <MapIcon className="text-primary-600 dark:text-primary-400" size={28} />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-400 dark:from-primary-400 dark:to-blue-200">
                    DataLens
                </span>
            </div>

            {/* Center Nav */}
            <div className="hidden md:flex items-center justify-center space-x-1 flex-none">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 font-medium'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center justify-end space-x-4 flex-1">
                <div className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {user?.name}
                </div>

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Toggle Theme"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                    <LogOut size={20} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
