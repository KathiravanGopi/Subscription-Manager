const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  logout, 
  checkAuth, 
  resetPassword, 
  resetUsername, 
  deleteAccount,
  sendPasswordResetOTP,
  verifyOTPAndResetPassword,
  sendEmailUpdateOTP,
  verifyOTPAndUpdateEmail
} = require('../controllers/authController');
const { auth } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check', auth, checkAuth);

// Old routes (keep for backward compatibility if needed)
router.put('/reset-password', auth, resetPassword);
router.put('/reset-username', auth, resetUsername);

// New OTP-based routes
router.post('/send-password-reset-otp', auth, sendPasswordResetOTP);
router.post('/verify-password-reset-otp', auth, verifyOTPAndResetPassword);
router.post('/send-email-update-otp', auth, sendEmailUpdateOTP);
router.post('/verify-email-update-otp', auth, verifyOTPAndUpdateEmail);

router.delete('/delete-account', auth, deleteAccount);

module.exports = router;
