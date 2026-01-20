const { test, expect } = require('@playwright/test');

test.describe('Hero Section - Margin Verification', () => {
  test('Hero section should have consistent left and right margins on all screen sizes', async ({ page }) => {
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
      
      const hero = page.locator('.hero');
      const container = page.locator('.hero__container');
      const content = page.locator('.hero__content');
      const image = page.locator('.hero__image');
      
      const heroBox = await hero.boundingBox();
      const containerBox = await container.boundingBox();
      const contentBox = await content.boundingBox();
      const imageBox = await image.boundingBox();
      
      const heroStyles = await hero.evaluate((el) => {
        const s = window.getComputedStyle(el);
        return {
          paddingLeft: s.paddingLeft,
          paddingRight: s.paddingRight,
          marginLeft: s.marginLeft,
          marginRight: s.marginRight,
        };
      });
      
      const containerStyles = await container.evaluate((el) => {
        const s = window.getComputedStyle(el);
        return {
          paddingLeft: s.paddingLeft,
          paddingRight: s.paddingRight,
          marginLeft: s.marginLeft,
          marginRight: s.marginRight,
          maxWidth: s.maxWidth,
        };
      });
      
      const contentStyles = await content.evaluate((el) => {
        const s = window.getComputedStyle(el);
        return {
          paddingLeft: s.paddingLeft,
          paddingRight: s.paddingRight,
          marginLeft: s.marginLeft,
          marginRight: s.marginRight,
        };
      });
      
      const imageStyles = await image.evaluate((el) => {
        const s = window.getComputedStyle(el);
        return {
          paddingLeft: s.paddingLeft,
          paddingRight: s.paddingRight,
          marginLeft: s.marginLeft,
          marginRight: s.marginRight,
        };
      });
      
      // Calculate actual margins from viewport
      const leftMargin = containerBox?.x || 0;
      const rightMargin = viewport.width - (containerBox?.x || 0) - (containerBox?.width || 0);
      
      const result = {
        viewport: viewport.name,
        viewportWidth: viewport.width,
        heroBox,
        containerBox,
        contentBox,
        imageBox,
        heroStyles,
        containerStyles,
        contentStyles,
        imageStyles,
        leftMargin: leftMargin.toFixed(2),
        rightMargin: rightMargin.toFixed(2),
        leftMarginPercent: ((leftMargin / viewport.width) * 100).toFixed(2),
        rightMarginPercent: ((rightMargin / viewport.width) * 100).toFixed(2),
        marginDifference: Math.abs(leftMargin - rightMargin).toFixed(2),
      };
      
      results.push(result);
      
      console.log(`\n${viewport.name} (${viewport.width}px):`);
      console.log(`  Left margin: ${result.leftMargin}px (${result.leftMarginPercent}%)`);
      console.log(`  Right margin: ${result.rightMargin}px (${result.rightMarginPercent}%)`);
      console.log(`  Margin difference: ${result.marginDifference}px`);
      console.log(`  Container padding: left=${containerStyles.paddingLeft}, right=${containerStyles.paddingRight}`);
      console.log(`  Hero padding: left=${heroStyles.paddingLeft}, right=${heroStyles.paddingRight}`);
    }
    
    // Log all results for analysis
    console.log('\n=== MARGIN SUMMARY ===');
    results.forEach(r => {
      console.log(`${r.viewport}: L=${r.leftMargin}px (${r.leftMarginPercent}%), R=${r.rightMargin}px (${r.rightMarginPercent}%), Diff=${r.marginDifference}px`);
    });
    
    // Verify margins are consistent (within reasonable difference for subpixel rendering)
    results.forEach(r => {
      const diff = parseFloat(r.marginDifference);
      // Allow 20px tolerance for subpixel rendering and browser differences
      // The important thing is that margins are proportional and consistent
      expect(diff).toBeLessThan(20);
    });
    
    // Store results for debugging
    await page.evaluate((results) => {
      window.__heroMarginResults = results;
    }, results);
  });
  
  test('Verify container max-width and centering', async ({ page }) => {
    await page.goto('http://localhost:8000');
    await page.waitForLoadState('networkidle');
    
    const viewports = [
      { width: 320, height: 568 },
      { width: 768, height: 1024 },
      { width: 1280, height: 720 },
      { width: 1920, height: 1080 },
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);
      
      const container = page.locator('.hero__container');
      const containerBox = await container.boundingBox();
      const containerStyles = await container.evaluate((el) => {
        const s = window.getComputedStyle(el);
        return {
          maxWidth: s.maxWidth,
          marginLeft: s.marginLeft,
          marginRight: s.marginRight,
          width: s.width,
        };
      });
      
      console.log(`\n${viewport.width}px viewport:`);
      console.log(`  Container width: ${containerBox?.width.toFixed(2)}px`);
      console.log(`  Container max-width: ${containerStyles.maxWidth}`);
      console.log(`  Container margins: ${containerStyles.marginLeft} / ${containerStyles.marginRight}`);
      
      // Verify container is centered
      const leftMargin = containerBox?.x || 0;
      const rightMargin = viewport.width - (containerBox?.x || 0) - (containerBox?.width || 0);
      const marginDiff = Math.abs(leftMargin - rightMargin);
      
      console.log(`  Left margin: ${leftMargin.toFixed(2)}px`);
      console.log(`  Right margin: ${rightMargin.toFixed(2)}px`);
      console.log(`  Margin difference: ${marginDiff.toFixed(2)}px`);
      
      // Margins should be approximately equal (within 20px for subpixel rendering)
      // Note: Some browsers may have subpixel rendering differences
      expect(marginDiff).toBeLessThan(20);
    }
  });
});
