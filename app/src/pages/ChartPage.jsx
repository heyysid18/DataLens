import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { BarChart3, TrendingUp, Users, Activity, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6', '#f97316', '#6366f1', '#eab308'];

const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <div className="bg-primary-50 p-3 rounded-xl">
                <Icon className="text-primary-600" size={24} />
            </div>
            <span className={`flex items - center text - sm font - medium ${trend >= 0 ? 'text-emerald-500' : 'text-slate-400'} `}>
                {trend !== 0 && <TrendingUp size={16} className={`mr - 1 ${trend < 0 && 'rotate-180 text-red-500'} `} />}
                {trend >= 0 && trend !== 0 ? '+' : ''}{trend}%
            </span>
        </div>
        <div className="space-y-1">
            <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
    </div>
);

const ChartPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Process data for charts and stats
    const [chartData, setChartData] = useState([]);
    const [stats, setStats] = useState({
        totalEmployees: 0,
        avgSalary: 0,
        totalPayroll: 0
    });

    useEffect(() => {
        const fetchApiData = async () => {
            try {
                setLoading(true);
                const response = await axios.post('https://backend.jotish.in/backend_dev/gettabledata.php', {
                    username: 'test',
                    password: '123456'
                });

                let fetchedData = [];
                if (response.data && response.data.TABLE_DATA && Array.isArray(response.data.TABLE_DATA.data)) {
                    fetchedData = response.data.TABLE_DATA.data.map(row => ({
                        employee_name: row[0],
                        employee_position: row[1],
                        employee_city: row[2],
                        id: row[3],
                        employee_date: row[4],
                        employee_salary: parseFloat(row[5].replace(/[^0-9.-]+/g, ""))
                    }));
                }

                if (fetchedData.length > 0) {
                    setData(fetchedData);

                    // Prepare Chart Data
                    // Use the first 10 employees from the API Response
                    const firstTenItems = fetchedData.slice(0, 10).map(emp => ({
                        name: emp.employee_name.split(' ')[0], // First name for x-axis brevity
                        fullName: emp.employee_name,
                        salary: Number(emp.employee_salary)
                    }));
                    setChartData(firstTenItems);

                    // Prepare Stats
                    const totalEmployees = fetchedData.length;
                    const totalPayroll = fetchedData.reduce((acc, curr) => acc + Number(curr.employee_salary), 0);
                    const avgSalary = Math.round(totalPayroll / totalEmployees);

                    setStats({
                        totalEmployees,
                        avgSalary,
                        totalPayroll
                    });
                } else {
                    setError('No data found to visualize.');
                }

            } catch (err) {
                console.error('Failed to fetch data for chart', err);
                setError('Failed to load chart data from server.');
            } finally {
                setLoading(false);
            }
        };
        fetchApiData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
                <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
                <p className="text-slate-500 font-medium relative z-10">Generating Analytics Dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-100 p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto mt-12">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <h3 className="text-xl font-semibold text-red-800">Analytics Error</h3>
                <p className="text-red-600">{error}</p>
                <button
                    onClick={() => navigate('/list')}
                    className="mt-4 px-6 py-2.5 bg-red-100 text-red-800 hover:bg-red-200 rounded-xl transition-colors font-medium flex items-center justify-center space-x-2"
                >
                    <ArrowLeft size={18} />
                    <span>Return to Directory</span>
                </button>
            </div>
        );
    }

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass rounded-xl p-4 shadow-lg border border-slate-100 z-50">
                    <p className="font-bold text-slate-800 mb-2">{payload[0].payload.fullName}</p>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <p className="text-slate-600 font-medium">
                            Salary: <span className="text-slate-900 font-bold">{formatCurrency(payload[0].value)}</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 animate-fade-in relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
                        <BarChart3 className="text-primary-600" />
                        <span>Salary Analytics Overview</span>
                    </h1>
                    <p className="text-slate-500 mt-1">Live data visualization of employee compensation</p>
                </div>
                <div>
                    <button
                        onClick={() => navigate('/list')}
                        className="hidden sm:flex items-center justify-center space-x-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:shadow-sm transition-all font-medium active:scale-95"
                    >
                        <ArrowLeft size={18} />
                        <span>Back to List</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Employees" value={stats.totalEmployees} icon={Users} trend={0} />
                <StatCard title="Average Salary" value={formatCurrency(stats.avgSalary)} icon={Activity} trend={0} />
                <StatCard title="Total Payroll" value={formatCurrency(stats.totalPayroll)} icon={TrendingUp} trend={0} />
            </div>

            <div className="glass rounded-3xl p-6 md:p-8 shadow-sm border border-white/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="mb-8 relative z-10">
                    <h3 className="text-xl font-bold text-slate-800">Compensation Breakdown</h3>
                    <p className="text-sm text-slate-500">Visualizing salary distribution among the first 10 employees</p>
                </div>

                <div className="h-[450px] w-full mt-4 relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            barGap={8}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                                dy={15}
                                angle={-45}
                                textAnchor="end"
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 13 }}
                                dx={-10}
                                tickFormatter={(value) => `$${value / 1000} k`}
                            />
                            <Tooltip cursor={{ fill: '#f8fafc', opacity: 0.6 }} content={<CustomTooltip />} />
                            <Bar
                                dataKey="salary"
                                name="Annual Salary"
                                radius={[8, 8, 0, 0]}
                                maxBarSize={60}
                                animationDuration={1500}
                                animationEasing="ease-out"
                            >
                                {
                                    chartData.map((entry, index) => (
                                        <Cell key={`cell - ${index} `} fill={colors[index % colors.length]} />
                                    ))
                                }
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ChartPage;
