import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, ArrowRight, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../config';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, total, clearCart } = useCart();
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate(); // Added navigate hook

    const handleCheckout = async () => {
        setSubmitting(true);
        try {
            const apiUrl = API_URL;
            await axios.post(`${apiUrl}/api/orders`, {
                items: cartItems.map(item => ({
                    product: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,

                    size: item.selectedSize
                })),
                totalAmount: total
            }, { withCredentials: true });
            clearCart();
            setShowSuccess(true);
        } catch (error) {
            console.error('Order failed:', error);

            // Handle Profile Gate
            if (error.response && error.response.status === 403 && error.response.data.code === 'PROFILE_INCOMPLETE') {
                const missing = error.response.data.missingFields.join(', ');
                if (confirm(`Please complete your profile first!\n\nMissing: ${missing}\n\nGo to Profile Settings now?`)) {
                    navigate('/profile');
                }
                return;
            }

            alert(error.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (cartItems.length === 0 && !showSuccess) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center text-gray-500 dark:text-slate-500 font-sans">
                <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-full mb-4">
                    <ShoppingBag size={32} className="text-gray-500 dark:text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Cart Empty</h2>
                <p className="text-xs text-gray-500 dark:text-slate-500 mb-6">No inventory items selected.</p>
                <Link to="/products" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20">
                    Browse Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-[#030712] text-gray-900 dark:text-slate-300 font-sans selection:bg-blue-500/30 pt-20 overflow-x-hidden">
            <div className="max-w-5xl mx-auto px-4 md:px-8 pb-6 pt-2">

                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 pb-4 md:pb-6 border-b border-gray-200 dark:border-gray-800">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-gray-500 dark:text-slate-500 uppercase tracking-widest">Portal / Checkout</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg border border-green-200 dark:border-green-500/20">
                                <ShoppingBag className="text-green-600 dark:text-green-500" size={20} />
                            </div>
                            Order Summary
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 md:gap-8 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg px-4 md:px-6 py-3 mt-4 md:mt-0 shadow-sm">
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-0.5">Total Items</div>
                            <div className="text-lg font-mono font-bold text-gray-900 dark:text-white leading-none">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</div>
                        </div>
                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-800"></div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-0.5">Order Total</div>
                            <div className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 leading-none">₹{total}</div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence mode='popLayout'>
                            {cartItems.map((item) => (
                                <motion.div
                                    key={`${item._id}-${item.selectedSize}`}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="group bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center gap-5 hover:border-gray-300 dark:hover:border-gray-700 transition-colors shadow-sm"
                                >
                                    {/* Image */}
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 flex-shrink-0">
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate pr-4">{item.name}</h3>
                                            <p className="font-mono text-sm font-bold text-gray-700 dark:text-slate-300">₹{item.price * item.quantity}</p>
                                        </div>

                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-slate-500 font-mono">
                                            <span>UNIT: ₹{item.price}</span>
                                            {item.selectedSize && (
                                                <>
                                                    <span className="w-1 h-1 bg-gray-400 dark:bg-gray-700 rounded-full"></span>
                                                    <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-gray-700">SIZE: {item.selectedSize}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1, item.selectedSize)}
                                                disabled={item.quantity <= 1}
                                                className="p-1.5 text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center text-xs font-mono font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1, item.selectedSize)}
                                                className="p-1.5 text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item._id, item.selectedSize)}
                                            className="p-2 text-gray-400 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                                            title="Remove Item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-4 md:p-6 sticky top-24 shadow-sm">
                            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                                <CreditCard size={16} className="text-blue-600 dark:text-blue-500" /> Payment Details
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400">
                                    <span>Subtotal</span>
                                    <span className="font-mono text-gray-800 dark:text-slate-200">₹{total}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400">
                                    <span>Processing Fee</span>
                                    <span className="font-mono text-gray-800 dark:text-slate-200">₹0.00</span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">Total</span>
                                    <span className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">₹{total}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={submitting}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    'Processing...'
                                ) : (
                                    <>Confirm Order <ArrowRight size={14} /></>
                                )}
                            </button>

                            <div className="mt-4 flex items-start gap-2 text-[10px] text-gray-500 dark:text-slate-500 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                                <Package size={14} className="flex-shrink-0 mt-0.5" />
                                <p>Payment will be collected upon delivery at the campus distribution center. Please present your Student ID.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-sm bg-white dark:bg-[#111827] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden p-8 text-center"
                        >
                            <div className="w-20 h-20 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                                >
                                    <Package size={40} className="text-green-600 dark:text-green-500" />
                                </motion.div>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h2>
                            <p className="text-sm text-gray-500 dark:text-slate-400 mb-8">
                                Your order has been placed successfully. You will receive an email confirmation shortly.
                            </p>

                            <Link
                                to="/"
                                className="block w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm uppercase tracking-wide hover:opacity-90 transition-opacity"
                            >
                                Back to Dashboard
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Cart;
