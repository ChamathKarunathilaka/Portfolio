import { test, expect } from '@playwright/test';
import { portfolio } from '../src/data/portfolio.js';

test('one data entry supplies personal details, links, and a future project', async ({ page }) => {
  // This fixture is isolated to the browser; your portfolio file is never modified.
  const custom = structuredClone(portfolio);
  Object.assign(custom, {
    name: 'Example Editor', initials: 'EE', role: 'Example role',
    headline: 'An editable headline', summary: 'An editable summary.',
    about: 'An editable introduction.', internship: 'An editable internship goal.',
    email: 'editor@example.com', github: 'https://example.com/profile',
    linkedin: 'https://example.com/linkedin', cvUrl: '/example-cv.pdf',
  });
  custom.projects.push({
    ...custom.projects[0], id: 'future-project', name: 'Future Project',
    contribution: 'An editable contribution.',
    screenshots: [{ src: '/favicon.svg', alt: 'Example screenshot fixture' }],
    github: 'https://example.com/source', live: 'https://example.com/demo',
  });
  await page.route('**/src/data/portfolio.js*', route => route.fulfill({
    contentType: 'application/javascript', body: `export const portfolio = ${JSON.stringify(custom)};`,
  }));
  await page.goto('/');
  await expect(page).toHaveTitle('Example Editor · Example role');
  for (const text of [custom.summary, custom.about, custom.internship]) {
    await expect(page.getByText(text, { exact: true })).toBeVisible();
  }
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(custom.headline);
  await expect(page.getByRole('link', { name: 'Download CV' })).toHaveAttribute('href', custom.cvUrl);
  await expect(page.getByRole('link', { name: custom.email, exact: true })).toHaveAttribute('href', `mailto:${custom.email}`);
  await expect(page.getByRole('link', { name: 'GitHub', exact: true })).toHaveAttribute('href', custom.github);
  await expect(page.getByRole('link', { name: 'LinkedIn', exact: true })).toHaveAttribute('href', custom.linkedin);
  const card = page.getByRole('button', { name: 'View Future Project project details' });
  await expect(card.getByRole('img', { name: 'Example screenshot fixture' })).toHaveAttribute('src', '/favicon.svg');
  await card.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('An editable contribution.');
  await expect(dialog.getByRole('link', { name: 'View source' })).toHaveAttribute('href', 'https://example.com/source');
  await expect(dialog.getByRole('link', { name: 'Live project' })).toHaveAttribute('href', 'https://example.com/demo');
  await expect.poll(() => dialog.locator('.screenshot-gallery img').evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
  await expect(dialog.getByText('Screenshots coming soon')).toHaveCount(0);
});

test('initial HTML carries metadata from the content file', async ({ request }) => {
  const response = await request.get('/');
  const html = await response.text();
  expect(html).toContain(`${portfolio.name} · ${portfolio.role}`);
  expect(html).toContain('property="og:description"');
  expect(html).toContain(portfolio.summary);
  expect((await request.get('/favicon.svg')).ok()).toBeTruthy();
});
