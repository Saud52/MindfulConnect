const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/students/:id
// @desc    Get a single student's profile by ID
// @access  Private (Counsellor only)
router.get('/:id', auth, async (req, res) => {
    if (req.user.role !== 'counsellor') {
        return res.status(403).json({ msg: 'Access denied.' });
    }
    try {
        const student = await User.findOne({
            _id: req.params.id,
            role: 'student'
        }).select('-password');

        if (!student) {
            return res.status(404).json({ msg: 'Student not found.' });
        }
        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;