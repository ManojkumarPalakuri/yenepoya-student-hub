import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, FileText, User, Bell, ExternalLink, Calendar, MapPin, ArrowRight, CreditCard, Sparkles, Activity, ShieldCheck, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin');
        }
    }, [user, navigate]);

    const announcements = [
        {
            id: 1,
            title: "Semester Exams Schedule Release",
            date: "Jan 24, 2026",
            description: "The tentative schedule for the upcoming semester end examinations has been published on the student portal.",
            tag: "Academics"
        },
        {
            id: 2,
            title: "Campus Recruitment Drive: Tech Giants",
            date: "Feb 05, 2026",
            description: "Top tech companies will be visiting the campus for recruitment. Register by Jan 30th.",
            tag: "Placement"
        },
        {
            id: 3,
            title: "Inter-Collegiate Sports Meet",
            date: "Feb 12, 2026",
            description: "Annual sports meet registration is open. Check the physical education department notice board.",
            tag: "Sports"
        }
    ];

    const quickLinks = [
        {
            title: "Fee Payment",
            description: "Tuition & Exam Fees",
            icon: CreditCard,
            link: "https://student.yenepoya.edu.in/",
            color: "text-red-500 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-500/10",
            border: "border-red-100 dark:border-red-500/20",
            hoverBg: "group-hover:bg-red-500/5",
            isExternal: true
        },
        {
            title: "Merchandise",
            description: "Uniforms & Gear",
            icon: ShoppingBag,
            link: "/products",
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-50 dark:bg-green-500/10",
            border: "border-green-100 dark:border-green-500/20",
            hoverBg: "group-hover:bg-green-500/5"
        },
        {
            title: "Documents",
            description: "Certificates & Letters",
            icon: FileText,
            link: "/request-document",
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-500/10",
            border: "border-blue-100 dark:border-blue-500/20",
            hoverBg: "group-hover:bg-blue-500/5"
        },
        {
            title: "My Profile",
            description: "Academic Records",
            icon: User,
            link: "/profile",
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-50 dark:bg-purple-500/10",
            border: "border-purple-100 dark:border-purple-500/20",
            hoverBg: "group-hover:bg-purple-500/5"
        }
    ];

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-[#030712] transition-colors duration-300 text-gray-900 dark:text-slate-300 font-sans selection:bg-blue-500/30">
            <div className="w-full px-4 md:px-8 pb-6 pt-20">

                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-gray-500 dark:text-slate-500 uppercase tracking-widest">Portal / Home</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-100 dark:border-blue-500/20">
                                <Activity className="text-blue-600 dark:text-blue-500" size={20} />
                            </div>
                            Student Dashboard
                        </h1>
                    </div>

                    {/* Header Stats Widget */}
                    <div className="flex items-center gap-8 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg px-6 py-3 mt-4 md:mt-0 shadow-sm">
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-0.5">Current Term</div>
                            <div className="text-lg font-mono font-bold text-gray-900 dark:text-white leading-none">Spring '26</div>
                        </div>
                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-800"></div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-0.5">Status</div>
                            <div className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 leading-none">Active</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-6 lg:space-y-8">

                        {/* Welcome Card */}
                        <div className="relative bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-6 md:p-8 overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 p-32 bg-blue-50 dark:bg-blue-500/5 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>

                            <div className="relative z-10">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
                                    <ShieldCheck size={12} /> Secure Session
                                </span>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    Welcome back, <span className="text-blue-600 dark:text-blue-500">{user?.name?.split(' ')[0]}</span>
                                </h2>
                                <p className="text-gray-500 dark:text-slate-400 max-w-lg mb-6 text-sm">
                                    Access your academic records, fee portals, and campus services from your centralized command center.
                                </p>

                                <div className="flex gap-3">
                                    <Link to="/products" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 transition-all flex items-center gap-2">
                                        <ShoppingBag size={16} /> Store Access
                                    </Link>
                                    <a href="https://student.yenepoya.edu.in/" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm font-bold rounded-lg border border-gray-200 dark:border-gray-700 transition-all flex items-center gap-2">
                                        <CreditCard size={16} /> Pay Fees
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Quick Access Grid */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <ExternalLink size={12} /> Quick Actions
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {quickLinks.map((link, idx) => {
                                    const Card = (
                                        <div className={`h-full group bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-500/30 active:scale-[0.98] rounded-xl p-5 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-md`}>
                                            <div className={`absolute top-0 right-0 p-16 ${link.bg} rounded-full blur-2xl -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                                            <div className="relative z-10 flex items-start justify-between mb-4">
                                                <div className={`p-3 rounded-lg ${link.bg} ${link.border} border ${link.color}`}>
                                                    <link.icon size={20} />
                                                </div>
                                                <ArrowRight size={16} className="text-gray-400 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
                                            </div>

                                            <div className="relative z-10">
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{link.title}</h4>
                                                <p className="text-xs text-gray-500 dark:text-slate-500 mt-1 font-mono">{link.description}</p>
                                            </div>
                                        </div>
                                    );

                                    return link.isExternal ? (
                                        <a key={idx} href={link.link} target="_blank" rel="noopener noreferrer" className="block h-full">{Card}</a>
                                    ) : (
                                        <Link key={idx} to={link.link} className="block h-full">{Card}</Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Announcements Feed */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden h-full max-h-[600px] flex flex-col shadow-sm">
                            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
                                <h3 className="text-xs font-bold text-gray-700 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <Bell size={14} className="text-red-500" /> System Broadcasts
                                </h3>
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {announcements.map((item, idx) => (
                                        <div key={item.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 font-mono">{item.date}</span>
                                                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-gray-700">
                                                    {item.tag}
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white transition-colors leading-snug mb-2">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-slate-500 leading-relaxed line-clamp-3">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
                                <button className="w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                    <Clock size={12} /> View Archive
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Incomplete Profile Warning Modal */}
            <AnimatePresence>
                {(!user.registerNumber || !user.campusId) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white dark:bg-[#111827] border border-amber-200 dark:border-amber-500/20 rounded-xl max-w-md w-full shadow-2xl overflow-hidden"
                        >
                            <div className="bg-amber-50 dark:bg-amber-500/10 px-6 py-4 border-b border-amber-100 dark:border-amber-500/20 flex items-center gap-3">
                                <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-full text-amber-600 dark:text-amber-500">
                                    <ShieldCheck size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Action Required</h3>
                            </div>

                            <div className="p-6">
                                <p className="text-sm text-gray-600 dark:text-slate-300 mb-6 leading-relaxed">
                                    Welcome to the Student Portal! Before you can request documents or order merchandise, you must complete your academic profile details.
                                </p>

                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-500/20 rounded-lg p-4 mb-6">
                                    <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">Missing Information</h4>
                                    <ul className="text-xs text-amber-600 dark:text-amber-500/80 space-y-1 font-mono list-disc list-inside">
                                        {!user.registerNumber && <li>Register Number</li>}
                                        {!user.campusId && <li>Campus ID Card No</li>}
                                    </ul>
                                </div>

                                <Link
                                    to="/profile"
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold uppercase tracking-widest shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 flex items-center justify-center gap-2 transition-all"
                                >
                                    <User size={16} /> Complete Profile Now
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
