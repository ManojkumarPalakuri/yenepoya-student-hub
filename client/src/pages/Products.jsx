import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Search, ShoppingBag, Filter, X, Zap, Package, Tag, Layers, ArrowRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null); // For size modal
    const [selectedSize, setSelectedSize] = useState('');
    const [error, setError] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [showOrders, setShowOrders] = useState(false);
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5001/api/orders/myorders`, { withCredentials: true });
            setOrders(data);
            setShowOrders(true);
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Failed to load order history');
        }
    };

    const { addToCart, cartItems } = useCart();

    const categories = ['All', 'Uniform', 'Merchandise', 'Books', 'Accessories'];

    const getItemQuantity = (productId) => {
        return cartItems
            .filter(item => item._id === productId)
            .reduce((sum, item) => sum + item.quantity, 0);
    };

    const handleAddToCartClick = (product) => {
        const needsSize = product.category === 'Uniform' ||
            product.name.toLowerCase().includes('shirt') ||
            product.name.toLowerCase().includes('pant') ||
            product.name.toLowerCase().includes('shoe');

        if (needsSize) {
            setSelectedProduct(product);
            setSelectedSize(''); // Reset size
        } else {
            addToCart(product);
        }
    };

    const confirmAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        addToCart(selectedProduct, selectedSize);
        setSelectedProduct(null);
        setSelectedSize('');
    };

    const sizes = ['S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '44'];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5001/api/products?t=${Date.now()}`, { withCredentials: true });
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to load items');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = filterCategory === 'All'
        ? products
        : products.filter(p => p.category === filterCategory || (filterCategory === 'Merchandise' && !['Uniform', 'Books'].includes(p.category)));

    if (loading) return (
        <div className="flex flex-col justify-center items-center py-40 gap-3 min-h-screen bg-gray-50 dark:bg-[#030712]">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-xs font-mono text-gray-500 dark:text-slate-500">LOADING_INVENTORY...</div>
        </div>
    );

    if (error) return (
        <div className="p-8 text-center text-xs font-mono text-red-500 bg-red-50 border border-red-200 rounded-lg mx-8 mt-8">
            SYSTEM_ERROR: {error}
        </div>
    );



    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-[#030712] text-gray-900 dark:text-slate-300 font-sans selection:bg-blue-500/30 pt-20">
            <div className="w-full px-4 md:px-8 pb-6 pt-2">

                {/* Header Row - Admin Style */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-gray-500 dark:text-slate-500 uppercase tracking-widest">Portal / Store</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg border border-purple-100 dark:border-purple-500/20">
                                <ShoppingBag className="text-purple-600 dark:text-purple-500" size={20} />
                            </div>
                            Merchandise Store
                        </h1>
                    </div>

                    {/* Header Stats - Compact Widget */}
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <button
                            onClick={fetchOrders}
                            className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm hover:border-blue-300 dark:hover:border-blue-500/30 transition-all group"
                        >
                            <div className="p-1 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20">
                                <Package size={14} />
                            </div>
                            <div className="text-left">
                                <div className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider leading-none mb-0.5">My Orders</div>
                                <div className="text-xs font-bold text-gray-900 dark:text-white leading-none">View Status</div>
                            </div>
                        </button>

                        <div className="hidden md:flex items-center gap-8 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg px-6 py-3 shadow-sm">
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-0.5">Total Items</div>
                                <div className="text-lg font-mono font-bold text-gray-900 dark:text-white leading-none">{products.length}</div>
                            </div>
                            <div className="w-px h-8 bg-gray-200 dark:bg-gray-800"></div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-0.5">Avail. Categories</div>
                                <div className="text-lg font-mono font-bold text-gray-900 dark:text-white leading-none">{categories.length - 1}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs - Admin Style */}
                <div className="flex items-center gap-1 mb-6 md:mb-8 border-b border-gray-200 dark:border-gray-800 overflow-x-auto custom-scrollbar pb-1">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all border-b-2 whitespace-nowrap ${filterCategory === cat
                                ? 'text-gray-900 dark:text-white border-blue-500 bg-blue-50 dark:bg-blue-500/5'
                                : 'text-gray-500 dark:text-slate-500 border-transparent hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredProducts.map(product => {
                            const quantity = getItemQuantity(product._id);
                            return (
                                <motion.div
                                    layout
                                    key={product._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="group flex flex-col bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    {/* Image Area */}
                                    <div className="relative h-48 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                                        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" /> {/* Placeholder */}
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-white/90 dark:bg-[#030712]/90 text-gray-900 dark:text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                                {product.name}
                                            </h3>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-slate-500 line-clamp-2 mb-4 font-medium h-8">
                                            {product.description}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <div className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                                                ₹{product.price}
                                            </div>

                                            <button
                                                onClick={() => handleAddToCartClick(product)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${quantity > 0
                                                    ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20 hover:bg-green-100 dark:hover:bg-green-500/20'
                                                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                                                    }`}
                                            >
                                                {quantity > 0 ? (
                                                    <><CheckCircle size={12} /> Added ({quantity})</>
                                                ) : (
                                                    <><ShoppingBag size={12} /> Add</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-transparent">
                        <Package className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-700 mb-4" />
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">No Inventory Found</h3>
                        <p className="text-xs text-gray-500 dark:text-slate-600 mt-1">Try adjusting your category filter.</p>
                    </div>
                )}
            </div>

            {/* Size Selection Modal - Admin Syntax */}
            <AnimatePresence>
                {selectedProduct && (
                    <div
                        className="fixed inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
                        onClick={() => setSelectedProduct(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl"
                        >
                            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <Tag size={14} className="text-blue-600 dark:text-blue-500" /> Select Size Configuration
                                </h3>
                                <button onClick={() => setSelectedProduct(null)} className="text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
                                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-md overflow-hidden">
                                        <img src={selectedProduct.imageUrl} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{selectedProduct.name}</h4>
                                        <p className="text-xs font-mono text-blue-600 dark:text-blue-400">UNIT_PRICE: ₹{selectedProduct.price}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-2 mb-6">
                                    {sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-2 rounded-md text-xs font-bold font-mono transition-all border ${selectedSize === size
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-slate-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={confirmAddToCart}
                                    disabled={!selectedSize}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={14} /> Confirm Selection
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Order History Sidebar */}
            <AnimatePresence>
                {showOrders && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                            onClick={() => setShowOrders(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#030712] border-l border-gray-200 dark:border-gray-800 z-[101] overflow-hidden flex flex-col shadow-2xl"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111827]">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Order History</h2>
                                    <p className="text-xs text-gray-500 dark:text-slate-500 font-mono mt-1">
                                        Total Orders: {orders.length}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowOrders(false)}
                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 dark:text-slate-500"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {orders.length === 0 ? (
                                    <div className="text-center py-20">
                                        <Package size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                                        <p className="text-sm text-gray-500 dark:text-slate-500 font-bold uppercase">No orders yet</p>
                                    </div>
                                ) : (
                                    orders.map(order => (
                                        <div key={order._id} className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm hover:border-blue-300 dark:hover:border-blue-500/30 transition-all">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <span className="text-[10px] font-mono text-gray-400 dark:text-slate-600 uppercase">ORDER ID</span>
                                                    <p className="text-xs font-bold text-gray-900 dark:text-white font-mono leading-tight">#{order._id.slice(-6).toUpperCase()}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${order.status === 'Completed' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20' :
                                                    order.status === 'Cancelled' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' :
                                                        'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>

                                            <div className="space-y-2 mb-4 border-t border-dashed border-gray-100 dark:border-gray-800 pt-3">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-xs text-gray-600 dark:text-slate-400">
                                                        <span>{item.quantity}x {item.name} {item.size && `(${item.size})`}</span>
                                                        <span className="font-mono">₹{item.price * item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-800">
                                                <span className="text-xs text-gray-400 dark:text-slate-600 font-mono">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                                                    Total: ₹{order.totalAmount}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Products;
