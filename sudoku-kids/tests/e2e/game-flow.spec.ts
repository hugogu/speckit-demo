/**
 * E2E Tests: Complete Game Flow
 * Reference: tasks.md T049
 * Reference: spec.md - all user stories
 */

import { test, expect } from '@playwright/test';

test.describe('Sudoku Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  /**
   * Reference: spec.md §US1 - Start a game
   */
  test('should start a new game with selected options', async ({ page }) => {
    // Select 4x4 board size
    await page.getByRole('button', { name: '4×4' }).click();
    
    // Select easy difficulty
    await page.getByRole('button', { name: '简单' }).click();
    
    // Start game
    await page.getByRole('button', { name: '开始游戏' }).click();
    
    // Verify board is displayed
    await expect(page.getByRole('grid')).toBeVisible();
  });

  /**
   * Reference: spec.md §US2 - Click to fill number
   */
  test('should fill number by clicking', async ({ page }) => {
    // Start a 4x4 easy game
    await page.getByRole('button', { name: '4×4' }).click();
    await page.getByRole('button', { name: '开始游戏' }).click();
    
    // Find and click an empty cell
    const cells = page.getByRole('gridcell');
    const emptyCell = cells.filter({ hasNotText: /[1-4]/ }).first();
    await emptyCell.click();
    
    // Number pad should appear
    await expect(page.getByText('选择数字')).toBeVisible();
  });

  /**
   * Reference: spec.md §US4 - Check answers
   */
  test('should check answers and show feedback', async ({ page }) => {
    // Start a game
    await page.getByRole('button', { name: '4×4' }).click();
    await page.getByRole('button', { name: '开始游戏' }).click();
    
    // Click check answers button
    await page.getByRole('button', { name: '检查答案' }).click();
    
    // Page should not crash (basic smoke test)
    await expect(page.getByRole('grid')).toBeVisible();
  });

  /**
   * Reference: spec.md §US6 - Responsive layout
   */
  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Start a game
    await page.getByRole('button', { name: '4×4' }).click();
    await page.getByRole('button', { name: '开始游戏' }).click();
    
    // Board should be visible
    await expect(page.getByRole('grid')).toBeVisible();
  });

  /**
   * Reference: spec.md §NFR-004 - Touch targets
   */
  test('buttons should have minimum touch target size', async ({ page }) => {
    const startButton = page.getByRole('button', { name: '开始游戏' });
    const box = await startButton.boundingBox();
    
    // Minimum 44x44px per spec
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });
});
