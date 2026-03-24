const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const router = express.Router();

// Apply for a job
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'Worker') return res.status(403).json({ message: 'Only workers can apply' });
        const { jobId } = req.body;
        
        const existing = await Application.findOne({ job: jobId, worker: req.user.id });
        if (existing) return res.status(400).json({ message: 'Already applied' });

        const application = new Application({ job: jobId, worker: req.user.id });
        await application.save();

        const job = await Job.findById(jobId);
        const io = req.app.get('socketio');
        io.to(job.farmer.toString()).emit('newApplication', { jobId, workerName: req.user.name });

        res.status(201).json(application);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get applications (farmer sees all for their jobs; worker sees their own)
router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Worker') {
            query.worker = req.user.id;
        } else {
            const jobs = await Job.find({ farmer: req.user.id });
            query.job = { $in: jobs.map(j => j._id) };
        }
        const apps = await Application.find(query).populate('job').populate('worker', 'name rating location phone');
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Farmer: Accept or Reject a worker's application
router.put('/:id', auth, async (req, res) => {
    try {
        const app = await Application.findById(req.params.id).populate('job');
        if (!app) return res.status(404).json({ message: 'Application not found' });
        if (app.job.farmer.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
        
        app.status = req.body.status;
        await app.save();
        
        const io = req.app.get('socketio');
        io.to(app.worker.toString()).emit('applicationStatus', { jobId: app.job._id, status: app.status });

        res.json(app);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Worker: Accept or Reject an assigned job (after farmer accepted their application)
router.put('/:id/worker-response', auth, async (req, res) => {
    try {
        if (req.user.role !== 'Worker') return res.status(403).json({ message: 'Only workers can respond' });
        const app = await Application.findById(req.params.id);
        if (!app) return res.status(404).json({ message: 'Application not found' });
        if (app.worker.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
        if (app.status !== 'accepted') return res.status(400).json({ message: 'Job not yet accepted by farmer' });

        app.workerAccepted = req.body.workerAccepted;
        await app.save();
        res.json(app);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
