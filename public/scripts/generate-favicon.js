const sharp = require('sharp');
const toIco = require('to-ico');
const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, '..', 'logos', 'Swine Tech_Iconic_Logo.png');
const outputDir = path.join(__dirname, '..', 'favicons');

async function generateFavicon() {
  try {
    // Check if logo exists
    if (!fs.existsSync(logoPath)) {
      console.error(`Logo file not found: ${logoPath}`);
      process.exit(1);
    }

    console.log('Generating favicons from Swine Tech Iconic Logo...');

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate 16x16 favicon
    await sharp(logoPath)
      .resize(16, 16, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
      })
      .png()
      .toFile(path.join(outputDir, 'favicon-16x16-iconic.png'));

    console.log('✓ Created favicon-16x16-iconic.png');

    // Generate 32x32 favicon
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
      })
      .png()
      .toFile(path.join(outputDir, 'favicon-32x32-iconic.png'));

    console.log('✓ Created favicon-32x32-iconic.png');

    // Generate 192x192 for Android
    await sharp(logoPath)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
      })
      .png()
      .toFile(path.join(outputDir, 'android-chrome-192x192-iconic.png'));

    console.log('✓ Created android-chrome-192x192-iconic.png');

    // Generate 512x512 for Android
    await sharp(logoPath)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
      })
      .png()
      .toFile(path.join(outputDir, 'android-chrome-512x512-iconic.png'));

    console.log('✓ Created android-chrome-512x512-iconic.png');

    // Generate Apple touch icon (180x180)
    await sharp(logoPath)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
      })
      .png()
      .toFile(path.join(outputDir, 'apple-touch-icon-iconic.png'));

    console.log('✓ Created apple-touch-icon-iconic.png');

    // Generate ICO file (multi-size)
    const ico16 = await sharp(logoPath)
      .resize(16, 16, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
      })
      .png()
      .toBuffer();

    const ico32 = await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
      })
      .png()
      .toBuffer();

    const ico48 = await sharp(logoPath)
      .resize(48, 48, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
      })
      .png()
      .toBuffer();

    const icoBuffer = await toIco([ico16, ico32, ico48]);
    fs.writeFileSync(path.join(outputDir, 'favicon-iconic.ico'), icoBuffer);

    console.log('✓ Created favicon-iconic.ico (multi-size ICO format)');

    console.log('\n✅ All favicon files generated successfully!');
    console.log('\nGenerated files:');
    console.log('  - favicon-16x16-iconic.png');
    console.log('  - favicon-32x32-iconic.png');
    console.log('  - android-chrome-192x192-iconic.png');
    console.log('  - android-chrome-512x512-iconic.png');
    console.log('  - apple-touch-icon-iconic.png');
    console.log('  - favicon-iconic.ico');
    console.log('\nNote: These files are based on the Swine Tech Iconic Logo with white background.');

  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicon();
