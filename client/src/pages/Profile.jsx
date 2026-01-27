import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Save, BadgeCheck, Shield, Mail, Hash, Building, GraduationCap, MapPin, Briefcase, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, logout, checkUserLoggedIn } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        registerNumber: '',
        campusId: '',
        batchYear: '',
        classSection: '',
        floorBuilding: '',
        adviserName: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                registerNumber: user.registerNumber || '',
                campusId: user.campusId || '',
                batchYear: user.batchYear || '',
                classSection: user.classSection || '',
                floorBuilding: user.floorBuilding || '',
                adviserName: user.adviserName || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const apiUrl = API_URL;
            await axios.put(`${apiUrl}/api/auth/profile`, formData, { withCredentials: true });
            await checkUserLoggedIn(); // Refresh user context
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(`Failed to update profile: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        toast.custom((t) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white dark:bg-[#1f2937] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Log out confirmation
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Are you sure you want to log out?
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex border-l border-gray-200 dark:border-gray-700">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const logoutPromise = async () => {
                                await logout();
                                navigate('/login');
                            };
                            toast.promise(logoutPromise(), {
                                loading: 'Signing out...',
                                success: 'Logged out successfully',
                                error: 'Failed to sign out'
                            });
                        }}
                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Logout
                    </button>
                </div>
                <div className="flex border-l border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: 5000 });
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-[#030712] text-gray-900 dark:text-slate-300 font-sans selection:bg-blue-500/30 pt-20">
            <div className="max-w-4xl mx-auto px-6 md:px-8 pb-6 pt-2">

                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-1 text-xs font-mono text-gray-500 dark:text-slate-500 uppercase tracking-widest hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                <ArrowLeft size={12} /> Back
                            </button>
                            <span className="text-gray-300 dark:text-gray-700">/</span>
                            <span className="text-xs font-mono text-gray-500 dark:text-slate-500 uppercase tracking-widest">Portal / Profile</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg border border-purple-200 dark:border-purple-500/20">
                                <User className="text-purple-600 dark:text-purple-500" size={20} />
                            </div>
                            Student Profile
                        </h1>
                    </div>

                    <div className="flex items-center gap-8 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg px-6 py-3 mt-4 md:mt-0 shadow-sm">
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-0.5">Role</div>
                            <div className="text-lg font-mono font-bold text-gray-900 dark:text-white leading-none capitalize">{user?.role || 'Student'}</div>
                        </div>
                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-800"></div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-0.5">Status</div>
                            <div className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 leading-none">Active</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Avatar & Quick Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-100 to-white dark:from-gray-800 dark:to-[#111827]"></div>

                            <div className="relative z-10">
                                <div className="w-24 h-24 mx-auto bg-gray-50 dark:bg-gray-900 rounded-full border-4 border-white dark:border-[#111827] flex items-center justify-center text-3xl font-bold text-white shadow-xl mb-4">
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                        {user?.name?.charAt(0)}
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                                <p className="text-sm text-gray-500 dark:text-slate-500 flex items-center justify-center gap-2 mt-1">
                                    <Mail size={12} /> {user?.email}
                                </p>

                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-center">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                                        <BadgeCheck size={12} /> Verified Identity
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                            <h3 className="text-xs font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest mb-4">Account Actions</h3>
                            <button
                                onClick={handleLogout}
                                className="w-full py-2.5 rounded-lg border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                            >
                                <LogOut size={14} /> Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Edit Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <Shield size={14} className="text-blue-600 dark:text-blue-500" /> Academic Details
                                </h3>
                                {!isEditing ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="text-xs font-bold text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors uppercase"
                                    >
                                        Edit Details
                                    </button>
                                ) : (
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="text-xs font-bold text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white transition-colors uppercase"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="text-xs font-bold text-emerald-600 dark:text-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors uppercase flex items-center gap-1"
                                        >
                                            <Save size={12} /> Save
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Register Number */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                        <Hash size={10} /> Register Number
                                    </label>
                                    <input
                                        type="text"
                                        name="registerNumber"
                                        value={formData.registerNumber}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full bg-gray-50 dark:bg-[#030712] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white font-mono focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                                        placeholder="Enter Reg No"
                                    />
                                </div>

                                {/* Campus ID */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                        <BadgeCheck size={10} /> Campus ID
                                    </label>
                                    <input
                                        type="text"
                                        name="campusId"
                                        value={formData.campusId}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full bg-gray-50 dark:bg-[#030712] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white font-mono focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                                        placeholder="Enter Campus ID"
                                    />
                                </div>

                                {/* Class & Section */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                        <Building size={10} /> Class & Section
                                    </label>
                                    <input
                                        type="text"
                                        name="classSection"
                                        value={formData.classSection}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full bg-gray-50 dark:bg-[#030712] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white font-mono focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                                        placeholder="e.g. 5A CSE"
                                    />
                                </div>

                                {/* Batch Year */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                        <GraduationCap size={10} /> Batch Year
                                    </label>
                                    <input
                                        type="text"
                                        name="batchYear"
                                        value={formData.batchYear}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full bg-gray-50 dark:bg-[#030712] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white font-mono focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                                        placeholder="e.g. 2023-2027"
                                    />
                                </div>

                                {/* Location */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                        <MapPin size={10} /> Delivery Location
                                    </label>
                                    <input
                                        type="text"
                                        name="floorBuilding"
                                        value={formData.floorBuilding}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full bg-gray-50 dark:bg-[#030712] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white font-mono focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                                        placeholder="Block / Floor / Room"
                                    />
                                </div>

                                {/* Adviser */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                        <Briefcase size={10} /> Class Adviser
                                    </label>
                                    <input
                                        type="text"
                                        name="adviserName"
                                        value={formData.adviserName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full bg-gray-50 dark:bg-[#030712] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white font-mono focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                                        placeholder="Adviser Full Name"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
