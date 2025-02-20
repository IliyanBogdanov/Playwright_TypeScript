import { test, expect, Locator } from '@playwright/test';

test.describe('Web Application QA Automation Test Suite', () => {
    
    test('Verify Google Search Functionality', async ({ page }) => {

        // Set browser to fullscreen
        await page.setViewportSize({ width: 1920, height: 1080 });

        // Navigate to Google homepage
        await page.goto('https://www.google.com');

        // Accept terms if consent popup appears
        const acceptButton = page.locator('button:has-text("Приемане на всички")');
        if (await acceptButton.isVisible()) {
            await acceptButton.click();
        }

        // Fill in search query and submit
        const searchBox = page.locator('textarea[name="q"]');
        await searchBox.fill('Iliyan Bogdanov');
        await searchBox.press('Enter');

        // Wait for search results to load
        await page.waitForSelector('h3', { state: 'visible', timeout: 15000 });

        // Get all links from search results
        const allLinks = await page.locator('a:has(h3)').all();

        let linkedInProfile: Locator | null = null;

        // Check if any link contains "LinkedIn"
        for (const link of allLinks) {
            const href = await link.getAttribute('href');
            if (href && href.includes('linkedin.com/in/')) {
                linkedInProfile = link;
                break;
            }
        }

        // Fail if no LinkedIn link is found
        expect(linkedInProfile).not.toBeNull();

        if (linkedInProfile) {
            // Open the link in a new tab and validate the navigation
            const [newPage] = await Promise.all([
                page.waitForEvent('popup'),
                linkedInProfile.click({ button: 'middle' }) // Open in new tab (middle click)
            ]);

            await newPage.waitForLoadState('load');

            // Verify that we navigated to LinkedIn
            expect(newPage.url()).toContain('linkedin.com/in/');
        }
    });

});
