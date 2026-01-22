const { test, expect } = require('@playwright/test');

test.describe('Navigation Alignment Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });

  test('Home, Learn, and Order nav items should be vertically aligned', async ({ page }) => {
    // Get the navigation menu
    const navMenu = page.locator('.nav__menu');
    await expect(navMenu).toBeVisible();

    // Get bounding boxes for each nav item
    const homeLink = page.getByRole('menuitem', { name: 'Home' });
    const learnLink = page.getByRole('menuitem', { name: 'Learn' });
    const orderLink = page.locator('.nav__item--order-disabled .nav__link');

    await expect(homeLink).toBeVisible();
    await expect(learnLink).toBeVisible();
    await expect(orderLink).toBeVisible();

    // Get bounding boxes
    const homeBox = await homeLink.boundingBox();
    const learnBox = await learnLink.boundingBox();
    const orderBox = await orderLink.boundingBox();

    // Check that all three have the same top position (within 2px tolerance)
    const tolerance = 2;
    const homeTop = homeBox.y;
    const learnTop = learnBox.y;
    const orderTop = orderBox.y;

    console.log('Home top:', homeTop);
    console.log('Learn top:', learnTop);
    console.log('Order top:', orderTop);

    expect(Math.abs(homeTop - learnTop)).toBeLessThan(tolerance);
    expect(Math.abs(homeTop - orderTop)).toBeLessThan(tolerance);
    expect(Math.abs(learnTop - orderTop)).toBeLessThan(tolerance);

    // Also check heights are similar
    const homeHeight = homeBox.height;
    const learnHeight = learnBox.height;
    const orderHeight = orderBox.height;

    console.log('Home height:', homeHeight);
    console.log('Learn height:', learnHeight);
    console.log('Order height:', orderHeight);

    // Heights should be similar (within 5px)
    expect(Math.abs(homeHeight - learnHeight)).toBeLessThan(5);
    expect(Math.abs(homeHeight - orderHeight)).toBeLessThan(5);
  });

  test('Order nav item should have "soon" text below it', async ({ page }) => {
    const soonText = page.locator('.nav__soon');
    await expect(soonText).toBeVisible();
    await expect(soonText).toHaveText('soon');

    // Check that "soon" is positioned below "Order"
    const orderLink = page.locator('.nav__item--order-disabled .nav__link');
    const orderBox = await orderLink.boundingBox();
    const soonBox = await soonText.boundingBox();

    // "soon" should be below "Order" (soon's top should be greater than order's bottom)
    expect(soonBox.y).toBeGreaterThan(orderBox.y + orderBox.height - 5);
  });
});
