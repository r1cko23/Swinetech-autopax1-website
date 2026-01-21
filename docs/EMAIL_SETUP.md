# Email Setup Guide - Bulk Order Form

This guide explains how to set up email notifications for the bulk order form using Resend and Vercel Serverless Functions.

## Overview

When users submit the bulk order form, an email is automatically sent to `autopax1@swinetech.ph` with the inquiry details.

## Setup Instructions

### 1. Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key

1. Go to [https://resend.com/api-keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Name it (e.g., "Swine Tech Production")
4. Copy the API key (you'll only see it once!)

### 3. Add API Key to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name:** `RESEND_API_KEY`
   - **Value:** Your Resend API key
   - **Environment:** Production, Preview, Development (select all)
4. Click **Save**

### 4. Set FROM Email (Optional)

For production with a verified domain, add another environment variable:

1. In Vercel dashboard → **Settings** → **Environment Variables**
2. Add:
   - **Name:** `RESEND_FROM_EMAIL`
   - **Value:** `noreply@swinetech.ph` (or your verified domain email)
   - **Environment:** Production, Preview, Development
3. Click **Save**

**Note:** If not set, it will default to `onboarding@resend.dev` (Resend's test email).

### 5. Verify Your Domain (Recommended for Production)

For production, you should verify your domain in Resend:

1. Go to [https://resend.com/domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `swinetech.ph`)
4. Add the DNS records Resend provides to your domain's DNS settings
5. Wait for verification (usually takes a few minutes)

**For testing:** You can use `onboarding@resend.dev` without domain verification.

## Testing

### Local Testing

1. Create a `.env.local` file in the project root:
   ```
   RESEND_API_KEY=re_your_api_key_here
   ```

2. Test the form submission on `http://localhost:3000/Order/bulk`

3. Check the email inbox at `autopax1@swinetech.ph`

### Production Testing

1. Deploy to Vercel (the environment variable will be automatically used)
2. Submit a test order from the live site
3. Verify the email is received

## Email Content

The email includes:
- Customer's first name
- Farm location
- Herd size
- Message/inquiry
- Timestamp

## Troubleshooting

### Email not sending?

1. **Check Vercel logs:**
   - Go to Vercel dashboard → Your project → Functions
   - Check the logs for `/api/send-order-email`

2. **Verify API key:**
   - Make sure `RESEND_API_KEY` is set in Vercel environment variables
   - Check that it's the correct key from Resend

3. **Check Resend dashboard:**
   - Go to [https://resend.com/emails](https://resend.com/emails)
   - See if emails are being sent and any error messages

4. **Domain verification:**
   - If using a custom domain, ensure it's verified in Resend
   - Use `onboarding@resend.dev` for testing if domain isn't verified

### Common Errors

- **"Email service not configured"**: `RESEND_API_KEY` is missing
- **"Invalid API key"**: Wrong API key or key has been revoked
- **"Domain not verified"**: Need to verify domain or use `onboarding@resend.dev`

## Resend Free Tier Limits

- **3,000 emails/month** (free tier)
- Perfect for most small to medium businesses
- Upgrade available if needed

## Security Notes

- API key is stored securely in Vercel environment variables
- Never commit API keys to git
- The serverless function validates all input before sending

## Support

- Resend Documentation: https://resend.com/docs
- Vercel Functions: https://vercel.com/docs/functions
