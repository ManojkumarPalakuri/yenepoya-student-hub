const express = require('express');
const router = express.Router();
const SupportQuery = require('../models/SupportQuery');
const Notification = require('../models/Notification');
const { protect, admin } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

// ...



// @route   POST /api/support
// @desc    Create new support query
// @access  Private
router.post('/', protect, async (req, res) => {
    const { subject, category, description } = req.body;

    try {
        const studentDetails = {
            name: req.user.name,
            registerNumber: req.user.registerNumber,
            email: req.user.email
        };

        const query = new SupportQuery({
            user: req.user._id,
            studentDetails,
            subject,
            category,
            description
        });

        const createdQuery = await query.save();

        // Email to Admin
        try {
            const emailContent = `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #ea580c;">New Support Query</h2>
                    <div style="background: #fff7ed; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #fed7aa;">
                        <h3 style="margin-top: 0; color: #c2410c;">Student Profile</h3>
                        <p><strong>Name:</strong> ${req.user.name}</p>
                        <p><strong>Email:</strong> ${req.user.email}</p>
                        <p><strong>Register No:</strong> ${req.user.registerNumber || 'N/A'}</p>
                        <p><strong>Campus ID:</strong> ${req.user.campusId || 'N/A'}</p>
                    </div>

                    <h3>Ticket Details</h3>
                    <p><strong>Category:</strong> ${category}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <div style="background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                        <strong>Description:</strong>
                        <p>${description}</p>
                    </div>
                </div>
            `;
            // Log removed for production
            await sendEmail({
                to: process.env.SMTP_EMAIL,
                subject: `New Support Query - ${subject}`,
                html: emailContent
            });
        } catch (e) {
            console.error('Email failed to send:', e.response ? e.response.data : e.message);
            // Optional: Don't fail the request, but log it clearly
        }

        res.status(201).json(createdQuery);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/support/my-queries
// @desc    Get logged in user queries
// @access  Private
router.get('/my-queries', protect, async (req, res) => {
    try {
        const queries = await SupportQuery.find({ user: req.user._id }).sort('-createdAt');
        res.json(queries);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/support
// @desc    Get all queries (Admin)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const queries = await SupportQuery.find({}).populate('user', 'name email').sort('-createdAt');
        res.json(queries);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/support/:id/reply
// @desc    Admin reply and update status
// @access  Private/Admin
router.put('/:id/reply', protect, admin, async (req, res) => {
    const { status, adminReply } = req.body;
    try {
        const query = await SupportQuery.findById(req.params.id).populate('user', 'email name');
        if (query) {
            query.status = status || query.status;
            query.adminReply = adminReply || query.adminReply;

            const Notification = require('../models/Notification'); // Add this import at the top if not present, but better to just add it here
            // Actually, it's better to add the import at the top of the file.
            // I will split this into two edits if needed, or just insert it.
            // Let's assume I need to add the require at the top first if I can't do it in one go.
            // But I can just use require inside the route if I want to be lazy, but that's bad practice.
            // I'll add the import to the top of the file in a separate tool call if strictly needed, but replace_file_content works on blocks.
            // I'll just add the notification logic here and assume I'll add the require at the top.

            const updatedQuery = await query.save();

            // Create In-App Notification
            await Notification.create({
                userId: query.user._id,
                type: 'Support',
                title: 'Support Ticket Update',
                message: `Admin replied to: ${query.subject.substring(0, 20)}...`,
                link: '/support'
            });

            // Send Email Notification
            const emailContent = `
             <h3>Support Query Update</h3>
             <p>Hello ${query.user.name},</p>
             <p>Your query regarding <strong>"${query.subject}"</strong> has been updated.</p>
             <p><strong>Status:</strong> ${updatedQuery.status}</p>
             <p><strong>Admin Reply:</strong> ${updatedQuery.adminReply}</p>
         `;
            try {
                sendEmail({
                    to: query.user.email,
                    subject: `Support Update: ${query.subject}`,
                    html: emailContent
                });
            } catch (err) {
                console.error('Email failed', err);
            }

            res.json(updatedQuery);
        } else {
            res.status(404).json({ message: 'Query not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
