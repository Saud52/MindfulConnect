const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'counsellor'],
        default: 'student'
    },
    profile: {
    fullName: { type: String },
    contact: { type: String },
    studentId: { type: String },

    department: { type: String },
year: { type: String },
rollNumber: { type: String },

    grade: { type: String },   // this will store TE_IT_54

    school: { type: String },
    specialization: { type: [String] },
    qualifications: { type: [String] },
    yearsOfExperience: { type: Number },
    bio: { type: String },
    rciId: { type: String },

    hasConsent: { type: Boolean, default: false },
    consentToShareDASS: { type: Boolean, default: false },
    hasCompletedAssessment: { type: Boolean, default: false },

    availability: {
        regularHours: { type: Object },
        blockedSlots: { type: Array }
    }
},
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);