import { expect } from '@playwright/test';

import { BasePage } from './BasePage';
import { CommonLocators, LoginPageLocators } from './locators';

export class LoginPage extends BasePage {
  async goto(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page.locator(LoginPageLocators.BUTTON_LOGIN)).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.fill(LoginPageLocators.INPUT_USERNAME, username);
    await this.page.fill(LoginPageLocators.INPUT_PASSWORD, password);
    await this.page.click(LoginPageLocators.BUTTON_LOGIN);
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.page).toHaveURL(BasePage.URL_INVENTORY);
  }

  async expectErrorMessage(expectedMessage: string): Promise<void> {
    const error = this.page.locator(CommonLocators.ERROR_MESSAGE);
    await expect(error).toBeVisible();
    await expect(error).toContainText(expectedMessage);
  }
}
