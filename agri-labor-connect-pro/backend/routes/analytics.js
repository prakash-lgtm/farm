const express = require('express');
const Job = require('../models/Job');
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role === 'Farmer') {
            const totalJobs = await Job.countDocuments({ farmer: req.user.id });
            const completedJobs = await Job.countDocuments({ farmer: req.user.id, status: 'completed' });
            res.json({ totalJobs, completedJobs });
        } else {
            const jobsCompleted = await Application.countDocuments({ worker: req.user.id, status: 'accepted' }); // Simplified complete logic
            // In a real app, you'd check job status too
            const totalEarnings = jobsCompleted * 500; // Mock calculation
            res.json({ jobsCompleted, totalEarnings });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
