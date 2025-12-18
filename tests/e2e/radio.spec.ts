import { test, expect } from '@playwright/test';

test.describe('Global Radio Feature', () => {
  test('should navigate to radio page and show 3D globe', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Check if Radio menu exists
    const radioLink = page.getByRole('link', { name: /Radio|라디오/i });
    await expect(radioLink).toBeVisible();
    
    // Click Radio menu
    await radioLink.click();
    
    // URL Check
    await expect(page).toHaveURL(/\/radio/);
    
    // Check Page Title
    await expect(page.getByText('Global Radio')).toBeVisible(); 
    // Or localized title, might need flexible matcher if default is not English
    
    // Check if Globe container is present (canvas might not be strictly checkable for content easily, but container yes)
    // The globe is inside a div roughly
    await expect(page.locator('canvas')).toBeVisible({ timeout: 10000 });
  });

  // Since actual audio playback and 3D interaction is hard to test in headless CI without GPU sometimes,
  // we focus on UI structure.
  
  test('sidebar toggle works', async ({ page }) => {
    await page.goto('/radio');
    
    // Toggle button should be visible (icon ListMusic)
    // We can find it by className or specific attribute if we added one, generally 'button' on top right
    // Use a more robust selector finding the button that contains the ListMusic icon
    const sidebarButton = page.locator('button').filter({ has: page.locator('svg.lucide-list-music') });
    await expect(sidebarButton).toBeVisible();
    
    await sidebarButton.click();
    
    // Sidebar should slide in
    const sidebar = page.getByRole('button', { name: 'Favorites' }).first(); // Tab inside sidebar
    await expect(sidebar).toBeVisible();
  });
});
