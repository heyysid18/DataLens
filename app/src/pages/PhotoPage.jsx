import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, RefreshCw, List, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

const PhotoPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const capturedImage = location.state?.capturedImage;
    const employeeName = location.state?.employeeName;

    useEffect(() => {
        if (!capturedImage) {
            navigate('/list');
        }
    }, [capturedImage, navigate]);

    const downloadImage = () => {
        if (capturedImage) {
            const a = document.createElement('a');
            a.href = capturedImage;
            a.download = `Photo_${employeeName ? employeeName.replace(/\s+/g, '_') : 'Capture'}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    if (!capturedImage) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="min-h-[80vh] flex flex-col items-center justify-center relative z-10 px-4"
        >
            {/* Background accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-200/40 dark:bg-primary-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-30 pointer-events-none"></div>

            <div className="w-full max-w-2xl glass dark:glass-dark rounded-3xl p-8 md:p-10 shadow-lg border border-white/50 dark:border-white/5 relative z-10 text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center justify-center space-x-2">
                    <Camera className="text-primary-600 dark:text-primary-400" size={28} />
                    <span>Photo Verified</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                    Identity capture successful for <strong className="text-slate-800 dark:text-slate-200">{employeeName || "Unknown"}</strong>
                </p>

                {/* Large Centered Image Preview */}
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border-4 border-slate-200 dark:border-slate-700 shadow-xl mb-8 relative mx-auto">
                    <img
                        src={capturedImage}
                        alt="Captured ID"
                        className="w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute bottom-4 left-4 inline-flex items-center bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-white shadow-lg space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="font-mono text-xs tracking-wider font-semibold">VALID SECURE CAPTURE</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-bold transition-colors shadow-sm"
                    >
                        <RefreshCw size={18} />
                        <span>Retake Photo</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={downloadImage}
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-md transition-colors"
                    >
                        <Download size={20} />
                        <span>Download Image</span>
                    </motion.button>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => navigate('/list')}
                        className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors group"
                    >
                        <List size={18} className="mr-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                        Back to List
                    </button>
                </div>

            </div>
        </motion.div>
    );
};

export default PhotoPage;
