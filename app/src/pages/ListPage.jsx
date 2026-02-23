import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, BarChart3, AlertCircle, ChevronRight, Loader2, MapIcon, Search, ArrowUpDown, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useDebounce } from '../hooks/useDebounce';

const ListPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // v2 Features State
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 300);
    const [sortOrder, setSortOrder] = useState(null); // 'asc' | 'desc' | null
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await axios.post('https://backend.jotish.in/backend_dev/gettabledata.php', {
                    username: 'test',
                    password: '123456'
                });

                if (response.data && response.data.TABLE_DATA && Array.isArray(response.data.TABLE_DATA.data)) {
                    const mappedData = response.data.TABLE_DATA.data.map((row, index) => ({
                        employee_name: row[0],
                        employee_position: row[1],
                        employee_city: row[2],
                        id: row[3] || index, // Fallback ID if missing
                        employee_date: row[4],
                        employee_salary: parseFloat(row[5].replace(/[^0-9.-]+/g, ""))
                    }));
                    setData(mappedData);
                    toast.success('Employee data loaded successfully');
                } else {
                    setData([]);
                    setError('Invalid data format received from server.');
                    toast.error('Invalid data format received from server.');
                }
            } catch (err) {
                console.error('Failed to fetch data', err);
                setError('Failed to load employee data. Please try again later.');
                toast.error('Failed to load employee data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Reset pagination to page 1 when search or sort changes
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, sortOrder]);

    const filteredAndSortedData = useMemo(() => {
        let result = [...data];

        // 1. Search filter
        if (debouncedSearch) {
            const lowerSearch = debouncedSearch.toLowerCase();
            result = result.filter(item =>
                item.employee_name?.toLowerCase().includes(lowerSearch) ||
                item.employee_city?.toLowerCase().includes(lowerSearch) ||
                item.employee_salary?.toString().includes(lowerSearch)
            );
        }

        // 2. Sorting
        if (sortOrder) {
            result.sort((a, b) => {
                if (sortOrder === 'asc') return a.employee_salary - b.employee_salary;
                return b.employee_salary - a.employee_salary;
            });
        }

        return result;
    }, [data, debouncedSearch, sortOrder]);

    // Pagination computation
    const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE) || 1;
    const paginatedData = filteredAndSortedData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSortToggle = () => {
        if (sortOrder === null) setSortOrder('desc');
        else if (sortOrder === 'desc') setSortOrder('asc');
        else setSortOrder(null);
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 transition-colors duration-300">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                        <Users className="text-primary-600 dark:text-primary-400" />
                        <span>Employee Directory</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and view employee information</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/map')}
                        className="flex items-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm transition-colors"
                    >
                        <MapIcon size={18} className="text-primary-500 dark:text-primary-400" />
                        <span>View Map</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/chart')}
                        className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm transition-colors"
                    >
                        <BarChart3 size={18} />
                        <span>View Analytics</span>
                    </motion.button>
                </div>
            </div>

            {/* List Controls: Search & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search directory..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm transition-colors"
                    />
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 hidden lg:inline-block mr-2">
                        {filteredAndSortedData.length} records found
                    </span>
                    <button
                        onClick={handleSortToggle}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${sortOrder
                            ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 border-primary-200 dark:border-primary-800'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                    >
                        <ArrowUpDown size={16} />
                        <span>
                            Sort Salary {sortOrder === 'asc' ? '(Low to High)' : sortOrder === 'desc' ? '(High to Low)' : ''}
                        </span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center p-12 space-y-4 glass dark:glass-dark rounded-2xl">
                    <Loader2 className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-spin" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Loading employee data...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
                    <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
                    <div>
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">Connection Error</h3>
                        <p className="text-red-600 dark:text-red-400 mt-1">{error}</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium transition-colors hover:bg-red-200 dark:hover:bg-red-800"
                    >
                        Try Again
                    </button>
                </div>
            ) : filteredAndSortedData.length === 0 ? (
                <div className="p-16 text-center glass dark:glass-dark rounded-2xl flex flex-col items-center">
                    <Search className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">No records found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Try adjusting your search criteria</p>
                </div>
            ) : (
                <div className="glass dark:glass-dark rounded-2xl shadow-sm border border-white/40 dark:border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-sm w-16">ID</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">Employee</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">City</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-sm text-right">Salary</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-sm w-16"></th>
                                </tr>
                            </thead>
                            <motion.tbody
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="divide-y divide-slate-100 dark:divide-slate-800"
                            >
                                <AnimatePresence mode="popLayout">
                                    {paginatedData.map((item) => (
                                        <motion.tr
                                            variants={itemVariants}
                                            layout
                                            key={item.id}
                                            onClick={() => navigate(`/details/${item.id}`, { state: { employee: item } })}
                                            className="group hover:bg-primary-50/50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">#{item.id}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-100 to-blue-200 dark:from-primary-900/60 dark:to-blue-900/60 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-xs ring-1 ring-white/50 dark:ring-black/20">
                                                        {item.employee_name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <span className="block font-medium text-slate-800 dark:text-slate-200">{item.employee_name}</span>
                                                        <span className="block text-xs text-slate-500 dark:text-slate-400">{item.employee_position}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">
                                                {item.employee_city}
                                            </td>
                                            <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium text-right text-sm">
                                                ${Number(item.employee_salary).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <ChevronRight className="inline-block text-slate-300 dark:text-slate-600 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors" size={18} />
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </motion.tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedData.length)} of {filteredAndSortedData.length} entries
                            </span>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 px-2">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default ListPage;
