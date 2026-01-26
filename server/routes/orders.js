const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

// ... (code omitted for brevity, focusing on the replace)

// In calls:
// sendEmail({ to: process.env.SMTP_EMAIL, subject: `New Order Received - ${createdOrder._id}`, html: emailContent });
// sendEmail({ to: order.user.email, subject: `Order Update: #${order._id} - ${status}`, html: emailContent });

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
    const { items, totalAmount } = req.body;

    if (items && items.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    try {
        const studentDetails = {
            name: req.user.name,
            registerNumber: req.user.registerNumber,
            batchYear: req.user.batchYear,
            classSection: req.user.classSection,
            floorBuilding: req.user.floorBuilding
        };

        const order = new Order({
            user: req.user._id,
            items,
            totalAmount,
            studentDetails,
            status: 'Pending'
        });

        const createdOrder = await order.save();

        const emailContent = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #2563eb;">New Merchandise Order Received</h2>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0;">Student Profile</h3>
                    <p><strong>Name:</strong> ${req.user.name}</p>
                    <p><strong>Email:</strong> ${req.user.email}</p>
                    <p><strong>Register No:</strong> ${req.user.registerNumber || 'N/A'}</p>
                    <p><strong>Campus ID:</strong> ${req.user.campusId || 'N/A'}</p>
                    <p><strong>Batch:</strong> ${req.user.batchYear || 'N/A'}</p>
                    <p><strong>Class/Section:</strong> ${req.user.classSection || 'N/A'}</p>
                    <p><strong>Floor/Building:</strong> ${req.user.floorBuilding || 'N/A'}</p>
                </div>
                
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> ${createdOrder._id}</p>
                <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
                
                <h4>Items Ordered:</h4>
                <ul>
                    ${items.map(item => `<li>${item.name} x ${item.quantity} - <strong>₹${item.price * item.quantity}</strong></li>`).join('')}
                </ul>
                <p>We will notify you when your order is ready.</p>
            </div>
        `;

        // Send Email
        try {
            sendEmail({
                to: process.env.SMTP_EMAIL,
                subject: `New Order Received - ${createdOrder._id}`,
                html: emailContent
            });
        } catch (emailErr) {
            console.error('Email failed', emailErr);
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email').sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
    const { status } = req.body;
    try {
        const order = await Order.findById(req.params.id).populate('user', 'email name');
        if (order) {
            order.status = status;
            const updatedOrder = await order.save();

            // Send Email Notification
            const emailContent = `
                <h3>Order Status Update</h3>
                <p>Hello ${order.user.name},</p>
                <p>Your order <strong>#${order._id}</strong> has been updated to:</p>
                <h2 style="color: ${status === 'Completed' ? 'green' : status === 'Cancelled' ? 'red' : 'blue'}">${status}</h2>
                <p>Total Amount: ₹${order.totalAmount}</p>
            `;
            try {
                sendEmail({
                    to: order.user.email,
                    subject: `Order Update: #${order._id} - ${status}`,
                    html: emailContent
                });
            } catch (err) {
                console.error('Email failed', err);
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
