const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test.describe('Video Thumbnail Missing - Debug', () => {
  test('should capture debug logs for missing video thumbnail', async ({ page }) => {
    // Open the HTML file directly
    const htmlPath = path.join(__dirname, '..', 'index.html');
    await page.goto(`file://${htmlPath}`);
    
    // Wait for page to load and scripts to execute
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for debug functions to run
    
    // Check if thumbnail element exists
    const thumbnail = page.locator('.video-section__thumbnail');
    const thumbnailExists = await thumbnail.count() > 0;
    
    if (thumbnailExists) {
      // Check if image is loaded
      const imgSrc = await thumbnail.getAttribute('src');
      const imgComplete = await thumbnail.evaluate((img) => img.complete);
      const imgNaturalWidth = await thumbnail.evaluate((img) => img.naturalWidth);
      const imgNaturalHeight = await thumbnail.evaluate((img) => img.naturalHeight);
      
      // Check computed styles
      const display = await thumbnail.evaluate((el) => window.getComputedStyle(el).display);
      const visibility = await thumbnail.evaluate((el) => window.getComputedStyle(el).visibility);
      const opacity = await thumbnail.evaluate((el) => window.getComputedStyle(el).opacity);
      const zIndex = await thumbnail.evaluate((el) => window.getComputedStyle(el).zIndex);
      const width = await thumbnail.evaluate((el) => window.getComputedStyle(el).width);
      const height = await thumbnail.evaluate((el) => window.getComputedStyle(el).height);
      
      // Get bounding box
      const boundingBox = await thumbnail.boundingBox();
      
      console.log('Thumbnail Debug Info:');
      console.log('  - Exists:', thumbnailExists);
      console.log('  - Src:', imgSrc);
      console.log('  - Complete:', imgComplete);
      console.log('  - Natural Size:', imgNaturalWidth, 'x', imgNaturalHeight);
      console.log('  - Display:', display);
      console.log('  - Visibility:', visibility);
      console.log('  - Opacity:', opacity);
      console.log('  - Z-index:', zIndex);
      console.log('  - Width:', width);
      console.log('  - Height:', height);
      console.log('  - Bounding Box:', boundingBox);
      
      // Check for image errors
      const imgError = await thumbnail.evaluate((img) => {
        return new Promise((resolve) => {
          if (img.complete && img.naturalWidth === 0) {
            resolve(true);
          } else {
            img.onerror = () => resolve(true);
            img.onload = () => resolve(false);
            // If already loaded, check immediately
            if (img.complete) resolve(false);
          }
        });
      });
      
      console.log('  - Image Error:', imgError);
    } else {
      console.log('Thumbnail element NOT FOUND in DOM');
    }
    
    // Wait for logs to be sent
    await page.waitForTimeout(1000);
    
    // Check log file
    const logPath = path.join(__dirname, '..', '.cursor', 'debug.log');
    if (fs.existsSync(logPath)) {
      const logContent = fs.readFileSync(logPath, 'utf-8');
      const lines = logContent.split('\n').filter(l => l.trim());
      console.log('\nDebug log entries:', lines.length);
      lines.slice(-10).forEach(line => {
        if (line.trim()) {
          try {
            const log = JSON.parse(line);
            if (log.message && log.message.includes('Thumbnail')) {
              console.log(`  - ${log.message}: ${log.hypothesisId}`);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      });
    }
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/missing-thumbnail-debug.png', fullPage: true });
  });
});
