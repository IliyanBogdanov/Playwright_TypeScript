import { test, expect } from '@playwright/test';

// Define test suite
test.describe('Web Application QA Automation Test Suite', () => {
    
    // Define test case
    test('Verify Google Search Functionality', async ({ page }) => {
        
        // Navigate to Google homepage
        await page.goto('https://www.google.com');

        //Accept terms
        const button = await page.waitForSelector('button:has-text("Приемане на всички")');
        await button.click();


        // Fill in search query
        const textarea = await page.waitForSelector('textarea#APjFqb');
        await textarea.fill('Iliyan Bogdanov')

        // Press "Enter" to submit the search
        await page.keyboard.press('Enter');

        // Wait for search results to load and verify search query in the title
        const iliyanLInkedInProfileLink = await page.waitForSelector('a[href="https://bg.linkedin.com/in/iliyan-bogdanov-a1914667"]',  { state: 'visible' });
        const text = await iliyanLInkedInProfileLink.textContent();
        expect(text).toContain('Iliyan Bogdanov');
    });

});
