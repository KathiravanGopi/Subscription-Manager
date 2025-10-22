const nodemailer = require('nodemailer');

/*
 * Note on EMAIL_PASS:
 * - When using Gmail you should NOT use your regular Google account password.
 * - Create an App Password (recommended) for SMTP: https://myaccount.google.com/apppasswords
 * - Put that App Password in the environment variable `EMAIL_PASS`.
 * - For testing you can also use Ethereal (https://ethereal.email) and put the test credentials in the env.
 */

// Create a transporter (configure with your email service)
// Use nodemailer.createTransport (correct API). Older examples sometimes show createTransporter which is incorrect
const createTransporter = () => {
  // For development, you can use a test account from ethereal.email
  // For production, use your actual email service (Gmail, SendGrid, etc.)

  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const secure = port === 465; // port 465 uses SSL

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[emailService] EMAIL_USER or EMAIL_PASS is not set in environment. Emails will likely fail to send.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });
};

const sendOTPEmail = async (email, otp, type) => {
  const transporter = createTransporter();
  
  const subject = type === 'password-reset' 
    ? 'Password Reset OTP - Subscription Manager' 
    : 'Email Update OTP - Subscription Manager';
  
  const message = type === 'password-reset'
    ? `Your OTP for password reset is: <strong>${otp}</strong><br><br>This code will expire in 10 minutes.`
    : `Your OTP for email update is: <strong>${otp}</strong><br><br>This code will expire in 10 minutes.`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Subscription Manager" <noreply@subscriptionmanager.com>',
    to: email,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #5227FF;">Subscription Manager</h2>
        <p>Hello,</p>
        <p>${message}</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated email, please do not reply.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email: ', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendOTPEmail };

// Also export the transporter factory so other modules (or tests) can reuse it
module.exports.createTransporter = createTransporter;
