/**
 * Vercel Serverless Function - Send Order Email
 * 
 * This function sends an email notification when a bulk order form is submitted.
 * 
 * Environment Variables Required:
 * - RESEND_API_KEY: Your Resend API key (get from https://resend.com/api-keys)
 * 
 * Usage:
 * POST /api/send-order-email
 * Body: {
 *   firstName: string,
 *   farmLocation: string,
 *   herdSize: string,
 *   message: string
 * }
 */

const { Resend } = require('resend');

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const TO_EMAIL = 'autopax1@swinetech.ph';
// Use environment variable or fallback to Resend's test email
// For production, set RESEND_FROM_EMAIL in Vercel environment variables
// For testing without domain verification, use: onboarding@resend.dev
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers for production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get form data from request body
    const { firstName, farmLocation, herdSize, message } = req.body;

    // Validate required fields
    if (!firstName || !farmLocation || !herdSize || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['firstName', 'farmLocation', 'herdSize', 'message']
      });
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return res.status(500).json({ 
        error: 'Email service not configured. Please set RESEND_API_KEY environment variable.' 
      });
    }

    // Format email content
    const emailSubject = `New Bulk Order Inquiry from ${firstName}`;
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0b8d0b; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #0b8d0b; }
            .value { margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid #0b8d0b; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Bulk Order Inquiry</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">First Name:</div>
                <div class="value">${firstName}</div>
              </div>
              <div class="field">
                <div class="label">Farm Location:</div>
                <div class="value">${farmLocation}</div>
              </div>
              <div class="field">
                <div class="label">Herd Size:</div>
                <div class="value">${herdSize}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from the Swine Tech website bulk order form.</p>
              <p>Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailText = `
New Bulk Order Inquiry

First Name: ${firstName}
Farm Location: ${farmLocation}
Herd Size: ${herdSize}

Message:
${message}

---
Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })}
This email was sent from the Swine Tech website bulk order form.
    `;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
      replyTo: TO_EMAIL, // Allow replying directly to the customer
    });

    if (error) {
      console.error('Resend API error:', error);
      return res.status(500).json({ 
        error: 'Failed to send email',
        details: error.message 
      });
    }

    // Success response
    return res.status(200).json({ 
      success: true,
      message: 'Email sent successfully',
      emailId: data?.id 
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
