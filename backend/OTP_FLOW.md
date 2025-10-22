# OTP Flow & Email Configuration

This document explains how the OTP verification flow works in this project and how to configure Gmail SMTP (or a test SMTP) to send OTP emails.

## Overview

Sensitive operations (password reset and email update) use a 2-step OTP verification:

1. User requests an OTP (must provide current password for password changes).
2. Server generates a 6-digit OTP, stores it in a MongoDB `OTP` collection with a 10-minute TTL.
3. Server sends the OTP via email to the user's CURRENT email address.
4. User enters the OTP along with the new password (for password reset) or just the OTP (for email update confirmation).
5. Server verifies the OTP and performs the requested action (update password or update email), then deletes the used OTP and, for email update, forces logout.

## Detailed Password Reset Flow

### Step 1: Request OTP
**Frontend (Settings.jsx)**
- User clicks "Change" button on password reset
- Modal opens: User enters current password
- Clicks "Send OTP" button
- Frontend calls `sendPasswordResetOTP({ currentPassword })`

**Backend (authController.js)**
- Validates current password using bcrypt.compare
- Generates 6-digit random OTP
- Deletes any existing password-reset OTPs for this user
- Saves new OTP to database with 10-minute TTL
- Sends OTP to user's email via nodemailer
- Returns success message

**Frontend Response**
- Shows success toast: "OTP sent to your email! Please check your inbox."
- Modal switches to Step 2

### Step 2: Verify OTP and Reset Password
**Frontend (Settings.jsx)**
- User sees OTP input (6 boxes) and password fields
- OtpInput component:
  - Auto-focuses next box on digit entry
  - Supports paste (Ctrl+V) for 6-digit codes
  - Calls `setPasswordOtp(otp)` when all 6 digits entered
- User enters new password and confirmation
- Clicks "Reset Password" button (disabled until OTP has 6 digits)
- Frontend calls `verifyPasswordResetOTP({ otp, newPassword })`

**Backend (authController.js)**
- Finds OTP record matching userId, otp, and type='password-reset'
- If not found: returns 401 "Invalid or expired OTP"
- Validates new password (min 6 chars)
- Checks if new password is same as current (rejects if same)
- Hashes new password with bcrypt
- Updates user.passwordHash
- Deletes the used OTP
- Returns success message

**Frontend Response**
- Shows success toast: "Password updated successfully!"
- Closes modal, resets all state
- User can now login with new password

## Detailed Email Update Flow

### Step 1: Request OTP
**Frontend (Settings.jsx)**
- User clicks "Update" button on email change
- Modal opens: User enters new email address
- Clicks "Send OTP" button
- Frontend calls `sendEmailUpdateOTP({ newEmail })`

**Backend (authController.js)**
- Checks if new email already exists in database
- If exists: returns 400 "Email already in use"
- Generates 6-digit random OTP
- Deletes any existing email-update OTPs for this user
- Saves new OTP with `newEmail` field and 10-minute TTL
- Sends OTP to user's **CURRENT** email (not new email)
- Returns success message

**Frontend Response**
- Shows success toast: "OTP sent to your current email! Please check your inbox."
- Shows warning: "You will be logged out after updating"
- Modal switches to Step 2

### Step 2: Verify OTP and Update Email
**Frontend (Settings.jsx)**
- User sees OTP input (6 boxes)
- Shows message: "Enter code sent to [current email]"
- Shows preview: "Your email will be changed to: [new email]"
- OtpInput calls `setEmailOtp(otp)` when complete
- Clicks "Verify & Update Email" button (disabled until OTP has 6 digits)
- Frontend calls `verifyEmailUpdateOTP({ otp })`

**Backend (authController.js)**
- Finds OTP record matching userId, otp, and type='email-update'
- If not found: returns 401 "Invalid or expired OTP"
- Retrieves `newEmail` from OTP record
- Updates user.email to newEmail
- Deletes the used OTP
- Clears authentication cookie (forces logout)
- Returns success message

**Frontend Response**
- Shows success toast: "Email updated successfully! Redirecting to login..."
- Closes modal
- Clears user from Redux state and localStorage
- Redirects to /login after 1.5 seconds
- User must login with new email address

## Why we send OTP to the CURRENT email

To prevent attackers from supplying a new email they control and immediately taking over an account, the OTP is sent to the currently registered email address. This ensures the account owner receives the confirmation first.

## OTP Storage

- The OTP model has fields: `userId`, `email`, `otp` (string), `type` (`password-reset` or `email-update`), `newEmail` (for email-change flows), and `createdAt`.
- There is a TTL index on `createdAt` set to 600 seconds (10 minutes).
- Creating a new OTP for the same user and type deletes any previous OTPs for that user+type (single active OTP).

## Email Configuration (Gmail)

You can use Gmail's SMTP server to send OTP emails. For Gmail:

1. Enable 2-Step Verification on your Google account.
2. Create an App Password specifically for this application:
   - Go to https://myaccount.google.com/apppasswords
   - Select app: "Other (Custom name)" - enter "Subscription Manager"
   - Google will show a 16-character password
3. Put that value in the `EMAIL_PASS` environment variable.

Environment variables (backend `.env`):

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=kathiravangopi12@gmail.com
EMAIL_PASS=<your-16-char-app-password>
EMAIL_FROM="Subscription Manager <kathiravangopi12@gmail.com>"
```

**Important Notes:**
- `EMAIL_PASS` is NOT your regular Gmail password
- It's an App Password generated specifically for SMTP
- Do NOT commit your `.env` file or credentials to version control

## Ethereal (for development/testing)

If you don't want to use real email accounts while developing, you can use Ethereal (https://ethereal.email)
- Create a test account and use the provided host/port/user/pass.
- Ethereal provides a web UI to inspect sent messages.

Example ethereal config:
```env
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your-ethereal-username@ethereal.email
EMAIL_PASS=your-ethereal-password
EMAIL_FROM="Subscription Manager <noreply@ethereal.email>"
```

## UI Features

### OTP Input Component (OtpInput.jsx)
- 6 separate input boxes for better UX
- Auto-focus next input on digit entry
- Backspace moves to previous input
- Full paste support (Ctrl+V) - validates and fills all 6 digits
- Automatically calls `onComplete(otp)` when all digits entered
- Responsive design: 48px on mobile, 56px on desktop
- Purple focus ring matching app theme
- Disabled state during API calls

### Password Reset Modal
- Step 1: Current password input + Send OTP button
- Step 2: OTP input + New password fields + Reset Password button
- "Back" button to return to Step 1
- Submit button disabled until OTP has 6 digits
- Shows current email where OTP was sent
- Clear error messages for validation

### Email Update Modal
- Step 1: New email input + Send OTP button
- Step 2: OTP input + Verify button
- Shows OTP sent to current email (not new email)
- Shows preview of new email before confirmation
- Warning about logout requirement
- "Back" button to return to Step 1

## Security Notes

- OTPs expire in 10 minutes (MongoDB TTL index).
- On email update, users are logged out and must re-authenticate with their new email.
- Only one active OTP per user per type (new OTP invalidates old ones).
- Password reset requires knowing current password before OTP is sent.
- Email update OTP sent to current verified email, not the new unverified email.
- Backend validates password is not same as current password.
- We recommend rate-limiting OTP requests to prevent abuse.

## How to Test End-to-End

1. **Setup Email Credentials**
   - Generate Gmail App Password or create Ethereal account
   - Update `backend/.env` with credentials (see above)

2. **Start Backend**
   ```bash
   cd backend
   npm install  # if not done already
   node app.js  # or npm start
   ```

3. **Start Frontend**
   ```bash
   cd frontend
   npm install  # if not done already
   npm run dev
   ```

4. **Test Password Reset**
   - Login with an account
   - Go to Settings page
   - Click "Change" on Reset Password
   - Enter current password → Click "Send OTP"
   - Check email inbox (or Ethereal web UI)
   - Enter 6-digit OTP (can paste)
   - Enter new password (min 6 chars)
   - Click "Reset Password"
   - Verify password changed by logging out and back in

5. **Test Email Update**
   - Go to Settings page
   - Click "Update" on Reset Email
   - Enter new email → Click "Send OTP"
   - Check CURRENT email inbox (not new email)
   - Enter 6-digit OTP (can paste)
   - Click "Verify & Update Email"
   - You'll be logged out automatically
   - Login with NEW email address

## Troubleshooting

### Emails not arriving
- Check backend console for nodemailer errors
- Verify `EMAIL_USER` and `EMAIL_PASS` are correct in `.env`
- For Gmail: ensure 2-Step Verification enabled and App Password created
- Check spam/junk folder
- Try Ethereal for testing (eliminates email delivery issues)

### OTP Invalid or Expired
- OTPs expire after 10 minutes
- Only one OTP active per user per type (new OTP invalidates old)
- Check system time is accurate (affects TTL)
- Verify MongoDB is running and TTL index is created

### Password Reset Not Working
- Ensure current password is correct
- New password must be min 6 characters
- New password cannot be same as current password
- Check browser console for frontend errors
- Check backend console for validation errors

### Email Update Not Working
- New email must not already exist in database
- OTP sent to current email, not new email
- After update, user is logged out (expected behavior)
- Must login with NEW email after successful update

## Implementation Files

- `backend/models/OTP.js` - OTP mongoose model with TTL
- `backend/utils/emailService.js` - Sends emails using nodemailer
- `backend/controllers/authController.js` - OTP generation and verification logic
- `backend/routes/auth.js` - API endpoints for OTP operations
- `frontend/src/Components/OtpInput.jsx` - Reusable 6-digit OTP input UI
- `frontend/src/Components/Settings.jsx` - Password and email update modals
- `frontend/src/redux/authSlice.js` - Redux thunks for OTP API calls

## API Endpoints

All endpoints require authentication (JWT cookie).

### POST `/api/auth/send-password-reset-otp`
Request:
```json
{ "currentPassword": "user's current password" }
```
Response:
```json
{ "message": "OTP sent to your email" }
```

### POST `/api/auth/verify-password-reset-otp`
Request:
```json
{
  "otp": "123456",
  "newPassword": "newSecurePassword123"
}
```
Response:
```json
{ "message": "Password updated successfully" }
```

### POST `/api/auth/send-email-update-otp`
Request:
```json
{ "newEmail": "newemail@example.com" }
```
Response:
```json
{ "message": "OTP sent to your current email" }
```

### POST `/api/auth/verify-email-update-otp`
Request:
```json
{ "otp": "123456" }
```
Response:
```json
{ "message": "Email updated successfully" }
```
Note: Clears authentication cookie (logout).



