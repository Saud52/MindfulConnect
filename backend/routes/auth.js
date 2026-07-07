const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password, role, rciId, profile } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) { return res.status(400).json({ msg: 'User already exists with this email' }); }

        user = await User.findOne({ username });
        if (user) { return res.status(400).json({ msg: 'Username already taken' }); }

        user = new User({
    username,
    email,
    password,
    role,
    profile: role === 'student'
        ? profile || {}
        : { rciId }
});

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role, userId: user.id, username: user.username });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        console.log("User found:", user);

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        console.log("Password match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;

                res.json({
                    token,
                    role: user.role,
                    userId: user.id,
                    username: user.username
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/users/consent
// @desc    Update user's privacy consent status
// @access  Private
router.post('/consent', auth, async (req, res) => {
    const { hasConsent, consentToShareDASS } = req.body;
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        user.profile.hasConsent = hasConsent;
        user.profile.consentToShareDASS = consentToShareDASS;
        await user.save();
        res.json({ msg: 'Consent updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/auth/profile
// @desc    Get the logged-in user's profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/auth/profile
// @desc    Update the logged-in user's profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
    const { fullName, contact, roleSpecific } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update common profile fields
        user.profile.fullName = fullName;
        user.profile.contact = contact;

        // Handle role-specific updates safely
        if (user.role === 'student' && roleSpecific) {
            user.profile.studentId = roleSpecific.studentId;
            user.profile.grade = roleSpecific.grade;
            user.profile.school = roleSpecific.school;
        } else if (user.role === 'counsellor' && roleSpecific) {
            user.profile.bio = roleSpecific.bio;
            user.profile.yearsOfExperience = roleSpecific.yearsOfExperience;
            // Convert comma-separated strings to arrays
            if (roleSpecific.specialization && typeof roleSpecific.specialization === 'string') {
                user.profile.specialization = roleSpecific.specialization.split(',').map(s => s.trim());
            }
            if (roleSpecific.qualifications && typeof roleSpecific.qualifications === 'string') {
                user.profile.qualifications = roleSpecific.qualifications.split(',').map(q => q.trim());
            }
        }
        
        // This line tells Mongoose that the nested 'profile' object has changed.
        user.markModified('profile');

        await user.save();
        res.json(user);

    } catch (err) {
        console.error("Error in PUT /profile:", err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;