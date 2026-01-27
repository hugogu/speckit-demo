import { test, expect } from '@playwright/test'

test.describe('Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    
    // Check header is visible
    await expect(page.locator('h1')).toContainText('数独学习游戏')
    
    // Check navigation links are visible
    await expect(page.locator('text=打印练习')).toBeVisible()
    await expect(page.locator('text=游戏记录')).toBeVisible()
  })

  test('should display correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    
    // Check header is visible
    await expect(page.locator('h1')).toContainText('数独学习游戏')
    
    // Start a game
    await page.click('text=开始游戏')
    
    // Check game board is visible
    await expect(page.locator('[role="grid"]')).toBeVisible()
  })

  test('should display correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check header is visible
    await expect(page.locator('h1')).toContainText('数独学习游戏')
    
    // Start a game
    await page.click('text=开始游戏')
    
    // Check game board is visible and fits screen
    const board = page.locator('[role="grid"]')
    await expect(board).toBeVisible()
    
    // Check board doesn't overflow
    const boardBox = await board.boundingBox()
    expect(boardBox).not.toBeNull()
    if (boardBox) {
      expect(boardBox.width).toBeLessThanOrEqual(375)
    }
  })

  test('touch targets should be at least 44x44px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Start a game
    await page.click('text=开始游戏')
    
    // Check number pad buttons have minimum touch target size
    const numberButtons = page.locator('button:has-text("1")')
    const buttonBox = await numberButtons.first().boundingBox()
    
    expect(buttonBox).not.toBeNull()
    if (buttonBox) {
      expect(buttonBox.width).toBeGreaterThanOrEqual(44)
      expect(buttonBox.height).toBeGreaterThanOrEqual(44)
    }
  })

  test('should handle landscape orientation', async ({ page }) => {
    // Landscape mobile
    await page.setViewportSize({ width: 667, height: 375 })
    
    // Check header is visible
    await expect(page.locator('h1')).toContainText('数独学习游戏')
    
    // Start a game
    await page.click('text=开始游戏')
    
    // Check game board is visible
    await expect(page.locator('[role="grid"]')).toBeVisible()
  })
})

test.describe('Print Page Responsive', () => {
  test('should display print options on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/print')
    
    // Check page title
    await expect(page.locator('h1')).toContainText('打印练习题')
    
    // Check options are visible
    await expect(page.locator('text=棋盘大小')).toBeVisible()
    await expect(page.locator('text=难度级别')).toBeVisible()
  })
})

test.describe('History Page Responsive', () => {
  test('should display history on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/history')
    
    // Check page title
    await expect(page.locator('h1')).toContainText('游戏记录')
    
    // Check stats section is visible
    await expect(page.locator('text=总游戏数')).toBeVisible()
  })
})
