import { getCheckoutCustomer, getUsersFromJson } from '../../utils/dataReader';
import { test } from '../fixtures';

const users = getUsersFromJson();

test.describe('Checkout Module', () => {
  test('CHECKOUT_01: Checkout với thông tin khách hàng hợp lệ', async ({
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    const customer = getCheckoutCustomer();

    await productPage.expectProductsPageLoaded();
    await productPage.addProductToCart(users.products.backpack);
    await cartPage.openCart();
    await cartPage.goToCheckout();
    await checkoutPage.fillCustomerInfo(
      customer.firstName,
      customer.lastName,
      customer.postalCode,
    );
    await checkoutPage.continueToOverview();
    await checkoutPage.finishCheckout();
  });
});
