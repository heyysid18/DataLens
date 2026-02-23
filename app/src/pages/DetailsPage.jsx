import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Webcam from 'react-webcam';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, Briefcase, Mail, Loader2, AlertCircle, Building2, UserCircle2, Camera } from 'lucide-react';

const DetailsPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    // We use "employee" now based on the ListPage mapping
    const [user, setUser] = useState(location.state?.employee || null);
    const [loading, setLoading] = useState(!user);
    const [error, setError] = useState('');

    // Webcam states
    const [isCameraActive, setIsCameraActive] = useState(false);
    const webcamRef = useRef(null);

    useEffect(() => {
        // If we don't have the user from state, we fetch ALL employees again
        // since the API endpoint provided doesn't specify an ID-based GET.
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

                    // Find the specific employee by ID
                    const foundEmployee = data.find(emp => emp.id?.toString() === id.toString());
                    if (foundEmployee) {
                        setUser(foundEmployee);
                    } else {
                        setError("Employee not found.");
                    }
                } catch (error) {
                    console.error("Failed to fetch user details", error);
                    setError("Failed to fetch employee details. Please try again.");
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
                // Navigate to photo page and pass the base64 image and user info via state
                navigate('/photo', {
                    state: {
                        capturedImage: imageSrc,
                        employeeName: user.employee_name
                    }
                });
            }
        }
    }, [webcamRef, navigate, user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
                <p className="text-slate-500 font-medium">Loading employee records...</p>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="text-center py-12 space-y-4">
                <AlertCircle size={48} className="mx-auto text-red-500" />
                <h2 className="text-2xl font-bold text-slate-800">{error || "Employee not found"}</h2>
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
        <div className="space-y-6 animate-fade-in relative z-10">
            {/* Header Profile Section */}
            <div className="glass rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm border border-white/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                <div className="flex items-center space-x-6 relative z-10 w-full md:w-auto">
                    <div className="h-24 w-24 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl shadow-xl flex items-center justify-center text-white font-bold text-3xl rotate-3 hover:rotate-0 transition-transform duration-300 flex-shrink-0">
                        {user.employee_name?.charAt(0) || <UserCircle2 size={40} />}
                    </div>
                    <div className="flex-grow">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 truncate">{user.employee_name}</h1>
                        <p className="text-sm sm:text-base text-slate-600 flex items-center mb-1 font-medium">
                            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-500" />
                            {user.employee_position}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">ID: {user.id} • Age: {user.employee_age} yrs</p>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/list')}
                    className="relative z-10 w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:shadow-sm transition-all font-medium active:scale-95"
                >
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Info Cards */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center mb-4">
                            <Briefcase className="w-5 h-5 mr-3 text-primary-500" />
                            Compensation
                        </h3>
                        <div className="space-y-3">
                            <p className="text-slate-500 text-sm">Annual Salary</p>
                            <p className="text-3xl font-bold text-emerald-600">{formattedSalary}</p>
                            <div className="pt-4 border-t border-slate-100 mt-4">
                                <p className="text-sm text-slate-500 italic">Compensation details are strictly confidential.</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center mb-4">
                            <Mail className="w-5 h-5 mr-3 text-primary-500" />
                            Contact File
                        </h3>
                        <div className="space-y-2 text-slate-600">
                            <p><strong>Status:</strong> Active</p>
                            <p><strong>Joined:</strong> {user.employee_date}</p>
                            <p><strong>Base:</strong> {user.employee_city}</p>
                        </div>
                    </div>
                </div>

                {/* Camera Integration Area */}
                <div className="lg:col-span-2 glass rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[400px]">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center mb-4">
                        <Camera className="w-5 h-5 mr-3 text-primary-500" />
                        Identity Verification
                    </h3>

                    <div className="flex-grow flex flex-col">
                        {isCameraActive ? (
                            <div className="flex-grow relative rounded-xl overflow-hidden bg-black flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-slate-300">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{ facingMode: "user", width: 1280, height: 720 }}
                                    className="w-full h-full object-cover absolute inset-0 z-0"
                                />
                                <div className="absolute inset-x-8 bottom-8 z-10 flex justify-center space-x-4">
                                    <button
                                        onClick={() => setIsCameraActive(false)}
                                        className="px-6 py-3 bg-red-500/80 hover:bg-red-600 backdrop-blur text-white rounded-full font-medium transition-colors shadow-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={capturePhoto}
                                        className="px-8 py-3 bg-white text-primary-600 rounded-full font-bold shadow-xl hover:scale-105 transition-transform"
                                    >
                                        Capture Photo
                                    </button>
                                </div>
                                {/* Viewfinder overlay */}
                                <div className="absolute inset-0 pointer-events-none z-0 border-[6px] border-white/20 m-6 rounded-lg"></div>
                            </div>
                        ) : (
                            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200 min-h-[300px]">
                                <div className="w-20 h-20 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                    <Camera size={36} />
                                </div>
                                <h4 className="text-lg font-semibold text-slate-800 mb-2">Update ID Photo</h4>
                                <p className="text-sm text-slate-500 mb-6 max-w-sm">
                                    Capture a new portrait for {user.employee_name}'s digital verification file. A working webcam is required.
                                </p>
                                <button
                                    onClick={() => setIsCameraActive(true)}
                                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center space-x-2"
                                >
                                    <Camera size={18} />
                                    <span>Activate Camera</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;
