const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');
const router = express.Router();

// Send a message
router.post('/', auth, async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const newMessage = new Message({
            sender: req.user.id,
            receiver: receiverId,
            message
        });
        await newMessage.save();

        // Emit via socket from controller if needed, but handled in server.js usually
        // For simplicity, we just save here.
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get messages between two users
router.get('/:otherUserId', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: req.params.otherUserId },
                { sender: req.params.otherUserId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
