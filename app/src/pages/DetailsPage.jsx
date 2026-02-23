import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Webcam from 'react-webcam';
import { ArrowLeft, Briefcase, Mail, Loader2, AlertCircle, Building2, UserCircle2, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const DetailsPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(location.state?.employee || null);
    const [loading, setLoading] = useState(!user);
    const [error, setError] = useState('');

    const [isCameraActive, setIsCameraActive] = useState(false);
    const webcamRef = useRef(null);

    useEffect(() => {
        if (!user) {
            const fetchUser = async () => {
                try {
                    setLoading(true);
                    const response = await axios.post('https://backend.jotish.in/backend_dev/gettabledata.php', {
                        username: 'test',
                        password: '123456'
                    });

                    let data = [];
                    if (response.data && response.data.TABLE_DATA && Array.isArray(response.data.TABLE_DATA.data)) {
                        data = response.data.TABLE_DATA.data.map(row => ({
                            employee_name: row[0],
                            employee_position: row[1],
                            employee_city: row[2],
                            id: row[3],
                            employee_date: row[4],
                            employee_salary: parseFloat(row[5].replace(/[^0-9.-]+/g, ""))
                        }));
                    }

                    const foundEmployee = data.find(emp => emp.id?.toString() === id.toString());
                    if (foundEmployee) {
                        setUser(foundEmployee);
                    } else {
                        setError("Employee not found.");
                        toast.error("Employee not found.");
                    }
                } catch (error) {
                    console.error("Failed to fetch user details", error);
                    setError("Failed to fetch employee details. Please try again.");
                    toast.error("Failed to load details");
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        }
    }, [id, user]);

    const capturePhoto = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                toast.success('Photo captured securely!');
                navigate('/photo', {
                    state: {
                        capturedImage: imageSrc,
                        employeeName: user.employee_name
                    }
                });
            } else {
                toast.error('Failed to capture photo');
            }
        }
    }, [webcamRef, navigate, user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="h-10 w-10 text-primary-600 dark:text-primary-400 animate-spin" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Loading employee records...</p>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="text-center py-12 space-y-4">
                <AlertCircle size={48} className="mx-auto text-red-500 dark:text-red-400" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{error || "Employee not found"}</h2>
                <button
                    onClick={() => navigate('/list')}
                    className="mt-6 px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center justify-center space-x-2 mx-auto transition-colors"
                >
                    <ArrowLeft size={16} /> <span>Back to Directory</span>
                </button>
            </div>
        );
    }

    const formattedSalary = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(user.employee_salary);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 relative z-10"
        >
            {/* Header Profile Section */}
            <div className="glass dark:glass-dark rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm border border-white/50 dark:border-white/5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-20 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                <div className="flex items-center space-x-6 relative z-10 w-full md:w-auto">
                    <div className="h-16 w-16 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl shadow-md flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                        {user.employee_name?.charAt(0) || <UserCircle2 size={32} />}
                    </div>
                    <div className="flex-grow">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1 truncate">{user.employee_name}</h1>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 flex items-center font-medium">
                            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-500 dark:text-primary-400" />
                            {user.employee_position}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                            ID: {user.id} {user.employee_age ? `• Age: ${user.employee_age} yrs` : ''}
                        </p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/list')}
                    className="relative z-10 w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors font-medium"
                >
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Info Cards */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
                        className="glass dark:glass-dark rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center mb-4">
                            <Briefcase className="w-5 h-5 mr-3 text-primary-500 dark:text-primary-400" />
                            Compensation
                        </h3>
                        <div className="space-y-3">
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Annual Salary</p>
                            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{formattedSalary}</p>
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                                <p className="text-sm text-slate-500 dark:text-slate-400 italic">Compensation details are strictly confidential.</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                        className="glass dark:glass-dark rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center mb-4">
                            <Mail className="w-5 h-5 mr-3 text-primary-500 dark:text-primary-400" />
                            Contact File
                        </h3>
                        <div className="space-y-2 text-slate-600 dark:text-slate-300">
                            <p><strong>Status:</strong> Active</p>
                            <p><strong>Joined:</strong> {user.employee_date}</p>
                            <p><strong>Base:</strong> {user.employee_city}</p>
                        </div>
                    </motion.div>
                </div>

                {/* Camera Integration Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
                    className="glass dark:glass-dark rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[400px]"
                >
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center mb-4">
                        <Camera className="w-5 h-5 mr-3 text-primary-500 dark:text-primary-400" />
                        Identity Verification
                    </h3>

                    <div className="flex-grow flex flex-col relative">
                        <AnimatePresence mode="wait">
                            {isCameraActive ? (
                                <motion.div
                                    key="camera-on"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-grow relative rounded-xl overflow-hidden bg-black flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-slate-300 dark:border-slate-700"
                                >
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={{ facingMode: "user", width: 1280, height: 720 }}
                                        className="w-full h-full object-cover absolute inset-0 z-0"
                                    />
                                    <div className="absolute inset-x-8 bottom-8 z-10 flex justify-center space-x-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setIsCameraActive(false)}
                                            className="px-6 py-3 bg-red-500/80 hover:bg-red-600 backdrop-blur text-white rounded-full font-medium transition-colors shadow-lg"
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={capturePhoto}
                                            className="px-8 py-3 bg-white text-primary-600 rounded-full font-bold shadow-xl overflow-hidden"
                                        >
                                            Capture Photo
                                        </motion.button>
                                    </div>
                                    <div className="absolute inset-0 pointer-events-none z-0 border-[6px] border-white/20 m-6 rounded-lg pointer-events-none"></div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="camera-off"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 min-h-[300px]"
                                >
                                    <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/40 text-primary-500 dark:text-primary-400 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                        <Camera size={36} />
                                    </div>
                                    <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Update ID Photo</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
                                        Capture a new portrait for {user.employee_name}'s digital verification file. A working webcam is required.
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsCameraActive(true)}
                                        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
                                    >
                                        <Camera size={18} />
                                        <span>Activate Camera</span>
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default DetailsPage;
