import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, MapPin, UserPlus, Sprout, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Worker', location: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/register', formData);
            login(res.data);
            navigate(res.data.user.role === 'Farmer' ? '/farmer-dashboard' : '/worker-dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed.');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '480px' }}>
                {/* Brand */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(39,174,96,0.12)', borderRadius: '50%', width: 60, height: 60, marginBottom: '1rem' }}>
                        <Sprout size={28} color="var(--primary)" />
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Join AgriConnect Pro</h1>
                    <p className="text-muted mt-1">Start connecting with farmers and workers today</p>
                </div>

                {/* Role Toggle */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <div className="role-switch" style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
                        <button type="button" className={`role-switch-btn ${formData.role === 'Worker' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, role: 'Worker' })}>
                            👨‍🌾 I'm a Laborer
                        </button>
                        <button type="button" className={`role-switch-btn ${formData.role === 'Farmer' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, role: 'Farmer' })}>
                            🌾 I'm a Farm Owner
                        </button>
                    </div>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Full Name</label>
                                <div className="form-input-icon">
                                    <User size={18} />
                                    <input type="text" className="form-input" required placeholder="Your full name"
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Email Address</label>
                                <div className="form-input-icon">
                                    <Mail size={18} />
                                    <input type="email" className="form-input" required placeholder="you@example.com"
                                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="form-input-icon">
                                    <Lock size={18} />
                                    <input type="password" className="form-input" required placeholder="Min. 6 characters"
                                        value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <div className="form-input-icon">
                                    <MapPin size={18} />
                                    <input type="text" className="form-input" required placeholder="City / Village"
                                        value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Phone Number</label>
                                <div className="form-input-icon">
                                    <Phone size={18} />
                                    <input type="tel" className="form-input" required placeholder="Phone Number"
                                        value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(39,174,96,0.07)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.2rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                            {formData.role === 'Farmer'
                                ? '🌾 As a Farm Owner, you can post jobs, manage workers, and track analytics.'
                                : '👨‍🌾 As a Laborer, you can browse jobs, apply, and accept offers in real time.'}
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary w-full" style={{ padding: '0.85rem', fontSize: '1rem' }}>
                            {loading ? 'Creating account…' : <><UserPlus size={18} /> Create Account as {formData.role === 'Farmer' ? 'Farm Owner' : 'Laborer'}</>}
                        </button>
                    </form>
                    <div className="divider" style={{ marginTop: '1.5rem' }} />
                    <p className="text-center text-muted" style={{ fontSize: '0.9rem' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign in →</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
