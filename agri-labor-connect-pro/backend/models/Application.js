const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Farmer's decision on the application
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    // Worker's response after being accepted by farmer
    workerAccepted: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);

