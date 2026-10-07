
const User = require('../models/User.js');
const { signToken } = require('../utils/auth.js');

// POST /api/users/register - Create a new user
async function registerUser(req, res) {
    try {
        const user = await User.create(req.body);
        const token = signToken(user);
        res.status(201).json({ token, user });
    } catch (err) {
        console.log('Error during registration:', err);
        res.status(400).json({ message: err.message || 'Registration failed' });
    }
}

// POST /api/users/login - Authenticate a user and return a token
async function loginUser(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({ message: "Can't find this user" });
        }

        const correctPw = await user.isCorrectPassword(req.body.password);

        if (!correctPw) {
            return res.status(400).json({ message: 'Wrong password!' });
        }

        const token = signToken(user);
        res.json({ token, user });
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get /api/users/profile - Get the authenticated user's information
async function getUser(req, res) {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// PUT /api/users/profile — Update user profile
async function updateUser(req, res) {
    try {
        const { categories } = req.body;

        
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { categories },
            { returnDocument: 'after' }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}


module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUser,
};