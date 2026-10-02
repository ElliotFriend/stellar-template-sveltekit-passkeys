// End-to-end tests run with Playwright (`pnpm test:integration`), which builds
// the app, serves it, and drives a real browser against it. Add more
// `*.test.ts` files to this `tests/` directory to check whole pages and flows.
import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Hello, SvelteKit Passkeys!' })).toBeVisible();
});
