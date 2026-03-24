import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, Trash2, Briefcase, CheckCircle, Clock, AlertTriangle, Send, BarChart2, ChevronDown, ChevronUp, Edit3, X } from 'lucide-react';
import LocationInput from '../components/LocationInput';

const WORK_TYPES = ['Harvesting', 'Planting', 'Ploughing', 'Irrigation', 'Pesticide Spraying', 'Weeding', 'Fruit Picking', 'Greenhouse Work', 'Livestock Care', 'Equipment Operation'];

const emptyJob = () => ({
    title: '', description: '', workType: 'Harvesting', date: '', time: '', wage: '',
    location: '', numWorkersRequired: 1, isUrgent: false,
    _id: Math.random().toString(36).slice(2)
});

const FarmerDashboard = () => {
    const [apps, setApps] = useState([]);
    const [stats, setStats] = useState({ totalJobs: 0, completedJobs: 0 });
    const [showPost, setShowPost] = useState(false);
    const [jobs, setJobs] = useState([emptyJob()]);  // Start with 1; can add up to 10+
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState('');
    const [expandedApps, setExpandedApps] = useState({});
    const [editingJob, setEditingJob] = useState(null);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [appsRes, statsRes] = await Promise.all([
                axios.get('/api/applications'),
                axios.get('/api/analytics'),
            ]);
            setApps(appsRes.data);
            setStats(statsRes.data);
        } catch (err) { console.error(err); }
    };

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const addJob = () => {
        setJobs(prev => [...prev, emptyJob()]);
    };

    const removeJob = (id) => {
        if (jobs.length === 1) return;
        setJobs(prev => prev.filter(j => j._id !== id));
    };

    const updateJob = (id, field, value) => {
        setJobs(prev => prev.map(j => j._id === id ? { ...j, [field]: value } : j));
    };

    const handleBulkSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        let successCount = 0;
        for (const job of jobs) {
            try {
                const { _id, ...payload } = job;
                await axios.post('/api/jobs', payload);
                successCount++;
            } catch (err) { console.error(err); }
        }
        setSubmitting(false);
        setJobs([emptyJob()]);
        setShowPost(false);
        fetchData();
        if (successCount > 0) {
            showToast(`✅ ${successCount} of ${jobs.length} job(s) posted successfully!`);
        } else {
            showToast(`❌ Failed to post jobs. Please check if all fields are filled.`);
        }
    };

    const handleAppAction = async (id, status) => {
        try {
            await axios.put(`/api/applications/${id}`, { status });
            fetchData();
            showToast(status === 'accepted' ? '✅ Worker accepted!' : '❌ Application rejected.');
        } catch (err) { alert('Action failed'); }
    };

    const handleUpdateJob = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/jobs/${editingJob._id}`, editingJob);
            showToast('✅ Job updated successfully!');
            setEditingJob(null);
            fetchData();
        } catch (err) { alert('Failed to update job'); }
    };

    const markJobCompleted = async (id) => {
        try {
            await axios.put(`/api/jobs/${id}/status`, { status: 'completed' });
            showToast('✅ Job marked as completed!');
            fetchData();
        } catch (err) { alert('Failed to complete job'); }
    };

    const appsByJob = apps.reduce((acc, app) => {
        const key = app.job?._id || 'unknown';
        if (!acc[key]) acc[key] = { job: app.job, items: [] };
        acc[key].items.push(app);
        return acc;
    }, {});

    return (
        <div className="container anim-fade-up" style={{ paddingBottom: '4rem' }}>
            {toast && <div className="toast">{toast}</div>}

            {/* Header */}
            <div className="page-header flex" style={{ justifyContent: 'space-between' }}>
                <div>
                    <h1 className="page-title">🌾 Farm Owner Dashboard</h1>
                    <p className="page-subtitle">Manage your jobs and worker applications</p>
                </div>
                <button onClick={() => setShowPost(!showPost)} className="btn btn-primary">
                    {showPost ? 'Cancel' : <><Plus size={18}/> Post Jobs</>}
                </button>
            </div>

            {/* Stats */}
            <div className="grid-4 mb-3">
                <div className="stat-card"><div className="stat-value">{stats.totalJobs}</div><div className="stat-label">Total Jobs Posted</div></div>
                <div className="stat-card"><div className="stat-value">{stats.completedJobs}</div><div className="stat-label">Jobs Completed</div></div>
                <div className="stat-card"><div className="stat-value">{apps.filter(a => a.status === 'pending').length}</div><div className="stat-label">Pending Applications</div></div>
                <div className="stat-card"><div className="stat-value">{apps.filter(a => a.status === 'accepted').length}</div><div className="stat-label">Hired Workers</div></div>
            </div>

            {/* Bulk Job Posting */}
            {showPost && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card-flat mb-3">
                    <div className="section-header">
                        <h2 className="section-title">📋 Bulk Job Posting</h2>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{jobs.length} job{jobs.length > 1 ? 's' : ''} in queue</span>
                    </div>
                    <form onSubmit={handleBulkSubmit}>
                        {jobs.map((job, idx) => (
                            <div key={job._id} className="card-flat mb-2" style={{ border: '1.5px solid var(--border)', position: 'relative' }}>
                                <div className="flex gap-1 mb-2" style={{ justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Job #{idx + 1}</span>
                                    {jobs.length > 1 && <button type="button" onClick={() => removeJob(job._id)} className="btn btn-danger btn-sm"><Trash2 size={14}/></button>}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Job Title *</label>
                                        <input className="form-input" required placeholder="e.g., Wheat Harvesting" value={job.title} onChange={e => updateJob(job._id, 'title', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Work Type *</label>
                                        <select className="form-input" value={job.workType} onChange={e => updateJob(job._id, 'workType', e.target.value)}>
                                            {WORK_TYPES.map(wt => <option key={wt}>{wt}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Date *</label>
                                        <input type="date" className="form-input" required value={job.date} onChange={e => updateJob(job._id, 'date', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Wage (₹/day) *</label>
                                        <input type="number" className="form-input" required placeholder="500" value={job.wage} onChange={e => updateJob(job._id, 'wage', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Location *</label>
                                        <LocationInput required placeholder="Village, District" value={job.location} onChange={val => updateJob(job._id, 'location', val)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Workers Required</label>
                                        <input type="number" min="1" className="form-input" value={job.numWorkersRequired} onChange={e => updateJob(job._id, 'numWorkersRequired', e.target.value)} />
                                    </div>
                                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                        <label className="form-label">Description</label>
                                        <textarea className="form-input" rows={2} placeholder="Describe the work..." value={job.description} onChange={e => updateJob(job._id, 'description', e.target.value)} />
                                    </div>
                                    <div className="flex gap-1">
                                        <input type="checkbox" id={`urgent-${job._id}`} checked={job.isUrgent} onChange={e => updateJob(job._id, 'isUrgent', e.target.checked)} />
                                        <label htmlFor={`urgent-${job._id}`} style={{ fontWeight: 600, color: 'var(--danger)', fontSize: '0.9rem', cursor: 'pointer' }}>🔴 Mark as Urgent</label>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="flex gap-2 mt-2">
                            <button type="button" onClick={addJob} className="btn btn-outline">
                                <Plus size={16}/> Add Another Job
                            </button>
                            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
                                <Send size={16}/> {submitting ? 'Posting...' : `Post ${jobs.length} Job${jobs.length > 1 ? 's' : ''}`}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Applications */}
            <div className="section-header">
                <h2 className="section-title">📥 Worker Applications</h2>
            </div>
            {Object.keys(appsByJob).length === 0
                ? <div className="card-flat text-center text-muted" style={{ padding: '3rem' }}>No applications received yet.</div>
                : Object.values(appsByJob).map(({ job: jobData, items }) => (
                    <div key={jobData?._id} className="card-flat mb-2">
                        {editingJob && editingJob._id === jobData?._id ? (
                            <form onSubmit={handleUpdateJob} className="mb-2">
                                <div className="flex gap-1 mb-2" style={{ justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>Edit Job</span>
                                    <button type="button" onClick={() => setEditingJob(null)} className="btn btn-outline btn-sm"><X size={14}/> Cancel</button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Job Title *</label>
                                        <input className="form-input" required value={editingJob.title} onChange={e => setEditingJob({...editingJob, title: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Wage (₹/day) *</label>
                                        <input type="number" className="form-input" required value={editingJob.wage} onChange={e => setEditingJob({...editingJob, wage: e.target.value})} />
                                    </div>
                                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                        <label className="form-label">Location *</label>
                                        <LocationInput required value={editingJob.location} onChange={val => setEditingJob({...editingJob, location: val})} />
                                    </div>
                                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                        <label className="form-label">Description</label>
                                        <textarea className="form-input" rows={2} value={editingJob.description} onChange={e => setEditingJob({...editingJob, description: e.target.value})} />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary mt-1">Save Changes</button>
                            </form>
                        ) : (
                            <>
                                <div className="flex gap-1" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setExpandedApps(p => ({ ...p, [jobData?._id]: !p[jobData?._id] }))}>
                                        <span style={{ fontWeight: 700 }}>{jobData?.title}</span>
                                        <span className="text-muted" style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>({items.length} applicant{items.length > 1 ? 's' : ''})</span>
                                        <span className="text-muted" style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>📍 {jobData?.location}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {jobData?.status !== 'completed' && <button onClick={(e) => { e.stopPropagation(); markJobCompleted(jobData._id); }} className="btn btn-success btn-sm" title="Mark as Completed"><CheckCircle size={16}/></button>}
                                        {jobData?.status === 'completed' && <span className="badge badge-success" style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', marginRight: '0.5rem' }}>COMPLETED</span>}
                                        <button onClick={(e) => { e.stopPropagation(); setEditingJob(jobData); }} className="btn btn-outline btn-sm" title="Edit Job"><Edit3 size={16}/></button>
                                        <button onClick={(e) => { e.stopPropagation(); setExpandedApps(p => ({ ...p, [jobData?._id]: !p[jobData?._id] })); }} className="btn btn-outline btn-sm" style={{ border: 'none' }}>
                                            {expandedApps[jobData?._id] ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                                        </button>
                                    </div>
                                </div>
                                {expandedApps[jobData?._id] && (
                            <div className="mt-2">
                                <div className="divider"/>
                                {items.map(app => (
                                    <div key={app._id} className="flex gap-2 mt-2" style={{ flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'var(--bg)', borderRadius: '10px' }}>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{app.worker?.name}</div>
                                            <div className="text-muted" style={{ fontSize: '0.83rem' }}>{app.worker?.location} · ⭐ {app.worker?.rating?.toFixed(1) || '—'} · 📞 {app.worker?.phone || 'No phone'}</div>
                                        </div>
                                        <span className={`badge badge-${app.status}`}>{app.status.toUpperCase()}</span>
                                        {app.status === 'pending' && (
                                            <div className="flex gap-1">
                                                <button onClick={() => handleAppAction(app._id, 'accepted')} className="btn btn-success btn-sm"><CheckCircle size={14}/> Accept</button>
                                                <button onClick={() => handleAppAction(app._id, 'rejected')} className="btn btn-danger btn-sm">Reject</button>
                                            </div>
                                        )}
                                        {app.status === 'accepted' && (
                                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Worker responded: <b>{app.workerAccepted}</b></span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        </>
                    )}
                    </div>
                ))
            }
        </div>
    );
};

export default FarmerDashboard;
