import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Users, ShieldCheck, TrendingUp, Zap, Star, ArrowRight, CheckCircle } from 'lucide-react';

const FEATURES = [
    { icon: <Zap size={28}/>, title: 'Smart Matching', desc: 'AI-powered algorithm connects the right worker with the right farm job instantly.' },
    { icon: <TrendingUp size={28}/>, title: 'Real-time Updates', desc: 'Live notifications for new jobs, applications, and messages via WebSocket.' },
    { icon: <ShieldCheck size={28}/>, title: 'Trusted & Verified', desc: 'Secure profiles, ratings, and reviews keep both farmers and workers accountable.' },
    { icon: <Star size={28}/>, title: 'Earnings Dashboard', desc: 'Workers track income history; Farmers monitor completed job analytics.' },
];

const WORK_TYPES = ['Harvesting', 'Planting', 'Ploughing', 'Irrigation', 'Pesticide Spraying', 'Weeding', 'Fruit Picking', 'Greenhouse Work', 'Livestock Care', 'Equipment Operation'];

const Home = () => {
    const { user } = useContext(AuthContext);
    const [activeRole, setActiveRole] = useState('Farmer'); // Demo role switch
    const navigate = useNavigate();

    const handleRoleAction = () => {
        if (!user) { navigate('/register'); return; }
        navigate(activeRole === 'Farmer' ? '/farmer-dashboard' : '/worker-dashboard');
    };

    return (
        <div>
            {/* Hero */}
            <section className="hero container anim-fade-up">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(39,174,96,0.1)', color: 'var(--primary)', padding: '0.35rem 1rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                    <Sprout size={16}/> India's #1 Agricultural Labor Platform
                </div>
                <h1>
                    Connecting <span className="gradient-text">Farmers</span> with<br/>
                    Skilled <span className="gradient-text">Agricultural Workers</span>
                </h1>
                <p>Post jobs, find work, and manage agricultural labor — all in one powerful platform built for the modern Indian farmer.</p>

                {/* Role Switch */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <div className="role-switch" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}>
                        <button className={`role-switch-btn ${activeRole === 'Farmer' ? 'active' : ''}`} onClick={() => setActiveRole('Farmer')}>
                            🌾 I'm a Farm Owner
                        </button>
                        <button className={`role-switch-btn ${activeRole === 'Worker' ? 'active' : ''}`} onClick={() => setActiveRole('Worker')}>
                            👨‍🌾 I'm a Laborer
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={activeRole} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                        className="card-flat" style={{ maxWidth: 520, margin: '0 auto 2rem', textAlign: 'left' }}>
                        {activeRole === 'Farmer' ? (
                            <>
                                <h3 style={{ color: 'var(--primary)', marginBottom: '0.8rem' }}>🌾 As a Farm Owner, you can:</h3>
                                {['Post unlimited jobs with one click', 'Bulk-add up to 10 jobs at once', 'Accept or reject worker applications', 'View worker ratings before hiring', 'Chat with accepted workers directly'].map(f => (
                                    <div key={f} className="flex gap-1" style={{ marginBottom: '0.5rem' }}>
                                        <CheckCircle size={17} color="var(--success)"/><span style={{ fontSize: '0.92rem' }}>{f}</span>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                <h3 style={{ color: 'var(--primary)', marginBottom: '0.8rem' }}>👨‍🌾 As a Laborer, you can:</h3>
                                {['Browse nearby jobs by location', 'Apply with a single tap', 'Accept or reject job offers', 'Track your earnings over time', 'Rate farmers after job completion'].map(f => (
                                    <div key={f} className="flex gap-1" style={{ marginBottom: '0.5rem' }}>
                                        <CheckCircle size={17} color="var(--success)"/><span style={{ fontSize: '0.92rem' }}>{f}</span>
                                    </div>
                                ))}
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="hero-actions">
                    <button onClick={handleRoleAction} className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '0.9rem 2.2rem' }}>
                        {user ? 'Go to Dashboard' : `Join as ${activeRole === 'Farmer' ? 'Farm Owner' : 'Laborer'}`} <ArrowRight size={20}/>
                    </button>
                    <Link to="/jobs" className="btn btn-outline">Browse Available Jobs</Link>
                </div>
            </section>

            {/* Work Types Section */}
            <section style={{ background: 'rgba(39,174,96,0.05)', padding: '3rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div className="container text-center">
                    <p className="text-muted mb-2" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.8rem' }}>Work Categories We Support</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' }}>
                        {WORK_TYPES.map(w => <span key={w} className="tag">{w}</span>)}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="container" style={{ padding: '5rem 1.5rem' }}>
                <div className="text-center mb-3">
                    <h2 style={{ fontSize: '1.9rem', fontWeight: 800 }}>Everything you need to manage <span className="gradient-text">farm labor</span></h2>
                    <p className="text-muted mt-1">Trusted by thousands of farmers and workers across India</p>
                </div>
                <div className="grid-4">
                    {FEATURES.map((f, i) => (
                        <motion.div key={i} whileHover={{ scale: 1.03 }} className="card text-center">
                            <div className="icon-circle" style={{ margin: '0 auto 1rem' }}>{f.icon}</div>
                            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Stats Banner */}
            <section style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', color: '#fff', padding: '3rem 0' }}>
                <div className="container grid-4 text-center">
                    {[['50,000+', 'Registered Workers'], ['12,000+', 'Active Farmers'], ['2,00,000+', 'Jobs Completed'], ['4.8★', 'Average Rating']].map(([v, l]) => (
                        <div key={l}>
                            <div style={{ fontSize: '2.2rem', fontWeight: 900 }}>{v}</div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.3rem' }}>{l}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.88rem', borderTop: '1px solid var(--border)' }}>
                © 2026 AgriConnect Pro. Empowering farmers and workers across India.
            </footer>
        </div>
    );
};

export default Home;
