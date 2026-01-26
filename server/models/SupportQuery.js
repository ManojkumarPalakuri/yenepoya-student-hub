const mongoose = require('mongoose');

const supportQuerySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    studentDetails: {
        name: String,
        registerNumber: String,
        email: String
    },
    subject: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Academic', 'Technical', 'General', 'Feedback'],
        default: 'General'
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open'
    },
    adminReply: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SupportQuery', supportQuerySchema);
