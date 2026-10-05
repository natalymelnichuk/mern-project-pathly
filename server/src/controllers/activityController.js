

const Activity = require('../models/Activity');
const Trip = require('../models/Trip');

// POST /api/activities — Create a new activity
async function createActivity(req, res) {
    try {

        const tripId = req.body.trip || req.params.tripId;

        if (!tripId) {
            return res.status(400).json({ message: 'Trip ID is required.' });
        }

        // 1. Check if the user has access to the trip
        const trip = await Trip.findOne({
        _id: tripId,
        user: req.user._id,
        });

        if (!trip) {
        return res.status(404).json({ message: 'Trip not found or unauthorized' });
        }

        // 2. Create the activity
        const activity = await Activity.create({
            ...req.body,
            trip: tripId,
        });

        res.status(201).json(activity);
    } catch (err) {
        res.status(400).json({ message: 'Error creating activity', error: err.message });
    }
}

// GET Get all activities for a specific trip
async function getActivitiesByTrip(req, res) {
    try {
        // Check if the user has access to the trip
        const trip = await Trip.findOne({
        _id: req.params.tripId,
        user: req.user._id,
        });

        if (!trip) {
        return res.status(404).json({ message: 'Trip not found or unauthorized' });
        }

        const activities = await Activity.find({ trip: req.params.tripId });
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// PUT /api/activities/:id — Update an activity
async function updateActivity(req, res) {
    try {
        const activity = await Activity.findById(req.params.id).populate('trip');

        if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
        }

        // Check if the trip of this activity belongs to the current user
        if (activity.trip.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized to update this activity' });
        }

        const updatedActivity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        });

        res.json(updatedActivity);
    } catch (err) {
        res.status(400).json({ message: 'Error updating activity', error: err.message });
    }
}

// DELETE /api/activities/:id — Delete an activity
async function deleteActivity(req, res) {
    try {
        const activity = await Activity.findById(req.params.id).populate('trip');

        if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
        }

        if (activity.trip.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized to delete this activity' });
        }

        await activity.deleteOne();
        res.json({ message: 'Activity deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Optional: Secure “Get Activity”
async function getActivityById(req, res) {
    try {
        // 1. Find the activity with an id
        const activity = await Activity.findById(req.params.id).populate('trip');
        if (!activity) {
        return res.status(404).json({ message: 'No activity found with this id!' });
        }

        // 2. Check ownership
        if (activity.trip.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to view this activity!' });
        }

        // 3. If everything if fine, user'll be able to get this activity
        res.json(activity);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    createActivity,
    getActivitiesByTrip,
    updateActivity,
    deleteActivity,
    getActivityById
};