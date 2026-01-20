const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test.describe('Video Overlap Debug - Runtime Evidence', () => {
  test('should capture debug logs for video thumbnail overlap', async ({ page }) => {
    // Clear previous log file
    const logPath = path.join(__dirname, '..', '.cursor', 'debug.log');
    if (fs.existsSync(logPath)) {
      fs.unlinkSync(logPath);
    }
    
    // Open the HTML file directly
    const htmlPath = path.join(__dirname, '..', 'index.html');
    await page.goto(`file://${htmlPath}`);
    
    // Wait for page to load and scripts to execute
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500); // Wait for debug function to run
    
    // Scroll to sections to trigger any scroll-based calculations
    const asfSection = page.locator('.asf-section');
    const videoSection = page.locator('.video-section');
    
    if (await asfSection.count() > 0) {
      await asfSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
    }
    
    if (await videoSection.count() > 0) {
      await videoSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
    }
    
    // Trigger resize to capture viewport-specific data
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(300);
    
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(300);
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(300);
    
    // Wait a bit more for all logs to be sent
    await page.waitForTimeout(500);
    
    // Check if log file was created and has content
    if (fs.existsSync(logPath)) {
      const logContent = fs.readFileSync(logPath, 'utf-8');
      console.log('Debug log file created with', logContent.split('\n').filter(l => l.trim()).length, 'entries');
      console.log('First few log entries:');
      logContent.split('\n').slice(0, 5).forEach(line => {
        if (line.trim()) {
          try {
            const log = JSON.parse(line);
            console.log(`  - ${log.message}: ${log.hypothesisId}`);
          } catch (e) {
            console.log(`  - ${line.substring(0, 100)}...`);
          }
        }
      });
    } else {
      console.log('Warning: Debug log file not created. Instrumentation may not have run.');
    }
    
    // Take screenshot for visual debugging
    await page.screenshot({ path: 'test-results/video-overlap-debug.png', fullPage: true });
  });
});
