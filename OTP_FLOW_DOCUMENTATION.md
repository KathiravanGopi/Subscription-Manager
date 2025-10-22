# OTP Verification System - Flow Documentation

## Overview
This document explains the complete flow of the OTP (One-Time Password) verification system implemented for secure password reset and email update operations.

---

## 📧 Gmail Configuration Setup

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** section
3. Enable **2-Step Verification** if not already enabled

### Step 2: Generate App Password
1. Visit: https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)**
4. Enter name: **Subscription Management App**
5. Click **Generate**
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
7. Paste it in `backend/.env` file:
   ```
   EMAIL_PASS=abcdefghijklmnop
   ```
   (Remove spaces when pasting)

### Current Configuration
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=kathiravangopi12@gmail.com
EMAIL_PASS=your-app-password-here  # Replace with generated app password
EMAIL_FROM="Subscription Management <kathiravangopi12@gmail.com>"
```

---

## 🔐 Password Reset Flow

### User Journey
```
┌─────────────────────────────────────────────────────────────┐
│                    Password Reset Flow                       │
└─────────────────────────────────────────────────────────────┘

Step 1: User clicks "Change" button in Settings
   ↓
Step 2: Modal opens - Enter Current Password
   │
   ├─ User enters current password
   ├─ Clicks "Send OTP" button
   │
   ↓
Step 3: Backend Validation & OTP Generation
   │
   ├─ Validates current password using bcrypt
   ├─ Generates 6-digit random OTP
   ├─ Saves OTP to MongoDB (TTL: 10 minutes)
   ├─ Sends OTP email via nodemailer
   │
   ↓
Step 4: User receives email
   │
   ├─ Subject: "Password Reset Verification Code"
   ├─ Contains 6-digit OTP code
   ├─ Valid for 10 minutes
   │
   ↓
Step 5: Modal updates - Enter OTP & New Password
   │
   ├─ User enters 6-digit OTP
   ├─ User enters new password
   ├─ User confirms new password
   ├─ OTP auto-submits when all 6 digits entered
   │
   ↓
Step 6: Backend Verification
   │
   ├─ Validates OTP from database
   ├─ Checks OTP not expired (< 10 min)
   ├─ Validates new password ≠ current password
   ├─ Hashes new password with bcrypt
   ├─ Updates user password in database
   ├─ Deletes used OTP from database
   │
   ↓
Step 7: Success
   │
   ├─ Shows success toast notification
   ├─ Closes modal
   ├─ User remains logged in
   │
   ↓
✅ Password updated successfully!
```

### Technical Implementation

#### Frontend Components
- **Settings.jsx**: Main settings page with password reset modal
- **OtpInput.jsx**: Reusable 6-digit OTP input component
- **authSlice.js**: Redux thunks for API calls

#### Backend Endpoints
1. **POST /api/auth/send-password-reset-otp**
   - Input: `{ currentPassword: string }`
   - Process: Validate password → Generate OTP → Send email
   - Output: Success message

2. **POST /api/auth/verify-password-reset-otp**
   - Input: `{ otp: string, newPassword: string }`
   - Process: Validate OTP → Check password → Update password
   - Output: Success message

#### Database Schema (OTP Model)
```javascript
{
  userId: ObjectId,          // Reference to User
  email: String,             // User's email
  otp: String,               // 6-digit code
  type: String,              // 'password-reset'
  createdAt: Date            // Auto-expires after 600 seconds (10 min)
}
```

---

## 📧 Email Update Flow

### User Journey
```
┌─────────────────────────────────────────────────────────────┐
│                     Email Update Flow                        │
└─────────────────────────────────────────────────────────────┘

Step 1: User clicks "Update" button in Settings
   ↓
Step 2: Modal opens - Enter New Email
   │
   ├─ User enters new email address
   ├─ Clicks "Send OTP" button
   │
   ↓
Step 3: Backend Validation & OTP Generation
   │
   ├─ Checks if new email already exists in database
   ├─ Generates 6-digit random OTP
   ├─ Saves OTP to MongoDB with newEmail field (TTL: 10 min)
   ├─ Sends OTP to CURRENT email address (security measure)
   │
   ↓
Step 4: User receives email at CURRENT address
   │
   ├─ Subject: "Email Update Verification Code"
   ├─ Contains 6-digit OTP code
   ├─ Message explains email change request
   ├─ Valid for 10 minutes
   │
   ↓
Step 5: Modal updates - Enter OTP
   │
   ├─ Shows current email address
   ├─ Shows new email address to be updated
   ├─ User enters 6-digit OTP
   ├─ OTP auto-submits when all 6 digits entered
   │
   ↓
Step 6: Backend Verification
   │
   ├─ Validates OTP from database
   ├─ Checks OTP not expired (< 10 min)
   ├─ Retrieves stored newEmail from OTP record
   ├─ Updates user.email in database
   ├─ Deletes used OTP from database
   ├─ Clears authentication cookie (force logout)
   │
   ↓
Step 7: Success & Logout
   │
   ├─ Shows success toast notification
   ├─ Redirects to login page
   ├─ User must login with NEW email
   │
   ↓
✅ Email updated successfully! Please login again.
```

### Security Features
1. **OTP sent to CURRENT email**: Prevents unauthorized email changes
2. **Forced logout**: Ensures user re-authenticates with new email
3. **Duplicate email check**: Prevents multiple users with same email
4. **Auto-expiration**: OTPs expire after 10 minutes

#### Backend Endpoints
1. **POST /api/auth/send-email-update-otp**
   - Input: `{ newEmail: string }`
   - Process: Check availability → Generate OTP → Send to current email
   - Output: Success message

2. **POST /api/auth/verify-email-update-otp**
   - Input: `{ otp: string }`
   - Process: Validate OTP → Update email → Clear auth cookie
   - Output: Success message

#### Database Schema (OTP Model)
```javascript
{
  userId: ObjectId,          // Reference to User
  email: String,             // CURRENT email (where OTP is sent)
  otp: String,               // 6-digit code
  type: String,              // 'email-update'
  newEmail: String,          // NEW email to be set (stored here)
  createdAt: Date            // Auto-expires after 600 seconds (10 min)
}
```

---

## 🔧 Technical Architecture

### File Structure
```
backend/
├── models/
│   └── OTP.js                    # MongoDB schema with TTL index
├── utils/
│   └── emailService.js           # Nodemailer configuration
├── controllers/
│   └── authController.js         # OTP generation & verification logic
└── routes/
    └── auth.js                   # API endpoints

frontend/
├── Components/
│   ├── Settings.jsx              # Main settings page with modals
│   └── OtpInput.jsx              # Reusable OTP input component
└── redux/
    └── authSlice.js              # Redux thunks for API calls
```

### Key Technologies
- **Nodemailer**: Email sending via Gmail SMTP
- **MongoDB TTL Index**: Auto-delete expired OTPs
- **bcrypt**: Password hashing and comparison
- **JWT Cookies**: Authentication state management
- **Redux Toolkit**: State management and async thunks

---

## 🎨 OTP Input Component Features

### User Experience
- **6 individual input boxes**: One for each digit
- **Auto-focus next**: Automatically moves to next input after entering digit
- **Backspace navigation**: Deletes digit and moves to previous input
- **Paste support**: Paste 6-digit code from clipboard (auto-fills all boxes)
- **Auto-submit**: Calls verification function when all 6 digits entered
- **Loading state**: Disables inputs during verification
- **Responsive design**: Adapts to mobile and desktop screens

### Visual Design
```
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│  1  │ │  2  │ │  3  │ │  4  │ │  5  │ │  6  │
└─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘
```
- Purple focus ring on active input
- Large, easy-to-read digits
- Mobile-friendly touch targets

---

## 🔒 Security Considerations

### Password Reset Security
✅ **Current password required**: Prevents unauthorized access
✅ **OTP verification**: Adds second layer of authentication
✅ **Email confirmation**: User must have access to email account
✅ **Same password prevention**: Cannot change to current password
✅ **10-minute expiration**: Limits OTP validity window
✅ **One-time use**: OTP deleted after successful verification

### Email Update Security
✅ **OTP to current email**: Ensures account owner approves change
✅ **Duplicate prevention**: Checks if email already exists
✅ **Forced logout**: Requires re-authentication with new email
✅ **Stored new email**: OTP record contains target email (can't be changed)
✅ **10-minute expiration**: Limits OTP validity window
✅ **One-time use**: OTP deleted after successful verification

### MongoDB TTL Index
```javascript
// Auto-deletes expired OTP records
otpSchema.index({ createdAt: 1 }, { expires: 600 })
```
- Runs every 60 seconds
- Removes documents where `createdAt + 600 seconds < now`
- Prevents database clutter
- No manual cleanup needed

---

## 📱 Email Template Example

### Password Reset Email
```
Subject: Password Reset Verification Code

Hello,

Your verification code for password reset is:

      123456

This code will expire in 10 minutes.

If you didn't request this, please ignore this email.

Best regards,
Subscription Management Team
```

### Email Update Email
```
Subject: Email Update Verification Code

Hello,

Your verification code for email address update is:

      123456

This code will expire in 10 minutes.

If you didn't request this, please ignore this email.

Best regards,
Subscription Management Team
```

---

## 🚀 Testing the System

### Before Testing
1. **Start MongoDB**: Ensure MongoDB is running locally
2. **Configure .env**: Add your Gmail app password
3. **Start Backend**: `cd backend && npm start`
4. **Start Frontend**: `cd frontend && npm run dev`

### Test Password Reset
1. Login to your account
2. Go to Settings page
3. Click "Change" button under Reset Password
4. Enter current password
5. Click "Send OTP"
6. Check email inbox (kathiravangopi12@gmail.com)
7. Enter 6-digit OTP
8. Enter new password
9. Confirm new password
10. OTP auto-verifies when 6 digits entered
11. ✅ Success toast should appear

### Test Email Update
1. Login to your account
2. Go to Settings page
3. Click "Update" button under Reset Email
4. Enter new email address
5. Click "Send OTP"
6. Check email inbox at **current** email (kathiravangopi12@gmail.com)
7. Enter 6-digit OTP
8. OTP auto-verifies when 6 digits entered
9. ✅ Success toast → Redirected to login
10. Login with **new** email address

---

## 🐛 Troubleshooting

### Email Not Sending
**Problem**: OTP email not received

**Solutions**:
1. Check Gmail app password in `.env` file
2. Verify 2-factor authentication enabled
3. Check spam/junk folder
4. Look at backend console for error logs
5. Test with ethereal.email (fake SMTP for testing)

### OTP Invalid Error
**Problem**: "Invalid or expired OTP" message

**Solutions**:
1. Check if OTP expired (> 10 minutes)
2. Verify correct email received OTP
3. Check MongoDB connection
4. Ensure OTP model TTL index created
5. Check backend logs for verification errors

### Password Not Updating
**Problem**: OTP verified but password not changing

**Solutions**:
1. Check if new password matches confirmation
2. Verify password length >= 6 characters
3. Check if same as current password (should fail)
4. Look at backend console for bcrypt errors

### Email Not Updating
**Problem**: OTP verified but email not changing

**Solutions**:
1. Check if new email already exists in database
2. Verify OTP was sent to current email
3. Check if user properly logged out
4. Verify MongoDB update operation succeeded

---

## 💡 Future Enhancements

### Potential Improvements
- [ ] Rate limiting: Prevent OTP spam (max 3 requests per 10 min)
- [ ] Resend OTP: Button to resend expired/lost codes
- [ ] SMS verification: Alternative to email OTP
- [ ] Recovery codes: Backup codes for account access
- [ ] Audit log: Track all security-related actions
- [ ] Email templates: Rich HTML with branding
- [ ] Multi-language: Support for different languages
- [ ] OTP length config: Allow 4, 6, or 8 digit codes

---

## 📝 Summary

This OTP verification system provides **enterprise-grade security** for sensitive account operations:

- ✅ **Two-factor verification** for password resets
- ✅ **Email ownership validation** for email updates  
- ✅ **Auto-expiring tokens** prevent reuse attacks
- ✅ **User-friendly interface** with auto-submit OTP input
- ✅ **Gmail integration** with app password support
- ✅ **MongoDB TTL indexes** for automatic cleanup
- ✅ **Comprehensive error handling** and user feedback

The system balances **security** with **user experience**, ensuring account protection while maintaining ease of use.

---

**Last Updated**: October 22, 2025  
**Version**: 1.0.0  
**Author**: Subscription Management Team
