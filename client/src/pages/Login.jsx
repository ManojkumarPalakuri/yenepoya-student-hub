import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
    Mail,
    ArrowRight,
    Loader2,
    Moon,
    Sun,
    Lock,
    User,
    Book,
    Ticket,
    FileText,
    CheckCircle2,
    Command,
    KeyRound,
    ChevronLeft,
    ShoppingBag,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import axios from 'axios';

const Login = () => {
    // View state: 'login' | 'signup' | 'forgot-password' | 'reset-password'
    const [view, setView] = useState('login');
    const [direction, setDirection] = useState(1);

    // Mobile State
    const [showMobileLogin, setShowMobileLogin] = useState(false);

    // Auth context and navigation
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Status states
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // --- View Switcher Helper ---
    const switchView = (newView, dir = 1) => {
        setDirection(dir);
        setError('');
        setSuccess('');
        setView(newView);
    };

    // --- Handlers ---

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const res = await axios.post(`${apiUrl}/api/auth/login`, { email, password }, { withCredentials: true, timeout: 15000 });

            await login(res.data);

            if (res.data.role && res.data.role.toLowerCase() === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }

        } catch (err) {
            console.error('Login Error:', err);
            setError(err.response?.data?.message || 'Login failed. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!email.toLowerCase().endsWith('@yenepoya.edu.in')) {
            setError('Access Restricted: Only @yenepoya.edu.in emails allowed.');
            setIsLoading(false);
            return;
        }

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const res = await axios.post(`${apiUrl}/api/auth/register`, { name, email, password }, { withCredentials: true, timeout: 15000 });
            navigate('/verify-email', { state: { email } });
        } catch (err) {
            console.error('Signup Error:', err);
            setError(err.response?.data?.message || 'Signup failed. Try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            await axios.post(`${apiUrl}/api/auth/forgot-password`, { email }, { withCredentials: true, timeout: 15000 });
            setSuccess('OTP sent to your email.');
            switchView('reset-password', 1);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Check email.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            await axios.post(`${apiUrl}/api/auth/reset-password`, { email, otp, password: newPassword }, { withCredentials: true });
            setSuccess('Password updated successfully!');
            setTimeout(() => {
                switchView('login', -1);
                setNewPassword('');
                setOtp('');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCardClick = () => {
        toast('Login required to continue', {
            icon: '🔒',
            style: {
                borderRadius: '10px',
                background: theme === 'dark' ? '#333' : '#fff',
                color: theme === 'dark' ? '#fff' : '#000',
            },
        });
    };

    const features = [
        {
            icon: Book,
            title: 'Campus Updates',
            description: 'Real-time notices & alerts',
            iconBg: 'bg-blue-600/20',
            iconColor: 'text-blue-400'
        },
        {
            icon: Ticket,
            title: 'Support Tickets',
            description: 'Fast-track issue resolution',
            iconBg: 'bg-purple-600/20',
            iconColor: 'text-purple-400'
        },
        {
            icon: FileText,
            title: 'Academic Tools',
            description: 'Resources at your fingertips',
            iconBg: 'bg-emerald-600/20',
            iconColor: 'text-emerald-400'
        }
    ];

    const mobileFeatures = [
        {
            icon: ShoppingBag,
            title: 'Store',
            description: 'Uniforms, ID card & tags',
            iconBg: 'bg-indigo-500/10',
            iconColor: 'text-indigo-500',
            borderColor: 'border-indigo-500/10'
        },
        {
            icon: Ticket,
            title: 'Support',
            description: 'Track requests & tickets',
            iconBg: 'bg-blue-500/10',
            iconColor: 'text-blue-500',
            borderColor: 'border-blue-500/10'
        },
        {
            icon: Book,
            title: 'Academics',
            description: 'My classes & resources',
            iconBg: 'bg-emerald-500/10',
            iconColor: 'text-emerald-500',
            borderColor: 'border-emerald-500/10'
        }
    ];

    // --- Animation Config ---
    const slideVariants = {
        enter: (dir) => ({
            x: dir > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (dir) => ({
            x: dir > 0 ? -50 : 50,
            opacity: 0
        })
    };

    // Mobile container variants
    const mobileContainerVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.3 } }
    };

    // Card hover variants
    const cardVariants = {
        tap: { scale: 0.98 }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300 overflow-x-hidden relative font-sans selection:bg-blue-500/20">

            {/* Theme Toggle (Visible on all screens) */}
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/5 transition-all text-slate-500 dark:text-slate-400 z-50 border border-slate-300 dark:border-white/10"
                aria-label="Toggle Theme"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Left Section - Hero (Desktop Only) */}
            <div className="hidden lg:flex relative w-1/2 flex-col justify-between p-16 bg-slate-50 dark:bg-[#0F172A] border-r border-slate-200 dark:border-white/5 overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Command size={22} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Yenepoya Student Hub</span>
                </div>

                <div className="relative z-10 space-y-6 max-w-2xl mt-12 mb-12">
                    <div className="space-y-4">
                        <h1 className="text-5xl xl:text-6xl font-bold leading-tight">
                            Your campus life,<br />
                            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                                streamlined
                            </span>{' '}
                            in one place.
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-lg">
                            Access official university updates, manage support tickets, and request documents with a single secure ID.
                        </p>
                    </div>

                    <div className="space-y-4 pt-4">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none"
                            >
                                <div className={`w-10 h-10 rounded-lg ${feature.iconBg} flex items-center justify-center shrink-0`}>
                                    <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[15px]">{feature.title}</h3>
                                    <p className="text-slate-500 text-sm">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-slate-500 text-xs font-medium">
                    © 2026 Yenepoya University • Official Portal
                </div>
            </div>

            {/* Mobile View - AnimatePresence to switch between Landing and Login */}
            <div className="lg:hidden w-full min-h-screen flex flex-col relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {!showMobileLogin ? (
                        // --- MOBILE LANDING VIEW ---
                        <motion.div
                            key="mobile-landing"
                            variants={mobileContainerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="flex-1 flex flex-col justify-between p-6 pt-10 safe-area-bottom"
                        >
                            <div className="flex-1 flex flex-col gap-8">
                                {/* Header */}
                                <div className="space-y-6">
                                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 ring-4 ring-blue-500/10">
                                        <Command size={28} className="text-white" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex flex-col">
                                            <h1 className="text-[34px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                                                Student Hub
                                            </h1>
                                            <p className="text-sm font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase opacity-90">Yenepoya University</p>
                                        </div>
                                        <p className="text-[17px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-[90%]">
                                            Order uniforms, request documents, and access campus support — all in one place.
                                        </p>
                                    </div>
                                </div>

                                {/* Interactive Features List */}
                                <div className="space-y-3">
                                    {mobileFeatures.map((feature, idx) => (
                                        <motion.div
                                            key={idx}
                                            variants={cardVariants}
                                            whileTap="tap"
                                            onClick={handleCardClick}
                                            className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/5 shadow-sm active:shadow-none active:bg-slate-50 dark:active:bg-white/[0.08] transition-all cursor-pointer relative overflow-hidden"
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-r ${feature.iconColor.replace('text', 'from')}/0 to-transparent opacity-0 group-active:opacity-10 transition-opacity`} />
                                            <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center shrink-0 border ${feature.borderColor} ${feature.iconColor}`}>
                                                <feature.icon size={22} className="stroke-[2.5px]" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-[15px] font-bold text-slate-900 dark:text-slate-100">{feature.title}</h4>
                                                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{feature.description}</p>
                                            </div>
                                            <div className="text-slate-300 dark:text-slate-600">
                                                <ChevronRight size={18} />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Section: CTA + Footer */}
                            <div className="mt-6 space-y-6">
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowMobileLogin(true)}
                                    className="w-full relative group overflow-hidden bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-white/5 flex items-center justify-center gap-3 text-[16px]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    <span>Sign in with University Email</span>
                                    <ArrowRight size={18} className="stroke-[2.5px]" />
                                </motion.button>

                                <div className="flex items-center justify-center px-2 pt-2 pb-2">
                                    <p className="text-[11px] font-medium text-slate-400 dark:text-slate-600">v2.0 • Secure Portal</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        // --- MOBILE LOGIN VIEW ---
                        <motion.div
                            key="mobile-login"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                            className="bg-white dark:bg-[#020617] min-h-screen flex flex-col relative z-20"
                        >
                            {/* Drag handle visual just for feel */}
                            <div className="w-full flex justify-center pt-3 pb-1">
                                <div className="w-12 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full" />
                            </div>

                            {/* Back Navigation */}
                            <div className="px-6 pt-4 pb-2 flex items-center justify-between">
                                <button
                                    onClick={() => setShowMobileLogin(false)}
                                    className="inline-flex items-center gap-2 text-[14px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                >
                                    <ChevronLeft size={18} />
                                    Back
                                </button>
                                <div className="text-[10px] font-black tracking-widest uppercase text-slate-300 dark:text-slate-700">
                                    Auth
                                </div>
                            </div>

                            {/* Card Container */}
                            <div className="flex-1 flex flex-col px-6 pt-6 pb-8 overflow-y-auto">
                                <div className="flex flex-col items-center mb-8">
                                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
                                        <Command size={24} className="text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Student Hub</h2>
                                    <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                        <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-500" />
                                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-wide">Secure Login</span>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <AnimatePresence mode="wait" custom={direction} initial={false}>
                                        {/* Mobile Login Form */}
                                        {view === 'login' && (
                                            <motion.div
                                                key="mobile-login-form"
                                                custom={direction}
                                                variants={slideVariants}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                                transition={{ duration: 0.3 }}
                                                className="space-y-6"
                                            >
                                                {error && <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-red-600 dark:text-red-400 text-xs font-medium text-center">{error}</div>}

                                                <form onSubmit={handleLogin} className="space-y-5">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">University Email</label>
                                                        <div className="relative group">
                                                            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-slate-200 dark:bg-white/10 group-focus-within:bg-blue-500 transition-colors" />
                                                            <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent border-0 border-b border-transparent py-3 pl-8 pr-4 text-base font-medium focus:ring-0 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 text-slate-900 dark:text-white" placeholder="id@yenepoya.edu.in" required />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <div className="flex justify-between items-center pl-1">
                                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                                                            <button type="button" onClick={() => switchView('forgot-password', 1)} className="text-[11px] font-bold text-blue-600 dark:text-blue-500">Forgot?</button>
                                                        </div>
                                                        <div className="relative group">
                                                            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-slate-200 dark:bg-white/10 group-focus-within:bg-blue-500 transition-colors" />
                                                            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent border-0 border-b border-transparent py-3 pl-8 pr-4 text-base font-medium focus:ring-0 transition-all text-slate-900 dark:text-white" placeholder="••••••••" required />
                                                        </div>
                                                    </div>
                                                    <button type="submit" disabled={isLoading} className="w-full mt-4 bg-blue-600 active:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-[15px] transition-transform active:scale-[0.98]">
                                                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign In"}
                                                    </button>
                                                </form>

                                                <div className="text-center">
                                                    <button onClick={() => switchView('signup', 1)} className="text-[14px] text-slate-500 font-medium">
                                                        New here? <span className="text-slate-900 dark:text-white font-bold underline decoration-slate-300 underline-offset-4">Create account</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Copying identical logic for Signup/Reset for mobile consistency... */}
                                        {/* For the sake of this task I am focusing key improvements on the Landing and Login view structure */}
                                        {view === 'signup' && (
                                            <motion.div key="mobile-signup" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-6">
                                                <div className="text-center"><h3 className="text-xl font-bold text-slate-900 dark:text-white">Create Account</h3></div>
                                                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-xs text-center">{error}</div>}
                                                <form onSubmit={handleSignup} className="space-y-4">
                                                    <div className="space-y-1"><label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm font-medium" placeholder="Jane Doe" required /></div>
                                                    <div className="space-y-1"><label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm font-medium" placeholder="id@yenepoya.edu.in" required /></div>
                                                    <div className="space-y-1"><label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm font-medium" placeholder="••••••••" required /></div>
                                                    <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg mt-2">{isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Create Account"}</button>
                                                </form>
                                                <div className="text-center"><button onClick={() => switchView('login', -1)} className="text-sm font-bold text-blue-600">Back to Login</button></div>
                                            </motion.div>
                                        )}
                                        {(view === 'forgot-password' || view === 'reset-password') && (
                                            <motion.div key="mobile-recover" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-6">
                                                <div className="text-center">
                                                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <KeyRound size={28} className="text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                        {view === 'forgot-password' ? 'Recover Password' : 'Reset Password'}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 mt-2 px-2">
                                                        {view === 'forgot-password'
                                                            ? 'Enter your email to receive a recovery code.'
                                                            : 'Enter the code sent to your email and your new password.'}
                                                    </p>
                                                </div>

                                                {error && <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-red-600 dark:text-red-400 text-xs font-medium text-center">{error}</div>}
                                                {success && <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-medium text-center">{success}</div>}

                                                <form onSubmit={view === 'forgot-password' ? handleSendOTP : handleResetPassword} className="space-y-5">
                                                    {view === 'forgot-password' ? (
                                                        <div className="space-y-1.5">
                                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email</label>
                                                            <div className="relative group">
                                                                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-slate-200 dark:bg-white/10 group-focus-within:bg-blue-500 transition-colors" />
                                                                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent border-0 border-b border-transparent py-3 pl-8 pr-4 text-base font-medium focus:ring-0 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 text-slate-900 dark:text-white" placeholder="id@yenepoya.edu.in" required />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="space-y-1.5">
                                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">OTP Code</label>
                                                                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-center text-lg font-bold tracking-[0.5em] text-slate-900 dark:text-white" placeholder="••••••" required />
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">New Password</label>
                                                                <div className="relative group">
                                                                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-slate-200 dark:bg-white/10 group-focus-within:bg-blue-500 transition-colors" />
                                                                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-transparent border-0 border-b border-transparent py-3 pl-8 pr-4 text-base font-medium focus:ring-0 transition-all text-slate-900 dark:text-white" placeholder="Min 6 chars" required />
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}

                                                    <button type="submit" disabled={isLoading} className="w-full mt-4 bg-blue-600 active:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-[15px] transition-transform active:scale-[0.98]">
                                                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (view === 'forgot-password' ? "Send Code" : "Reset Password")}
                                                    </button>
                                                </form>

                                                <div className="text-center">
                                                    <button onClick={() => switchView('login', -1)} className="text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                                                        Back to Login
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Right Section / Card Container (Desktop Only - lg:flex) */}
            <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-16">
                <div className="w-full max-w-md">
                    <div className="bg-white dark:bg-[#111827]/90 backdrop-blur-2xl border border-slate-200 dark:border-white/[0.08] lg:rounded-[32px] p-10 shadow-2xl relative overflow-hidden transition-all duration-300 min-h-[520px] flex flex-col justify-center">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                        <AnimatePresence mode="wait" custom={direction} initial={false}>
                            {view === 'login' && (
                                <motion.div key="desktop-login" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-6">
                                    <div className="text-center space-y-2"><h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Student Login</h2><p className="text-slate-600 dark:text-slate-400 text-sm">Enter your credentials to access the dashboard.</p></div>
                                    <div className="flex justify-center"><div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-600 dark:text-emerald-400 text-xs font-medium"><CheckCircle2 size={13} /> Only @yenepoya.edu.in allowed</div></div>
                                    {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">{error}</div>}
                                    <form onSubmit={handleLogin} className="space-y-6">
                                        <div className="space-y-2"><label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">University Email</label><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-400" placeholder="name@yenepoya.edu.in" required /></div></div>
                                        <div className="space-y-2"><div className="flex justify-between pl-1"><label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Password</label><button type="button" onClick={() => switchView('forgot-password', 1)} className="text-[11px] font-bold text-blue-500 hover:text-blue-400">Forgot?</button></div><div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all" placeholder="••••••••" required /></div></div>
                                        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2">{isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <><span className="hidden lg:inline">Continue</span><ArrowRight className="w-5 h-5" /></>}</button>
                                    </form>
                                    <div className="pt-4 text-center"><p className="text-sm text-slate-500">Don't have an account? <button onClick={() => switchView('signup', 1)} className="text-blue-500 font-bold hover:underline">Sign up</button></p></div>
                                </motion.div>
                            )}
                            {view === 'signup' && (
                                <motion.div key="desktop-signup" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-6">
                                    <div className="text-center space-y-2"><h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Create Account</h2><p className="text-slate-600 dark:text-slate-400 text-sm">Join the central student command portal.</p></div>
                                    <div className="flex justify-center"><div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-600 dark:text-emerald-400 text-xs font-medium"><CheckCircle2 size={13} /> Student verification required</div></div>
                                    {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">{error}</div>}
                                    <form onSubmit={handleSignup} className="space-y-5">
                                        <div className="space-y-2"><label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label><div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="Jane Doe" required /></div></div>
                                        <div className="space-y-2"><label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">University Email</label><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="id@yenepoya.edu.in" required /></div></div>
                                        <div className="space-y-2"><label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Password</label><div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="••••••••" required /></div></div>
                                        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2">{isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <><span className="hidden lg:inline">Create Account</span><ArrowRight className="w-5 h-5" /></>}</button>
                                    </form>
                                    <div className="pt-4 text-center"><p className="text-sm text-slate-500">Already have an account? <button onClick={() => switchView('login', -1)} className="text-blue-500 font-bold hover:underline">Sign in</button></p></div>
                                </motion.div>
                            )}
                            {(view === 'forgot-password' || view === 'reset-password') && (
                                <motion.div key="desktop-recover" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-6">
                                    <div className="text-center"><h2 className="text-3xl font-bold text-slate-900 dark:text-white">Recover Access</h2><p className="text-slate-600 dark:text-slate-400 text-sm mt-2">Enter email to recover account.</p></div>
                                    <form onSubmit={view === 'forgot-password' ? handleSendOTP : handleResetPassword} className="space-y-6">
                                        {view === 'forgot-password' ? (
                                            <div className="space-y-2"><label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email</label><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" required /></div></div>
                                        ) : (
                                            <div className="space-y-4">
                                                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full py-3 text-center text-xl font-bold tracking-[0.5em] rounded-xl border border-slate-200 dark:border-white/10 dark:bg-[#0B1220]" placeholder="OTP" required />
                                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full py-3 pl-4 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-[#0B1220]" placeholder="New Password" required />
                                            </div>
                                        )}
                                        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl">{isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Proceed"}</button>
                                    </form>
                                    <div className="pt-4 text-center"><button onClick={() => switchView('login', -1)} className="text-sm font-bold text-slate-500 hover:text-blue-500 flex items-center justify-center gap-1 mx-auto"><ChevronLeft size={16} /> Back to Login</button></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
