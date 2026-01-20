#!/usr/bin/env node

/**
 * Video Compression Script
 * 
 * Compresses video files for web playback using ffmpeg.
 * Reduces file size while maintaining good quality.
 * 
 * Usage:
 *   node scripts/compress-videos.js [input-file] [output-file]
 *   node scripts/compress-videos.js --all
 *   node scripts/compress-videos.js --quality medium
 * 
 * Quality options: low, medium, high (default: medium)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Quality presets for different compression levels
const QUALITY_PRESETS = {
  low: {
    crf: 28,           // Higher CRF = smaller file, lower quality
    preset: 'fast',    // Faster encoding
    maxrate: '2M',     // Max bitrate
    bufsize: '4M',     // Buffer size
    description: 'Small file size, acceptable quality (good for slow connections)'
  },
  medium: {
    crf: 23,           // Balanced quality/size
    preset: 'medium',  // Balanced encoding speed
    maxrate: '4M',     // Max bitrate
    bufsize: '8M',     // Buffer size
    description: 'Balanced file size and quality (recommended)'
  },
  high: {
    crf: 20,           // Lower CRF = larger file, higher quality
    preset: 'slow',    // Slower encoding, better compression
    maxrate: '6M',     // Max bitrate
    bufsize: '12M',    // Buffer size
    description: 'Larger file size, high quality'
  }
};

/**
 * Get file size in human-readable format
 */
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  return `${sizeInMB} MB`;
}

/**
 * Compress a video file
 */
function compressVideo(inputPath, outputPath, quality = 'medium') {
  const preset = QUALITY_PRESETS[quality] || QUALITY_PRESETS.medium;
  
  console.log(`\n📹 Compressing video...`);
  console.log(`   Input: ${inputPath}`);
  console.log(`   Output: ${outputPath}`);
  console.log(`   Quality: ${quality} (${preset.description})`);
  
  // Check if input file exists
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }
  
  const inputSize = getFileSize(inputPath);
  console.log(`   Original size: ${inputSize}`);
  
  // Build ffmpeg command
  const command = [
    'ffmpeg',
    '-i', `"${inputPath}"`,
    '-c:v', 'libx264',           // H.264 codec (widely supported)
    '-crf', preset.crf.toString(), // Quality setting
    '-preset', preset.preset,    // Encoding speed
    '-c:a', 'aac',                // AAC audio codec
    '-b:a', '128k',               // Audio bitrate
    '-movflags', '+faststart',    // Enable fast start for web playback
    '-maxrate', preset.maxrate,   // Max bitrate
    '-bufsize', preset.bufsize,  // Buffer size
    '-vf', 'scale=1920:-2',       // Scale to max 1920px width, maintain aspect ratio
    '-y',                         // Overwrite output file
    `"${outputPath}"`
  ].join(' ');
  
  try {
    console.log(`\n⏳ Processing (this may take a few minutes)...\n`);
    
    execSync(command, { 
      stdio: 'inherit',
      shell: true 
    });
    
    // Check if output file was created
    if (fs.existsSync(outputPath)) {
      const outputSize = getFileSize(outputPath);
      const reduction = ((1 - parseFloat(outputSize) / parseFloat(inputSize)) * 100).toFixed(1);
      
      console.log(`\n✅ Compression complete!`);
      console.log(`   Original: ${inputSize}`);
      console.log(`   Compressed: ${outputSize}`);
      console.log(`   Reduction: ${reduction}%`);
      
      return {
        success: true,
        inputSize,
        outputSize,
        reduction: `${reduction}%`
      };
    } else {
      throw new Error('Output file was not created');
    }
  } catch (error) {
    console.error(`\n❌ Compression failed:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Compress all video files in the current directory
 */
function compressAllVideos(quality = 'medium') {
  const videoFiles = [
    'swintech BRAND VIDEO eng FINAL W SUBS.mp4',
    'demo video spray only VO engsubs FIOINAL.mp4'
  ];
  
  const results = [];
  
  for (const videoFile of videoFiles) {
    const inputPath = path.join(process.cwd(), videoFile);
    const outputPath = path.join(process.cwd(), `${path.parse(videoFile).name}_compressed.mp4`);
    
    if (fs.existsSync(inputPath)) {
      const result = compressVideo(inputPath, outputPath, quality);
      results.push({ file: videoFile, ...result });
    } else {
      console.log(`\n⚠️  File not found: ${videoFile}`);
      results.push({ file: videoFile, success: false, error: 'File not found' });
    }
  }
  
  return results;
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Video Compression Tool

Usage:
  node scripts/compress-videos.js [input] [output] [--quality low|medium|high]
  node scripts/compress-videos.js --all [--quality low|medium|high]

Examples:
  node scripts/compress-videos.js video.mp4 video_compressed.mp4
  node scripts/compress-videos.js --all --quality medium
  node scripts/compress-videos.js "swintech BRAND VIDEO eng FINAL W SUBS.mp4" "brand_compressed.mp4"

Quality Options:
  low     - Small file size, acceptable quality (~50-70% reduction)
  medium  - Balanced size and quality (~40-60% reduction) [default]
  high    - Larger file, high quality (~20-40% reduction)

Note: Place your original video files in the project root directory.
    `);
    process.exit(0);
  }
  
  if (args.includes('--all')) {
    const qualityArg = args.find(arg => arg.startsWith('--quality='));
    const quality = qualityArg ? qualityArg.split('=')[1] : 
                   args[args.indexOf('--quality') + 1] || 'medium';
    
    console.log('🎬 Compressing all videos...\n');
    const results = compressAllVideos(quality);
    
    console.log('\n📊 Summary:');
    results.forEach(result => {
      if (result.success) {
        console.log(`   ✅ ${result.file}: ${result.reduction} reduction`);
      } else {
        console.log(`   ❌ ${result.file}: ${result.error || 'Failed'}`);
      }
    });
  } else if (args.length >= 2) {
    const inputPath = args[0];
    const outputPath = args[1];
    const qualityArg = args.find(arg => arg.startsWith('--quality='));
    const quality = qualityArg ? qualityArg.split('=')[1] : 
                   args[args.indexOf('--quality') + 1] || 'medium';
    
    compressVideo(inputPath, outputPath, quality);
  } else {
    console.log('❌ Invalid arguments. Use --help for usage information.');
    process.exit(1);
  }
}

module.exports = { compressVideo, compressAllVideos, QUALITY_PRESETS };
