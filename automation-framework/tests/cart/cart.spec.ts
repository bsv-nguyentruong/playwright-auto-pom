import { getUsersFromJson } from '../../utils/dataReader';
import { test } from '../fixtures';

const { products } = getUsersFromJson();

test.describe('Cart Module', () => {
  test('CART_01: Add product vào cart', async ({ productPage, cartPage }) => {
    await productPage.expectProductsPageLoaded();
    await productPage.addProductToCart(products.backpack);
    await productPage.expectProductAddedToCart(products.backpack);
    await cartPage.expectCartBadgeCount(1);
    await cartPage.openCart();
    await cartPage.expectProductInCart(products.backpack);
  });

  test('CART_02: Remove product khỏi cart', async ({ productPage, cartPage }) => {
    await productPage.expectProductsPageLoaded();
    await productPage.addProductToCart(products.bikeLight);
    await cartPage.expectCartBadgeCount(1);
    await cartPage.openCart();
    await cartPage.expectProductInCart(products.bikeLight);
    await cartPage.removeProductFromCart(products.bikeLight);
    await cartPage.expectProductNotInCart(products.bikeLight);
    await cartPage.expectCartEmpty();
  });
});
