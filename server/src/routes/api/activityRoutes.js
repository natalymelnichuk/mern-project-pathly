

const router = require('express').Router();
const {
    createActivity,
    getActivityById,
    updateActivity,
    deleteActivity,
} = require('../../controllers/activityController');
const { authMiddleware } = require('../../utils/auth');

// All routes in this file will require authentication
router.use(authMiddleware);

// POST /api/activities — Create a new activity
router.post('/', createActivity);

// GET, PUT, DELETE /api/activities/:id — Work with a specific activity
router.route('/:id')
    .get(getActivityById)
    .put(updateActivity)
    .delete(deleteActivity);

module.exports = router;