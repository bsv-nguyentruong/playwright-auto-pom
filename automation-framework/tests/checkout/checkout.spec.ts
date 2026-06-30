import { getCheckoutCustomer, getUsersFromJson } from '../../utils/dataReader';
import { test } from '../fixtures';

const { products } = getUsersFromJson();

test.describe('Checkout Module', () => {
  test('CHECKOUT_01: Checkout hợp lệ', async ({ productPage, cartPage, checkoutPage }) => {
    const customer = getCheckoutCustomer();

    await productPage.expectProductsPageLoaded();
    await productPage.addProductToCart(products.backpack);
    await cartPage.openCart();
    await cartPage.goToCheckout();
    await checkoutPage.fillCustomerInfo(customer.firstName, customer.lastName, customer.postalCode);
    await checkoutPage.continueToOverview();
    await checkoutPage.finishCheckout();
  });
});
