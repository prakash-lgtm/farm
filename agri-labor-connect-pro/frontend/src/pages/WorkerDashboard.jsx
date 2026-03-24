import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { DollarSign, CheckCircle, Clock, Search, ThumbsUp, ThumbsDown, MapPin, Calendar, AlertCircle } from 'lucide-react';

const WorkerDashboard = () => {
    const [myApps, setMyApps] = useState([]);
    const [stats, setStats] = useState({ jobsCompleted: 0, totalEarnings: 0 });
    const [toast, setToast] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'accepted' | 'rejected'

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [appsRes, statsRes] = await Promise.all([
                axios.get('/api/applications'),
                axios.get('/api/analytics'),
            ]);
            setMyApps(appsRes.data);
            setStats(statsRes.data);
        } catch (err) { console.error(err); }
    };

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    // Worker accepts or rejects a job that farmer approved
    const handleWorkerResponse = async (appId, workerAccepted) => {
        try {
            await axios.put(`/api/applications/${appId}/worker-response`, { workerAccepted });
            fetchData();
            showToast(workerAccepted === 'accepted' ? '✅ You accepted the job!' : '❌ You declined the job.');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to respond');
        }
    };

    const filtered = myApps.filter(a => activeTab === 'all' || a.status === activeTab);

    const TABS = [
        { key: 'all', label: 'All' },
        { key: 'pending', label: 'Pending' },
        { key: 'accepted', label: 'Accepted by Farmer' },
        { key: 'rejected', label: 'Rejected' },
    ];

    return (
        <div className="container anim-fade-up" style={{ paddingBottom: '4rem' }}>
            {toast && <div className="toast">{toast}</div>}

            {/* Header */}
            <div className="page-header flex" style={{ justifyContent: 'space-between' }}>
                <div>
                    <h1 className="page-title">👨‍🌾 Worker Dashboard</h1>
                    <p className="page-subtitle">Track your applications and job offers</p>
                </div>
                <a href="/jobs" className="btn btn-primary"><Search size={16}/> Browse Jobs</a>
            </div>

            {/* Stats */}
            <div className="grid-4 mb-3">
                <div className="stat-card"><div className="stat-value">{myApps.length}</div><div className="stat-label">Total Applied</div></div>
                <div className="stat-card"><div className="stat-value">{myApps.filter(a => a.status === 'accepted').length}</div><div className="stat-label">Accepted by Farmer</div></div>
                <div className="stat-card"><div className="stat-value" style={{ color: 'var(--success)' }}>₹{stats.totalEarnings}</div><div className="stat-label">Total Earnings</div></div>
                <div className="stat-card"><div className="stat-value">{stats.jobsCompleted}</div><div className="stat-label">Jobs Completed</div></div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-3" style={{ borderBottom: '2px solid var(--border)', paddingBottom: '0' }}>
                {TABS.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        style={{ padding: '0.5rem 1.2rem', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
                            color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-muted)',
                            borderBottom: activeTab === tab.key ? '3px solid var(--primary)' : '3px solid transparent',
                            marginBottom: '-2px' }}>
                        {tab.label}
                        <span style={{ fontSize: '0.75rem', background: 'var(--bg)', borderRadius: '100px', padding: '0.1rem 0.5rem', marginLeft: '0.4rem' }}>
                            {myApps.filter(a => tab.key === 'all' || a.status === tab.key).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Application Cards */}
            {filtered.length === 0
                ? <div className="card-flat text-center text-muted" style={{ padding: '3rem' }}>
                    No applications in this category. <a href="/jobs" style={{ color: 'var(--primary)', fontWeight: 600 }}>Browse jobs →</a>
                  </div>
                : <div className="grid-3">
                    {filtered.map(app => (
                        <motion.div key={app._id} whileHover={{ scale: 1.015 }} className="card">
                            <div className="flex gap-1" style={{ justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{app.job?.title}</h3>
                                {app.job?.isUrgent && <span className="badge badge-urgent">🔴 URGENT</span>}
                            </div>
                            <div className="flex gap-1 mb-1 text-muted" style={{ fontSize: '0.85rem' }}>
                                <MapPin size={15}/> {app.job?.location}
                            </div>
                            <div className="flex gap-1 mb-1 text-muted" style={{ fontSize: '0.85rem' }}>
                                <Calendar size={15}/> {app.job?.date ? new Date(app.job.date).toLocaleDateString() : '—'}
                            </div>
                            <div className="flex gap-1 mb-2 text-muted" style={{ fontSize: '0.85rem' }}>
                                <DollarSign size={15}/> ₹{app.job?.wage}/day
                            </div>

                            <div className="divider"/>

                            <div className="flex gap-1" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Farmer's Decision</div>
                                    <span className={`badge badge-${app.status}`} style={{ marginTop: '0.2rem' }}>{app.status.toUpperCase()}</span>
                                </div>
                                {app.status === 'accepted' && (
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Your Response</div>
                                        <span className={`badge badge-${app.workerAccepted === 'pending' ? 'pending' : app.workerAccepted === 'accepted' ? 'accepted' : 'rejected'}`} style={{ marginTop: '0.2rem' }}>
                                            {app.workerAccepted === 'pending' ? '⏳ Awaiting Your Response' : app.workerAccepted.toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Worker Accept / Reject Buttons */}
                            {app.status === 'accepted' && app.workerAccepted === 'pending' && (
                                <div className="flex gap-1 mt-2">
                                    <button onClick={() => handleWorkerResponse(app._id, 'accepted')} className="btn btn-success w-full">
                                        <ThumbsUp size={16}/> Accept Job
                                    </button>
                                    <button onClick={() => handleWorkerResponse(app._id, 'rejected')} className="btn btn-danger w-full">
                                        <ThumbsDown size={16}/> Decline
                                    </button>
                                </div>
                            )}
                            {app.status === 'accepted' && app.workerAccepted === 'accepted' && (
                                <div className="mt-2" style={{ textAlign: 'center', background: 'rgba(39,174,96,0.08)', borderRadius: 10, padding: '0.6rem', color: 'var(--success)', fontWeight: 700, fontSize: '0.9rem' }}>
                                    <CheckCircle size={16} style={{ verticalAlign: 'text-bottom', marginRight: 4 }}/> You've confirmed this job!
                                </div>
                            )}
                        </motion.div>
                    ))}
                  </div>
            }
        </div>
    );
};

export default WorkerDashboard;
