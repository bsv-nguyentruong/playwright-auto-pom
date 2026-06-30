import { CheckoutPage } from '../../pages/CheckoutPage';
import { getUsersFromJson } from '../../utils/dataReader';
import { test } from '../fixtures';

const { products } = getUsersFromJson();

test.describe('Checkout Module', () => {
  test('CHECKOUT_01: Checkout hợp lệ', async ({ productPage, cartPage }) => {
    await productPage.expectProductsPageLoaded();
    await productPage.addProductToCart(products.backpack);
    await cartPage.openCart();
    await cartPage.goToCheckout();

    const checkoutPage = new CheckoutPage(cartPage.page);
    await checkoutPage.fillCustomerInfo('Nguyen', 'Truong', '700000');
    await checkoutPage.continueToOverview();
    await checkoutPage.finishCheckout();
  });
});
