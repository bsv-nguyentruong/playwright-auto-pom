import { type Page, expect } from '@playwright/test';

import { CommonLocators } from './locators';

export class BasePage {
  static readonly URL_INVENTORY = /.*inventory\.html/;
  static readonly URL_INVENTORY_ITEM = /.*inventory-item\.html/;
  static readonly URL_CART = /.*cart\.html/;
  static readonly URL_CHECKOUT_STEP_ONE = /.*checkout-step-one\.html/;
  static readonly URL_CHECKOUT_STEP_TWO = /.*checkout-step-two\.html/;

  constructor(readonly page: Page) {}

  protected async expectPageTitle(title: string): Promise<void> {
    await expect(this.page.locator(CommonLocators.PAGE_TITLE)).toHaveText(title);
  }
}
