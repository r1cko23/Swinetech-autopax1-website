const { test, expect } = require('@playwright/test');

const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 },
];

const pages = [
  { name: 'index.html', url: 'index.html' },
  { name: 'order-form.html', url: 'order-form.html' },
  { name: 'bulk-order.html', url: 'bulk-order.html' },
  { name: 'infographics.html', url: 'infographics.html' },
];

test.describe('Navigation Tests - All Screen Sizes', () => {
  for (const viewport of viewports) {
    test.describe(`${viewport.name} Viewport (${viewport.width}x${viewport.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
      });

      // Test navigation links on each page
      for (const pageInfo of pages) {
        test(`Navigation links work on ${pageInfo.name}`, async ({ page }) => {
          await page.goto(`http://localhost:8000/${pageInfo.url}`);
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(500); // Wait for JS to initialize

          // Open mobile menu if needed
          if (viewport.width <= 768) {
            const menuToggle = page.getByRole('button', { name: 'Toggle navigation menu' });
            if (await menuToggle.isVisible()) {
              await menuToggle.click();
              await page.waitForTimeout(300);
            }
          }

          // Test Home link
          const homeLink = page.getByRole('menuitem', { name: 'Home' });
          await expect(homeLink).toBeVisible();
          await homeLink.click();
          await page.waitForURL('**/index.html**');
          await expect(page).toHaveURL(/index\.html/);

          // Go back to original page
          await page.goto(`http://localhost:8000/${pageInfo.url}`);
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(500);
        });

        test(`Infographics link works on ${pageInfo.name}`, async ({ page }) => {
          await page.goto(`http://localhost:8000/${pageInfo.url}`);
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(500);

          // Open mobile menu if needed
          if (viewport.width <= 768) {
            const menuToggle = page.getByRole('button', { name: 'Toggle navigation menu' });
            if (await menuToggle.isVisible()) {
              await menuToggle.click();
              await page.waitForTimeout(300);
            }
          }

          const infographicsLink = page.getByRole('menuitem', { name: 'Infographics' });
          await expect(infographicsLink).toBeVisible();
          await infographicsLink.click();
          await page.waitForURL('**/infographics.html**');
          await expect(page).toHaveURL(/infographics\.html/);
        });

        test(`Contact Us link works on ${pageInfo.name}`, async ({ page }) => {
          await page.goto(`http://localhost:8000/${pageInfo.url}`);
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(500);

          // Open mobile menu if needed
          if (viewport.width <= 768) {
            const menuToggle = page.getByRole('button', { name: 'Toggle navigation menu' });
            if (await menuToggle.isVisible()) {
              await menuToggle.click();
              await page.waitForTimeout(300);
            }
          }

          const contactLink = page.getByRole('menuitem', { name: 'Contact Us' });
          await expect(contactLink).toBeVisible();
          await contactLink.click();
          // Should scroll to contact section or navigate
          await page.waitForTimeout(500);
        });

        test(`FAQ link redirects to bulk-order.html#faq on ${pageInfo.name}`, async ({ page }) => {
          await page.goto(`http://localhost:8000/${pageInfo.url}`);
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(500);

          // Open mobile menu if needed
          if (viewport.width <= 768) {
            const menuToggle = page.getByRole('button', { name: 'Toggle navigation menu' });
            if (await menuToggle.isVisible()) {
              await menuToggle.click();
              await page.waitForTimeout(300);
            }
          }

          const faqLink = page.getByRole('menuitem', { name: 'FAQ' });
          await expect(faqLink).toBeVisible();
          
          // Check href attribute
          const href = await faqLink.getAttribute('href');
          expect(href).toBe('bulk-order.html#faq');
          
          await faqLink.click();
          await page.waitForURL('**/bulk-order.html**');
          await expect(page).toHaveURL(/bulk-order\.html/);
          
          // Check if FAQ section exists
          const faqSection = page.locator('#faq');
          await expect(faqSection).toBeVisible();
        });
      }

      // Test Order Form dropdown
      test('Order Form dropdown works on mobile/tablet', async ({ page }) => {
        await page.goto('http://localhost:8000/index.html');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(500);

        // Open mobile menu if needed
        if (viewport.width <= 768) {
          const menuToggle = page.getByRole('button', { name: 'Toggle navigation menu' });
          await expect(menuToggle).toBeVisible();
          await menuToggle.click();
          await page.waitForTimeout(300);
        }

        const orderFormLink = page.locator('.nav__link--dropdown').filter({ hasText: 'Order Form' }).first();
        await expect(orderFormLink).toBeVisible();

        if (viewport.width <= 768) {
          // On mobile/tablet, clicking should expand dropdown
          await orderFormLink.click();
          await page.waitForTimeout(300);

          // Check if dropdown is expanded
          const isExpanded = await orderFormLink.getAttribute('aria-expanded');
          expect(isExpanded).toBe('true');

          // Check if dropdown items are visible
          const smallOrderForm = page.getByRole('menuitem', { name: 'Small Order Form' });
          const bulkOrderForm = page.getByRole('menuitem', { name: 'Bulk Order Form' });
          
          await expect(smallOrderForm).toBeVisible();
          await expect(bulkOrderForm).toBeVisible();

          // Test clicking Small Order Form
          await smallOrderForm.click();
          await page.waitForURL('**/order-form.html**');
          await expect(page).toHaveURL(/order-form\.html/);
        } else {
          // On desktop, hover should show dropdown
          await orderFormLink.hover();
          await page.waitForTimeout(300);

          const smallOrderForm = page.getByRole('menuitem', { name: 'Small Order Form' });
          const bulkOrderForm = page.getByRole('menuitem', { name: 'Bulk Order Form' });
          
          await expect(smallOrderForm).toBeVisible();
          await expect(bulkOrderForm).toBeVisible();
        }
      });

      // Test phone link
      test('Phone link works', async ({ page }) => {
        await page.goto('http://localhost:8000/index.html');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(500);

        // Open mobile menu if needed
        if (viewport.width <= 768) {
          const menuToggle = page.getByRole('button', { name: 'Toggle navigation menu' });
          if (await menuToggle.isVisible()) {
            await menuToggle.click();
            await page.waitForTimeout(300);
          }
        }

        // Use more specific selector for nav phone link
        const phoneLink = page.locator('.nav__phone').first();
        await expect(phoneLink).toBeVisible();
        
        const href = await phoneLink.getAttribute('href');
        expect(href).toContain('tel:');
        expect(href).toContain('9569464189');
      });

      // Test logo navigation
      test('Logo navigates to home', async ({ page }) => {
        await page.goto('http://localhost:8000/order-form.html');
        await page.waitForLoadState('networkidle');

        const logoLink = page.getByRole('link', { name: 'Swine Tech Home' });
        await expect(logoLink).toBeVisible();
        await logoLink.click();
        await page.waitForURL('**/index.html**');
        await expect(page).toHaveURL(/index\.html/);
      });
    });
  }
});
