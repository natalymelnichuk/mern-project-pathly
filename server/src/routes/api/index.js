const router = require('express').Router();
const authRoutes = require('./authRoutes');
const tripRoutes = require('./tripRoutes');


// All users routes will be prefixed with /users
router.use('/users', authRoutes);

// All trip routes will be prefixed with /trips
router.use('/trips', tripRoutes);

module.exports = router;