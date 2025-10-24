const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTPEmail } = require('../utils/emailService');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '7d',
  });

// Cookie options for cross-site authentication
const getCookieOptions = () => ({
  httpOnly: true,
  secure: true, // Always true for HTTPS
  sameSite: 'none', // Required for cross-domain cookies
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

const getClearCookieOptions = () => ({
  httpOnly: true,
  secure: true,
  sameSite: 'none'
});

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: role === 'admin' ? 'admin' : 'user' });
    const token = signToken(user);
    
    // Set HTTP-only cookie
    res.cookie('auth_token', token, getCookieOptions());
    
    return res.status(201).json({ user: { id: user._id, email: user.email, role: user.role, name: user.name } });
  } catch (e) {
    console.error('Registration error:', e);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user);
    
    // Set HTTP-only cookie
    res.cookie('auth_token', token, getCookieOptions());
    
    return res.json({ user: { id: user._id, email: user.email, role: user.role, name: user.name } });
  } catch (e) {
    console.error('Login error:', e);
    return res.status(500).json({ message: 'Login failed' });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie('auth_token', getClearCookieOptions());
    return res.json({ message: 'Logged out successfully' });
  } catch (e) {
    return res.status(500).json({ message: 'Logout failed' });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'User not found' });
    return res.json({ user: { id: user._id, email: user.email, role: user.role, name: user.name } });
  } catch (e) {
    return res.status(500).json({ message: 'Authentication check failed' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Check if new password is the same as current password
    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSamePassword) {
      return res.status(400).json({ message: 'New password cannot be the same as current password' });
    }
    
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    
    return res.json({ message: 'Password updated successfully' });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to update password' });
  }
};

exports.resetUsername = async (req, res) => {
  try {
    const { newEmail } = req.body;
    
    if (!newEmail) {
      return res.status(400).json({ message: 'New email is required' });
    }
    
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== req.user.id) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.email = newEmail;
    await user.save();
    
    // Clear the auth cookie to force re-login
    res.clearCookie('auth_token', getClearCookieOptions());
    
    return res.json({ message: 'Email updated successfully' });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to update email' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const Subscription = require('../models/Subscription');
    
    // Delete all user's subscriptions
    await Subscription.deleteMany({ userId: req.user.id });
    
    // Delete the user
    await User.findByIdAndDelete(req.user.id);
    
    // Clear the auth cookie
    res.clearCookie('auth_token', getClearCookieOptions());
    
    return res.json({ message: 'Account deleted successfully' });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to delete account' });
  }
};

// Generate OTP for password reset
exports.sendPasswordResetOTP = async (req, res) => {
  try {
    const { currentPassword } = req.body;
    
    if (!currentPassword) {
      return res.status(400).json({ message: 'Current password is required' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Delete any existing OTP for this user and type
    await OTP.deleteMany({ userId: user._id, type: 'password-reset' });
    
    // Save OTP to database
    await OTP.create({
      userId: user._id,
      email: user.email,
      otp,
      type: 'password-reset'
    });
    
    // Send OTP via email
    const emailResult = await sendOTPEmail(user.email, otp, 'password-reset');
    
    if (!emailResult.success) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }
    
    return res.json({ message: 'OTP sent to your email' });
  } catch (e) {
    console.error('Send password reset OTP error:', e);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// Verify OTP and reset password
exports.verifyOTPAndResetPassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    
    if (!otp || !newPassword) {
      return res.status(400).json({ message: 'OTP and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Find OTP record
    const otpRecord = await OTP.findOne({ 
      userId: req.user.id, 
      otp, 
      type: 'password-reset' 
    });
    
    if (!otpRecord) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Check if new password is the same as current password
    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSamePassword) {
      return res.status(400).json({ message: 'New password cannot be the same as current password' });
    }
    
    // Update password
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    
    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });
    
    return res.json({ message: 'Password updated successfully' });
  } catch (e) {
    console.error('Verify OTP and reset password error:', e);
    return res.status(500).json({ message: 'Failed to reset password' });
  }
};

// Generate OTP for email update
exports.sendEmailUpdateOTP = async (req, res) => {
  try {
    const { newEmail } = req.body;
    
    if (!newEmail) {
      return res.status(400).json({ message: 'New email is required' });
    }
    
    // Check if email is already in use
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== req.user.id) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Delete any existing OTP for this user and type
    await OTP.deleteMany({ userId: user._id, type: 'email-update' });
    
    // Save OTP to database
    await OTP.create({
      userId: user._id,
      email: user.email,
      otp,
      type: 'email-update',
      newEmail
    });
    
    // Send OTP to current email
    const emailResult = await sendOTPEmail(user.email, otp, 'email-update');
    
    if (!emailResult.success) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }
    
    return res.json({ message: 'OTP sent to your current email' });
  } catch (e) {
    console.error('Send email update OTP error:', e);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// Verify OTP and update email
exports.verifyOTPAndUpdateEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    
    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }
    
    // Find OTP record
    const otpRecord = await OTP.findOne({ 
      userId: req.user.id, 
      otp, 
      type: 'email-update' 
    });
    
    if (!otpRecord) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Update email
    user.email = otpRecord.newEmail;
    await user.save();
    
    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });
    
    // Clear the auth cookie to force re-login
    res.clearCookie('auth_token', getClearCookieOptions());
    
    return res.json({ message: 'Email updated successfully' });
  } catch (e) {
    console.error('Verify OTP and update email error:', e);
    return res.status(500).json({ message: 'Failed to update email' });
  }
};
