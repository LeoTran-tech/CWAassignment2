// assi2/tests/builderroom.spec.ts
import { test, expect } from '@playwright/test';

// Deployed frontend URL
const FRONTEND_URL = 'http://ec2-3-85-115-208.compute-1.amazonaws.com/escape-room';

test.skip(({ browserName }) => browserName === 'webkit', 'WebKit not supported on this host');

test.describe('Escape Room - Builder Room workflow', () => {
    test('Add, Edit, and Delete a question', async ({ page }) => {
        // Step 1️⃣ — Visit the Escape Room page
        await page.goto(FRONTEND_URL);
        await page.waitForLoadState('networkidle');

        // Step 2️⃣ — Ensure Builder Room is visible
        const toggleButton = page.locator(
            'button:has-text("Open Builder Room"), button:has-text("Hide Builder Room")'
        );
        if (await toggleButton.isVisible()) await toggleButton.click();
        await expect(page.locator('h2')).toContainText('Builder Room');

        // Step 3️⃣ — Fill in new question details
        const topic = 'Playwright Test Topic';
        const question = 'What does Playwright automate?';
        const hint = 'Browser automation framework';
        const answer = 'End-to-end web testing';

        await page.fill('input[placeholder="Topic"]', topic);
        await page.fill('input[placeholder="Question"]', question);
        await page.fill('input[placeholder="Hint"]', hint);
        await page.fill('input[placeholder="Answer"]', answer);

        // Step 4️⃣ — Click "Add Question"
        await page.click('button:has-text("Add Question")');

        // Wait until new row appears
        const row = page.locator('tr', { hasText: topic });
        await expect(row).toBeVisible();
        await expect(row).toContainText(question);

        // Step 5️⃣ — Click "Edit" and update hint
        await row.locator('button:has-text("Edit")').click();
        await expect(page.locator('button:has-text("Update")')).toBeVisible();

        const updatedHint = 'Updated: helps test browser UIs';
        await page.fill('input[placeholder="Hint"]', updatedHint);
        await page.click('button:has-text("Update")');

        // Verify updated hint appears
        await expect(page.locator('table')).toContainText(updatedHint);

        // Step 6️⃣ — Delete the row and confirm disappearance
        await row.locator('button:has-text("Delete")').click();

        // Wait for table to refresh and confirm removal
        await expect(page.locator('tr', { hasText: topic })).toHaveCount(0);
    });
});