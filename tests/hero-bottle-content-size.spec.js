const { test, expect } = require('@playwright/test');

test.describe('Hero Section - Bottle Should Match Content Height', () => {
  test('Bottle height should match hero content height on all screen sizes', async ({ page }) => {
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
      const bottle = page.locator('.hero__bottle');
      
      const contentBox = await content.boundingBox();
      const bottleBox = await bottle.boundingBox();
      
      const contentStyles = await content.evaluate((el) => {
        const s = window.getComputedStyle(el);
        return {
          height: s.height,
          minHeight: s.minHeight,
          paddingTop: s.paddingTop,
          paddingBottom: s.paddingBottom,
        };
      });
      
      const bottleStyles = await bottle.evaluate((el) => {
        const s = window.getComputedStyle(el);
        return {
          width: s.width,
          maxWidth: s.maxWidth,
          height: s.height,
          maxHeight: s.maxHeight,
        };
      });
      
      const result = {
        viewport: viewport.name,
        contentHeight: contentBox?.height || 0,
        bottleHeight: bottleBox?.height || 0,
        contentStyles,
        bottleStyles,
        difference: Math.abs((contentBox?.height || 0) - (bottleBox?.height || 0)),
        matchPercentage: contentBox?.height 
          ? ((bottleBox?.height || 0) / (contentBox?.height || 1)) * 100 
          : 0,
      };
      
      results.push(result);
      
      console.log(`\n${viewport.name}:`);
      console.log(`  Content height: ${contentBox?.height?.toFixed(2)}px`);
      console.log(`  Bottle height: ${bottleBox?.height?.toFixed(2)}px`);
      console.log(`  Difference: ${result.difference.toFixed(2)}px`);
      console.log(`  Match: ${result.matchPercentage.toFixed(1)}%`);
    }
    
    // Log all results for analysis
    console.log('\n=== SUMMARY ===');
    results.forEach(r => {
      console.log(`${r.viewport}: Content=${r.contentHeight.toFixed(0)}px, Bottle=${r.bottleHeight.toFixed(0)}px, Diff=${r.difference.toFixed(0)}px`);
    });
    
    // Store results for debugging
    await page.evaluate((results) => {
      window.__heroSizeResults = results;
    }, results);
  });
  
  test('Measure hero content and bottle dimensions in detail', async ({ page }) => {
    await page.goto('http://localhost:8000');
    await page.waitForLoadState('networkidle');
    
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);
    
    const content = page.locator('.hero__content');
    const bottle = page.locator('.hero__bottle');
    const container = page.locator('.hero__container');
    
    const containerBox = await container.boundingBox();
    const contentBox = await content.boundingBox();
    const bottleBox = await bottle.boundingBox();
    
    const containerStyles = await container.evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        display: s.display,
        gridTemplateColumns: s.gridTemplateColumns,
        gap: s.gap,
        alignItems: s.alignItems,
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
      };
    });
    
    const bottleStyles = await bottle.evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        width: s.width,
        maxWidth: s.maxWidth,
        height: s.height,
        maxHeight: s.maxHeight,
        objectFit: s.objectFit,
        aspectRatio: s.aspectRatio,
      };
    });
    
    console.log('\n=== DETAILED MEASUREMENTS (1280px) ===');
    console.log('Container:', containerBox);
    console.log('Container Styles:', containerStyles);
    console.log('\nContent:', contentBox);
    console.log('Content Styles:', contentStyles);
    console.log('\nBottle:', bottleBox);
    console.log('Bottle Styles:', bottleStyles);
  });
});
