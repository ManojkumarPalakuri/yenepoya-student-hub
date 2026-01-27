const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const Notification = require('../models/Notification');

console.log('>>> Orders Route Loaded');

// Helper for title casing names
const titleCase = (str) => {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
    const { items, totalAmount } = req.body;
    try {
        // Validate items
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        // Check product availability
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.name} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }
        }

        const order = new Order({
            user: req.user._id,
            items,
            totalAmount,
            status: 'Pending',
            studentDetails: {
                name: req.user.name,
                registerNumber: req.user.registerNumber,
                email: req.user.email,
                campusId: req.user.campusId,
                classSection: req.user.classSection,
                floorBuilding: req.user.floorBuilding,
                batchYear: req.user.batchYear
            }
        });

        const createdOrder = await order.save();

        // Update product stock
        for (const item of items) {
            const product = await Product.findById(item.product);
            product.stock -= item.quantity;
            await product.save();
        }

        // Create notification for admin
        const itemNames = items.map(i => i.name).join(', ');
        await Notification.create({
            userId: req.user._id,
            type: 'Order',
            title: 'New Order Placed',
            message: `New order for ${itemNames} placed by ${req.user.name}`,
            link: '/admin/orders'
        });

        // Send Email Confirmation
        const formattedDate = new Date(createdOrder.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const emailContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Confirmation</title>
                <style>
                    body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
                    table { border-collapse: collapse; width: 100%; }
                    .wrapper { background-color: #f1f5f9; padding: 40px 0; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
                    .header { background-color: #2563eb; padding: 32px; text-align: center; }
                    .header-logo { color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; text-decoration: none; display: inline-block; }
                    .content { padding: 40px; }
                    .title { color: #1e293b; font-size: 24px; font-weight: 700; margin: 0 0 12px 0; text-align: center; }
                    .subtitle { color: #64748b; font-size: 16px; margin: 0 0 32px 0; text-align: center; line-height: 1.5; }
                    .info-row { text-align: center; margin-bottom: 32px; }
                    .order-pill { background-color: #f1f5f9; color: #475569; padding: 6px 16px; border-radius: 9999px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; font-weight: 600; display: inline-block; border: 1px solid #e2e8f0; }
                    .section-title { color: #1e293b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px 0; padding-bottom: 12px; border-bottom: 2px solid #f1f5f9; }
                    .details-table td { padding-bottom: 12px; font-size: 15px; vertical-align: top; }
                    .label { color: #64748b; width: 40%; font-weight: 500; }
                    .value { color: #334155; font-weight: 600; }
                    .summary-table th { text-align: left; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 600; padding-bottom: 12px; border-bottom: 2px solid #f1f5f9; }
                    .summary-table td { padding: 16px 0; border-bottom: 1px solid #f1f5f9; font-size: 15px; color: #334155; }
                    .summary-table td.meta { color: #94a3b8; font-size: 13px; margin-top: 4px; display: block; }
                    .total-section { margin-top: 24px; text-align: right; padding-top: 20px; border-top: 2px solid #f1f5f9; }
                    .total-label { color: #64748b; font-size: 14px; margin-right: 12px; font-weight: 600; }
                    .total-amount { color: #2563eb; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
                    .footer { background-color: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #e2e8f0; }
                    .footer-text { color: #94a3b8; font-size: 13px; line-height: 1.6; margin-bottom: 8px; }
                    .footer-link { color: #2563eb; text-decoration: none; font-weight: 600; }
                </style>
            </head>
            <body>
                <table class="wrapper" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center">
                            <table class="container" width="600" cellpadding="0" cellspacing="0">
                                <!-- Header -->
                                <tr>
                                    <td class="header">
                                        <div class="header-logo">YENEPOYA STUDENT HUB</div>
                                    </td>
                                </tr>
                                <!-- Content -->
                                <tr>
                                    <td class="content">
                                        <h1 class="title">Order Confirmed</h1>
                                        <p class="subtitle">Thank you for your purchase, ${titleCase(req.user.name)}.</p>
                                        
                                        <div class="info-row">
                                            <span class="order-pill">#${createdOrder._id.toString().slice(-8).toUpperCase()}</span>
                                            <div style="color: #94a3b8; font-size: 13px; margin-top: 8px;">${formattedDate}</div>
                                        </div>

                                        <!-- Student Details -->
                                        <div style="margin-bottom: 32px;">
                                            <div class="section-title">Student Details</div>
                                            <table class="details-table" width="100%">
                                                <tr><td class="label">Name</td><td class="value">${titleCase(req.user.name)}</td></tr>
                                                <tr><td class="label">Register No</td><td class="value">${req.user.registerNumber || '-'}</td></tr>
                                                <tr><td class="label">Campus ID</td><td class="value">${req.user.campusId || '-'}</td></tr>
                                                <tr><td class="label">Location</td><td class="value">${req.user.floorBuilding || '-'}</td></tr>
                                            </table>
                                        </div>

                                        <!-- Order Summary -->
                                        <div>
                                            <div class="section-title">Order Summary</div>
                                            <table class="summary-table" width="100%" cellpadding="0" cellspacing="0">
                                                <thead>
                                                    <tr>
                                                        <th width="60%">Item</th>
                                                        <th width="15%" style="text-align: center;">Qty</th>
                                                        <th width="25%" style="text-align: right;">Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${items.map(item => `
                                                    <tr>
                                                        <td>
                                                            <div style="font-weight: 600;">${item.name}</div>
                                                            ${item.size ? `<span class="meta">Size: ${item.size}</span>` : ''}
                                                        </td>
                                                        <td style="text-align: center; color: #64748b;">${item.quantity}</td>
                                                        <td style="text-align: right; font-weight: 600;">₹${item.price * item.quantity}</td>
                                                    </tr>
                                                    `).join('')}
                                                </tbody>
                                            </table>
                                            
                                            <div class="total-section">
                                                <span class="total-label">Total Amount</span>
                                                <span class="total-amount">₹${totalAmount}</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <!-- Footer -->
                                <tr>
                                    <td class="footer">
                                        <div class="footer-text">Questions? Contact <a href="mailto:studentsupport@yenepoya.edu.in" class="footer-link">Support</a></div>
                                        <div class="footer-text">© ${new Date().getFullYear()} Yenepoya Student Hub</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        await sendEmail({
            to: req.user.email,
            subject: 'Order Confirmation',
            html: emailContent
        });

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/orders
// @desc    Get user orders
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/orders/all
// @desc    Get all orders (Admin)
// @access  Private/Admin
router.get('/all', protect, admin, async (req, res) => {
    try {
        let orders = await Order.find({})
            .populate('user', 'id name email')
            .lean(); // Convert to plain JS objects for sorting

        const statusPriority = {
            'Pending': 1,
            'Processing': 2,
            'Completed': 3,
            'Cancelled': 4
        };

        orders.sort((a, b) => {
            const priorityA = statusPriority[a.status] || 99;
            const priorityB = statusPriority[b.status] || 99;

            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }
            // Secondary sort: Newest first
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
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
            const statusColor = status === 'Completed' ? '#10b981' : status === 'Cancelled' ? '#ef4444' : '#3b82f6';
            const statusLabel = status === 'Completed' ? 'Delivered & Completed' : status === 'Cancelled' ? 'Order Cancelled' : status;

            const emailContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Update</title>
                <style>
                    body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
                    table { border-collapse: collapse; width: 100%; }
                    .wrapper { background-color: #f1f5f9; padding: 40px 0; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
                    .header { background-color: #2563eb; padding: 32px; text-align: center; }
                    .header-logo { color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; text-decoration: none; display: inline-block; }
                    .content { padding: 40px; }
                    .title { color: #1e293b; font-size: 24px; font-weight: 700; margin: 0 0 12px 0; text-align: center; }
                    .subtitle { color: #64748b; font-size: 16px; margin: 0 0 32px 0; text-align: center; line-height: 1.5; }
                    .status-pill { display: inline-block; padding: 8px 24px; border-radius: 9999px; font-size: 14px; font-weight: 700; background-color: ${statusColor}; color: white; margin-bottom: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .badge-pill { background-color: #f1f5f9; color: #475569; padding: 4px 12px; border-radius: 9999px; font-family: ui-monospace, monospace; font-size: 12px; display: inline-block; border: 1px solid #e2e8f0; }
                    .section-title { color: #1e293b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px 0; padding-bottom: 12px; border-bottom: 2px solid #f1f5f9; }
                    .summary-table th { text-align: left; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 600; padding-bottom: 12px; border-bottom: 2px solid #f1f5f9; }
                    .summary-table td { padding: 16px 0; border-bottom: 1px solid #f1f5f9; font-size: 15px; color: #334155; }
                    .summary-table td.meta { color: #94a3b8; font-size: 13px; margin-top: 4px; display: block; }
                    .total-section { margin-top: 24px; text-align: right; padding-top: 20px; border-top: 2px solid #f1f5f9; }
                    .total-label { color: #64748b; font-size: 14px; margin-right: 12px; font-weight: 600; }
                    .total-amount { color: ${statusColor}; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
                    .footer { background-color: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #e2e8f0; }
                    .footer-text { color: #94a3b8; font-size: 13px; line-height: 1.6; margin-bottom: 8px; }
                    .footer-link { color: #2563eb; text-decoration: none; font-weight: 600; }
                </style>
            </head>
            <body>
                <table class="wrapper" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center">
                            <table class="container" width="600" cellpadding="0" cellspacing="0">
                                <!-- Header -->
                                <tr>
                                    <td class="header" style="background-color: ${statusColor};">
                                        <div class="header-logo">YENEPOYA STUDENT HUB</div>
                                    </td>
                                </tr>
                                <!-- Content -->
                                <tr>
                                    <td class="content">
                                        <h1 class="title">Order Update</h1>
                                        <p class="subtitle">Order Status Changed</p>
                                        
                                        <div style="text-align: center; margin-bottom: 24px;">
                                            <div class="status-pill">${statusLabel}</div>
                                            <div style="margin-top: 16px;">
                                                <span class="badge-pill">#${order._id.toString().slice(-8).toUpperCase()}</span>
                                            </div>
                                        </div>

                                        <p style="text-align: center; color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 40px;">
                                            Hello <strong style="color: #1e293b;">${titleCase(order.user.name)}</strong>,<br>
                                            The status of your order has been updated to <strong style="color: ${statusColor};">${status}</strong>.
                                        </p>

                                        <!-- Order Summary -->
                                        <div>
                                            <div class="section-title">Order Summary</div>
                                            <table class="summary-table" width="100%" cellpadding="0" cellspacing="0">
                                                <thead>
                                                    <tr>
                                                        <th width="70%">Item</th>
                                                        <th width="30%" style="text-align: right;">Qty</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${order.items.map(item => `
                                                    <tr>
                                                        <td>
                                                            <div style="font-weight: 600;">${item.name}</div>
                                                            ${item.size ? `<span class="meta">Size: ${item.size}</span>` : ''}
                                                        </td>
                                                        <td style="text-align: right; color: #334155;">x${item.quantity}</td>
                                                    </tr>
                                                    `).join('')}
                                                </tbody>
                                            </table>
                                            
                                            <div class="total-section">
                                                <span class="total-label">Total Amount</span>
                                                <span class="total-amount">₹${order.totalAmount}</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <!-- Footer -->
                                <tr>
                                    <td class="footer">
                                        <div class="footer-text">Questions? Contact <a href="mailto:studentsupport@yenepoya.edu.in" class="footer-link">Support</a></div>
                                        <div class="footer-text">© ${new Date().getFullYear()} Yenepoya Student Hub</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            `;

            await sendEmail({
                to: order.user.email,
                subject: `Order Update: ${statusLabel}`,
                html: emailContent
            });

            // Create notification
            const itemNames = order.items.map(i => i.name).join(', ');
            await Notification.create({
                userId: order.user._id,
                type: 'Order',
                title: 'Order Status Updated',
                message: `Your order for ${itemNames} is now ${status}`,
                link: '/orders'
            });

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Status update error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
