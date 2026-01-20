# Supabase Video CDN Setup Guide

This guide will help you set up Supabase Storage with CDN for serving video files in your SwineTech website.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A Supabase project created
3. Your video files ready to upload

## Step 1: Create a Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Name it `videos` (this matches the bucket name in the configuration)
5. Set it to **Public bucket** (so videos can be accessed via CDN)
6. Click **Create bucket**

## Step 2: Upload Your Videos

1. In the Storage section, click on the `videos` bucket
2. Click **Upload file** or drag and drop your video files
3. Upload these files:
   - `swintech BRAND VIDEO eng FINAL W SUBS.mp4`
   - `demo video spray only VO engsubs FIOINAL.mp4`

**Important:** Make sure the file names match exactly (including spaces and capitalization).

## Step 3: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (the `anon` key, not the `service_role` key)

## Step 4: Configure Your Website

You have three options to configure Supabase credentials:

### Option A: Environment Variables (Recommended for Production)

If you're using a build system or hosting platform that supports environment variables:

1. Set these environment variables:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. Update `scripts/supabase-config.js` to read from environment variables (already configured to check for these).

### Option B: Window Configuration (For Development)

Add this script tag **before** the `supabase-config.js` script in your HTML files:

```html
<script>
  window.SUPABASE_CONFIG = {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key-here'
  };
</script>
<script src="scripts/supabase-config.js"></script>
```

### Option C: Direct Configuration (Not Recommended)

Edit `scripts/supabase-config.js` and update these lines:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

**⚠️ Warning:** Don't commit credentials directly in code if using version control. Use environment variables or a secrets management system.

## Step 5: Test the Setup

1. Open your website in a browser
2. Open the browser's Developer Console (F12)
3. Check for any Supabase-related errors
4. Try playing a video - it should load from Supabase CDN
5. In the Network tab, verify that video requests are going to `*.supabase.co` domain

## Step 6: Verify CDN URLs

The Supabase CDN URLs will look like:
```
https://[project-ref].supabase.co/storage/v1/object/public/videos/[filename]
```

You can verify the public URL by:
1. Going to Storage → videos bucket in Supabase dashboard
2. Clicking on a video file
3. Copying the **Public URL**

## Troubleshooting

### Videos not loading from Supabase

1. **Check credentials:** Verify your Supabase URL and anon key are correct
2. **Check bucket name:** Ensure the bucket is named `videos` and is public
3. **Check file names:** File names must match exactly (including spaces)
4. **Check browser console:** Look for error messages
5. **Fallback behavior:** The code will automatically fall back to local paths if Supabase is not configured

### CORS Issues

If you encounter CORS errors:
1. Go to Supabase Dashboard → Storage → Policies
2. Ensure public access is enabled for the `videos` bucket
3. Check that the bucket is set to "Public"

### Video not playing

1. Check that the video file format is supported (MP4 is recommended)
2. Verify the video file is not corrupted
3. Check browser console for specific error messages
4. Try accessing the Supabase public URL directly in a new tab

## Security Best Practices

1. **Never commit credentials to version control**
2. Use environment variables for production
3. The `anon` key is safe to use in client-side code (it's designed for public access)
4. Don't use the `service_role` key in client-side code (it has admin privileges)

## Performance Benefits

Using Supabase CDN provides:
- ✅ Global CDN distribution for faster video loading
- ✅ Reduced server load on your hosting
- ✅ Automatic caching and optimization
- ✅ Scalable video delivery

## File Structure

After setup, your project structure should include:
```
SwineTech/
├── scripts/
│   ├── supabase-config.js    # Supabase client configuration
│   ├── video-config.js        # Video URL helper functions
│   └── main.js                # Updated to use Supabase URLs
├── index.html                 # Updated with Supabase scripts
└── SUPABASE_SETUP.md          # This file
```

## Additional Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase CDN Information](https://supabase.com/docs/guides/storage/cdn)

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all steps in this guide were completed
3. Test with a simple HTML file to isolate the issue
4. Check Supabase project logs in the dashboard
