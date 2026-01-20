const { test, expect } = require('@playwright/test');

test.describe('Hero Section - Bottle Top/Bottom Alignment with Content', () => {
  test('Bottle should align with content top and bottom on all screen sizes', async ({ page }) => {
    await page.goto('http://localhost:8000');
    await page.waitForLoadState('networkidle');
    
    const viewports = [
      { width: 320, height: 568, name: 'Mobile (320px)' },
      { width: 375, height: 667, name: 'Mobile (375px)' },
      { width: 480, height: 854, name: 'Mobile (480px)' },
      { width: 768, height: 1024, name: 'Tablet (768px)' },
      { width: 1024, height: 768, name: 'Laptop (1024px)' },
      { width: 1280, height: 720, name: 'Laptop (1280px)' },
      { width: 1440, height: 900, name: 'Desktop (1440px)' },
      { width: 1920, height: 1080, name: 'Large Desktop (1920px)' },
    ];
    
    const results = [];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);
      
      const content = page.locator('.hero__content');
      const image = page.locator('.hero__image');
      const bottle = page.locator('.hero__bottle');
      const container = page.locator('.hero__container');
      
      const contentBox = await content.boundingBox();
      const imageBox = await image.boundingBox();
      const bottleBox = await bottle.boundingBox();
      const containerBox = await container.boundingBox();
      
      const contentStyles = await content.evaluate((el) => {
        const s = window.getComputedStyle(el);
        return {
          paddingTop: s.paddingTop,
          paddingBottom: s.paddingBottom,
          marginTop: s.marginTop,
          marginBottom: s.marginBottom,
          alignSelf: s.alignSelf,
        };
      });
      
      const imageStyles = await image.evaluate((el) => {
        const s = window.getComputedStyle(el);
        return {
          paddingTop: s.paddingTop,
          paddingBottom: s.paddingBottom,
          marginTop: s.marginTop,
          marginBottom: s.marginBottom,
          alignSelf: s.alignSelf,
          alignItems: s.alignItems,
        };
      });
      
      const containerStyles = await container.evaluate((el) => {
        const s = window.getComputedStyle(el);
        return {
          alignItems: s.alignItems,
          alignContent: s.alignContent,
        };
      });
      
      // Calculate alignment differences
      const topDifference = contentBox && imageBox 
        ? Math.abs(contentBox.y - imageBox.y) 
        : 0;
      
      const bottomDifference = contentBox && imageBox
        ? Math.abs((contentBox.y + contentBox.height) - (imageBox.y + imageBox.height))
        : 0;
      
      // Bottle alignment within image container
      const bottleTopInImage = bottleBox && imageBox
        ? bottleBox.y - imageBox.y
        : 0;
      
      const bottleBottomInImage = bottleBox && imageBox
        ? (imageBox.y + imageBox.height) - (bottleBox.y + bottleBox.height)
        : 0;
      
      const result = {
        viewport: viewport.name,
        viewportWidth: viewport.width,
        contentBox,
        imageBox,
        bottleBox,
        containerBox,
        contentStyles,
        imageStyles,
        containerStyles,
        topDifference: topDifference.toFixed(2),
        bottomDifference: bottomDifference.toFixed(2),
        bottleTopInImage: bottleTopInImage.toFixed(2),
        bottleBottomInImage: bottleBottomInImage.toFixed(2),
      };
      
      results.push(result);
      
      console.log(`\n${viewport.name} (${viewport.width}px):`);
      console.log(`  Content top: ${contentBox?.y.toFixed(2)}px, bottom: ${(contentBox?.y + contentBox?.height).toFixed(2)}px`);
      console.log(`  Image top: ${imageBox?.y.toFixed(2)}px, bottom: ${(imageBox?.y + imageBox?.height).toFixed(2)}px`);
      console.log(`  Bottle top: ${bottleBox?.y.toFixed(2)}px, bottom: ${(bottleBox?.y + bottleBox?.height).toFixed(2)}px`);
      console.log(`  Top difference: ${result.topDifference}px`);
      console.log(`  Bottom difference: ${result.bottomDifference}px`);
      console.log(`  Bottle top in image: ${result.bottleTopInImage}px`);
      console.log(`  Bottle bottom in image: ${result.bottleBottomInImage}px`);
    }
    
    // Log all results for analysis
    console.log('\n=== ALIGNMENT SUMMARY ===');
    results.forEach(r => {
      console.log(`${r.viewport}: TopDiff=${r.topDifference}px, BottomDiff=${r.bottomDifference}px, BottleTop=${r.bottleTopInImage}px, BottleBottom=${r.bottleBottomInImage}px`);
    });
    
    // Verify alignment (within 5px tolerance)
    results.forEach(r => {
      const topDiff = parseFloat(r.topDifference);
      const bottomDiff = parseFloat(r.bottomDifference);
      expect(topDiff).toBeLessThan(5); // Content and image should align at top
      expect(bottomDiff).toBeLessThan(5); // Content and image should align at bottom
    });
    
    // Store results for debugging
    await page.evaluate((results) => {
      window.__heroAlignmentResults = results;
    }, results);
  });
  
  test('Measure detailed alignment with computed styles', async ({ page }) => {
    await page.goto('http://localhost:8000');
    await page.waitForLoadState('networkidle');
    
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);
    
    const content = page.locator('.hero__content');
    const image = page.locator('.hero__image');
    const bottle = page.locator('.hero__bottle');
    const container = page.locator('.hero__container');
    
    const contentBox = await content.boundingBox();
    const imageBox = await image.boundingBox();
    const bottleBox = await bottle.boundingBox();
    const containerBox = await container.boundingBox();
    
    const containerStyles = await container.evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        display: s.display,
        alignItems: s.alignItems,
        alignContent: s.alignContent,
        height: s.height,
        minHeight: s.minHeight,
      };
    });
    
    const contentStyles = await content.evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        height: s.height,
        minHeight: s.minHeight,
        paddingTop: s.paddingTop,
        paddingBottom: s.paddingBottom,
        marginTop: s.marginTop,
        marginBottom: s.marginBottom,
        alignSelf: s.alignSelf,
      };
    });
    
    const imageStyles = await image.evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        height: s.height,
        minHeight: s.minHeight,
        paddingTop: s.paddingTop,
        paddingBottom: s.paddingBottom,
        marginTop: s.marginTop,
        marginBottom: s.marginBottom,
        alignSelf: s.alignSelf,
        alignItems: s.alignItems,
      };
    });
    
    const bottleStyles = await bottle.evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        height: s.height,
        maxHeight: s.maxHeight,
        marginTop: s.marginTop,
        marginBottom: s.marginBottom,
        verticalAlign: s.verticalAlign,
      };
    });
    
    console.log('\n=== DETAILED ALIGNMENT MEASUREMENTS (1280px) ===');
    console.log('Container:', containerBox);
    console.log('Container Styles:', containerStyles);
    console.log('\nContent:', contentBox);
    console.log('Content Styles:', contentStyles);
    console.log('\nImage:', imageBox);
    console.log('Image Styles:', imageStyles);
    console.log('\nBottle:', bottleBox);
    console.log('Bottle Styles:', bottleStyles);
    
    if (contentBox && imageBox) {
      console.log(`\nAlignment Check:`);
      console.log(`  Content top: ${contentBox.y.toFixed(2)}px`);
      console.log(`  Image top: ${imageBox.y.toFixed(2)}px`);
      console.log(`  Top difference: ${Math.abs(contentBox.y - imageBox.y).toFixed(2)}px`);
      console.log(`  Content bottom: ${(contentBox.y + contentBox.height).toFixed(2)}px`);
      console.log(`  Image bottom: ${(imageBox.y + imageBox.height).toFixed(2)}px`);
      console.log(`  Bottom difference: ${Math.abs((contentBox.y + contentBox.height) - (imageBox.y + imageBox.height)).toFixed(2)}px`);
    }
  });
});
