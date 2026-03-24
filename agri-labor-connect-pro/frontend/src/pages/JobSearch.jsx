import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';
import LocationInput from '../components/LocationInput';
import { Search, Filter, MapPin, Tag, Zap } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const WORK_TYPES = ['', 'Harvesting', 'Planting', 'Ploughing', 'Irrigation', 'Pesticide Spraying', 'Weeding', 'Fruit Picking', 'Greenhouse Work', 'Livestock Care', 'Equipment Operation'];

const JobSearch = () => {
    const [jobs, setJobs] = useState([]);
    const [appliedIds, setAppliedIds] = useState(new Set());
    const [filters, setFilters] = useState({ location: '', workType: '', isUrgent: false });
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => { fetchJobs(); }, [filters]);
    useEffect(() => { if (user?.role === 'Worker') fetchMyApps(); }, [user]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.location) params.set('location', filters.location);
            if (filters.workType) params.set('workType', filters.workType);
            if (filters.isUrgent) params.set('isUrgent', 'true');
            const res = await axios.get(`/api/jobs?${params.toString()}`);
            setJobs(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchMyApps = async () => {
        try {
            const res = await axios.get('/api/applications');
            setAppliedIds(new Set(res.data.map(a => a.job?._id)));
        } catch (err) { /* ignore */ }
    };

    const handleApply = async (jobId) => {
        if (!user) { window.location.href = '/login'; return; }
        try {
            await axios.post('/api/applications', { jobId });
            setAppliedIds(prev => new Set([...prev, jobId]));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to apply');
        }
    };

    const urgentJobs = jobs.filter(j => j.isUrgent);
    const regularJobs = jobs.filter(j => !j.isUrgent);

    return (
        <div className="container anim-fade-in" style={{ paddingBottom: '4rem' }}>
            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">Browse Jobs</h1>
                <p className="page-subtitle">{jobs.length} available job{jobs.length !== 1 ? 's' : ''} found</p>
            </div>

            {/* Filters */}
            <div className="card-flat mb-3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label className="form-label"><MapPin size={13}/> Location</label>
                    <LocationInput 
                        placeholder="Search by city or village…"
                        value={filters.location} 
                        onChange={val => setFilters({ ...filters, location: val })} 
                    />
                </div>
                <div style={{ flex: 1, minWidth: '180px' }}>
                    <label className="form-label"><Tag size={13}/> Work Type</label>
                    <select className="form-input" value={filters.workType} onChange={e => setFilters({ ...filters, workType: e.target.value })}>
                        {WORK_TYPES.map(wt => <option key={wt} value={wt}>{wt || 'All Types'}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.1rem' }}>
                    <input type="checkbox" id="urgent" checked={filters.isUrgent} onChange={e => setFilters({ ...filters, isUrgent: e.target.checked })} style={{ width: 17, height: 17 }} />
                    <label htmlFor="urgent" style={{ fontWeight: 700, color: 'var(--danger)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Zap size={15}/> Urgent Only
                    </label>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-muted" style={{ padding: '4rem' }}>Loading jobs…</div>
            ) : (
                <>
                    {/* Urgent Banner */}
                    {urgentJobs.length > 0 && !filters.isUrgent && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Zap size={18}/> Urgent Jobs — Apply Immediately
                            </h2>
                            <div className="grid-3">
                                {urgentJobs.map(job => (
                                    <JobCard key={job._id} job={job} isWorker={user?.role === 'Worker'} onApply={handleApply} applied={appliedIds.has(job._id)} />
                                ))}
                            </div>
                            <div className="divider" style={{ margin: '2rem 0' }} />
                        </div>
                    )}

                    {/* All / Regular Jobs */}
                    {regularJobs.length > 0 || (filters.isUrgent && urgentJobs.length > 0) ? (
                        <>
                            {!filters.isUrgent && regularJobs.length > 0 && (
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>All Open Jobs</h2>
                            )}
                            <div className="grid-3">
                                {(filters.isUrgent ? urgentJobs : regularJobs).map(job => (
                                    <motion.div key={job._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                                        <JobCard job={job} isWorker={user?.role === 'Worker'} onApply={handleApply} applied={appliedIds.has(job._id)} />
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="card-flat text-center text-muted" style={{ padding: '4rem' }}>
                            No jobs found. Try different filters or{' '}
                            {user?.role === 'Farmer' ? <a href="/farmer-dashboard" style={{ color: 'var(--primary)', fontWeight: 600 }}>post a new job</a> : 'check back later.'}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default JobSearch;
