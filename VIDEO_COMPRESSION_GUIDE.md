# Video Compression Guide

This guide will help you compress your video files to reduce their size for faster uploads and web playback.

## Quick Start

### Option 1: Compress All Videos (Recommended)

If your video files are in the project root directory:

```bash
node scripts/compress-videos.js --all
```

This will compress both videos with medium quality (balanced size/quality).

### Option 2: Compress Individual Videos

```bash
# Compress brand video
node scripts/compress-videos.js "swintech BRAND VIDEO eng FINAL W SUBS.mp4" "brand_compressed.mp4"

# Compress demo video
node scripts/compress-videos.js "demo video spray only VO engsubs FIOINAL.mp4" "demo_compressed.mp4"
```

## Quality Options

You can choose different quality levels:

```bash
# Small file size (good for slow connections)
node scripts/compress-videos.js --all --quality low

# Balanced (recommended)
node scripts/compress-videos.js --all --quality medium

# High quality (larger files)
node scripts/compress-videos.js --all --quality high
```

## Expected Results

- **Low Quality**: 50-70% file size reduction
- **Medium Quality**: 40-60% file size reduction (recommended)
- **High Quality**: 20-40% file size reduction

## What the Script Does

The compression script:
- ✅ Converts to H.264 codec (widely supported)
- ✅ Optimizes for web playback (fast start enabled)
- ✅ Scales to max 1920px width (maintains aspect ratio)
- ✅ Compresses audio to 128kbps AAC
- ✅ Maintains good visual quality

## Manual Compression (Alternative)

If you prefer to use a GUI tool:

### macOS:
1. **HandBrake** (Free) - https://handbrake.fr/
   - Open video
   - Preset: "Web Optimized"
   - Quality: RF 23 (medium) or RF 28 (low)
   - Start encoding

2. **Compressor** (Paid, part of Final Cut Pro)
   - Use "Web Streaming" preset

### Online Tools:
- **CloudConvert** - https://cloudconvert.com/
- **FreeConvert** - https://www.freeconvert.com/
- **Clideo** - https://clideo.com/compress-video

### Settings for Online Tools:
- Format: MP4
- Codec: H.264
- Quality: Medium/High
- Resolution: 1920x1080 (or original)
- Bitrate: 2-4 Mbps

## After Compression

1. **Check file sizes** - They should be significantly smaller
2. **Test playback** - Make sure videos still play correctly
3. **Upload to Supabase** - Use the compressed versions

## Upload Compressed Videos

After compression, upload the `*_compressed.mp4` files to Supabase:

```bash
# Using the upload script (update paths first)
node scripts/upload-videos.js

# Or via Supabase Dashboard
# Go to Storage → videos bucket → Upload
```

## Troubleshooting

### "ffmpeg not found"
Install ffmpeg:
```bash
# macOS
brew install ffmpeg

# Or download from https://ffmpeg.org/download.html
```

### Videos are too large after compression
- Try `--quality low` for more compression
- Check original video resolution (may need to scale down more)
- Consider reducing video length if possible

### Quality is too low
- Use `--quality high` for better quality
- Original video quality affects final result

### Compression takes too long
- Use `--quality low` (faster encoding)
- Or compress one video at a time

## Best Practices

1. **Keep originals** - Don't delete original files until you verify compressed versions work
2. **Test playback** - Always test compressed videos before uploading
3. **Start with medium** - Try medium quality first, adjust if needed
4. **Check file sizes** - Aim for files under 50MB for web (ideally 10-30MB)

## File Size Recommendations

For web video playback:
- **Small videos** (< 10MB): Fast loading, good for mobile
- **Medium videos** (10-30MB): Balanced, recommended
- **Large videos** (30-50MB): Acceptable, may be slow on mobile
- **Very large** (> 50MB): Consider further compression or splitting

## Next Steps

1. Compress your videos using the script
2. Verify the compressed files play correctly
3. Upload to Supabase Storage
4. Test on your website

Your videos will then be served via Supabase CDN for fast global delivery! 🚀
