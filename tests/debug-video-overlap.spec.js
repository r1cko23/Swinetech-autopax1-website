const { test, expect } = require('@playwright/test');

test.describe('Video Overlap Debug', () => {
  test('should verify video overlaps between Section 2 and Section 3', async ({ page }) => {
    await page.goto('http://localhost:8000');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Scroll to Section 2
    const asfSection = page.locator('.asf-section');
    await asfSection.scrollIntoViewIfNeeded();
    
    // Get Section 2 dimensions
    const asfSectionBox = await asfSection.boundingBox();
    console.log('ASF Section position:', asfSectionBox);
    
    // Get video element
    const videoPlayer = page.locator('.asf-section__video .video-section__player');
    await expect(videoPlayer).toBeVisible();
    
    const videoBox = await videoPlayer.boundingBox();
    console.log('Video player position:', videoBox);
    
    // Calculate overlap
    if (asfSectionBox && videoBox) {
      const section2Bottom = asfSectionBox.y + asfSectionBox.height;
      const videoTop = videoBox.y;
      const videoBottom = videoBox.y + videoBox.height;
      const videoHeight = videoBox.height;
      
      const overlapInSection2 = section2Bottom - videoTop;
      const overlapPercentage = (overlapInSection2 / videoHeight) * 100;
      
      console.log('Section 2 bottom:', section2Bottom);
      console.log('Video top:', videoTop);
      console.log('Video bottom:', videoBottom);
      console.log('Video height:', videoHeight);
      console.log('Overlap in Section 2:', overlapInSection2);
      console.log('Overlap percentage:', overlapPercentage + '%');
      
      // Video should have 25% in Section 2
      expect(overlapPercentage).toBeGreaterThan(20);
      expect(overlapPercentage).toBeLessThan(30);
    }
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'test-results/video-overlap-debug.png', fullPage: false });
  });
});
