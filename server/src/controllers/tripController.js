

const Trip = require('../models/Trip');


// GET /api/trips - Get all trips for the logged-in user
async function getTrips(req, res) {
  // This currently finds all trips in the database.
  // It should only find trips owned by the logged in user.
    try {
        const trips = await Trip.find({ user: req.user._id });
        res.json(trips);
    } catch (err) {
        res.status(500).json(err);
    }
};
 
// POST /api/trips - Create a new trip
async function createTrip(req, res) {
    try {
        const trip = await Trip.create({
        ...req.body,
        // The user ID needs to be added here
        user: req.user._id        
        });
        
        res.status(201).json(trip);
    } catch (err) {
        res.status(400).json(err);
    }
};
 
// PUT /api/trips/:id - Update a trip
async function updateTrip (req, res) {
    try {
        // This needs an authorization check
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
        return res.status(404).json({ message: 'No trip found with this id!' });
        }

        if (trip.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this trip!' });
        }

        const updatedTrip = await Trip.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after', runValidators: true}
        )
        res.json(updatedTrip);
    } catch (err) {
        res.status(500).json(err);
    }
};

// DELETE /api/trips/:id - Delete a trip
async function deleteTrip (req, res) {
    try {
        // This needs an authorization check
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
        return res.status(404).json({ message: 'No trip found with this id!' });
        }

        if (trip.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this trip!' });
        }

        await trip.deleteOne();

        res.json({ message: 'Trip deleted!' });
    } catch (err) {
        res.status(500).json(err);
    }
};

// Optional: Secure “Get Single Trip”
async function getTripById(req, res) {
    try {
        // 1. Find the trip with an id
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
        return res.status(404).json({ message: 'No trip found with this id!' });
        }

        // 2. Check ownership
        if (trip.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to view this trip!' });
        }

        // 3. If everything if fine, user'll be able to get this trip
        res.json(trip);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    getTrips,
    createTrip,
    updateTrip,
    deleteTrip,
    getTripById
}; 


