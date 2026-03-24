import React from 'react';
import { Calendar, MapPin, DollarSign, Users, Clock, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const JobCard = ({ job, onApply, isWorker, applied }) => {
    const dateStr = job.date ? new Date(job.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

    return (
        <motion.div whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.13)' }} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {/* Top */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                <div>
                    <span className="tag" style={{ fontSize: '0.75rem', marginBottom: '0.4rem', display: 'inline-block' }}>{job.workType}</span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.2rem', color: 'var(--text-main)' }}>{job.title}</h3>
                </div>
                {job.isUrgent && <span className="badge badge-urgent"><Zap size={12}/> URGENT</span>}
            </div>

            {/* Description */}
            {job.description && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                    {job.description.length > 90 ? job.description.slice(0, 90) + '…' : job.description}
                </p>
            )}

            {/* Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                {[
                    [<Calendar size={14}/>, dateStr],
                    [<MapPin size={14}/>, job.location],
                    [<DollarSign size={14}/>, `₹${job.wage}/day`],
                    [<Users size={14}/>, `${job.numWorkersRequired} worker${job.numWorkersRequired > 1 ? 's' : ''} needed`],
                ].map(([icon, text], i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--primary)' }}>{icon}</span>{text}
                    </div>
                ))}
            </div>

            {/* Farmer info */}
            {job.farmer && (
                <>
                    <div className="divider"/>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0' }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(39,174,96,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {job.farmer.name?.[0]?.toUpperCase() || 'F'}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.83rem', fontWeight: 600 }}>{job.farmer.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Star size={11} fill="var(--warning)" color="var(--warning)"/> {job.farmer.rating?.toFixed(1) || 'New'}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* CTA */}
            {isWorker && (
                <button onClick={() => onApply(job._id)} disabled={applied} className={`btn ${applied ? 'btn-outline' : 'btn-primary'} w-full`} style={{ marginTop: '0.8rem' }}>
                    {applied ? '✓ Applied' : 'Apply Now →'}
                </button>
            )}
        </motion.div>
    );
};

export default JobCard;
