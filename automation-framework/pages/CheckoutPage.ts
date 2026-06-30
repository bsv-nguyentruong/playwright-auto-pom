import { expect } from '@playwright/test';

import { Messages } from '../utils/messages';
import { BasePage } from './BasePage';
import { CheckoutPageLocators } from './locators';

export class CheckoutPage extends BasePage {
  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.page.fill(CheckoutPageLocators.INPUT_FIRST_NAME, firstName);
    await this.page.fill(CheckoutPageLocators.INPUT_LAST_NAME, lastName);
    await this.page.fill(CheckoutPageLocators.INPUT_POSTAL_CODE, postalCode);
  }

  async continueToOverview(): Promise<void> {
    await this.page.click(CheckoutPageLocators.BUTTON_CONTINUE);
    await expect(this.page).toHaveURL(BasePage.URL_CHECKOUT_STEP_TWO);
  }

  async finishCheckout(): Promise<void> {
    await this.page.click(CheckoutPageLocators.BUTTON_FINISH);
    await expect(this.page.locator(CheckoutPageLocators.COMPLETE_HEADER)).toBeVisible();
    await expect(this.page.locator(CheckoutPageLocators.COMPLETE_HEADER)).toHaveText(
      Messages.ORDER_COMPLETE,
    );
  }
}
