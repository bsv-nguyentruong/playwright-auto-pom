import { type Locator, expect } from '@playwright/test';

import { Messages } from '../utils/messages';
import { BasePage } from './BasePage';
import { CommonLocators, ProductPageLocators } from './locators';

export class ProductPage extends BasePage {
  private getProductItem(productName: string): Locator {
    return this.page.locator(ProductPageLocators.INVENTORY_ITEM).filter({ hasText: productName });
  }

  async expectProductsPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(BasePage.URL_INVENTORY);
    await this.expectPageTitle(Messages.PRODUCTS_PAGE_TITLE);
    await expect(this.page.locator(ProductPageLocators.INVENTORY_LIST)).toBeVisible();
  }

  async getProductCount(): Promise<number> {
    const items = this.page.locator(ProductPageLocators.INVENTORY_ITEM);
    await expect(items.first()).toBeVisible();
    return items.count();
  }

  async openProductDetails(productName: string): Promise<void> {
    const product = this.getProductItem(productName);
    await expect(product).toBeVisible();
    await product.locator(ProductPageLocators.INVENTORY_ITEM_NAME).click();
    await expect(this.page.locator(ProductPageLocators.PRODUCT_DETAIL_NAME)).toBeVisible();
  }

  async expectProductDetails(productName: string): Promise<void> {
    await expect(this.page).toHaveURL(BasePage.URL_INVENTORY_ITEM);
    await expect(this.page.locator(ProductPageLocators.PRODUCT_DETAIL_NAME)).toHaveText(productName);
    await expect(this.page.locator(ProductPageLocators.PRODUCT_DETAIL_DESC)).toBeVisible();
  }

  async addProductToCart(productName: string): Promise<void> {
    const product = this.getProductItem(productName);
    await expect(product).toBeVisible();
    await product.locator(CommonLocators.BUTTON_ACTION).click();
  }

  async expectProductAddedToCart(productName: string): Promise<void> {
    await expect(this.getProductItem(productName).locator(CommonLocators.BUTTON_ACTION)).toHaveText(
      Messages.BUTTON_REMOVE,
    );
  }
}
