/**
 * Playwright Responsive Design Test
 * Tests the website across multiple viewport sizes
 */

const { test, expect } = require('@playwright/test');
const path = require('path');

const viewports = [
  { name: 'Mobile Portrait', width: 375, height: 667 },
  { name: 'Mobile Landscape', width: 667, height: 375 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Tablet Landscape', width: 1024, height: 768 },
  { name: 'Desktop Small', width: 1280, height: 720 },
  { name: 'Desktop Large', width: 1920, height: 1080 },
];

test.describe('Responsive Design Tests', () => {
  test.beforeEach(async ({ page }) => {
    const htmlPath = path.join(__dirname, '..', 'index.html');
    await page.goto(`file://${htmlPath}`);
  });

  for (const viewport of viewports) {
    test(`should render correctly on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check that body doesn't overflow
      const bodyWidth = await page.evaluate(() => {
        return document.body.scrollWidth;
      });
      
      expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 10); // Allow small margin for rounding
      
      // Check that main sections are visible
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
      
      // Check that navigation is visible (may be hamburger menu on mobile)
      const nav = page.locator('.nav');
      await expect(nav).toBeVisible();
      
      // Check hero section
      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();
      
      // Check that no horizontal scrollbar appears
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      expect(hasHorizontalScroll).toBe(false);
    });

    test(`should have proper navigation on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForLoadState('networkidle');
      
      const logo = page.locator('.nav__logo');
      await expect(logo).toBeVisible();
      
      if (viewport.width <= 768) {
        // Mobile: hamburger menu should be visible
        const toggle = page.locator('.nav__toggle');
        await expect(toggle).toBeVisible();
        
        // Menu should be hidden initially
        const navRight = page.locator('.nav__right');
        const isVisible = await navRight.isVisible();
        expect(isVisible).toBe(false);
        
        // Click toggle to open menu
        await toggle.click();
        await expect(navRight).toBeVisible();
      } else {
        // Desktop: full navigation should be visible
        const navMenu = page.locator('.nav__menu');
        await expect(navMenu).toBeVisible();
      }
    });

    test(`should have responsive hero section on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForLoadState('networkidle');
      
      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();
      
      const heroHeading = page.locator('.hero__heading');
      await expect(heroHeading).toBeVisible();
      
      if (viewport.width <= 768) {
        // On mobile, check that grid is single column
        const gridColumns = await hero.locator('.hero__container').evaluate((el) => {
          return window.getComputedStyle(el).gridTemplateColumns;
        });
        expect(gridColumns).not.toContain('1.3fr');
      }
    });

    test(`should have responsive sections on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForLoadState('networkidle');
      
      // Check ASF section
      const asfSection = page.locator('.asf-section');
      await expect(asfSection).toBeVisible();
      
      // Check video section
      const videoSection = page.locator('.video-section');
      await expect(videoSection).toBeVisible();
      
      // Check mechanism section
      const mechanismSection = page.locator('.mechanism-section');
      await expect(mechanismSection).toBeVisible();
      
      // Check proof section
      const proofSection = page.locator('.proof-section');
      await expect(proofSection).toBeVisible();
      
      // Check product section
      const productSection = page.locator('.product-section');
      await expect(productSection).toBeVisible();
      
      // Check admin section
      const adminSection = page.locator('.admin-section');
      await expect(adminSection).toBeVisible();
      
      // Check protocol section
      const protocolSection = page.locator('.protocol-section');
      await expect(protocolSection).toBeVisible();
    });

    test(`should have responsive footer on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForLoadState('networkidle');
      
      const footer = page.locator('.footer');
      await expect(footer).toBeVisible();
      
      if (viewport.width <= 768) {
        // On mobile, footer should stack vertically
        const footerContainer = page.locator('.footer__container');
        const gridColumns = await footerContainer.evaluate((el) => {
          return window.getComputedStyle(el).gridTemplateColumns;
        });
        expect(gridColumns).not.toContain('repeat(auto-fit');
      }
    });
  }

  test('should handle mobile menu toggle correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    const toggle = page.locator('.nav__toggle');
    const navRight = page.locator('.nav__right');
    
    // Menu should be hidden initially
    await expect(navRight).not.toBeVisible();
    
    // Click to open
    await toggle.click();
    await expect(navRight).toBeVisible();
    
    // Click to close
    await toggle.click();
    await expect(navRight).not.toBeVisible();
  });

  test('should prevent horizontal overflow on all viewports', async ({ page }) => {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForLoadState('networkidle');
      
      const overflow = await page.evaluate(() => {
        return {
          body: document.body.scrollWidth > document.body.clientWidth,
          html: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          bodyWidth: document.body.scrollWidth,
          viewportWidth: window.innerWidth
        };
      });
      
      expect(overflow.body).toBe(false);
      expect(overflow.html).toBe(false);
    }
  });
});
