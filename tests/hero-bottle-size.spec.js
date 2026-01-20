const { test, expect } = require('@playwright/test');

test.describe('Hero Section - Bottle Size Check', () => {
  test('Bottle size should be appropriate on laptop screens', async ({ page }) => {
    await page.goto('http://localhost:8000');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Get the bottle element
    const bottle = page.locator('.hero__bottle');
    await expect(bottle).toBeVisible();
    
    // Get computed styles and dimensions
    const boundingBox = await bottle.boundingBox();
    const computedStyles = await bottle.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        width: styles.width,
        maxWidth: styles.maxWidth,
        height: styles.height,
        transform: styles.transform,
      };
    });
    
    console.log('Bottle dimensions:', boundingBox);
    console.log('Bottle computed styles:', computedStyles);
    
    // Check on laptop viewport (1280px)
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);
    
    const laptopBoundingBox = await bottle.boundingBox();
    const laptopStyles = await bottle.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        width: styles.width,
        maxWidth: styles.maxWidth,
        height: styles.height,
      };
    });
    
    console.log('Laptop (1280px) bottle dimensions:', laptopBoundingBox);
    console.log('Laptop (1280px) bottle styles:', laptopStyles);
    
    // Bottle should not exceed 280px width on laptop
    if (laptopBoundingBox) {
      expect(laptopBoundingBox.width).toBeLessThanOrEqual(300); // Allow some tolerance
    }
  });
  
  test('Bottle size on different viewports', async ({ page }) => {
    await page.goto('http://localhost:8000');
    await page.waitForLoadState('networkidle');
    
    const viewports = [
      { width: 1024, height: 768, name: 'Laptop (1024px)' },
      { width: 1280, height: 720, name: 'Laptop (1280px)' },
      { width: 1440, height: 900, name: 'Desktop (1440px)' },
      { width: 1920, height: 1080, name: 'Large Desktop (1920px)' },
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);
      
      const bottle = page.locator('.hero__bottle');
      const boundingBox = await bottle.boundingBox();
      const styles = await bottle.evaluate((el) => {
        const s = window.getComputedStyle(el);
        return {
          width: s.width,
          maxWidth: s.maxWidth,
          height: s.height,
        };
      });
      
      console.log(`${viewport.name}:`);
      console.log('  Dimensions:', boundingBox);
      console.log('  Styles:', styles);
      
      if (boundingBox) {
        console.log(`  Actual width: ${boundingBox.width}px`);
      }
    }
  });
});
