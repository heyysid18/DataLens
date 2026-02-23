import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, RefreshCw, List, Camera } from 'lucide-react';

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
        <div className="min-h-[80vh] flex flex-col items-center justify-center animate-fade-in relative z-10 px-4">
            {/* Background accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>

            <div className="w-full max-w-2xl glass rounded-3xl p-8 md:p-10 shadow-lg border border-white/50 relative z-10 text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 flex items-center justify-center space-x-2">
                    <Camera className="text-primary-600" size={28} />
                    <span>Photo Verified</span>
                </h1>
                <p className="text-slate-500 mb-8">
                    Identity capture successful for <strong className="text-slate-800">{employeeName || "Unknown"}</strong>
                </p>

                {/* Large Centered Image Preview */}
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border-4 border-slate-200 shadow-xl mb-8 relative mx-auto">
                    <img
                        src={capturedImage}
                        alt="Captured ID"
                        className="w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute bottom-4 left-4 inline-flex items-center bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-white shadow-lg space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <span className="font-mono text-xs tracking-wider font-semibold">VALID SECURE CAPTURE</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-bold transition-all active:scale-95 shadow-sm"
                    >
                        <RefreshCw size={18} />
                        <span>Retake Photo</span>
                    </button>

                    <button
                        onClick={downloadImage}
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-[0_8px_20px_rgb(59,130,246,0.25)] hover:shadow-[0_8px_25px_rgb(59,130,246,0.35)] transition-all active:scale-95"
                    >
                        <Download size={20} />
                        <span>Download Image</span>
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <button
                        onClick={() => navigate('/list')}
                        className="inline-flex items-center text-slate-500 hover:text-slate-800 font-medium transition-colors group"
                    >
                        <List size={18} className="mr-2 group-hover:text-primary-600 transition-colors" />
                        Back to List
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PhotoPage;
