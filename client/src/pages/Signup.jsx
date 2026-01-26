import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, User, Lock, ArrowRight, Loader2, Command, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
            const res = await axios.post(`${apiUrl}/api/auth/register`, { name, email, password }, { withCredentials: true });
            navigate('/verify-email', { state: { email } });
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-[#030712] text-gray-900 dark:text-slate-300 transition-colors duration-500 ease-in-out p-4 relative overflow-hidden">

            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#111827] transition-colors text-gray-500 dark:text-slate-500 z-50 mr-4 mt-2"
                aria-label="Toggle Theme"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="w-full max-w-[400px] bg-white dark:bg-[#111827] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 md:p-10 relative z-10">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20">
                            <Command size={24} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Create Account</h2>
                    <p className="text-gray-500 dark:text-slate-500 text-sm mt-2">Join the central student command portal.</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0B1220] border border-gray-200 dark:border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600"
                                placeholder="Jane Doe"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider">University Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0B1220] border border-gray-200 dark:border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600"
                                placeholder="id@yenepoya.edu.in"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0B1220] border border-gray-200 dark:border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg text-sm uppercase tracking-widest shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <>Sign Up <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
                    <p className="text-sm text-gray-500 dark:text-slate-500">
                        Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 font-bold">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
