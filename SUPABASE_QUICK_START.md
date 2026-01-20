# Supabase Video CDN - Quick Start

## Quick Setup (5 minutes)

### 1. Create Supabase Storage Bucket
- Go to Supabase Dashboard → Storage
- Create a new bucket named `videos`
- Set it to **Public**

### 2. Upload Videos
- Upload these files to the `videos` bucket:
  - `swintech BRAND VIDEO eng FINAL W SUBS.mp4`
  - `demo video spray only VO engsubs FIOINAL.mp4`

### 3. Get Credentials
- Go to Settings → API
- Copy **Project URL** and **anon key**

### 4. Configure Website

Add this script **before** `supabase-config.js` in your HTML files:

```html
<script>
  window.SUPABASE_CONFIG = {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key-here'
  };
</script>
```

### 5. Test
- Open your website
- Check browser console for errors
- Play a video - it should load from Supabase CDN

## That's it! 🎉

Videos will automatically use Supabase CDN when configured, or fall back to local paths if not configured.

For detailed instructions, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
