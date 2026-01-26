import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Load cart from local storage on mount (optional, for persistence)
    useEffect(() => {
        const savedCart = localStorage.getItem('yen_cart');
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                setCartItems(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
                console.error('Failed to parse cart', e);
                setCartItems([]);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('yen_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, size = null) => {
        setCartItems(prev => {
            const existing = prev.find(item => item._id === product._id && item.selectedSize === size);
            if (existing) {
                return prev.map(item =>
                    (item._id === product._id && item.selectedSize === size) ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1, selectedSize: size }];
        });
    };

    const removeFromCart = (productId, size = null) => {
        setCartItems(prev => prev.filter(item => !(item._id === productId && item.selectedSize === size)));
    };

    const updateQuantity = (productId, quantity, size = null) => {
        if (quantity < 1) return;
        setCartItems(prev =>
            prev.map(item => (item._id === productId && item.selectedSize === size) ? { ...item, quantity } : item)
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
};
