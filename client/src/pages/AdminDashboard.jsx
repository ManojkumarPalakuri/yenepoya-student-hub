import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Activity,
    FileText,
    CheckCircle2,
    Clock,
    Search,
    Filter,
    ArrowUpRight,
    User,
    MapPin,
    Calendar,
    ChevronDown,
    LayoutGrid,
    List,
    DollarSign,
    Box,
    AlertCircle,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    const [orders, setOrders] = useState([]);
    const [requests, setRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, totalRequests: 0, revenue: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (background = false) => {
        if (!background) setLoading(true);
        try {
            const [ordersRes, requestsRes] = await Promise.all([
                axios.get(`${apiUrl}/api/orders`, { withCredentials: true }),
                axios.get(`${apiUrl}/api/requests`, { withCredentials: true })
            ]);
            setOrders(ordersRes.data);
            setRequests(requestsRes.data);

            const totalRevenue = ordersRes.data.reduce((sum, order) => sum + (order.status !== 'Cancelled' ? order.totalAmount : 0), 0);

            setStats({
                totalOrders: ordersRes.data.length,
                pendingOrders: ordersRes.data.filter(o => o.status === 'Processing' || o.status === 'Pending').length,
                totalRequests: requestsRes.data.length,
                pendingRequests: requestsRes.data.filter(r => r.status === 'Pending').length,
                revenue: totalRevenue
            });
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            if (!background) setLoading(false);
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            await axios.put(`${apiUrl}/api/orders/${id}/status`, { status }, { withCredentials: true });
            fetchData(true); // Silent refresh
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const updateRequestStatus = async (id, status) => {
        try {
            await axios.put(`${apiUrl}/api/requests/${id}/status`, { status }, { withCredentials: true });
            fetchData(true); // Silent refresh
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const StatusBadge = ({ status }) => {
        const config = {
            Completed: { color: 'text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10' },
            Approved: { color: 'text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10' },
            Processing: { color: 'text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10' },
            Pending: { color: 'text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10' },
            Rejected: { color: 'text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10' },
            Cancelled: { color: 'text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/30 bg-gray-100 dark:bg-gray-500/10' },
        };
        const style = config[status] || config.Pending;

        return (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${style.color}`}>
                {status}
            </span>
        );
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center py-40 gap-3 min-h-screen bg-gray-50 dark:bg-[#030712]">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-xs font-mono text-gray-500 dark:text-slate-500">LOADING_DASHBOARD...</div>
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-[#030712] text-gray-900 dark:text-slate-300 font-sans selection:bg-blue-500/30 pt-20">
            <div className="w-full px-6 md:px-8 pb-6 pt-2">

                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-gray-500 dark:text-slate-500 uppercase tracking-widest">Portal / Overview</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-100 dark:border-blue-500/20">
                                <Activity className="text-blue-600 dark:text-blue-500" size={20} />
                            </div>
                            Command Center
                        </h1>
                    </div>

                    {/* Header Actions */}
                    <div className="flex items-center gap-4">
                        <button onClick={fetchData} className="p-2 hover:bg-gray-200 dark:hover:bg-white/5 rounded-lg text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white transition-colors" title="Refresh Data">
                            <Clock size={16} />
                        </button>
                        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 flex items-center gap-4 shadow-sm">
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider">Revenue</div>
                                <div className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">₹{stats.revenue.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Orders', value: stats.totalOrders, icon: Box, color: 'text-blue-600 dark:text-blue-400' },
                        { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'text-amber-600 dark:text-amber-400' },
                        { label: 'Doc Requests', value: stats.totalRequests, icon: FileText, color: 'text-purple-600 dark:text-purple-400' },
                        { label: 'Pending Docs', value: stats.pendingRequests, icon: AlertCircle, color: 'text-red-600 dark:text-red-400' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-[#111827] p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-gray-700 transition-colors shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <stat.icon size={16} className={stat.color} />
                                <span className={`text-[10px] font-bold bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded text-gray-500 dark:text-slate-400`}>VAR +0%</span>
                            </div>
                            <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white">{stat.value}</div>
                            <div className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 mb-6 border-b border-gray-200 dark:border-gray-800">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`pb-3 text-xs font-bold uppercase tracking-wide transition-all border-b-2 ${activeTab === 'orders' ? 'text-gray-900 dark:text-white border-blue-600 dark:border-blue-500' : 'text-gray-500 dark:text-slate-500 border-transparent hover:text-gray-700 dark:hover:text-slate-300'
                            }`}
                    >
                        Store Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`pb-3 text-xs font-bold uppercase tracking-wide transition-all border-b-2 ${activeTab === 'requests' ? 'text-gray-900 dark:text-white border-purple-600 dark:border-purple-500' : 'text-gray-500 dark:text-slate-500 border-transparent hover:text-gray-700 dark:hover:text-slate-300'
                            }`}
                    >
                        Certificate Requests
                    </button>
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'orders' ? (
                            <motion.div
                                key="orders"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                {orders.length === 0 && <div className="text-center py-10 text-xs font-mono text-gray-400 dark:text-slate-600">NO_ORDERS_FOUND</div>}
                                {orders.map(order => (
                                    <div key={order._id} className="group bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-gray-300 dark:hover:border-gray-700 transition-all shadow-sm">
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            {/* Left: Meta */}
                                            <div className="lg:w-1/3 min-w-[200px]">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="font-mono text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 rounded">#{order._id.slice(-6).toUpperCase()}</span>
                                                    <StatusBadge status={order.status} />
                                                </div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">{order.studentDetails?.name || 'Unknown User'}</h3>
                                                <p className="text-xs font-mono text-gray-500 dark:text-slate-500 mt-0.5">{order.studentDetails?.registerNumber}</p>

                                                <div className="flex gap-2 mt-3 text-[10px] text-gray-500 dark:text-slate-400 font-mono">
                                                    <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{order.studentDetails?.classSection || 'N/A'}</span>
                                                    <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            {/* Middle: Items */}
                                            <div className="lg:flex-1 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 pt-4 lg:pt-0 lg:pl-6">
                                                <div className="space-y-2">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-xs">
                                                            <div className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                                                                <span className="font-mono text-gray-500 dark:text-slate-500">x{item.quantity}</span>
                                                                <span>{item.name}</span>
                                                                {item.size && <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-slate-400 px-1 rounded text-[9px] font-bold">{item.size}</span>}
                                                            </div>
                                                            <span className="font-mono text-gray-500 dark:text-slate-500">₹{item.price * item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Right: Actions */}
                                            <div className="lg:w-auto flex flex-col items-end justify-between border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 pt-4 lg:pt-0 lg:pl-6">
                                                <div className="text-right mb-4 lg:mb-0">
                                                    <div className="text-lg font-mono font-bold text-gray-900 dark:text-white">₹{order.totalAmount}</div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {order.status !== 'Completed' && order.status !== 'Cancelled' ? (
                                                        <>
                                                            {order.status !== 'Processing' && (
                                                                <button
                                                                    onClick={() => updateOrderStatus(order._id, 'Processing')}
                                                                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                                >
                                                                    Process
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => updateOrderStatus(order._id, 'Completed')}
                                                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 transition-all flex items-center gap-1.5"
                                                            >
                                                                Complete <ArrowUpRight size={10} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs font-bold text-gray-500 dark:text-slate-600 flex items-center gap-1">
                                                            <CheckCircle2 size={12} /> Archived
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="requests"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                {requests.length === 0 && <div className="text-center py-10 text-xs font-mono text-gray-400 dark:text-slate-600">NO_REQUESTS_FOUND</div>}
                                {requests.map(req => (
                                    <div key={req._id} className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-gray-300 dark:hover:border-gray-700 transition-colors shadow-sm">
                                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <StatusBadge status={req.status} />
                                                    <span className="font-mono text-xs text-gray-500 dark:text-slate-500">{new Date(req.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{req.documentType}</h3>
                                                    <p className="text-xs text-gray-500 dark:text-slate-400 font-mono mt-1 max-w-xl opacity-80">"{req.purpose}"</p>
                                                </div>
                                                <div className="flex items-center gap-2 pt-2">
                                                    <div className="w-5 h-5 rounded bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-[10px] font-bold border border-purple-100 dark:border-purple-500/20">
                                                        {req.studentDetails?.name?.[0]}
                                                    </div>
                                                    <span className="text-xs text-gray-700 dark:text-slate-300 font-medium">{req.studentDetails?.name}</span>
                                                    <span className="text-xs font-mono text-gray-500 dark:text-slate-600">ID: {req.studentDetails?.registerNumber}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 self-start mt-1">
                                                {req.status === 'Pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateRequestStatus(req._id, 'Rejected')}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                        <button
                                                            onClick={() => updateRequestStatus(req._id, 'Approved')}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 dark:bg-white text-gray-900 dark:text-black hover:bg-gray-200 dark:hover:bg-gray-200 transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                    </>
                                                )}
                                                {req.status === 'Approved' && (
                                                    <button
                                                        onClick={() => updateRequestStatus(req._id, 'Completed')}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/20 transition-all"
                                                    >
                                                        Mark Done
                                                    </button>
                                                )}
                                                {['Completed', 'Rejected'].includes(req.status) && (
                                                    <span className="text-xs font-bold text-gray-500 dark:text-slate-600 flex items-center gap-1">
                                                        <CheckCircle2 size={12} /> Processed
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
