const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const router = express.Router();

// Post a job
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'Farmer') return res.status(403).json({ message: 'Only farmers can post jobs' });
        const job = new Job({ ...req.body, farmer: req.user.id });
        await job.save();
        
        // Notify nearby workers (Simplified: Notify all for now, filter in frontend or later)
        const io = req.app.get('socketio');
        io.emit('newJob', job);
        
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all jobs with filters
router.get('/', async (req, res) => {
    try {
        const { location, workType, isUrgent } = req.query;
        let query = { status: 'open' };
        if (location) query.location = new RegExp(location, 'i');
        if (workType) query.workType = workType;
        if (isUrgent === 'true') query.isUrgent = true;

        const jobs = await Job.find(query).populate('farmer', 'name rating');
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single job
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.id).populate('farmer', 'name rating email');
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update entire job
router.put('/:id', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.farmer.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
        
        const updatableFields = ['title', 'description', 'workType', 'date', 'wage', 'location', 'numWorkersRequired', 'isUrgent'];
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                job[field] = req.body[field];
            }
        });
        
        await job.save();
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update job status
router.put('/:id/status', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (job.farmer.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
        job.status = req.body.status;
        await job.save();
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
