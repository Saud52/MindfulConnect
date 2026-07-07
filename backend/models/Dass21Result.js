// backend/models/Dass21Result.js
const mongoose = require('mongoose');

const Dass21ResultSchema = new mongoose.Schema({
    userId: { // Link to the User who took the assessment
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    depression: {
        type: Number,
        required: true,
    },
    anxiety: {
        type: Number,
        required: true,
    },
    stress: {
        type: Number,
        required: true,
    },
    recommendation: { // 'Green', 'Yellow', 'Red'
        type: String,
        required: true,
    },
    testDate: {
        type: Date,
        default: Date.now,
    },
    // Consent status AT THE TIME OF ASSESSMENT submission
    consentToShare: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Dass21Result', Dass21ResultSchema);