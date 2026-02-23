import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, BarChart3, AlertCircle, ChevronRight, Loader2, MapIcon } from 'lucide-react';

const ListPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await axios.post('https://backend.jotish.in/backend_dev/gettabledata.php', {
                    username: 'test',
                    password: '123456'
                });

                // The API returns an object { TABLE_DATA: { data: [ [name, position, city, id, date, salary], ... ] } }
                if (response.data && response.data.TABLE_DATA && Array.isArray(response.data.TABLE_DATA.data)) {
                    // We need to map the array of arrays into array of objects to work with our table
                    const mappedData = response.data.TABLE_DATA.data.map(row => ({
                        employee_name: row[0],
                        employee_position: row[1],
                        employee_city: row[2],
                        id: row[3],
                        employee_date: row[4],
                        // Remove $ and commas to parse as number
                        employee_salary: parseFloat(row[5].replace(/[^0-9.-]+/g, ""))
                    }));
                    setData(mappedData);
                } else {
                    setData([]);
                    setError('Invalid data format received from server.');
                }
            } catch (err) {
                console.error('Failed to fetch data', err);
                setError('Failed to load employee data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6 animate-fade-in animation-duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
                        <Users className="text-primary-600" />
                        <span>Employee Directory</span>
                    </h1>
                    <p className="text-slate-500 mt-1">Manage and view employee information</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="hidden sm:block bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                        {data.length} Records
                    </div>
                    <button
                        onClick={() => navigate('/map')}
                        className="flex items-center space-x-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm active:scale-95"
                    >
                        <MapIcon size={18} className="text-primary-500" />
                        <span>View Map</span>
                    </button>
                    <button
                        onClick={() => navigate('/chart')}
                        className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm active:scale-95"
                    >
                        <BarChart3 size={18} />
                        <span>View Salary Bar Chart</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center p-12 space-y-4 glass rounded-2xl border border-slate-200">
                    <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                    <p className="text-slate-500 font-medium">Loading employee data...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                    <div>
                        <h3 className="text-lg font-semibold text-red-800">Connection Error</h3>
                        <p className="text-red-600 mt-1">{error}</p>
                    </div>
                    <button
                        onClick={() => navigate('/list')}
                        className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : data.length === 0 ? (
                <div className="p-12 text-center glass rounded-2xl border border-slate-200">
                    <p className="text-slate-500 font-medium">No employee records found.</p>
                </div>
            ) : (
                <div className="glass rounded-2xl shadow-sm border border-white/40 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200">
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm w-16">ID</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Employee Name</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Age</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Salary</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.map((item) => (
                                    <tr
                                        key={item.id}
                                        onClick={() => navigate(`/details/${item.id}`, { state: { employee: item } })}
                                        className="group hover:bg-primary-50/50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-slate-500 text-sm font-medium">#{item.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-100 to-blue-200 flex items-center justify-center text-primary-700 font-bold text-xs">
                                                    {item.employee_name?.charAt(0) || '?'}
                                                </div>
                                                <span className="font-medium text-slate-800">{item.employee_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 text-sm">
                                            {item.employee_age} years
                                        </td>
                                        <td className="px-6 py-4 text-slate-800 font-medium text-right text-sm">
                                            ${Number(item.employee_salary).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <ChevronRight className="inline-block text-slate-300 group-hover:text-primary-500 transition-colors" size={18} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListPage;
