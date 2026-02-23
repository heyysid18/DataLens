import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, LogOut, Camera, BarChart3, MapIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
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
        <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
                <MapIcon className="text-primary-600" size={28} />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-400">
                    DataLens
                </span>
            </div>

            <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-primary-50 text-primary-600 font-medium'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </div>

            <div className="flex items-center space-x-4">
                <div className="hidden md:block text-sm font-medium text-slate-700">
                    {user?.name}
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-slate-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
                >
                    <LogOut size={20} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
