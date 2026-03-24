import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Sun, Moon, Sprout, LayoutDashboard, Search, MessageSquare } from 'lucide-react';

const Navbar = () => {
    const { user, logout, theme, toggleTheme } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/'); };
    const dashLink = user?.role === 'Farmer' ? '/farmer-dashboard' : '/worker-dashboard';

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <Sprout size={28} />
                <span>AgriConnect Pro</span>
            </Link>
            <div className="navbar-actions">
                <Link to="/jobs" className="navbar-link">Browse Jobs</Link>
                {user
                    ? <>
                        <Link to={dashLink} className="navbar-link flex gap-1">
                            <LayoutDashboard size={16}/> Dashboard
                        </Link>
                        <span style={{ padding: '0.4rem 0.9rem', background: 'rgba(39,174,96,0.12)', borderRadius: '100px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {user.name} · {user.role}
                        </span>
                        <button onClick={handleLogout} className="btn btn-danger btn-sm">
                            <LogOut size={15}/> Logout
                        </button>
                    </>
                    : <>
                        <Link to="/login" className="navbar-link">Login</Link>
                        <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                    </>}
                <button onClick={toggleTheme} className="btn-icon" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
                    {theme === 'light' ? <Moon size={21}/> : <Sun size={21}/>}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
