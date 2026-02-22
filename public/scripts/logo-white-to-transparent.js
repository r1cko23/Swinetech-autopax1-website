/**
 * One-off: Convert logo JPG to PNG with white background made transparent.
 * Usage: node public/scripts/logo-white-to-transparent.js
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..', '..');
const inputPath = path.join(projectRoot, 'Swine Tech_Final_Vertical_Logo_with tagline.jpg');
const outputDir = path.join(projectRoot, 'public', 'logos');
const outputPath = path.join(outputDir, 'Swine Tech_Final_Vertical_Logo_with tagline.png');

const WHITE_THRESHOLD = 248; // Pixels with R,G,B all >= this become transparent

async function main() {
  if (!fs.existsSync(inputPath)) {
    console.error('Input not found:', inputPath);
    process.exit(1);
  }
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(outputPath);

  console.log('Saved transparent PNG:', outputPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
