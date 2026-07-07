// backend/routes/dass21.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import auth middleware
const Dass21Result = require('../models/Dass21Result'); // Import the Dass21Result model
const User = require('../models/User'); // Import User model (for population)

// @route   POST /api/dass21/submit
// @desc    Submit DASS-21 assessment results
// @access  Private (Student only)
router.post('/submit', auth, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ msg: 'Access denied. Only students can submit DASS-21 assessments.' });
    }

    const { depression, anxiety, stress, recommendation } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        const consentToShare = true;

        const newDassResult = new Dass21Result({
            userId: req.user.id,
            depression,
            anxiety,
            stress,
            recommendation,
            consentToShare,
        });

        await newDassResult.save();

        user.profile.hasCompletedAssessment = true;
        await user.save();

        console.log(`DASS-21 result saved for user ${user.username} (ID: ${user._id}). Recommendation: ${recommendation}`);

        if (consentToShare) {
            if (recommendation === 'Red') {
                console.log(`URGENT: Red Zone detected for ${user.username}. Counsellor referral process initiated.`);
            } else {
                console.log(`DASS-21 report for user ${user.username} (Recommendation: ${recommendation}) available for counsellor review.`);
            }
        }

        res.status(200).json({ msg: 'DASS-21 assessment submitted successfully', result: newDassResult });

    } catch (err) {
        console.error(`Error submitting DASS-21: ${err.message}`);
        res.status(500).send('Server Error');
    }
});

// @route GET /api/dass21/report/latest
// @desc  Get the latest DASS-21 assessment result for the authenticated student
// @access Private (Student only)
router.get('/report/latest', auth, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ msg: 'Access denied. Only students can view their DASS-21 reports.' });
    }

    try {
        const latestResult = await Dass21Result.findOne({ userId: req.user.id })
                                               .sort({ testDate: -1 }) 
                                               .lean();

        if (!latestResult) {
            return res.status(404).json({ msg: 'No DASS-21 assessment found for this user.' });
        }

        res.status(200).json({ latestResult });

    } catch (err) {
        console.error(`Error fetching latest DASS-21 report: ${err.message}`);
        res.status(500).send('Server Error');
    }
});

// NEW: @route GET /api/dass21/reports/all-consented
// NEW: @desc  Get all DASS-21 assessment reports from students who gave consent
// NEW: @access Private (Counsellor only)
router.get('/reports/all-consented', auth, async (req, res) => {
    // Only counsellors can view all consented DASS reports
    if (req.user.role !== 'counsellor') {
        return res.status(403).json({ msg: 'Access denied. Only counsellors can view all DASS reports.' });
    }

    try {
        // Find all DASS-21 results where consentToShare is true
        // Use .populate('userId', 'username email') to fetch student's username and email from the User model
const allConsentedReports = await Dass21Result.find({ consentToShare: true })
  .populate('userId')
  .sort({ testDate: -1 });

        res.status(200).json({ reports: allConsentedReports });

    } catch (err) {
        console.error(`Error fetching all consented DASS reports: ${err.message}`);
        res.status(500).send('Server Error');
    }
});

// Add this route to backend/routes/dass21.js, before module.exports

// @route   GET /api/dass21/history/:studentId
// @desc    Get all DASS assessment results for a specific student
// @access  Private (Counsellor only)
router.get('/history/:studentId', auth, async (req, res) => {
    // Ensure the user is a counsellor
    if (req.user.role !== 'counsellor') {
        return res.status(403).json({ msg: 'Access denied.' });
    }

    try {
        const studentDassHistory = await Dass21Result.find({ userId: req.params.studentId })
                                                     .sort({ testDate: -1 }); // Show most recent first

        if (!studentDassHistory) {
            return res.status(404).json({ msg: 'No DASS history found for this student.' });
        }

        res.json(studentDassHistory);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;