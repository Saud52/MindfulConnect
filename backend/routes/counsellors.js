const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');
const { sendProactiveOutreachEmail } = require('../utils/emailService');

// @route   GET /api/counsellors/main
// @desc    Get the designated main counsellor
// @access  Private
router.get('/main', auth, async (req, res) => {
    try {
        const mainCounsellorEmail = "main.counsellor@example.com";
        const mainCounsellor = await User.findOne({
            role: 'counsellor',
            email: mainCounsellorEmail
        }).select('-password');

        if (!mainCounsellor) {
            return res.status(404).json({ msg: 'Main counsellor account not found.' });
        }
        res.json(mainCounsellor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Helper function to get booked slots for a specific counsellor
const getBookedSlotsForCounselor = async (counsellorId) => {
    const now = new Date();
    const appointments = await Appointment.find({
        counselorId: counsellorId,
        status: 'scheduled',
        date: { $gte: now }
    }).select('date time');
    return appointments.map(app => ({
        date: new Date(app.date).toISOString().split('T')[0],
        time: app.time
    }));
};

// Helper function to format the DB schedule for the booking page
const formatWorkingHoursForBooking = (regularHours) => {
    if (!regularHours) return [];
    // Converts the DB format { '1': [{...}] } to the frontend format [{ day: 1, ... }]
    return Object.keys(regularHours).map(dayKey => ({
        day: parseInt(dayKey, 10),
        start: regularHours[dayKey][0].start,
        end: regularHours[dayKey][0].end,
    }));
};

// @route   GET /api/counsellors/:id
// @desc    Get a single counsellor's profile and REAL availability by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ msg: 'Counsellor not found (invalid ID format).' });
    }

    try {
        const counsellor = await User.findOne({
            _id: req.params.id,
            role: 'counsellor'
        }).select('-password');

        if (!counsellor) {
            return res.status(404).json({ msg: 'Counsellor not found.' });
        }
        
        // This now reads and formats the REAL availability from the database
        const availability = {
            workingHours: formatWorkingHoursForBooking(counsellor.profile.availability?.regularHours),
            bookedSlots: await getBookedSlotsForCounselor(req.params.id)
        };

        res.json({ counsellor, availability });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/counsellors/availability/me
// @desc    Get the logged-in counsellor's own availability
// @access  Private (Counsellor only)
router.get('/availability/me', auth, async (req, res) => {
    if (req.user.role !== 'counsellor') {
        return res.status(403).json({ msg: 'Access denied.' });
    }
    try {
        const counsellor = await User.findById(req.user.id).select('profile.availability');
        if (!counsellor) {
            return res.status(404).json({ msg: 'Counsellor not found.' });
        }
        res.json(counsellor.profile.availability || { regularHours: {}, blockedSlots: [] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/counsellors/availability
// @desc    Update the logged-in counsellor's availability
// @access  Private (Counsellor only)
router.put('/availability', auth, async (req, res) => {
    if (req.user.role !== 'counsellor') {
        return res.status(403).json({ msg: 'Access denied.' });
    }
    const { regularHours, blockedSlots } = req.body;
    try {
        const counsellor = await User.findById(req.user.id);
        if (!counsellor) {
            return res.status(404).json({ msg: 'Counsellor not found.' });
        }
        
        counsellor.profile.availability = { regularHours, blockedSlots };
        await counsellor.save();
        
        res.json(counsellor.profile.availability);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.post('/contact-student', auth, async (req, res) => {
    if (req.user.role !== 'counsellor') {
        return res.status(403).json({ msg: 'Access denied.' });
    }
    
    const { studentId } = req.body;

    try {
        const counsellor = await User.findById(req.user.id);
        const student = await User.findById(studentId);

        if (!student) {
            return res.status(404).json({ msg: 'Student not found.' });
        }

        // Call the email service function
        await sendProactiveOutreachEmail(counsellor, student);

        res.json({ msg: 'Email sent successfully.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;