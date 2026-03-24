import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/login', formData);
            login(res.data);
            navigate(res.data.user.role === 'Farmer' ? '/farmer-dashboard' : '/worker-dashboard');
        } catch (err) {
            if (!err.response) {
                alert('Network Error: Cannot reach the server. Please ensure the backend is running.');
            } else {
                alert(err.response?.data?.message || 'Login failed. Check your credentials.');
            }
        } finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '420px' }}>
                {/* Brand */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(39,174,96,0.12)', borderRadius: '50%', width: 60, height: 60, marginBottom: '1rem' }}>
                        <Sprout size={28} color="var(--primary)" />
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome Back</h1>
                    <p className="text-muted mt-1">Sign in to your AgriConnect account</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
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
                                <input type="password" className="form-input" required placeholder="••••••••"
                                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2" style={{ padding: '0.85rem', fontSize: '1rem', marginTop: '1.2rem' }}>
                            {loading ? 'Signing in…' : <><LogIn size={18} /> Sign In</>}
                        </button>
                    </form>
                    <div className="divider" style={{ marginTop: '1.5rem' }} />
                    <p className="text-center text-muted" style={{ fontSize: '0.9rem' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Create one →</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
