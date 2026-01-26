const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    documentType: {
        type: String,
        required: true,
        enum: [
            'Bonafide Certificate',
            'Academic Records',
            'Academic Transcript',
            'Official Certificates',
            'Letter of Recommendation',
            'Letter of Recommendation (LOR)', // Keeping for backward compatibility
            'Transfer Certificate',
            'Course Completion',
            'Other'
        ]
    },
    purpose: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Processing', 'Completed', 'Rejected'],
        default: 'Pending'
    },
    studentDetails: { // Snapshot
        name: String,
        registerNumber: String,
        batchYear: String,
        classSection: String,
        floorBuilding: String
    }
}, { timestamps: true });

module.exports = mongoose.model('DocumentRequest', requestSchema);
