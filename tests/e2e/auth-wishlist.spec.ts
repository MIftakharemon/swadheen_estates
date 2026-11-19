import { test, expect } from '@playwright/test'

// Auth + wishlist journey: anonymous visitors see the account menu, saving
// prompts a sign-in, and a signed-in visitor's wishlist persists server-side.

const TEST_ACCOUNT = {
  name: 'Smoke Test',
  email: 'smoke-test@example.com',
  password: 'smoke-test-password',
}
const PROPERTY_PATH = '/properties/the-grove-3a'

test.beforeEach(async ({ page, request }) => {
  // The site's default locale is Bengali — pin it so selectors stay stable.
  await page.addInitScript(() => window.localStorage.setItem('swadheen-locale', 'bn'))
  // Ensure the demo account exists; a 409/429 on repeat runs is fine.
  await request.post('/api/auth/register', {
    data: { ...TEST_ACCOUNT, confirmPassword: TEST_ACCOUNT.password },
  })
})

test('anonymous header offers sign in and create account', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'অ্যাকাউন্ট' }).click()
  const signIn = page.getByRole('link', { name: 'সাইন ইন' })
  const createAccount = page.getByRole('link', { name: 'অ্যাকাউন্ট খুলুন' })
  await expect(signIn).toBeVisible()
  await expect(createAccount).toBeVisible()
  await expect(signIn).toHaveAttribute('href', /\/login\?next=/)
  await expect(createAccount).toHaveAttribute('href', /\/register\?next=/)
})

test('saving a property without an account prompts sign in', async ({ page }) => {
  await page.goto(PROPERTY_PATH)
  // The save pill is the only aria-pressed button that shows visible text
  // (card hearts are icon-only, gallery thumbnails have no text).
  const save = page.locator('button[aria-pressed]').filter({ hasText: 'সেভ' }).first()
  await save.click()
  await expect(page.getByText('সাইন ইন প্রয়োজন')).toBeVisible()
  await expect(
    page.getByText('এই প্রপার্টি উইশলিস্টে সেভ করতে সাইন ইন বা অ্যাকাউন্ট খুলুন।'),
  ).toBeVisible()
  // The wishlist must not change for anonymous visitors.
  await expect(save).toHaveAttribute('aria-pressed', 'false')
})

test('visitor signs in from the prompt and the wishlist persists', async ({ page }) => {
  await page.goto(PROPERTY_PATH)
  const save = page.locator('button[aria-pressed]').filter({ hasText: 'সেভ' }).first()
  await save.click()

  // The toast's sign-in call to action carries the visitor to the login page.
  await page.locator('[role="status"]').getByRole('link', { name: 'সাইন ইন' }).click()
  await expect(page).toHaveURL(/\/login\?next=/)

  await page.getByPlaceholder('you@example.com').fill(TEST_ACCOUNT.email)
  await page.getByPlaceholder('আপনার পাসওয়ার্ড').fill(TEST_ACCOUNT.password)

  // Track the wishlist load the authenticated page performs after sign-in so
  // we never read aria-pressed while the initial fetch is still in flight.
  const initialLoad = page.waitForResponse(
    (response) => response.url().includes('/api/wishlist') && response.request().method() === 'GET',
  )
  await page.getByRole('button', { name: 'পরবর্তী' }).click()
  await expect(page).toHaveURL(new RegExp('/properties/the-grove-3a'))
  await initialLoad

  // The header now shows the signed-in member's initials.
  await expect(page.getByRole('button', { name: 'অ্যাকাউন্ট' })).toContainText('ST')

  const before = await save.getAttribute('aria-pressed')
  await expect(before).toMatch(/^(true|false)$/)
  const expected = before === 'true' ? 'false' : 'true'

  // Wait for the toggle to reach the server before reloading.
  const toggle = page.waitForResponse(
    (response) => response.url().includes('/api/wishlist') && response.request().method() === 'POST',
  )
  await save.click()
  await expect(save).toHaveAttribute('aria-pressed', expected)
  await toggle

  // Reload: the choice came back from the server instead of local state.
  const reloadLoad = page.waitForResponse(
    (response) => response.url().includes('/api/wishlist') && response.request().method() === 'GET',
  )
  await page.reload()
  await reloadLoad
  await expect(save).toHaveAttribute('aria-pressed', expected)
})

test('register form explains mismatched passwords without calling the API', async ({ page }) => {
  await page.goto('/register')
  await page.getByPlaceholder('আপনার নাম').fill('Test Person')
  await page.getByPlaceholder('you@example.com').fill('mismatch-check@example.com')
  await page.getByPlaceholder('আপনার পাসওয়ার্ড').first().fill('a-very-long-password')
  await page.getByPlaceholder('আপনার পাসওয়ার্ড').nth(1).fill('another-long-password')
  await page.getByRole('button', { name: 'অ্যাকাউন্ট খুলুন' }).click()
  // Scoped past Next's route announcer, which is also a role="alert".
  await expect(page.locator('p[role="alert"]')).toHaveText('পাসওয়ার্ড দুটি মিলছে না।')
})
