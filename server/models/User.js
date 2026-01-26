const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        select: false // Don't return password by default
    },
    googleId: {
        type: String,
        // required: true  <-- Removed required
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        select: false
    },
    otpExpires: {
        type: Date,
        select: false
    },
    resetPasswordOtp: {
        type: String,
        select: false
    },
    resetPasswordExpires: {
        type: Date,
        select: false
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    campusId: { type: String },
    registerNumber: { type: String },
    batchYear: { type: String },
    classSection: { type: String },
    floorBuilding: { type: String },
    adviserName: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
