const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Link to the Student User
        required: true,
    },
    counselorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Link to the Counsellor User
        required: true,
    },
    counselorName: { // Storing name directly for easier display
        type: String,
        required: true,
    },
    studentName: { // Storing name directly for easier display
        type: String,
        required: true,
    },
    date: { // Date of the appointment
        type: Date,
        required: true,
    },
    time: { // Time slot (e.g., "09:00-09:30" string)
        type: String,
        required: true,
    },
    status: { // e.g., 'scheduled', 'completed', 'cancelled'
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled',
    },
    remarks: { // New field for counsellor's notes
        type: String,
        default: ''
    },
    showRemarksToStudent: {
        type: Boolean,
        default: false
    },
    specialization: { // Copy specialization from counselor for that appointment context
        type: String,
    }
}, {
    timestamps: true // createdAt and updatedAt
});

module.exports = mongoose.model('Appointment', AppointmentSchema);