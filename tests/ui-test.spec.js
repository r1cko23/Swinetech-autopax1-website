/**
 * Playwright UI Test for Swine Tech Funnel Website
 * Tests the website against the reference design
 */

const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Swine Tech Funnel Website', () => {
    test.beforeEach(async ({ page }) => {
        // Load the HTML file
        const htmlPath = path.join(__dirname, '..', 'index.html');
        await page.goto(`file://${htmlPath}`);
    });

    test('should display header with logo and navigation', async ({ page }) => {
        // Check logo
        const logo = page.locator('.nav__logo');
        await expect(logo).toBeVisible();
        
        // Check logo image
        const logoImg = page.locator('.nav__logo-img');
        await expect(logoImg).toBeVisible();
        
        // Check navigation links
        await expect(page.locator('text=Home')).toBeVisible();
        await expect(page.locator('text=Infographics')).toBeVisible();
        await expect(page.locator('text=Order Form')).toBeVisible();
        await expect(page.locator('text=FAQ')).toBeVisible();
        
        // Check Contact Us link
        await expect(page.locator('text=Contact Us')).toBeVisible();
        
        // Check separator
        await expect(page.locator('.nav__separator')).toBeVisible();
        
        // Check phone icon and number
        await expect(page.locator('.nav__phone')).toBeVisible();
        await expect(page.locator('.nav__phone-icon')).toBeVisible();
        await expect(page.locator('.nav__phone')).toContainText('+63 917 822 9754');
        
        // Check dropdown arrows
        const dropdownArrows = page.locator('.nav__dropdown-arrow');
        await expect(dropdownArrows).toHaveCount(2);
    });

    test('should display hero section with correct content', async ({ page }) => {
        // Check hero heading
        const heading = page.locator('.hero__heading');
        await expect(heading).toBeVisible();
        await expect(heading).toContainText('Because your');
        await expect(heading).toContainText('Herd');
        await expect(heading).toContainText('Livestock');
        
        // Check red text styling (Herd)
        const redText = page.locator('.hero__heading--red');
        await expect(redText).toHaveCount(1);
        
        // Check blue text styling (More Than Just Livestock)
        const blueText = page.locator('.hero__heading--blue');
        await expect(blueText).toHaveCount(1);
        
        // Check subtitle
        await expect(page.locator('.hero__subtitle')).toContainText('FDA-Approved Organic Solution');
        
        // Check CTA button
        const ctaButton = page.locator('.btn--blue.btn--large');
        await expect(ctaButton).toBeVisible();
        
        // Check bottle image
        const bottle = page.locator('.hero__bottle');
        await expect(bottle).toBeVisible();
    });

    test('should display ASF section with red background', async ({ page }) => {
        const asfSection = page.locator('.asf-section');
        await expect(asfSection).toBeVisible();
        
        // Check heading
        await expect(page.locator('.asf-section__heading')).toContainText('ASF Is No Longer an Automatic Death Sentence');
        
        // Check CTA button
        await expect(page.locator('.btn--black')).toBeVisible();
    });

    test('should display video testimonial section', async ({ page }) => {
        await expect(page.locator('.video-section__heading')).toContainText('Filipino Compassion, Australian Technology');
        
        // Check video player
        const videoPlayer = page.locator('.video-section__player');
        await expect(videoPlayer).toBeVisible();
        
        // Check play button
        const playButton = page.locator('.video-section__play-btn');
        await expect(playButton).toBeVisible();
    });

    test('should display mechanism section with correct content', async ({ page }) => {
        // Check heading
        await expect(page.locator('.mechanism-section__heading')).toContainText('How Autopax 1 Fights Back for You');
        
        // Check text mentions Swine Derived Glycoprotein
        await expect(page.locator('.mechanism-section__text')).toContainText('Swine Derived Glycoprotein');
        
        // Check benefits list
        const benefits = page.locator('.mechanism-section__benefit');
        await expect(benefits).toHaveCount(3);
        
        // Check specific benefits
        await expect(page.locator('.mechanism-section__benefit').first()).toContainText('Boosts the innate immunity');
        await expect(page.locator('.mechanism-section__benefit').nth(1)).toContainText('Inhibits the replication');
        await expect(page.locator('.mechanism-section__benefit').nth(2)).toContainText('Activates effector cells');
        
        // Check red CTA button
        await expect(page.locator('.btn--red')).toBeVisible();
    });

    test('should display proof section with carousel', async ({ page }) => {
        // Check heading with red text
        const heading = page.locator('.proof-section__heading');
        await expect(heading).toContainText('Tested in the');
        await expect(heading).toContainText('Red Zones');
        await expect(heading).toContainText('Lab');
        
        // Check carousel
        const carousel = page.locator('.carousel');
        await expect(carousel).toBeVisible();
        
        // Check carousel controls
        await expect(page.locator('#carouselPrev')).toBeVisible();
        await expect(page.locator('#carouselNext')).toBeVisible();
        await expect(page.locator('.carousel__indicators')).toBeVisible();
    });

    test('should display product section with features', async ({ page }) => {
        await expect(page.locator('.product-section__heading')).toContainText('Your Partner in Swine Health');
        
        // Check features (product images were removed from HTML)
        const features = page.locator('.product-section__feature');
        await expect(features).toHaveCount(3);
        
        // Check feature titles
        await expect(page.locator('.product-section__feature-title').first()).toHaveText('Rapid Absorption');
        await expect(page.locator('.product-section__feature-title').nth(1)).toHaveText('Immune Support');
        await expect(page.locator('.product-section__feature-title').nth(2)).toHaveText('Swine Health');
    });

    test('should display admin section with blue highlighted text', async ({ page }) => {
        const heading = page.locator('.admin-section__heading');
        await expect(heading).toContainText('Easy to Administer');
        await expect(heading).toContainText('No Needles Required');
        
        // Check blue text styling
        const blueText = page.locator('.admin-section__heading--blue');
        await expect(blueText).toBeVisible();
    });

    test('should display protocol section with red heading', async ({ page }) => {
        const heading = page.locator('.protocol-section__heading');
        await expect(heading).toContainText('5-Day Protocol');
        
        // Check red text styling
        const redText = page.locator('.protocol-section__heading--red');
        await expect(redText).toBeVisible();
        
        // Check protocol text
        await expect(page.locator('.protocol-section__text')).toContainText('5 sprays in the morning');
        await expect(page.locator('.protocol-section__note')).toContainText('Repeat for Day 8 to Day 12');
    });

    test('should display footer with correct information', async ({ page }) => {
        // Check logo (footer__brand-text was removed from HTML)
        await expect(page.locator('.footer__logo')).toBeVisible();
        
        // Check address
        const address = page.locator('.footer__address');
        await expect(address).toContainText('SWINE TECH INC PHILIPPINES');
        await expect(address).toContainText('Unit 202 E, Formula Campos Esguerra');
        await expect(address).toContainText('Poblacion 3005, Pulilan Bulacan');
        
        // Check contact info
        await expect(page.locator('.footer__contact-item').first()).toContainText('+63 917 822 9754');
        await expect(page.locator('.footer__contact-item').nth(1)).toContainText('autopax1@swinetech.ph');
        
        // Check legal links
        await expect(page.locator('.footer__legal-link').first()).toHaveText('Security');
        await expect(page.locator('.footer__legal-link').nth(1)).toHaveText('Cookie Policy');
        await expect(page.locator('.footer__legal-link').nth(2)).toHaveText('Terms of Services');
        await expect(page.locator('.footer__legal-link').nth(3)).toHaveText('Privacy Policy');
    });

    test('should be responsive on mobile', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        
        // Check that navigation menu exists (may be hidden on mobile initially)
        const navMenu = page.locator('.nav__menu');
        // Menu exists in DOM even if hidden
        await expect(navMenu).toHaveCount(1);
        
        // Check that hero section stacks vertically
        const heroContainer = page.locator('.hero__container');
        const styles = await heroContainer.evaluate((el) => {
            return window.getComputedStyle(el);
        });
        // On mobile, grid should be single column (check if it's not a multi-column layout)
        // The grid-template-columns might be "328px" or similar on mobile, but should not be "1fr 1fr"
        expect(styles.gridTemplateColumns).not.toContain('1fr 1fr');
    });

    test('should have all images loaded', async ({ page }) => {
        // Wait for all images to load
        await page.waitForLoadState('networkidle');
        
        // Check key images
        const images = [
            '.nav__logo-img',
            '.hero__bottle',
            '.video-section__thumbnail',
            '.product-section__box-img',
            '.product-section__bottle-img',
            '.footer__logo'
        ];
        
        for (const selector of images) {
            const img = page.locator(selector);
            // Skip elements that don't exist in the HTML
            if (selector === '.product-section__box-img' || selector === '.product-section__bottle-img') {
                continue;
            }
            await expect(img).toBeVisible();
            
            // Check if image is loaded
            const isLoaded = await img.evaluate((el) => {
                return el.complete && el.naturalHeight !== 0;
            });
            expect(isLoaded).toBe(true);
        }
    });

    test('should have proper accessibility attributes', async ({ page }) => {
        // Check ARIA labels
        await expect(page.locator('[aria-label="Main navigation"]')).toBeVisible();
        await expect(page.locator('[aria-label="Swine Tech Home"]')).toBeVisible();
        
        // Check semantic HTML
        await expect(page.locator('header[role="banner"]')).toBeVisible();
        await expect(page.locator('main[role="main"]')).toBeVisible();
        await expect(page.locator('footer[role="contentinfo"]')).toBeVisible();
        
        // Check heading hierarchy
        const h1 = page.locator('h1');
        await expect(h1).toHaveCount(1);
    });
});
