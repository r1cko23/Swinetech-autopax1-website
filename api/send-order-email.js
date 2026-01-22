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
    
    // Get the site URL from environment or use default
    const SITE_URL = process.env.SITE_URL || 'https://www.swinetech.ph';
    const LOGO_URL = `${SITE_URL}/logos/Swine Tech_Iconic_Logo.png`;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; 
              line-height: 1.6; 
              color: #111111; 
              background-color: #f5f5f5;
              padding: 20px;
            }
            .email-wrapper {
              max-width: 600px; 
              margin: 0 auto; 
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header { 
              background: linear-gradient(135deg, #0b8d0b 0%, #007deb 100%);
              color: #ffffff; 
              padding: 30px 20px; 
              text-align: center; 
            }
            .logo-container {
              margin-bottom: 20px;
            }
            .logo {
              max-width: 200px;
              height: auto;
              display: block;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 10px;
              border-radius: 8px;
            }
            .header h1 {
              font-size: 24px;
              font-weight: 700;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .header p {
              font-size: 14px;
              margin-top: 10px;
              opacity: 0.95;
            }
            .content { 
              background-color: #ffffff; 
              padding: 30px 20px; 
            }
            .field { 
              margin-bottom: 20px; 
            }
            .label { 
              font-weight: 700; 
              color: #0b8d0b; 
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
              display: block;
            }
            .value { 
              padding: 12px 15px; 
              background-color: #f5f5f5; 
              border-left: 4px solid #007deb;
              border-radius: 4px;
              color: #111111;
              font-size: 15px;
              line-height: 1.5;
            }
            .message-value {
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .footer { 
              background-color: #111111;
              color: #ffffff;
              padding: 20px; 
              text-align: center; 
              font-size: 12px; 
              line-height: 1.6;
            }
            .footer p {
              margin: 5px 0;
            }
            .footer a {
              color: #007deb;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
            .divider {
              height: 1px;
              background: linear-gradient(to right, transparent, #ddd, transparent);
              margin: 25px 0;
            }
            @media only screen and (max-width: 600px) {
              body { padding: 10px; }
              .content { padding: 20px 15px; }
              .header { padding: 20px 15px; }
              .logo { max-width: 150px; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <div class="logo-container">
                <img src="${LOGO_URL}" alt="Swine Tech Logo" class="logo" />
              </div>
              <h1>New Bulk Order Inquiry</h1>
              <p>You have received a new inquiry from your website</p>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">First Name</span>
                <div class="value">${firstName}</div>
              </div>
              <div class="divider"></div>
              <div class="field">
                <span class="label">Farm Location</span>
                <div class="value">${farmLocation}</div>
              </div>
              <div class="divider"></div>
              <div class="field">
                <span class="label">Herd Size</span>
                <div class="value">${herdSize}</div>
              </div>
              <div class="divider"></div>
              <div class="field">
                <span class="label">Message</span>
                <div class="value message-value">${message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              <p><strong>Swine Tech Inc. Philippines</strong></p>
              <p>This email was sent from the Swine Tech website bulk order form.</p>
              <p>Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', dateStyle: 'long', timeStyle: 'short' })}</p>
              <p style="margin-top: 15px;">
                <a href="mailto:autopax1@swinetech.ph">autopax1@swinetech.ph</a> | 
                <a href="tel:+639569464189">+63 956 946 4189</a>
              </p>
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
