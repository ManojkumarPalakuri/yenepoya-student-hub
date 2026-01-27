const express = require('express');
const router = express.Router();
const DocumentRequest = require('../models/DocumentRequest');
const Notification = require('../models/Notification');
const { protect, admin } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

// ...



// @route   POST /api/requests
// @desc    Create new document request
// @access  Private
router.post('/', protect, async (req, res) => {
    const { documentType, purpose } = req.body;

    try {
        const studentDetails = {
            name: req.user.name,
            registerNumber: req.user.registerNumber,
            batchYear: req.user.batchYear,
            classSection: req.user.classSection,
            floorBuilding: req.user.floorBuilding
        };

        const docRequest = new DocumentRequest({
            user: req.user._id,
            documentType,
            purpose,
            studentDetails
        });

        const createdRequest = await docRequest.save();

        // Send Email
        // Send Email
        const emailContent = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #2563eb;">New Document Request</h2>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0;">Student Profile</h3>
                    <p><strong>Name:</strong> ${req.user.name}</p>
                    <p><strong>Email:</strong> ${req.user.email}</p>
                    <p><strong>Register No:</strong> ${req.user.registerNumber || 'N/A'}</p>
                    <p><strong>Campus ID:</strong> ${req.user.campusId || 'N/A'}</p>
                    <p><strong>Batch:</strong> ${req.user.batchYear || 'N/A'}</p>
                </div>

                <h3>Request Details</h3>
                <p><strong>Document Type:</strong> ${documentType}</p>
                <div style="background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                    <strong>Purpose:</strong>
                    <p>${purpose}</p>
                </div>
            </div>
         `;
        try {
            sendEmail({
                to: process.env.SMTP_EMAIL,
                subject: `New Document Request - ${createdRequest._id}`,
                html: emailContent
            });
        } catch (emailErr) {
            console.error('Email failed', emailErr);
        }

        res.status(201).json(createdRequest);
    } catch (error) {
        console.error('Create Request Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/requests
// @desc    Get all requests (Admin)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        let requests = await DocumentRequest.find({})
            .populate('user', 'name email')
            .lean();

        const statusPriority = {
            'Pending': 1,
            'Processing': 2,
            'Approved': 3,
            'Completed': 3,
            'Rejected': 4
        };

        requests.sort((a, b) => {
            const priorityA = statusPriority[a.status] || 99;
            const priorityB = statusPriority[b.status] || 99;

            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }
            // Secondary sort: Newest first
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/requests/myrequests
// @desc    Get logged in user requests
// @access  Private
router.get('/my-requests', protect, async (req, res) => {
    try {
        const requests = await DocumentRequest.find({ user: req.user._id }).sort('-createdAt');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/requests/:id/status
// @desc    Update request status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
    const { status } = req.body;
    try {
        const request = await DocumentRequest.findById(req.params.id).populate('user', 'email name');
        if (request) {
            request.status = status;
            const updatedRequest = await request.save();

            // Create In-App Notification
            await Notification.create({
                userId: request.user._id,
                type: 'Document',
                title: 'Document Request Updated',
                message: `Your ${request.documentType} is now ${status}`,
                link: '/request-document'
            });

            // Send Email Notification
            const emailContent = `
                <h3>Document Request Update</h3>
                <p>Hello ${request.user.name},</p>
                <p>Your request for <strong>${request.documentType}</strong> has been updated to:</p>
                <h2 style="color: ${status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'orange'}">${status}</h2>
                <p>View details on your dashboard.</p>
            `;
            try {
                sendEmail({
                    to: request.user.email,
                    subject: `Request Update: ${request.documentType} - ${status}`,
                    html: emailContent
                });
            } catch (err) {
                console.error('Email failed', err);
            }

            res.json(updatedRequest);
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
