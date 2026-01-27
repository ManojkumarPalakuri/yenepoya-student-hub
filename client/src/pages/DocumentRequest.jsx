import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, ArrowRight, Clock, CheckCircle, XCircle, File, Sparkles, Activity, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import { API_URL } from '../config';

const DocumentRequest = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [purpose, setPurpose] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const docTypes = [
        { id: 'bonafide', title: 'Bonafide Certificate', desc: 'Proof of student status', icon: FileText, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-100 dark:border-blue-500/20' },
        { id: 'transcript', title: 'Academic Transcript', desc: 'Official grade record', icon: File, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10', border: 'border-purple-100 dark:border-purple-500/20' },
        { id: 'lor', title: 'Letter of Recommendation', desc: 'For higher studies', icon: Sparkles, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-100 dark:border-amber-500/20' },
        { id: 'tc', title: 'Transfer Certificate', desc: 'Leaving institute req', icon: ArrowRight, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-100 dark:border-emerald-500/20' },
        { id: 'completion', title: 'Course Completion', desc: 'Program finish cert', icon: CheckCircle, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-500/10', border: 'border-cyan-100 dark:border-cyan-500/20' },
    ];

    const fetchRequests = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/requests/my-requests`, { withCredentials: true });
            setRequests(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const openModal = (doc) => {
        setSelectedDoc(doc);
        setPurpose('');
    };

    const closeModal = () => {
        setSelectedDoc(null);
        setPurpose('');
    };

    const handleConfirmRequest = async () => {
        if (!purpose.trim()) {
            toast.error('Please enter a purpose');
            return;
        }

        setSubmitting(true);

        try {
            const apiUrl = API_URL;
            await axios.post(`${apiUrl}/api/requests`, {
                documentType: selectedDoc.title,
                purpose
            }, { withCredentials: true });

            fetchRequests();
            closeModal();
            toast.success('Document request submitted');
        } catch (error) {
            toast.error('Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-[#030712] text-gray-900 dark:text-slate-300 font-sans selection:bg-blue-500/30 pt-20">
            <div className="w-full px-6 md:px-8 pb-6 pt-2">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-gray-500 dark:text-slate-500 uppercase tracking-widest">Portal / Requests</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/20">
                                <FileText className="text-blue-600 dark:text-blue-500" size={20} />
                            </div>
                            Document Center
                        </h1>
                    </div>

                    <div className="flex items-center gap-8 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg px-6 py-3 mt-4 md:mt-0 shadow-sm">
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-0.5">Pending Actions</div>
                            <div className="text-lg font-mono font-bold text-gray-900 dark:text-white leading-none">
                                {requests.filter(r => r.status === 'Pending').length}
                            </div>
                        </div>
                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-800"></div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-0.5">Total Requests</div>
                            <div className="text-lg font-mono font-bold text-gray-900 dark:text-white leading-none">{requests.length}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Request Buttons */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {docTypes.map((doc, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => openModal(doc)}
                                className="group relative text-left bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-xl hover:border-blue-300 dark:hover:border-blue-500/30 transition-all shadow-sm hover:shadow-md"
                            >
                                <div className={`w-10 h-10 rounded-lg ${doc.bg} ${doc.border} border flex items-center justify-center mb-4 text-white`}>
                                    <doc.icon size={20} className={doc.color} />
                                </div>
                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                    <ArrowRight size={16} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{doc.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-slate-500 font-mono">{doc.desc}</p>
                            </motion.button>
                        ))}
                    </div>

                    {/* Request History Log */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden h-full max-h-[600px] flex flex-col shadow-sm">
                            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
                                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <Activity size={14} className="text-blue-600 dark:text-blue-500" /> Activity Log
                                </h3>
                                <button onClick={fetchRequests} className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline uppercase">
                                    Refresh
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                                {requests.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <p className="text-xs text-gray-400 dark:text-slate-600 font-mono">NO_HISTORY_FOUND</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {requests.map((req) => (
                                            <div key={req._id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${req.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' :
                                                        req.status === 'Rejected' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' :
                                                            'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                                                        }`}>
                                                        {req.status}
                                                    </span>
                                                    <span className="text-[9px] font-mono text-gray-400 dark:text-slate-600">
                                                        {new Date(req.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-slate-200 leading-snug">
                                                    {req.documentType}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-gray-500 dark:text-slate-500">
                                                    <span>ID: {req._id.slice(-6).toUpperCase()}</span>
                                                    <span className="mx-1">•</span>
                                                    <span>{req.purpose}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Purpose Modal */}
            <AnimatePresence>
                {selectedDoc && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md bg-white dark:bg-[#111827] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <FileText size={14} className="text-blue-600 dark:text-blue-500" /> New Request
                                </h3>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-2">
                                        Document Type
                                    </label>
                                    <div className="p-3 bg-gray-50 dark:bg-[#0B1220] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <selectedDoc.icon size={16} className={selectedDoc.color} />
                                        {selectedDoc.title}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-2">
                                        Purpose of Request
                                    </label>
                                    <textarea
                                        value={purpose}
                                        onChange={(e) => setPurpose(e.target.value)}
                                        placeholder="e.g. Required for visa application..."
                                        className="w-full h-32 bg-gray-50 dark:bg-[#0B1220] border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-slate-600"
                                        autoFocus
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmRequest}
                                        disabled={submitting}
                                        className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 transition-all disabled:opacity-50"
                                    >
                                        {submitting ? 'Submitting...' : 'Confirm Request'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DocumentRequest;
