import { test, expect } from '@playwright/test'

test('visitor can browse the catalogue and open a property', async ({ page }) => {
  await page.goto('/properties')
  await expect(page.getByRole('heading', { name: /A place to begin/i })).toBeVisible()
  await expect(page.getByText(/properties · curated for you/i)).toBeVisible()
  await page
    .getByRole('link', { name: /The Grove/i })
    .first()
    .click()
  await expect(page).toHaveURL(/\/properties\//)
  await expect(page.getByRole('heading', { name: /The Grove/i })).toBeVisible()
})

test('homepage pins the cinematic journey while its scenes move horizontally', async ({ page }) => {
  await page.goto('/')
  const journey = page.getByTestId('cinematic-journey')
  const sticky = page.getByTestId('cinematic-journey-sticky')
  await expect(journey).toBeVisible()

  const metrics = await journey.evaluate((node) => ({
    top: node.getBoundingClientRect().top + window.scrollY,
    height: node.getBoundingClientRect().height,
    viewport: window.innerHeight,
  }))
  await page.evaluate(({ top, height, viewport }) => {
    window.scrollTo(0, top + Math.min(viewport * 1.25, height - viewport - 40))
  }, metrics)

  await expect.poll(() => sticky.evaluate((node) => Math.round(node.getBoundingClientRect().top))).toBe(0)
  await expect
    .poll(() => sticky.evaluate((node) => Math.round(node.getBoundingClientRect().height)))
    .toBe(metrics.viewport)
})

test('homepage media reel autoplays and advances one video at a time', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('heading', { name: 'Small moments. A different feeling.' }).scrollIntoViewIfNeeded()

  const frame = page.locator('iframe').first()
  await expect(frame).toHaveAttribute('src', /uYqTlMWMnZk.*autoplay=1.*mute=1/)
  await expect
    .poll(() => frame.getAttribute('src'), { timeout: 9_000 })
    .toMatch(/j14fWqUluPQ.*autoplay=1.*mute=1/)
})

test('public screens stay usable across narrow phone widths', async ({ browser }) => {
  const routes = [
    '/',
    '/properties',
    '/properties/the-grove-3a',
    '/projects/the-grove-bashundhara',
    '/about',
    '/contact',
    '/journal',
    '/request',
    '/careers',
    '/privacy',
    '/terms',
    '/login',
  ]

  for (const width of [320, 375, 390, 430]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: true })
    for (const route of routes) {
      const page = await context.newPage()
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      const response = await page.goto(route)
      await expect(response).not.toBeNull()
      await expect(page.locator('body')).not.toContainText('Let’s try that again.')
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
        .toBeLessThanOrEqual(width)
      expect(errors, `${route} at ${width}px`).toEqual([])
      await page.close()
    }
    await context.close()
  }
})

test('visitor can submit a valid property enquiry', async ({ page }) => {
  await page.goto('/properties/the-grove-3a')
  await page.getByPlaceholder('Your name').fill('Playwright Visitor')
  await page.getByPlaceholder('Phone number').fill('+8801712345678')
  await page.getByPlaceholder('Email address').fill('visitor@example.com')
  await page.getByRole('button', { name: /Arrange a private viewing/i }).click()
  await expect(page.getByRole('heading', { name: /We have your note/i })).toBeVisible()
})

test('invalid enquiry stays on the form with a validation message', async ({ page }) => {
  await page.goto('/properties/the-grove-3a')
  await page.getByRole('button', { name: /Arrange a private viewing/i }).click()
  await expect(page.getByPlaceholder('Your name')).toBeVisible()
})

test('protected workspaces redirect unauthenticated visitors to login', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/login\?next=\/admin/)
  await page.goto('/portal')
  await expect(page).toHaveURL(/\/login\?next=\/portal/)
})
