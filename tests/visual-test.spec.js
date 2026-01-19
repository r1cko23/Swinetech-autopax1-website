/**
 * Visual Test for Swine Tech Funnel Website
 * Takes screenshots for visual comparison with reference design
 */

const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Visual Comparison', () => {
    test.beforeEach(async ({ page }) => {
        const htmlPath = path.join(__dirname, '..', 'index.html');
        await page.goto(`file://${htmlPath}`);
        // Wait for all content to load
        await page.waitForLoadState('networkidle');
    });

    test('should capture full page screenshot', async ({ page }) => {
        // Take full page screenshot
        await page.screenshot({
            path: 'test-results/full-page.png',
            fullPage: true
        });
    });

    test('should capture hero section', async ({ page }) => {
        const heroSection = page.locator('.hero');
        await heroSection.screenshot({
            path: 'test-results/hero-section.png'
        });
    });

    test('should capture ASF section', async ({ page }) => {
        const asfSection = page.locator('.asf-section');
        await asfSection.screenshot({
            path: 'test-results/asf-section.png'
        });
    });

    test('should capture mechanism section', async ({ page }) => {
        const mechanismSection = page.locator('.mechanism-section');
        await mechanismSection.screenshot({
            path: 'test-results/mechanism-section.png'
        });
    });

    test('should capture proof section', async ({ page }) => {
        const proofSection = page.locator('.proof-section');
        await proofSection.screenshot({
            path: 'test-results/proof-section.png'
        });
    });

    test('should capture product section', async ({ page }) => {
        const productSection = page.locator('.product-section');
        await productSection.screenshot({
            path: 'test-results/product-section.png'
        });
    });

    test('should capture footer', async ({ page }) => {
        const footer = page.locator('.footer');
        await footer.screenshot({
            path: 'test-results/footer.png'
        });
    });

    test('should capture mobile view', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(500); // Wait for layout to adjust
        await page.screenshot({
            path: 'test-results/mobile-view.png',
            fullPage: true
        });
    });

    test('should capture tablet view', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: 'test-results/tablet-view.png',
            fullPage: true
        });
    });

    test('should capture desktop view', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: 'test-results/desktop-view.png',
            fullPage: true
        });
    });
});
