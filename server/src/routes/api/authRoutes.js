

const router = require('express').Router();
const { registerUser, loginUser, getUser, updateUser } = require("../../controllers/authController");
const { authMiddleware } = require('../../utils/auth');

// POST /api/users/register - Create a new user
router.post('/register', registerUser);

// POST /api/users/login - Authenticate a user and return a token
router.post('/login', loginUser);

// GET /api/users/profile - Get the authenticated user's information
router.get('/profile', authMiddleware, getUser);

// PUT /api/users/profile - Update users info
router.put('/profile', authMiddleware, updateUser)

module.exports = router;