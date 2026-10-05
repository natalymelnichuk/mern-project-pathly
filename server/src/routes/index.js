
const router = require('express').Router();
const apiRoutes = require('./api');

// Connect all API routes under the /api prefix
router.use('/api', apiRoutes);

// Handle undefined routes
router.use((req, res) => {
  res.status(404).json({ message: '404 Not Found' });
});

module.exports = router;
