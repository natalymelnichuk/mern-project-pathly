

const router = require('express').Router();
const { registerUser, loginUser, getUser } = require("../../controllers/authController");
const { authMiddleware } = require('../../utils/auth');

// POST /api/users/register - Create a new user
router.post('/register', registerUser);

// POST /api/users/login - Authenticate a user and return a token
router.post('/login', loginUser);

// GET /api/users/me - Get the authenticated user's information
router.get('/me', authMiddleware, getUser);

module.exports = router;