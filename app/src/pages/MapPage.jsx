import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, MapIcon, MapPin, Loader2, AlertCircle, Users } from 'lucide-react';
import L from 'leaflet';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mapping API foreign cities to Indian Coordinates for visualization on an India map
const cityCoordinates = {
    'San Francisco': { lat: 12.9716, lng: 77.5946, label: 'Bangalore (HQ)' },
    'New York': { lat: 19.0760, lng: 72.8777, label: 'Mumbai' },
    'London': { lat: 28.7041, lng: 77.1025, label: 'New Delhi' },
    'Edinburgh': { lat: 18.5204, lng: 73.8567, label: 'Pune' },
    'Tokyo': { lat: 17.3850, lng: 78.4867, label: 'Hyderabad' },
    'Singapore': { lat: 13.0827, lng: 80.2707, label: 'Chennai' },
    'Sidney': { lat: 22.5726, lng: 88.3639, label: 'Kolkata' },
};

// Fallback Indian location (Geographical center of India approx)
const defaultIndiaCenter = { lat: 20.5937, lng: 78.9629 };

const MapPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { isDark } = useTheme();

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
                    setEmployees(fetchedData);
                    toast.success('Map data loaded securely');
                } else {
                    setError('No geographical data found.');
                    toast.error('No geographical data found.');
                }

            } catch (err) {
                console.error('Failed to fetch data for map', err);
                setError('Failed to load map data from server.');
                toast.error('Failed to load map data');
            } finally {
                setLoading(false);
            }
        };
        fetchApiData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
                <Loader2 className="h-10 w-10 text-primary-600 dark:text-primary-400 animate-spin" />
                <p className="text-slate-500 dark:text-slate-400 font-medium relative z-10">Initializing Interactive Map...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto mt-12">
                <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400" />
                <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">Map Initialization Error</h3>
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <button
                    onClick={() => navigate('/list')}
                    className="mt-4 px-6 py-2.5 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/80 rounded-xl transition-colors font-medium flex items-center justify-center space-x-2"
                >
                    <ArrowLeft size={18} />
                    <span>Return to Directory</span>
                </button>
            </div>
        );
    }

    // Count employees per city mapped to India
    const cityCounts = employees.reduce((acc, emp) => {
        const coordsType = cityCoordinates[emp.employee_city] ? cityCoordinates[emp.employee_city].label : 'Other (Nagpur)';
        acc[coordsType] = (acc[coordsType] || 0) + 1;
        return acc;
    }, {});

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-6 relative z-10"
        >
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                        <MapIcon className="text-primary-600 dark:text-primary-400" />
                        <span>Employee Distribution (India)</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Geographic overview of our distributed workforce</p>
                </div>
                <div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/list')}
                        className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium"
                    >
                        <ArrowLeft size={18} />
                        <span>Back to List</span>
                    </motion.button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Info Legend */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="glass dark:glass-dark rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-white/5">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between mb-4">
                            <span className="flex items-center">
                                <Users className="w-5 h-5 mr-3 text-primary-500 dark:text-primary-400" />
                                Workforce Heatmap
                            </span>
                        </h3>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).map(([city, count]) => (
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    key={city}
                                    className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 transition-transform cursor-default"
                                >
                                    <div className="flex items-center space-x-2">
                                        <MapPin size={16} className="text-red-500 dark:text-red-400" />
                                        <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">{city}</span>
                                    </div>
                                    <span className="bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full text-xs font-bold">
                                        {count}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-6 italic">
                            * Global HQ cities are mapped to respective regional offices in India.
                        </p>
                    </div>
                </div>

                {/* The Map itself */}
                <div className="lg:col-span-3 glass dark:glass-dark rounded-2xl p-4 shadow-sm h-[600px] border border-white/40 dark:border-white/5 overflow-hidden relative">
                    <MapContainer
                        center={[defaultIndiaCenter.lat, defaultIndiaCenter.lng]}
                        zoom={5}
                        scrollWheelZoom={true}
                        className={`h-full w-full rounded-xl z-0 ${isDark ? 'contrast-125 hue-rotate-15 invert-[.85]' : ''}`}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            className={isDark ? 'map-tiles' : ''}
                        />

                        {employees.map((emp) => {
                            const locationBase = cityCoordinates[emp.employee_city];
                            const latJitter = (Math.random() - 0.5) * 0.04;
                            const lngJitter = (Math.random() - 0.5) * 0.04;

                            const lat = locationBase ? locationBase.lat + latJitter : defaultIndiaCenter.lat + latJitter;
                            const lng = locationBase ? locationBase.lng + lngJitter : defaultIndiaCenter.lng + lngJitter;

                            return (
                                <Marker key={emp.id} position={[lat, lng]}>
                                    <Popup className={`font-sans min-w-[150px] ${isDark ? 'dark-popup' : ''}`}>
                                        <div className="mb-1">
                                            <strong className="text-slate-800 text-[15px] block">{emp.employee_name}</strong>
                                            <span className="text-primary-600 text-xs font-medium block border-b border-slate-100 pb-1 mb-1">{emp.employee_position}</span>
                                        </div>
                                        <div className="text-[13px] text-slate-600">
                                            <span className="flex items-center mt-1">
                                                <MapPin size={12} className="mr-1 text-slate-400" />
                                                {locationBase ? locationBase.label : 'Central Operations'}
                                            </span>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>
            </div>
        </motion.div>
    );
};

export default MapPage;
