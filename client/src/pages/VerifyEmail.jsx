import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth(); // We might use this to auto-login after verify, or just redirect to login

    // Default email from signup redirect, or empty
    const [email, setEmail] = useState(location.state?.email || '');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await axios.post(`${API_URL}/api/auth/verify-otp`, { email, otp }, { withCredentials: true });
            setSuccess('Account verified! Logging you in...');

            // Auto login logic: Since the backend returns a token on verification, we can technically use it.
            // But for now, let's redirect to login to keep it simple and standardized, OR update AuthContext (better).
            // Let's redirect to login for clarity:
            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Invalid OTP.');
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen overflow-hidden w-full flex items-center justify-center bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4">
            <div className="w-full max-w-[400px] bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 p-8 md:p-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                        <CheckCircle size={24} />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Verify Email</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        Enter the 6-digit code sent to <br /><span className="font-semibold text-zinc-800 dark:text-zinc-200">{email}</span>
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

                <form onSubmit={handleVerify} className="space-y-5">
                    {!location.state?.email && (
                        <div>
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent border border-gray-200 dark:border-zinc-800 rounded-lg p-3 text-sm" required />
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">OTP Code</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            className="w-full bg-transparent border border-gray-200 dark:border-zinc-800 rounded-lg py-3 text-center text-2xl font-bold tracking-[1em] focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                            placeholder="••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 font-bold py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <>Verify Account <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyEmail;
