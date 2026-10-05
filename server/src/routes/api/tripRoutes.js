


const router = require('express').Router();
const { 
    getTrips, 
    createTrip, 
    updateTrip, 
    deleteTrip, 
    getTripById  
} = require("../../controllers/tripController")
const { authMiddleware } = require('../../utils/auth');
// const { getActivityByTrip, createActivity } = require('../../controllers/activityController');

// Apply authMiddleware to all routes in this file
router.use(authMiddleware);

// GET /api/trips - Get all trips for the logged-in user
// THIS IS THE ROUTE THAT CURRENTLY HAS THE FLAW
router.get('/', getTrips);

// POST /api/trips - Create a new trip
router.post('/', createTrip);

// PUT /api/trips/:id - Update a trip
router.put('/:id', updateTrip);

// DELETE /api/trips/:id - Delete a trip
router.delete('/:id', deleteTrip);

// Get Single Trip
router.get('/:id', getTripById);

/*

// GET /api/trips/:tripId/activity - Get all activities for a specific trip
router.get('/:tripId/activity', getActivityByTrip);

// POST /api/trips/:tripId/activity - Create a new activity for a specific trip
router.post('/:tripId/activity', createActivity);


*/
module.exports = router;