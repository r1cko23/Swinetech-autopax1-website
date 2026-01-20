const { test, expect } = require('@playwright/test');

test.describe('Production Site Debug', () => {
  test('Check console errors and network requests on live site', async ({ page }) => {
    // Track console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push({
          type: msg.type(),
          text: msg.text(),
          location: msg.location()
        });
      }
    });

    // Track failed network requests
    const failedRequests = [];
    page.on('requestfailed', request => {
      failedRequests.push({
        url: request.url(),
        failure: request.failure()?.errorText,
        method: request.method()
      });
    });

    // Track all network requests
    const allRequests = [];
    page.on('request', request => {
      allRequests.push({
        url: request.url(),
        method: request.method()
      });
    });

    // Navigate to production site
    await page.goto('https://swinetech.ph/index.html', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // Wait a bit for all requests to complete
    await page.waitForTimeout(3000);

    // Check for localhost requests (debug tracking)
    const localhostRequests = allRequests.filter(req => 
      req.url.includes('127.0.0.1') || 
      req.url.includes('localhost') ||
      req.url.includes('b76d1cdd-97ac-45d2-af38-06bb397558d8')
    );

    // Log findings
    console.log('\n=== PRODUCTION DEBUG REPORT ===');
    console.log(`\nTotal requests: ${allRequests.length}`);
    console.log(`\nLocalhost/Debug requests found: ${localhostRequests.length}`);
    if (localhostRequests.length > 0) {
      console.log('\nLocalhost requests:');
      localhostRequests.forEach(req => {
        console.log(`  - ${req.method} ${req.url}`);
      });
    }

    console.log(`\nConsole errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('\nConsole errors:');
      consoleErrors.forEach(err => {
        console.log(`  - ${err.text}`);
        if (err.location) {
          console.log(`    Location: ${err.location.url}:${err.location.lineNumber}`);
        }
      });
    }

    console.log(`\nFailed requests: ${failedRequests.length}`);
    if (failedRequests.length > 0) {
      console.log('\nFailed requests:');
      failedRequests.forEach(req => {
        console.log(`  - ${req.method} ${req.url}`);
        console.log(`    Error: ${req.failure}`);
      });
    }

    // Check if page loaded correctly
    const pageTitle = await page.title();
    console.log(`\nPage title: ${pageTitle}`);

    // Check if main content is visible
    const heroSection = await page.locator('.hero').first();
    const isHeroVisible = await heroSection.isVisible().catch(() => false);
    console.log(`\nHero section visible: ${isHeroVisible}`);

    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/production-debug.png',
      fullPage: true 
    });

    // Save network log
    const networkLog = {
      timestamp: new Date().toISOString(),
      url: page.url(),
      totalRequests: allRequests.length,
      localhostRequests: localhostRequests,
      consoleErrors: consoleErrors,
      failedRequests: failedRequests,
      allRequests: allRequests.slice(0, 50) // First 50 for brevity
    };

    const fs = require('fs');
    fs.writeFileSync(
      'test-results/production-debug-network.json',
      JSON.stringify(networkLog, null, 2)
    );

    // Assertions
    expect(pageTitle).toContain('Swine Tech');
    
    // Log warnings but don't fail the test
    if (localhostRequests.length > 0) {
      console.warn('\n⚠️  WARNING: Debug tracking code detected in production!');
    }
  });

  test('Compare localhost vs production behavior', async ({ page }) => {
    // Test production
    await page.goto('https://swinetech.ph/index.html', { 
      waitUntil: 'networkidle' 
    });
    
    const prodErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        prodErrors.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);
    
    const prodScreenshot = await page.screenshot({ 
      path: 'test-results/production-comparison.png' 
    });

    console.log(`\nProduction errors: ${prodErrors.length}`);
    prodErrors.forEach(err => console.log(`  - ${err}`));
  });
});
