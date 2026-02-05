const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  licenseNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  city: {
    type: String,
    default: 'Delhi NCR',
    trim: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Driver', driverSchema);
