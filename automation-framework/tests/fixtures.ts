import { type Page, test as base } from '@playwright/test';

import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { getUsersFromJson } from '../utils/dataReader';

const users = getUsersFromJson();

async function loginAsValidUser(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(users.validUser.username, users.validUser.password);
  await loginPage.expectLoggedIn();
}

export const test = base.extend<{
  loginPage: LoginPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  productPage: async ({ page }, use) => {
    await loginAsValidUser(page);
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await loginAsValidUser(page);
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await loginAsValidUser(page);
    await use(new CheckoutPage(page));
  },
});

export { expect } from '@playwright/test';
