const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Dass21Result = require('../models/Dass21Result'); // Added this line
const { sendAppointmentEmail } = require('../utils/emailService');

const mongoose = require('mongoose')

// @route   POST /api/appointments/book
// @desc    Book a new appointment (for counsellors)
// @access  Private
router.post('/book', auth, async (req, res) => {
    console.log('Booking request received:', {
        body: req.body,
        user: req.user,
        headers: req.headers
    });
    
    if (req.user.role !== 'counsellor') {
        console.log('Access denied - User role:', req.user.role);
        return res.status(403).json({ msg: 'Access denied.' });
    }

    // Validate request body
    const { studentId, studentName, counselorId, counselorName, date, time } = req.body;
    
    if (!studentId || !studentName || !counselorId || !counselorName || !date || !time) {
        return res.status(400).json({ 
            msg: 'Missing required fields',
            received: { studentId, studentName, counselorId, counselorName, date, time }
        });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(counselorId)) {
        return res.status(400).json({ 
            msg: 'Invalid ID format',
            studentId,
            counselorId
        });
    }

    try {
        // Verify that the counselor exists
        const counselor = await User.findById(counselorId);
        if (!counselor || counselor.role !== 'counsellor') {
            return res.status(400).json({ msg: 'Invalid counselor ID' });
        }

        const student = await User.findById(studentId);
        if (!student || student.role !== 'student') {
            return res.status(400).json({ msg: 'Invalid student ID' });
        }

        // Check if the slot is already booked
        const existingAppointment = await Appointment.findOne({
            counselorId,
            date,
            time,
            status: 'scheduled'
        });

        if (existingAppointment) {
            return res.status(400).json({ msg: 'This time slot is already booked' });
        }

        const newAppointment = new Appointment({
            studentId,
            studentName,
            counselorId,
            counselorName,
            date,
            time,
            status: 'scheduled'
        });
        await newAppointment.save();

        res.status(201).json({ msg: 'Appointment booked successfully', appointment: newAppointment });

        try {
            await sendAppointmentEmail(student, counselor, newAppointment);
        } catch (emailErr) {
            console.error("Failed to send booking emails:", emailErr);
        }
    } catch (err) {
        console.error('Error booking appointment:', {
            error: err.message,
            stack: err.stack,
            body: req.body
        });
        res.status(500).json({ 
            msg: 'Server Error',
            error: err.message 
        });
    }
});

// @route   GET /api/appointments/upcoming
// @desc    Get upcoming appointments for the logged-in user
// @access  Private
router.get('/upcoming', auth, async (req, res) => {
    const now = new Date();
    try {
        let appointments;
        
        if (req.user.role === 'student') {
            const query = { studentId: req.user.id, status: 'scheduled', date: { $gte: now } };
            appointments = await Appointment.find(query)
                .populate('counselorId', 'username profile')
                .sort({ date: 1, time: 1 });
        } else if (req.user.role === 'counsellor') {
            const query = { counselorId: req.user.id, status: 'scheduled', date: { $gte: now } };
            appointments = await Appointment.find(query)
                .populate('studentId', 'username email')
                .sort({ date: 1, time: 1 });
        } else {
            return res.status(403).json({ msg: 'Access denied for this role.' });
        }

        res.status(200).json({ appointments });
    } catch (err) {
        console.error(`Error fetching upcoming appointments: ${err.message}`);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/appointments/student-book
// @desc    Book a new appointment (by a student)
// @access  Private (Student only)
router.post('/student-book', auth, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ msg: 'Only students can book appointments.' });
    }
    const { counselorId, date, time } = req.body;
    try {
        const student = await User.findById(req.user.id);
        const counsellor = await User.findById(counselorId);
        if (!counsellor) {
            return res.status(404).json({ msg: 'Counsellor not found.' });
        }
        const existingAppointment = await Appointment.findOne({ counselorId, date, time, status: 'scheduled' });
        if (existingAppointment) {
            return res.status(400).json({ msg: 'This time slot is no longer available.' });
        }
        const newAppointment = new Appointment({
            studentId: req.user.id,
            studentName: student.username,
            counselorId,
            counselorName: counsellor.username,
            specialization: counsellor.profile.specialization.join(' & '),
            date,
            time,
        });
        await newAppointment.save();
        res.status(201).json({ msg: 'Appointment booked successfully!', appointment: newAppointment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/appointments/:id/complete
// @desc    Mark an appointment as completed
// @access  Private (Counsellor only)
router.put('/:id/complete', auth, async (req, res) => {
    if (req.user.role !== 'counsellor') {
        return res.status(403).json({ msg: 'Access denied.' });
    }
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found.' });
        }
        if (appointment.counselorId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized.' });
        }
        appointment.status = 'completed';
        await appointment.save();
        res.json({ msg: 'Appointment marked as completed.', appointment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/appointments/completed
// @desc    Get all completed appointments for a counsellor, including DASS scores
// @access  Private (Counsellor only)
router.get('/completed', auth, async (req, res) => {
    if (req.user.role !== 'counsellor') {
        return res.status(403).json({ msg: 'Access denied.' });
    }
    try {
        const completedAppointments = await Appointment.find({
            counselorId: req.user.id,
            status: 'completed'
        })
        .populate('studentId', 'username email')
        .sort({ date: -1 })
        .lean();

        const recordsWithDass = await Promise.all(completedAppointments.map(async (app) => {
            if (!app.studentId) return { ...app, latestDass: null };
            const latestDass = await Dass21Result.findOne({ userId: app.studentId._id })
                .sort({ testDate: -1 });
            return { ...app, latestDass: latestDass || null };
        }));

        res.json(recordsWithDass);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/appointments/:id/remarks
// @desc    Add or update remarks for an appointment
// @access  Private (Counsellor only)
router.put('/:id/remarks', auth, async (req, res) => {
    if (req.user.role !== 'counsellor') {
        return res.status(403).json({ msg: 'Access denied.' });
    }
    const { remarks, showRemarksToStudent } = req.body;
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found.' });
        }
        if (appointment.counselorId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized.' });
        }
        appointment.remarks = remarks;
        if (showRemarksToStudent !== undefined) {
            appointment.showRemarksToStudent = showRemarksToStudent;
        }
        await appointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add this route to backend/routes/appointments.js

// @route   GET /api/appointments/history
// @desc    Get a student's own appointment history (completed/cancelled)
// @access  Private (Student only)
router.get('/history', auth, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ msg: 'Access denied.' });
    }
    try {
        const history = await Appointment.find({
            studentId: req.user.id,
            status: { $in: ['completed', 'cancelled'] } // Find all non-scheduled
        })
        .populate('counselorId', 'username')
        .sort({ date: -1 });

        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;