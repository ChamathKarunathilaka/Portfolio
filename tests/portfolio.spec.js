import { test, expect } from '@playwright/test';
import { portfolio } from '../src/data/portfolio.js';

test('desktop projects, keyboard dialog, and honest placeholders', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  for (const name of ['BuildNexus', 'UrbanFresh', 'CloudBox', 'Blossom Hut']) {
    await page.getByRole('button', { name: `View ${name} project details` }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog').getByRole('heading', { name, exact: true })).toBeVisible();
    const hasScreenshots = portfolio.projects.find(proj => proj.name === name).screenshots.length > 0;
    if (hasScreenshots) {
      await expect(page.getByRole('dialog').locator('.screenshot-gallery img').first()).toBeVisible();
    } else {
      await expect(page.getByText('Screenshots coming soon')).toBeVisible();
    }
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByRole('button', { name: `View ${name} project details` })).toBeFocused();
  }
  await page.getByRole('button', { name: 'Download CV' }).click();
  await expect(page.getByRole('status')).toContainText('CV hasn’t been added');
  await page.getByRole('button', { name: 'View BuildNexus project details' }).click();
  await page.mouse.click(3, 3);
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'View BuildNexus project details' })).toBeFocused();
  expect(errors).toEqual([]);
});

test('mobile layout stays in viewport and navigation works', async ({ page }) => {
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 850 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
  await page.setViewportSize({ width: 360, height: 800 });
  await page.getByRole('button', { name: 'Toggle menu' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Projects' }).focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Toggle menu' })).toBeFocused();
  await expect(page.getByRole('button', { name: 'Toggle menu' })).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'Toggle menu' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Projects' }).click();
  await expect(page).toHaveURL(/#projects$/);
  await page.getByRole('button', { name: 'View CloudBox project details' }).click();
  await expect(page.getByRole('dialog')).toContainText('leader election, automatic re-election after failures, partition detection');
  await page.getByRole('button', { name: 'Close project details' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'View CloudBox project details' })).toBeFocused();
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: true });
});

test('keyboard entry, focus containment, and reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  await page.getByRole('button', { name: 'View BuildNexus project details' }).focus();
  await page.keyboard.press('Enter');
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement.closest('dialog'))).toBeTruthy();
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'View BuildNexus project details' })).toBeFocused();
  await expect(page.getByRole('link', { name: 'Let’s start a conversation' })).toHaveAttribute('href', `mailto:${portfolio.email}`);
});
