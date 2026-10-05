

const mongoose = require('mongoose');
 

const tripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  destination: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalBudget: {
    type: Number,
    required: true,
    default: 0,
  },
  user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
  }
}, {
    timestamps: true,
});
 
const Trip = mongoose.model('Trip', tripSchema);
 
module.exports = Trip;