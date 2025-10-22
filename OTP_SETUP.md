# OTP Verification System Setup

This guide explains how to set up and test the OTP (One-Time Password) verification system for password reset and email update features.

## Features

- **Password Reset with OTP**: Users must verify their identity via email before changing their password
- **Email Update with OTP**: Users must verify via their current email before changing to a new email address
- **Security**: 
  - OTPs expire after 10 minutes (MongoDB TTL index)
  - 6-digit verification codes
  - Sent to user's registered email
  - Old OTPs are automatically deleted when new ones are generated

## Setup Instructions

### 1. Email Configuration (Required)

You need to configure SMTP settings in the backend `.env` file. There are two options:

#### Option A: Gmail (Recommended for Production)

1. Open `backend/.env`
2. Update the following variables:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="Subscription Management <your-gmail@gmail.com>"
```

3. **Generate Gmail App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Enable 2-factor authentication on your Google account
   - Click "Generate" and select "Mail" and "Other (Custom name)"
   - Copy the 16-character password
   - Paste it as `EMAIL_PASS` in your `.env` file

#### Option B: Ethereal Email (For Testing)

For development and testing without using a real email account:

1. Go to https://ethereal.email/
2. Click "Create Ethereal Account"
3. Copy the SMTP credentials and update your `.env`:

```env
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=username@ethereal.email
EMAIL_PASS=password-from-ethereal
EMAIL_FROM="Subscription Management <username@ethereal.email>"
```

**Note**: Ethereal emails are **fake** - they don't actually send to real inboxes. View them at https://ethereal.email/messages

### 2. Backend Setup

```bash
cd backend
npm install  # nodemailer is already installed
```

### 3. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## How It Works

### Password Reset Flow

1. User clicks "Change" on Password in Settings
2. **Step 1**: User enters current password and clicks "Send OTP"
   - Backend verifies current password
   - Generates 6-digit OTP
   - Saves OTP to database (expires in 10 minutes)
   - Sends email with OTP code
3. **Step 2**: User enters OTP and new password
   - Backend verifies OTP is correct and not expired
   - Checks new password is different from current
   - Updates password
   - Deletes used OTP

### Email Update Flow

1. User clicks "Update" on Email in Settings
2. **Step 1**: User enters new email address and clicks "Send OTP"
   - Backend checks if email is already in use
   - Generates 6-digit OTP
   - Saves OTP to database with new email
   - Sends email to **current** email address (security measure)
3. **Step 2**: User enters OTP from their current email inbox
   - Backend verifies OTP
   - Updates email to new address
   - Logs user out (forces re-login with new email)
   - Deletes used OTP

## API Endpoints

### Password Reset
- `POST /api/auth/send-password-reset-otp` - Send OTP for password reset
  - Body: `{ currentPassword: string }`
  - Requires: Authentication cookie
  
- `POST /api/auth/verify-password-reset-otp` - Verify OTP and change password
  - Body: `{ otp: string, newPassword: string }`
  - Requires: Authentication cookie

### Email Update
- `POST /api/auth/send-email-update-otp` - Send OTP for email change
  - Body: `{ newEmail: string }`
  - Requires: Authentication cookie
  
- `POST /api/auth/verify-email-update-otp` - Verify OTP and update email
  - Body: `{ otp: string }`
  - Requires: Authentication cookie

## Database Schema

### OTP Model
```javascript
{
  userId: ObjectId,           // Reference to User
  email: String,              // Email where OTP was sent
  otp: String,                // 6-digit code
  type: String,               // 'password-reset' or 'email-update'
  newEmail: String,           // Only for email-update type
  createdAt: Date             // TTL index - auto-delete after 10 minutes
}
```

## Testing

### Manual Testing Steps

1. **Test Password Reset**:
   - Login to the application
   - Go to Settings
   - Click "Change" on Password
   - Enter your current password → Click "Send OTP"
   - Check your email for the 6-digit code
   - Enter the OTP and your new password
   - Verify you can login with the new password

2. **Test Email Update**:
   - Login to the application
   - Go to Settings
   - Click "Update" on Email
   - Enter a new email address → Click "Send OTP"
   - Check your **current** email for the code
   - Enter the OTP
   - Verify you're logged out
   - Login with the new email address

3. **Test OTP Expiration**:
   - Send an OTP
   - Wait 10+ minutes
   - Try to use the expired OTP
   - Should show "Invalid or expired OTP" error

### Troubleshooting

**Problem**: "Failed to send OTP" error
- **Solution**: Check backend console for email service errors
- Verify SMTP credentials in `.env` are correct
- For Gmail: Ensure App Password is generated (not regular password)
- For Ethereal: Credentials are valid (they expire after 1 month)

**Problem**: OTP email not received
- **Gmail**: Check spam folder
- **Ethereal**: Go to https://ethereal.email/messages and login with your test account
- Check backend console for email sending success/failure

**Problem**: "Invalid or expired OTP"
- OTP expires after 10 minutes
- Each user can only have one active OTP per type
- Requesting a new OTP invalidates the old one

**Problem**: Backend crashes with email errors
- Ensure all EMAIL_* variables are set in `.env`
- Restart backend after changing `.env` file
- Check MongoDB is running (OTP model requires database)

## Security Considerations

- OTPs are 6 digits (1,000,000 possible combinations)
- Auto-expire after 10 minutes
- One OTP per user per operation type
- Email sent to verified current email address
- Password cannot be changed to same password
- Email update forces logout (security best practice)

## File Structure

```
backend/
├── models/
│   └── OTP.js                    # OTP database schema
├── utils/
│   └── emailService.js           # Nodemailer email sending
├── controllers/
│   └── authController.js         # OTP send/verify logic
└── routes/
    └── auth.js                   # OTP API endpoints

frontend/
├── src/
│   ├── Components/
│   │   ├── OtpInput.jsx          # Reusable OTP input component
│   │   └── Settings.jsx          # Settings page with OTP flows
│   └── redux/
│       └── authSlice.js          # Redux OTP thunks
```

## Next Steps

1. **Configure Email**: Set up Gmail App Password or Ethereal account in `.env`
2. **Test Locally**: Follow manual testing steps above
3. **Production**: Use a professional SMTP service (SendGrid, AWS SES, Mailgun)
4. **Monitoring**: Add logging for OTP generation and verification attempts
5. **Rate Limiting**: Consider adding rate limits to prevent OTP spam

## Production Recommendations

- Use a dedicated email service (SendGrid, AWS SES, Mailgun)
- Add rate limiting to OTP endpoints (max 3 attempts per hour)
- Log OTP verification attempts for security monitoring
- Consider SMS OTP as an alternative/backup
- Add CAPTCHA to prevent automated attacks
- Implement account lockout after multiple failed OTP attempts
