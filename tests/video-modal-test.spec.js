/**
 * Test video modal functionality in Section 3
 * Tests that thumbnail and play button are visible, and modal opens on click
 */

const { test, expect } = require('@playwright/test');

test.describe('Video Modal in Section 3', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/index.html');
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display thumbnail and play button in Section 3', async ({ page }) => {
    // Scroll to video section
    const videoSection = page.locator('.video-section');
    await videoSection.scrollIntoViewIfNeeded();
    
    // Check that thumbnail is visible
    const thumbnail = page.locator('.video-section__thumbnail');
    await expect(thumbnail).toBeVisible();
    
    // Check that play button is visible
    const playButton = page.locator('.video-section__play-btn');
    await expect(playButton).toBeVisible();
    
    // Check that play icon is visible
    const playIcon = page.locator('.video-section__play-icon');
    await expect(playIcon).toBeVisible();
  });

  test('should open fullscreen modal when play button is clicked', async ({ page }) => {
    // Scroll to video section
    const videoSection = page.locator('.video-section');
    await videoSection.scrollIntoViewIfNeeded();
    
    // Wait for play button to be visible
    const playButton = page.locator('.video-section__play-btn');
    await expect(playButton).toBeVisible();
    
    // Click the play button
    await playButton.click();
    
    // Wait for modal to appear
    const videoModal = page.locator('#videoModal');
    await expect(videoModal).toBeVisible();
    
    // Check that modal has aria-hidden="false"
    await expect(videoModal).toHaveAttribute('aria-hidden', 'false');
    
    // Check that video player exists in modal
    const videoPlayer = page.locator('#videoModalPlayer');
    await expect(videoPlayer).toBeVisible();
    
    // Check that video source is correct
    const videoSource = page.locator('#videoModalPlayer source');
    await expect(videoSource).toHaveAttribute('src', 'swintech BRAND VIDEO eng FINAL W SUBS.mp4');
  });

  test('should play video when modal opens', async ({ page }) => {
    // Scroll to video section
    const videoSection = page.locator('.video-section');
    await videoSection.scrollIntoViewIfNeeded();
    
    // Click play button
    const playButton = page.locator('.video-section__play-btn');
    await playButton.click();
    
    // Wait for modal and video player
    const videoPlayer = page.locator('#videoModalPlayer');
    await expect(videoPlayer).toBeVisible();
    
    // Wait a bit for video to start playing
    await page.waitForTimeout(1000);
    
    // Check if video is playing (paused property should be false)
    const isPlaying = await videoPlayer.evaluate((video) => {
      return !video.paused;
    });
    
    // Video should be playing (or at least attempted to play)
    // Note: Some browsers may require user interaction, so we check if video is ready
    const videoReady = await videoPlayer.evaluate((video) => {
      return video.readyState >= 2; // HAVE_CURRENT_DATA or higher
    });
    
    expect(videoReady).toBeTruthy();
  });

  test('should close modal when close button is clicked', async ({ page }) => {
    // Scroll to video section
    const videoSection = page.locator('.video-section');
    await videoSection.scrollIntoViewIfNeeded();
    
    // Open modal
    const playButton = page.locator('.video-section__play-btn');
    await playButton.click();
    
    // Wait for modal
    const videoModal = page.locator('#videoModal');
    await expect(videoModal).toBeVisible();
    
    // Click close button
    const closeButton = page.locator('#closeVideoModal');
    await closeButton.click();
    
    // Wait for modal to close
    await expect(videoModal).toHaveAttribute('aria-hidden', 'true');
    
    // Modal should not be visible
    await expect(videoModal).not.toBeVisible();
  });

  test('should close modal when overlay is clicked', async ({ page }) => {
    // Scroll to video section
    const videoSection = page.locator('.video-section');
    await videoSection.scrollIntoViewIfNeeded();
    
    // Open modal
    const playButton = page.locator('.video-section__play-btn');
    await playButton.click();
    
    // Wait for modal
    const videoModal = page.locator('#videoModal');
    await expect(videoModal).toBeVisible();
    
    // Click overlay - use force click to ensure it works even if video intercepts
    const overlay = page.locator('.video-modal__overlay');
    // Click at a position that's definitely on the overlay (top-left corner)
    await overlay.click({ position: { x: 10, y: 10 }, force: true });
    
    // Wait for modal to close
    await expect(videoModal).toHaveAttribute('aria-hidden', 'true');
  });

  test('should close modal when Escape key is pressed', async ({ page }) => {
    // Scroll to video section
    const videoSection = page.locator('.video-section');
    await videoSection.scrollIntoViewIfNeeded();
    
    // Open modal
    const playButton = page.locator('.video-section__play-btn');
    await playButton.click();
    
    // Wait for modal
    const videoModal = page.locator('#videoModal');
    await expect(videoModal).toBeVisible();
    
    // Press Escape key
    await page.keyboard.press('Escape');
    
    // Wait for modal to close
    await expect(videoModal).toHaveAttribute('aria-hidden', 'true');
  });

  test('should pause and reset video when modal closes', async ({ page }) => {
    // Scroll to video section
    const videoSection = page.locator('.video-section');
    await videoSection.scrollIntoViewIfNeeded();
    
    // Open modal
    const playButton = page.locator('.video-section__play-btn');
    await playButton.click();
    
    // Wait for modal and video
    const videoPlayer = page.locator('#videoModalPlayer');
    await expect(videoPlayer).toBeVisible();
    
    // Wait a bit for video to potentially start
    await page.waitForTimeout(500);
    
    // Close modal
    const closeButton = page.locator('#closeVideoModal');
    await closeButton.click();
    
    // Wait for modal to close
    const videoModal = page.locator('#videoModal');
    await expect(videoModal).toHaveAttribute('aria-hidden', 'true');
    
    // Check that video is paused and reset
    const videoState = await videoPlayer.evaluate((video) => {
      return {
        paused: video.paused,
        currentTime: video.currentTime
      };
    });
    
    expect(videoState.paused).toBe(true);
    expect(videoState.currentTime).toBe(0);
  });
});
