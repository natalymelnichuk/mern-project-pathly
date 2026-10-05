const router = require('express').Router();
const authRoutes = require('./authRoutes');
const tripRoutes = require('./tripRoutes');
const activityRoutes = require('./activityRoutes');


// All users routes will be prefixed with /users
router.use('/users', authRoutes);

// All trip routes will be prefixed with /trips
router.use('/trips', tripRoutes);

// All activity routes will be prefixed with /activities
router.use('/activities', activityRoutes);

module.exports = router;