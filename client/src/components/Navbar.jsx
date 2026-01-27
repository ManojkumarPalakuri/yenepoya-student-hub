import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LayoutDashboard, Moon, Sun, Menu, X, Command, Activity, Bell, LogOut, ChevronDown, Settings, FileText, ShoppingBag, PhoneCall, Package, Headphones, Info, CheckCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatTimeAgo } from '../utils/helpers';

import { API_URL } from '../config';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Notification State
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    // Fetch Notifications
    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const { data } = await axios.get(`${API_URL}/api/notifications`, { withCredentials: true });
            if (Array.isArray(data)) {
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.isRead).length);
            } else {
                setNotifications([]);
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotifications([]);
        }
    };

    const clearNotifications = async () => {
        setNotifications([]);
        setUnreadCount(0);


        try {
            const apiUrl = API_URL;
            await axios.delete(`${apiUrl}/api/notifications`, { withCredentials: true });
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault(); // Prevent form submission refresh
        if (!searchQuery.trim()) return;

        console.log("Navbar: Searching for:", searchQuery);

        setPlatformSearchLoading(true); // Start loading
        // Optionally clear old results
        setSearchResults([]);

        try {
            const apiUrl = API_URL;
            await axios.delete(`${apiUrl}/api/notifications`, { withCredentials: true });
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    const markAllRead = async () => {
        if (unreadCount === 0) return;
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        try {
            await axios.put(`${API_URL}/api/notifications/mark-all-read`, {}, { withCredentials: true });
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    // Poll for notifications
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [user]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            setMenuOpen(false);
            await logout();
            navigate('/login');
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout failed:', error);
            setIsLoggingOut(false);
        }
    };

    if (!user) return null;

    const isActive = (path) => location.pathname === path;
    const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const navLinks = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Store', path: '/products', icon: ShoppingBag },
        { name: 'Documents', path: '/request-document', icon: FileText },
        { name: 'Support', path: '/support', icon: PhoneCall },
        { name: 'Digital ID', path: '/digital-id', icon: Activity },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled
                    ? 'bg-white/90 dark:bg-[#030712]/90 backdrop-blur-md border-gray-200/50 dark:border-white/5'
                    : 'bg-white/50 dark:bg-[#030712]/50 backdrop-blur-sm border-gray-200/30 dark:border-white/5'
                    }`}
            >
                <div className="w-full px-4 md:px-8 h-16 flex items-center justify-between">

                    {/* LEFT: BRAND */}
                    <div className="flex items-center md:min-w-[200px]">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/20">
                                <Command size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-900 dark:text-white tracking-tight leading-none">YENEPOYA</span>
                                <span className="text-[10px] font-mono text-gray-500 dark:text-slate-500 uppercase tracking-widest leading-none mt-0.5">STUDENT HUB</span>
                            </div>
                        </Link>
                    </div>

                    {/* CENTER: DESKTOP NAVIGATION */}
                    <div className="hidden md:flex items-center justify-center flex-1">
                        <div className="flex items-center gap-1 bg-gray-100/50 dark:bg-white/5 p-1 rounded-full border border-gray-200/50 dark:border-white/5 backdrop-blur-md">
                            {navLinks.slice(0, 4).map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 relative overflow-hidden ${isActive(link.path)
                                        ? 'text-white shadow-lg shadow-blue-500/25'
                                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {isActive(link.path) && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-blue-600 rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{link.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: DESKTOP ACTIONS */}
                    <div className="hidden md:flex items-center justify-end gap-3 md:min-w-[200px]">
                        <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {/* Notifications */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => {
                                    setNotificationOpen(!notificationOpen);
                                    if (!notificationOpen) {
                                        fetchNotifications();
                                        markAllRead();
                                    }
                                }}
                                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all relative ${notificationOpen ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'}`}
                            >
                                <Bell size={18} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-[#030712]"></span>
                                )}
                            </button>

                            <AnimatePresence>
                                {notificationOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#030712] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl overflow-hidden py-1 z-50"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                                            <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Updates</p>
                                            <button onClick={clearNotifications} className="text-[10px] text-red-500 font-bold uppercase tracking-wider hover:underline">Clear All</button>
                                        </div>
                                        <div className="max-h-[320px] overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                                                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-2">
                                                        <Bell size={18} className="text-gray-400 dark:text-slate-600" />
                                                    </div>
                                                    <p className="text-xs font-bold text-gray-900 dark:text-white">All caught up!</p>
                                                    <p className="text-[10px] text-gray-500 dark:text-slate-500 mt-0.5">No new notifications to show</p>
                                                </div>
                                            ) : (
                                                notifications.map((item, idx) => {
                                                    const getStyle = (type) => {
                                                        const styles = {
                                                            Order: { icon: Package, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-100 dark:border-blue-500/20' },
                                                            Document: { icon: FileText, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10', border: 'border-purple-100 dark:border-purple-500/20' },
                                                            Support: { icon: Headphones, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-100 dark:border-amber-500/20' },
                                                            System: { icon: Info, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-500/10', border: 'border-gray-100 dark:border-gray-500/20' }
                                                        };
                                                        return styles[item.type] || styles.System;
                                                    };

                                                    const style = getStyle(item.type);
                                                    const Icon = style.icon;

                                                    return (
                                                        <div key={idx} className={`px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer ${!item.isRead ? 'bg-blue-50/30 dark:bg-blue-900/5' : ''}`}>
                                                            <div className="flex gap-3">
                                                                <div className={`mt-0.5 w-8 h-8 rounded-lg ${style.bg} ${style.border} border flex items-center justify-center flex-shrink-0`}>
                                                                    <Icon size={14} className={style.color} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex justify-between items-start gap-2">
                                                                        <p className={`text-xs font-bold ${!item.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-slate-300'}`}>{item.title}</p>
                                                                        <span className="text-[10px] text-gray-400 dark:text-slate-500 whitespace-nowrap">{formatTimeAgo(item.createdAt)}</span>
                                                                    </div>
                                                                    <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-tight mt-0.5 line-clamp-2">{item.message}</p>
                                                                </div>
                                                                {!item.isRead && (
                                                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 shadow-sm shadow-blue-500/50"></div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link to="/cart" className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors relative">
                            <ShoppingCart size={18} />
                            {cartItemCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white dark:ring-[#030712]">{cartItemCount}</span>}
                        </Link>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 pl-1 pr-3 py-1 border border-transparent hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all">
                                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=2563eb&color=fff`} alt="" className="w-7 h-7 rounded-full" />
                                <ChevronDown size={14} className="text-gray-500" />
                            </button>
                            <AnimatePresence>
                                {profileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#030712] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl overflow-hidden py-1 z-50"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                                            <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <div className="p-1">
                                            <Link to="/profile" className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"><User size={14} /> My Profile</Link>
                                            <Link to="/digital-id" className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"><Activity size={14} /> Digital ID</Link>
                                            <button
                                                onClick={handleLogout}
                                                disabled={isLoggingOut}
                                                className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoggingOut ? (
                                                    <><div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div> Signing out...</>
                                                ) : (
                                                    <><LogOut size={14} /> Sign Out</>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* MOBILE TRIGGER */}
                    <div className="md:hidden flex items-center gap-3">
                        <Link to="/cart" className="relative p-2 text-gray-500 dark:text-slate-400">
                            <ShoppingCart size={20} />
                            {cartItemCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>}
                        </Link>
                        <button onClick={() => setMenuOpen(true)} className="p-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10 rounded-lg">
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* SIDE DRAWER MENU (MOBILE ONLY) */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-80 max-w-[90%] bg-white dark:bg-[#0c0a09] border-l border-gray-200 dark:border-gray-800 shadow-2xl z-[70] flex flex-col md:hidden overflow-hidden"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">Student Navigation</p>
                                </div>
                                <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
                                    <X size={20} className="text-gray-500 dark:text-slate-400" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                                {/* Main Navigation Links */}
                                <div className="space-y-1">
                                    <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-600 mb-2">Navigation</p>
                                    {navLinks.map(link => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setMenuOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold transition-all ${isActive(link.path)
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                        >
                                            <link.icon size={18} />
                                            {link.name}
                                        </Link>
                                    ))}
                                    {user.role === 'admin' && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/10 dark:text-purple-400"
                                        >
                                            <LayoutDashboard size={18} /> Admin Dashboard
                                        </Link>
                                    )}
                                </div>

                                {/* Quick Actions */}
                                <div className="space-y-1">
                                    <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-600 mb-2">Activities</p>

                                    {/* Notifications Toggle */}
                                    <div className="px-3 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                                                <Bell size={16} /> Notifications
                                            </div>
                                            {unreadCount > 0 && (
                                                <span className="px-1.5 rounded-full bg-red-500 text-white text-[10px]">{unreadCount}</span>
                                            )}
                                        </div>
                                        {notifications.length > 0 ? (
                                            <div className="space-y-2 mt-2">
                                                {notifications.slice(0, 3).map((item, idx) => {
                                                    const getStyle = (type) => {
                                                        const styles = {
                                                            Order: { icon: Package, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-100 dark:border-blue-500/20' },
                                                            Document: { icon: FileText, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10', border: 'border-purple-100 dark:border-purple-500/20' },
                                                            Support: { icon: Headphones, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-100 dark:border-amber-500/20' },
                                                            System: { icon: Info, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-500/10', border: 'border-gray-100 dark:border-gray-500/20' }
                                                        };
                                                        return styles[type] || styles.System;
                                                    };
                                                    const style = getStyle(item.type);
                                                    const Icon = style.icon;

                                                    return (
                                                        <div key={idx} className="flex gap-3 p-2 bg-white dark:bg-black rounded-lg border border-gray-100 dark:border-gray-800">
                                                            <div className={`w-8 h-8 rounded-lg ${style.bg} ${style.border} border flex items-center justify-center flex-shrink-0`}>
                                                                <Icon size={14} className={style.color} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start gap-2">
                                                                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{item.title}</p>
                                                                    <span className="text-[9px] text-gray-400 whitespace-nowrap">{formatTimeAgo(item.createdAt)}</span>
                                                                </div>
                                                                <p className="text-[10px] text-gray-500 dark:text-slate-400 leading-tight mt-0.5 line-clamp-2">{item.message}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                <button onClick={clearNotifications} className="text-[10px] text-red-500 font-bold uppercase tracking-wider hover:underline w-full text-center mt-2">Clear All</button>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">No new notifications</p>
                                        )}
                                    </div>

                                    {/* Cart Button */}
                                    <Link
                                        to="/cart"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center justify-between px-3 py-3 rounded-lg text-sm font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5"
                                    >
                                        <div className="flex items-center gap-3">
                                            <ShoppingCart size={18} /> Cart
                                        </div>
                                        {cartItemCount > 0 && (
                                            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs">{cartItemCount}</span>
                                        )}
                                    </Link>
                                </div>
                            </div>

                            {/* Drawer Footer */}
                            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 space-y-2">
                                <button
                                    onClick={toggleTheme}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold text-gray-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10"
                                >
                                    <span className="flex items-center gap-3"><Moon size={16} /> Dark Mode</span>
                                    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                        <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </div>
                                </button>

                                <Link
                                    to="/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-gray-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10"
                                >
                                    <Settings size={16} /> Account Settings
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoggingOut ? (
                                        <><div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div> Signing out...</>
                                    ) : (
                                        <><LogOut size={16} /> Log Out</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
