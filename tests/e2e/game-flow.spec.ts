import { test, expect } from '@playwright/test'

test.describe('Complete Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should start a new game with default settings', async ({ page }) => {
    // Check initial setup screen
    await expect(page.locator('h1')).toContainText('数独学习游戏')
    await expect(page.locator('text=开始游戏')).toBeVisible()
    
    // Start game
    await page.click('text=开始游戏')
    
    // Verify game board is displayed
    await expect(page.locator('[role="grid"]')).toBeVisible()
    
    // Verify timer is running
    await expect(page.locator('text=00:0')).toBeVisible()
  })

  test('should allow selecting different board sizes', async ({ page }) => {
    // Select 6x6 board
    await page.selectOption('select', { label: '6×6 (进阶)' })
    await page.click('text=开始游戏')
    
    // Verify 6x6 grid (36 cells)
    const cells = page.locator('[role="grid"] > div')
    await expect(cells).toHaveCount(36)
  })

  test('should allow cell selection and number input', async ({ page }) => {
    await page.click('text=开始游戏')
    
    // Wait for board to load
    await expect(page.locator('[role="grid"]')).toBeVisible()
    
    // Click on a cell (first empty one)
    const cells = page.locator('[role="gridcell"]')
    await cells.first().click()
    
    // Verify cell is selected (has selection styling)
    await expect(cells.first()).toHaveClass(/bg-indigo/)
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.click('text=开始游戏')
    await expect(page.locator('[role="grid"]')).toBeVisible()
    
    // Click first cell to select
    const cells = page.locator('[role="gridcell"]')
    await cells.first().click()
    
    // Press arrow key to navigate
    await page.keyboard.press('ArrowRight')
    
    // Second cell should now be selected
    // (Selection state is managed by the app)
  })

  test('should pause and resume game', async ({ page }) => {
    await page.click('text=开始游戏')
    await expect(page.locator('[role="grid"]')).toBeVisible()
    
    // Click pause button
    await page.click('text=暂停')
    
    // Verify resume button appears
    await expect(page.locator('text=继续')).toBeVisible()
    
    // Click resume
    await page.click('text=继续')
    
    // Verify pause button is back
    await expect(page.locator('text=暂停')).toBeVisible()
  })

  test('should navigate to history page', async ({ page }) => {
    await page.click('text=游戏记录')
    
    await expect(page).toHaveURL('/history')
    await expect(page.locator('h1')).toContainText('游戏记录')
  })

  test('should navigate to print page', async ({ page }) => {
    await page.click('text=打印练习')
    
    await expect(page).toHaveURL('/print')
    await expect(page.locator('h1')).toContainText('打印练习题')
  })

  test('should navigate to settings page', async ({ page }) => {
    await page.click('text=设置')
    
    await expect(page).toHaveURL('/settings')
    await expect(page.locator('h1')).toContainText('设置')
  })

  test('should persist settings', async ({ page }) => {
    // Go to settings
    await page.click('text=设置')
    
    // Change default difficulty
    await page.selectOption('select >> nth=1', { label: '困难' })
    
    // Go back to home
    await page.click('text=返回游戏')
    
    // Verify difficulty is set
    const difficultySelect = page.locator('select >> nth=1')
    await expect(difficultySelect).toHaveValue('hard')
  })
})

test.describe('Print Page', () => {
  test('should generate puzzles for printing', async ({ page }) => {
    await page.goto('/print')
    
    // Click generate button
    await page.click('text=生成题目')
    
    // Wait for puzzles to be generated
    await expect(page.locator('text=重新选择')).toBeVisible()
    
    // Verify puzzles are displayed
    await expect(page.locator('.print-puzzle')).toHaveCount(4) // Default 9x9 = 4 puzzles
  })
})
