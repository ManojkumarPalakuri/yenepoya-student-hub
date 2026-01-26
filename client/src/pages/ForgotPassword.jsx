import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, CheckCircle, KeyRound } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
            setSuccess('OTP sent to your email.');
            setStep(2);
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

        try {
            await axios.post('http://localhost:5001/api/auth/reset-password', { email, otp, password });
            setSuccess('Password reset successfully! Redirecting...');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen overflow-hidden w-full flex items-center justify-center bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4">
            <div className="w-full max-w-[400px] bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 p-8 md:p-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 mb-4">
                        <KeyRound size={24} />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Reset Password</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        {step === 1 ? "Enter your email to receive a recovery code." : "Enter the code and your new password."}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium text-center">
                        {success}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOTP} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">University Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent border border-gray-200 dark:border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all"
                                    placeholder="id@yenepoya.edu.in"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 font-bold py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <>Send Code <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">OTP Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                className="w-full bg-transparent border border-gray-200 dark:border-zinc-800 rounded-lg py-3 text-center text-xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all"
                                placeholder="••••••"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent border border-gray-200 dark:border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all"
                                    placeholder="Min 6 chars"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-yen-primary hover:bg-red-700 text-white font-bold py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <>Reset Password <CheckCircle className="w-4 h-4" /></>}
                        </button>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800 text-center">
                    <button onClick={() => navigate('/login')} className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium">
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
