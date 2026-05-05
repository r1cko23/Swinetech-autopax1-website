/**
 * Playwright Test for Footer Section
 * Tests footer against the reference design (2nd image)
 */

const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Footer Section - Reference Design Verification', () => {
    test.beforeEach(async ({ page }) => {
        // Load the HTML file
        const htmlPath = path.join(__dirname, '..', 'index.html');
        await page.goto(`file://${htmlPath}`);
        
        // Wait for page to load
        await page.waitForLoadState('networkidle');
    });

    test('should display footer with updated address matching reference', async ({ page }) => {
        // Scroll to footer
        await page.locator('footer').scrollIntoViewIfNeeded();
        
        // Check address section
        const address = page.locator('.footer__address');
        await expect(address).toBeVisible();
        
        // Verify address text matches reference (2nd image)
        await expect(address).toContainText('SWINE TECH INC PHILIPPINES');
        await expect(address).toContainText('Unit 202 E, Formula Campos Esguerra');
        await expect(address).toContainText('Poblacion 3005, Pulilan Bulacan');
        await expect(address).toContainText('Philippines');
        
        // Verify address icon is visible
        const addressIcon = address.locator('.footer__icon');
        await expect(addressIcon).toBeVisible();
    });

    test('should display footer with updated phone number matching reference', async ({ page }) => {
        // Scroll to footer
        await page.locator('footer').scrollIntoViewIfNeeded();
        
        // Check phone number matches reference (2nd image): +63 917 822 9754
        const phoneItem = page.locator('.footer__contact-item').first();
        await expect(phoneItem).toBeVisible();
        await expect(phoneItem).toContainText('+63 917 822 9754');
        
        // Verify phone link href (the contact-item itself is the link)
        await expect(phoneItem).toHaveAttribute('href', 'tel:+639178229754');
        
        // Verify phone icon is visible
        const phoneIcon = phoneItem.locator('.footer__icon');
        await expect(phoneIcon).toBeVisible();
    });

    test('should display footer with updated copyright year matching reference', async ({ page }) => {
        // Scroll to footer
        await page.locator('footer').scrollIntoViewIfNeeded();
        
        // Check copyright matches reference (2nd image): © Copyright 2026
        const copyright = page.locator('.footer__copyright');
        await expect(copyright).toBeVisible();
        await expect(copyright).toContainText('© Copyright 2026 Swine Tech. All rights reserved.');
        
        // Verify it does NOT contain the old year
        const copyrightText = await copyright.textContent();
        expect(copyrightText).not.toContain('2024');
    });

    test('should display footer with email address', async ({ page }) => {
        // Scroll to footer
        await page.locator('footer').scrollIntoViewIfNeeded();
        
        // Check email
        const emailItem = page.locator('.footer__contact-item').nth(1);
        await expect(emailItem).toBeVisible();
        await expect(emailItem).toContainText('autopax1@swinetech.ph');
        
        // Verify email link (the contact-item itself is the link)
        await expect(emailItem).toHaveAttribute('href', 'mailto:autopax1@swinetech.ph');
        
        // Verify email icon is visible
        const emailIcon = emailItem.locator('.footer__icon');
        await expect(emailIcon).toBeVisible();
    });

    test('should display footer with logo and social media', async ({ page }) => {
        // Scroll to footer
        await page.locator('footer').scrollIntoViewIfNeeded();
        
        // Check logo
        const logo = page.locator('.footer__logo');
        await expect(logo).toBeVisible();
        
        // Check brand text (footer__brand-text was removed from HTML)
        // Logo is visible, brand text was removed per user request
        
        // Check social media icons (now using Font Awesome icons, not a single image)
        const socialLinks = page.locator('.footer__social-link');
        await expect(socialLinks.first()).toBeVisible();
        // Should have multiple social media links
        const socialCount = await socialLinks.count();
        expect(socialCount).toBeGreaterThan(0);
    });

    test('should display footer legal links', async ({ page }) => {
        // Scroll to footer
        await page.locator('footer').scrollIntoViewIfNeeded();
        
        // Check legal links
        const legalLinks = page.locator('.footer__legal-link');
        await expect(legalLinks).toHaveCount(4);
        
        await expect(legalLinks.nth(0)).toHaveText('Security');
        await expect(legalLinks.nth(1)).toHaveText('Cookie Policy');
        await expect(legalLinks.nth(2)).toHaveText('Terms of Services');
        await expect(legalLinks.nth(3)).toHaveText('Privacy Policy');
    });

    test('should take screenshot of footer for visual verification', async ({ page }) => {
        // Scroll to footer
        await page.locator('footer').scrollIntoViewIfNeeded();
        
        // Wait a bit for any animations
        await page.waitForTimeout(500);
        
        // Take screenshot of footer
        const footer = page.locator('footer');
        await footer.screenshot({ path: 'test-results/footer-screenshot.png' });
        
        // Verify footer is visible in screenshot
        await expect(footer).toBeVisible();
    });

    test('should verify footer layout structure matches reference', async ({ page }) => {
        // Scroll to footer
        await page.locator('footer').scrollIntoViewIfNeeded();
        
        // Verify footer container structure
        const footerContainer = page.locator('.footer__container');
        await expect(footerContainer).toBeVisible();
        
        // Verify three main sections exist
        const brandSection = page.locator('.footer__brand');
        const addressSection = page.locator('.footer__address');
        const contactSection = page.locator('.footer__contact');
        
        await expect(brandSection).toBeVisible();
        await expect(addressSection).toBeVisible();
        await expect(contactSection).toBeVisible();
        
        // Verify bottom section with copyright and legal links
        const footerBottom = page.locator('.footer__bottom');
        await expect(footerBottom).toBeVisible();
        
        const copyright = footerBottom.locator('.footer__copyright');
        const legalNav = footerBottom.locator('.footer__legal');
        
        await expect(copyright).toBeVisible();
        await expect(legalNav).toBeVisible();
    });
});
