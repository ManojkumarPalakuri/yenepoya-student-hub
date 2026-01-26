const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });

const app = express();
const PORT = process.env.PORT || 5000; // Default to 5000 if env missing
console.log('Current Working Directory:', process.cwd());
console.log('Using PORT:', PORT);

// Trust Proxy for Render/Vercel
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5001',
            process.env.FRONTEND_URL,
            'https://yenepoya-student-hub.vercel.app',
            'https://a-student-hub.vercel.app'
        ];

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost')) {
            return callback(null, true);
        }

        // callback(new Error('Not allowed by CORS')); // Un-comment for strict mode
        callback(null, true); // Keep permissive for now to prevent blocking
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Database Connection
console.log('Attempting to connect to MongoDB URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes (Placeholder)
app.get('/', (req, res) => {
    res.json({
        status: 'Online',
        service: 'Yenepoya Student Hub API',
        deployedAt: new Date().toISOString()
    });
});

// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const requestRoutes = require('./routes/requests');
const supportRoutes = require('./routes/support');
const notificationRoutes = require('./routes/notifications');
const cartRoutes = require('./routes/cart');

// Use Routes (Commented out until files exist)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/cart', cartRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
