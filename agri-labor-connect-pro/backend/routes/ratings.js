const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Rate a user (Farmer rates Worker or vice-versa)
router.post('/', auth, async (req, res) => {
    try {
        const { userId, rating } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const totalRating = user.rating * user.numRatings + rating;
        user.numRatings += 1;
        user.rating = totalRating / user.numRatings;
        
        await user.save();
        res.json({ message: 'Rating submitted', averageRating: user.rating });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
