import { expect, test } from '@playwright/test';

test('new learner can finish welcome and open the typing studio', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /మీ ఇంగ్లీష్ ప్రయాణం/i })).toBeVisible();
  await page.getByRole('button', { name: /let’s begin/i }).click();
  await page.getByPlaceholder(/name/i).fill('Lakshmi');
  await page.getByRole('button', { name: /^next/i }).click();
  await page.getByRole('button', { name: /try a little english/i }).click();
  await page.getByRole('button', { name: 'am', exact: true }).click();
  await page.getByRole('button', { name: /start my journey/i }).click();
  await expect(page.getByRole('heading', { name: /నమస్కారం, Lakshmi/i })).toBeVisible();
  await page.getByRole('link', { name: /Tenglish Studio/i }).click();
  await expect(page.getByRole('heading', { name: /Tenglish Typing Studio/i })).toBeVisible();
  await expect(page.locator('[lang="te"]').first()).toBeVisible();
});
