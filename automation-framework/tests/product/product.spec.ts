import { getUsersFromJson } from '../../utils/dataReader';
import { test } from '../fixtures';

const { products } = getUsersFromJson();

test.describe('Product Module', () => {
  test('PRODUCT_01: Hiển thị danh sách sản phẩm', async ({ productPage }) => {
    await productPage.expectProductsPageLoaded();
    await productPage.expectProductsNotEmpty();
  });

  test('PRODUCT_02: Xem chi tiết sản phẩm', async ({ productPage }) => {
    await productPage.expectProductsPageLoaded();
    await productPage.openProductDetails(products.backpack);
    await productPage.expectProductDetails(products.backpack);
  });
});
