const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    workType: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String },
    wage: { type: Number, required: true },
    location: { type: String, required: true },
    numWorkersRequired: { type: Number, default: 1 },
    status: { type: String, enum: ['open', 'in-progress', 'completed'], default: 'open' },
    isUrgent: { type: Boolean, default: false },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
