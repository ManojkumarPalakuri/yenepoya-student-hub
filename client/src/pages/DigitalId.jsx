import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Share2, ShieldCheck, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DigitalId = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#030712] flex items-center justify-center p-6 pt-20">
            <div className="w-full max-w-sm perspective-1000">

                {/* Navigation Header */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-24 left-6 flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest hover:text-blue-600 dark:hover:text-blue-400 transition-colors z-20"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="mb-8 text-center relative z-10 pointer-events-none">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Student Identity</h1>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Tap card to flip</p>
                </div>

                {/* Card Container */}
                <motion.div
                    className="relative w-full aspect-[3/5] cursor-pointer preserve-3d"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    onClick={handleFlip}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* FRONT SIDE */}
                    <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827]">
                        {/* Holographic Header */}
                        <div className="h-40 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

                            <div className="absolute top-6 left-6 text-white">
                                <span className="text-[10px] font-bold tracking-[0.2em] opacity-80 block mb-1">YENEPOYA UNIVERSITY</span>
                                <span className="text-xl font-bold flex items-center gap-2">
                                    <ShieldCheck size={20} className="text-emerald-400" /> Official ID
                                </span>
                            </div>
                        </div>

                        {/* Photo Wrapper */}
                        <div className="absolute top-24 left-1/2 -translate-x-1/2">
                            <div className="w-32 h-32 rounded-xl bg-gray-200 border-4 border-white dark:border-[#111827] shadow-lg overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                {/* Placeholder Avatar */}
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-5xl font-bold text-slate-500">
                                    {user.name.charAt(0)}
                                </div>
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border-2 border-white dark:border-[#111827]">
                                ACTIVE
                            </div>
                        </div>

                        {/* User Details */}
                        <div className="pt-20 px-6 pb-8 text-center mt-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-slate-400 font-mono mb-6">{user.email}</p>

                            <div className="grid grid-cols-2 gap-4 text-left border-t border-gray-100 dark:border-gray-800 pt-6">
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-wider block mb-1">Register No</span>
                                    <span className="text-sm font-mono font-bold text-gray-800 dark:text-slate-200">{user.registerNumber || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-wider block mb-1">Campus ID</span>
                                    <span className="text-sm font-mono font-bold text-gray-800 dark:text-slate-200">{user.campusId || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-wider block mb-1">Batch</span>
                                    <span className="text-sm font-bold text-gray-800 dark:text-slate-200">{user.batchYear || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-wider block mb-1">Course</span>
                                    <span className="text-sm font-bold text-gray-800 dark:text-slate-200 line-clamp-1">{user.classSection || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>
                    </div>

                    {/* BACK SIDE */}
                    <div
                        className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-[#111827] text-white rotate-y-180"
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        <div className="h-full flex flex-col items-center justify-center p-8 relative">
                            {/* Decorative Grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                            <div className="relative bg-white p-3 rounded-xl shadow-2xl mb-6">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify({
                                        Name: user.name,
                                        Email: user.email,
                                        "Campus ID": user.campusId || 'N/A',
                                        "Reg No": user.registerNumber || 'N/A'
                                    }, null, 2))}`}
                                    alt="Student QR"
                                    className="w-48 h-48"
                                />
                            </div>

                            <p className="text-sm font-mono text-gray-400 mb-8 text-center max-w-[200px]">
                                Scan this QR at library, events, and campus gates.
                            </p>

                            <div className="w-full border-t border-gray-800 pt-6">
                                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                        <ShieldCheck size={14} className="text-red-500" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Emergency Contact</div>
                                        <div className="text-xs font-bold text-red-200">{import.meta.env.VITE_EMERGENCY_CONTACT}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-8 text-center">
                    <button
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
                    >
                        <Share2 size={14} /> Share Digital ID
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DigitalId;
