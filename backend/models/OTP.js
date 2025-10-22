const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['password-reset', 'email-update'],
    required: true
  },
  newEmail: {
    type: String,
    // Only required for email-update type
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // OTP expires after 10 minutes
  }
});

module.exports = mongoose.model('OTP', otpSchema);
