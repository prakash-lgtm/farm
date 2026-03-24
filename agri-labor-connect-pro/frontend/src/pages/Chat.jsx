import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';
import { Send, ArrowLeft, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Chat = () => {
    const { userId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [otherUser, setOtherUser] = useState(null);
    const socketRef = useRef();
    const chatEndRef = useRef();

    useEffect(() => {
        if (!user) { navigate('/login'); return; }

        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('join', user.id);

        socketRef.current.on('receiveMessage', (data) => {
            if (data.senderId === userId || data.receiverId === userId) {
                setMessages(prev => [...prev, data]);
            }
        });

        fetchMessages();
        return () => socketRef.current?.disconnect();
    }, [userId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`/api/messages/${userId}`);
            setMessages(res.data);
        } catch (err) { console.error(err); }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        const msgPayload = { senderId: user.id, receiverId: userId, message: newMessage, createdAt: new Date() };
        try {
            await axios.post('/api/messages', { receiverId: userId, message: newMessage });
            socketRef.current.emit('sendMessage', msgPayload);
            setMessages(prev => [...prev, msgPayload]);
            setNewMessage('');
        } catch (err) { alert('Failed to send'); }
    };

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem 0 1rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm"><ArrowLeft size={16}/></button>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(39,174,96,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 800 }}>
                    <User size={20}/>
                </div>
                <div>
                    <div style={{ fontWeight: 700 }}>Chat</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time conversation</div>
                </div>
            </div>

            {/* Messages */}
            <div style={{ height: '58vh', overflowY: 'auto', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {messages.length === 0 && (
                    <div className="text-center text-muted" style={{ margin: 'auto' }}>No messages yet. Say hello! 👋</div>
                )}
                {messages.map((m, i) => {
                    const isMine = (m.sender?._id || m.senderId) === user.id;
                    return (
                        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '72%' }}>
                            <div style={{
                                background: isMine ? 'linear-gradient(135deg,var(--primary),var(--primary-light))' : 'var(--card-bg)',
                                color: isMine ? '#fff' : 'var(--text-main)',
                                padding: '0.75rem 1.1rem', borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                fontSize: '0.92rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                border: isMine ? 'none' : '1px solid var(--border)'
                            }}>
                                {m.message}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem', textAlign: isMine ? 'right' : 'left' }}>
                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </motion.div>
                    );
                })}
                <div ref={chatEndRef}/>
            </div>

            {/* Input */}
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.7rem', padding: '1rem 0', borderTop: '1px solid var(--border)' }}>
                <input type="text" className="form-input" placeholder="Type a message…" value={newMessage}
                    onChange={e => setNewMessage(e.target.value)} style={{ flex: 1 }} />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.2rem' }}>
                    <Send size={18}/>
                </button>
            </form>
        </div>
    );
};

export default Chat;
