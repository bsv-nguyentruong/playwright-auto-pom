import { type Locator, expect } from '@playwright/test';

import { Messages } from '../utils/messages';
import { BasePage } from './BasePage';
import { CartPageLocators, CommonLocators } from './locators';

export class CartPage extends BasePage {
  private getCartItem(productName: string): Locator {
    return this.page.locator(CartPageLocators.CART_ITEM).filter({ hasText: productName });
  }

  async openCart(): Promise<void> {
    await this.page.click(CartPageLocators.LINK_CART);
    await expect(this.page).toHaveURL(BasePage.URL_CART);
    await this.expectPageTitle(Messages.CART_PAGE_TITLE);
  }

  async expectCartBadgeCount(count: number): Promise<void> {
    const badge = this.page.locator(CartPageLocators.BADGE_CART);
    if (count === 0) {
      await expect(badge).toHaveCount(0);
      return;
    }
    await expect(badge).toHaveText(String(count));
  }

  async expectProductInCart(productName: string): Promise<void> {
    await expect(this.getCartItem(productName)).toBeVisible();
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const item = this.getCartItem(productName);
    await expect(item).toBeVisible();
    await item.locator(CommonLocators.BUTTON_ACTION).click();
  }

  async expectProductNotInCart(productName: string): Promise<void> {
    await expect(this.getCartItem(productName)).toHaveCount(0);
  }

  async expectCartEmpty(): Promise<void> {
    await expect(this.page.locator(CartPageLocators.CART_ITEM)).toHaveCount(0);
    await this.expectCartBadgeCount(0);
  }

  async goToCheckout(): Promise<void> {
    await this.page.click(CartPageLocators.BUTTON_CHECKOUT);
    await expect(this.page).toHaveURL(BasePage.URL_CHECKOUT_STEP_ONE);
    await this.expectPageTitle(Messages.CHECKOUT_INFO_TITLE);
  }
}
