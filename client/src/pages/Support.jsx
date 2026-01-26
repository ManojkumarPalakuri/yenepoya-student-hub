import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Send, HelpCircle, MessageSquare, AlertCircle, CheckCircle, Clock, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Support = () => {
    const { user } = useAuth();
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('new'); // 'new' or 'history'

    const [formData, setFormData] = useState({
        subject: '',
        category: 'General',
        description: ''
    });

    const categories = ['Academic', 'Technical', 'General', 'Feedback'];

    const fetchQueries = async () => {
        try {
            const { data } = await axios.get('http://localhost:5001/api/support/my-queries', { withCredentials: true });

            // Client-side filtering
            const lastCleared = localStorage.getItem('supportHistoryClearedAt');
            let displayData = data;
            if (lastCleared) {
                displayData = data.filter(q => new Date(q.createdAt).getTime() > parseInt(lastCleared));
            }

            setQueries(displayData);
        } catch (error) {
            console.error('Error fetching queries:', error);
            toast.error('Failed to load support history');
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = () => {
        if (window.confirm("Are you sure you want to clear your ticket history view? This won't delete the tickets from the server.")) {
            setQueries([]);
            localStorage.setItem('supportHistoryClearedAt', Date.now().toString());
            toast.success('History cleared successfully');
        }
    };

    useEffect(() => {
        fetchQueries();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('http://localhost:5001/api/support', formData, { withCredentials: true });

            // Reset and refresh
            setFormData({ subject: '', category: 'General', description: '' });
            await fetchQueries();
            setActiveTab('history');

            // Show success
            toast.success('Support query submitted successfully');

        } catch (error) {
            console.error('Error submitting query:', error);
            toast.error('Failed to submit query. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-[#030712] text-gray-900 dark:text-slate-300 font-sans selection:bg-blue-500/30 pt-20">
            <div className="max-w-5xl mx-auto px-6 md:px-8 pb-6 pt-2">

                {/* Header */}
                <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-gray-500 dark:text-slate-500 uppercase tracking-widest">Portal / Help</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-100 dark:border-blue-500/20">
                            <HelpCircle className="text-blue-600 dark:text-blue-500" size={20} />
                        </div>
                        Student Support Center
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Sidebar / Tabs */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-2 shadow-sm">
                            <button
                                onClick={() => setActiveTab('new')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'new'
                                    ? 'bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`}
                            >
                                <Send size={16} /> New Query
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'history'
                                    ? 'bg-green-50 dark:bg-green-600/10 text-green-600 dark:text-green-400'
                                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`}
                            >
                                <Clock size={16} /> My Ticket History
                            </button>
                        </div>

                        {/* Quick FAQ / Info Card */}
                        <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg shadow-blue-500/20">
                            <h3 className="font-bold text-lg mb-2">Need Immediate Help?</h3>
                            <p className="text-blue-100 text-xs mb-4 leading-relaxed">
                                For urgent academic issues, please contact your Class Advisor directly.
                                This portal is for tracking formal requests and technical issues.
                            </p>
                            <div className="flex items-center gap-2 text-xs font-mono bg-blue-700/50 p-3 rounded-lg border border-blue-500/30">
                                <MessageSquare size={14} /> Response Time: ~24hrs
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode='wait'>
                            {activeTab === 'new' ? (
                                <motion.div
                                    key="new"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
                                >
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                        Submit a New Request
                                    </h2>

                                    <form onSubmit={handleSubmit} className="space-y-6">

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider">Category</label>
                                                <div className="relative">
                                                    <select
                                                        name="category"
                                                        value={formData.category}
                                                        onChange={handleChange}
                                                        className="w-full bg-gray-50 dark:bg-[#030712] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white appearance-none focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-colors"
                                                    >
                                                        {categories.map(cat => <option key={cat} value={cat}>{cat} Support</option>)}
                                                    </select>
                                                    <Filter size={14} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider">Subject</label>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Brief summary of issue..."
                                                    className="w-full bg-gray-50 dark:bg-[#030712] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider">Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                required
                                                rows="6"
                                                placeholder="Please describe your query in detail..."
                                                className="w-full bg-gray-50 dark:bg-[#030712] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none resize-none transition-colors"
                                            ></textarea>
                                        </div>

                                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                            >
                                                {submitting ? 'Submitting...' : <><Send size={16} /> Submit Ticket</>}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="history"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
                                            Ticket History
                                        </h2>
                                        {queries.length > 0 && (
                                            <button
                                                onClick={clearHistory}
                                                className="text-xs font-bold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 uppercase tracking-wider flex items-center gap-1"
                                            >
                                                Clear History
                                            </button>
                                        )}
                                    </div>

                                    {queries.length === 0 ? (
                                        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
                                            <MessageSquare size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">No Tickets Found</h3>
                                            <p className="text-xs text-gray-500 dark:text-slate-600 mt-1">You haven't submitted any support queries yet.</p>
                                        </div>
                                    ) : (
                                        queries.map(query => (
                                            <div key={query._id} className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:border-blue-300 dark:hover:border-blue-500/30 transition-all">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-wider font-mono">#{query._id.slice(-6).toUpperCase()}</span>
                                                            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-wider font-mono">• {new Date(query.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{query.subject}</h3>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${query.status === 'Resolved' || query.status === 'Closed'
                                                        ? 'bg-green-50 dark:bg-green-500/10 text-green-600 border-green-200 dark:border-green-500/20'
                                                        : query.status === 'In Progress'
                                                            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/20'
                                                            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/20'
                                                        }`}>
                                                        {query.status}
                                                    </span>
                                                </div>

                                                <div className="bg-gray-50 dark:bg-[#030712] rounded-lg p-3 text-xs text-gray-600 dark:text-slate-400 font-medium mb-4">
                                                    {query.description}
                                                </div>

                                                {query.adminReply && (
                                                    <div className="pl-4 border-l-2 border-green-500">
                                                        <p className="text-[10px] font-bold text-green-600 dark:text-green-500 uppercase tracking-wider mb-1">Admin Response</p>
                                                        <p className="text-xs text-gray-700 dark:text-gray-300">{query.adminReply}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
