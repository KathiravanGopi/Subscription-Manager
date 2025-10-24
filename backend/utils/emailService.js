const { Resend } = require('resend');

/*
 * Using Resend for email delivery
 * - Get your API key from https://resend.com/api-keys
 * - Set RESEND_API_KEY in your environment variables
 * - Resend allows you to send from 'onboarding@resend.dev' for testing
 * - For production, add and verify your own domain
 */

// Initialize Resend client
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.warn('[emailService] RESEND_API_KEY is not set in environment. Emails will fail to send.');
    throw new Error('RESEND_API_KEY is required');
  }
  
  console.log('[emailService] Initializing Resend client');
  return new Resend(apiKey);
};

const sendOTPEmail = async (email, otp, type) => {
  try {
    const resend = getResendClient();
    
    const subject = type === 'password-reset' 
      ? 'Password Reset OTP - Subscription Manager' 
      : 'Email Update OTP - Subscription Manager';
    
    const message = type === 'password-reset'
      ? `Your OTP for password reset is: <strong>${otp}</strong><br><br>This code will expire in 10 minutes.`
      : `Your OTP for email update is: <strong>${otp}</strong><br><br>This code will expire in 10 minutes.`;

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #5227FF;">Subscription Manager</h2>
        <p>Hello,</p>
        <p>${message}</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated email, please do not reply.</p>
      </div>
    `;

    // NOTE: When using onboarding@resend.dev, emails can only be sent to kathiravangopi23@gmail.com
    // For production, verify a domain at resend.com/domains and update EMAIL_FROM
    const recipientEmail = email;
    
    console.log(`[sendOTPEmail] Sending ${type} OTP to ${recipientEmail} via Resend`);
    
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: recipientEmail,
      subject: subject,
      html: emailContent,
    });

    if (error) {
      console.error('[sendOTPEmail] Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('[sendOTPEmail] Email sent successfully. ID:', data.id);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('[sendOTPEmail] Error sending email:', error.message);
    console.error('[sendOTPEmail] Full error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendOTPEmail };

// Also export the Resend client factory for testing or other uses
module.exports.getResendClient = getResendClient;
