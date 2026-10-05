
const mongoose = require('mongoose');
 

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    default: 'Other',
  },
  cost: {
    type: Number,
    required: true,
    default: 0,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    name: {
        type: String,
    },
    lat: {
        type: Number,
    },
    lng: {
        type: Number,
    }
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do',
  },
  trip: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Trip',
  required: true,
  }
}, {
    timestamps: true,
});
 
const Activity = mongoose.model('Activity', activitySchema);
 
module.exports = Activity;