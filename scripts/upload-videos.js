/**
 * Video Upload Helper Script
 * 
 * This script helps you upload videos to Supabase Storage.
 * 
 * Usage:
 * 1. Make sure you have the video files in the project root or specify the path
 * 2. Run: node scripts/upload-videos.js
 * 
 * Or use it as a module:
 * const { uploadVideo } = require('./scripts/upload-videos.js');
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const SUPABASE_URL = 'https://kkdbbymvxwmmywtniaje.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGJieW12eHdtbXl3dG5pYWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTYwNzgsImV4cCI6MjA4NDQ3MjA3OH0.-zrJmAZ7uPZWJvPoHM6rq5MfpHH87tGAU0MrkLFWE-Y';
const BUCKET_NAME = 'videos';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Upload a video file to Supabase Storage
 * @param {string} filePath - Path to the video file
 * @param {string} fileName - Name to use in storage (optional, defaults to file name)
 * @returns {Promise<Object>} Upload result
 */
async function uploadVideo(filePath, fileName = null) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Get file name if not provided
    const storageFileName = fileName || path.basename(filePath);

    // Read file
    const fileBuffer = fs.readFileSync(filePath);
    const fileBlob = new Blob([fileBuffer]);

    console.log(`Uploading ${storageFileName}...`);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storageFileName, fileBlob, {
        cacheControl: '3600',
        upsert: true, // Overwrite if exists
        contentType: 'video/mp4'
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storageFileName);

    console.log(`✅ Upload successful!`);
    console.log(`   File: ${storageFileName}`);
    console.log(`   Public URL: ${urlData.publicUrl}`);
    console.log('');

    return {
      success: true,
      fileName: storageFileName,
      publicUrl: urlData.publicUrl,
      data
    };
  } catch (error) {
    console.error(`❌ Upload failed for ${filePath}:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Upload multiple videos
 * @param {Array<{path: string, name?: string}>} videos - Array of video file info
 */
async function uploadVideos(videos) {
  console.log('Starting video uploads to Supabase Storage...\n');
  
  const results = [];
  for (const video of videos) {
    const result = await uploadVideo(video.path, video.name);
    results.push(result);
  }

  console.log('\n📊 Upload Summary:');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`   ✅ Successful: ${successful}`);
  console.log(`   ❌ Failed: ${failed}`);

  return results;
}

// If running directly (not as module)
if (require.main === module) {
  // Example usage - update these paths to your actual video files
  // Prefer compressed versions if they exist
  const videosToUpload = [
    {
      path: './swintech BRAND VIDEO eng FINAL W SUBS_compressed.mp4',
      name: 'swintech BRAND VIDEO eng FINAL W SUBS.mp4',
      fallback: './swintech BRAND VIDEO eng FINAL W SUBS.mp4'
    },
    {
      path: './demo video spray only VO engsubs FIOINAL_compressed.mp4',
      name: 'demo video spray only VO engsubs FIOINAL.mp4',
      fallback: './demo video spray only VO engsubs FIOINAL.mp4'
    }
  ];

  // Use fallback if compressed version doesn't exist
  videosToUpload.forEach(video => {
    if (!fs.existsSync(video.path) && video.fallback && fs.existsSync(video.fallback)) {
      console.log(`⚠️  Compressed version not found, using original: ${video.name}`);
      video.path = video.fallback;
    }
  });

  uploadVideos(videosToUpload)
    .then(() => {
      console.log('\n✨ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

// Export for use as module
module.exports = {
  uploadVideo,
  uploadVideos,
  supabase,
  BUCKET_NAME
};
