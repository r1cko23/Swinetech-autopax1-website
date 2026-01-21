// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('CTA Redirect Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('SECURE MY SUPPLY button redirects to bulk order form', async ({ page }) => {
    const secureSupplyLink = page.getByRole('link', { name: /secure my supply/i });
    await expect(secureSupplyLink).toHaveAttribute('href', '/Order/bulk');
    
    await secureSupplyLink.click();
    await expect(page).toHaveURL(/.*\/Order\/bulk/);
    await expect(page.getByText('Join the Repopulation')).toBeVisible();
  });

  test('PARTNER WITH US button in hero redirects to bulk order form', async ({ page }) => {
    const partnerLink = page.getByRole('link', { name: /partner with us/i }).first();
    await expect(partnerLink).toHaveAttribute('href', '/Order/bulk');
    
    await partnerLink.click();
    await expect(page).toHaveURL(/.*\/Order\/bulk/);
  });

  test('PROTECT YOUR HERD button redirects to bulk order form', async ({ page }) => {
    const protectHerdLink = page.getByRole('link', { name: /protect your herd/i });
    await expect(protectHerdLink).toHaveAttribute('href', '/Order/bulk');
    
    await protectHerdLink.click();
    await expect(page).toHaveURL(/.*\/Order\/bulk/);
    await expect(page.getByText('Join the Repopulation')).toBeVisible();
  });

  test('Order menu item is hidden in navigation', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: /main navigation/i });
    await expect(nav.getByRole('menuitem', { name: /order/i })).not.toBeVisible();
    await expect(nav.getByRole('menuitem', { name: /home/i })).toBeVisible();
    await expect(nav.getByRole('menuitem', { name: /learn/i })).toBeVisible();
  });

  test('Direct access to /Order redirects to /Order/bulk', async ({ page }) => {
    await page.goto('http://localhost:3000/Order');
    await expect(page).toHaveURL(/.*\/Order\/bulk/);
  });
});
