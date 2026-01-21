#!/bin/bash

# Quick script to compress and upload videos
# Usage: ./compress-and-upload.sh

echo "🎬 Video Compression and Upload Script"
echo "======================================"
echo ""

# Step 1: Compress videos
echo "Step 1: Compressing videos..."
node scripts/compress-videos.js --all --quality medium

if [ $? -ne 0 ]; then
    echo "❌ Compression failed. Please check the errors above."
    exit 1
fi

echo ""
echo "Step 2: Uploading compressed videos to Supabase..."
echo ""

# Step 2: Upload to Supabase
node scripts/upload-videos.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Done! Your videos are now on Supabase CDN!"
else
    echo ""
    echo "❌ Upload failed. Please check the errors above."
    exit 1
fi
