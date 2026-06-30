import { Messages } from '../../utils/messages';
import { getCsvScenario, getLoginScenario } from '../../utils/dataReader';
import { ProductPage } from '../../pages/ProductPage';
import { test } from '../fixtures';

test.describe('Login Module', () => {
  test('LOGIN_01: Login thành công', async ({ loginPage }) => {
    const c = getLoginScenario('validUser');
    await loginPage.login(c.username, c.password);
    await loginPage.expectLoggedIn();
  });

  test('LOGIN_02: Login sai password', async ({ loginPage }) => {
    const c = getLoginScenario('invalidPassword');
    await loginPage.login(c.username, c.password);
    await loginPage.expectErrorMessage(Messages.ERROR_USERNAME_PASSWORD_MISMATCH);
  });

  test('LOGIN_03: Login sai username', async ({ loginPage }) => {
    const c = getLoginScenario('invalidUsername');
    await loginPage.login(c.username, c.password);
    await loginPage.expectErrorMessage(Messages.ERROR_USERNAME_PASSWORD_MISMATCH);
  });

  test('LOGIN_04: Login để trống', async ({ loginPage }) => {
    const c = getLoginScenario('emptyCredentials');
    await loginPage.login(c.username, c.password);
    await loginPage.expectErrorMessage(Messages.ERROR_USERNAME_REQUIRED);
  });

  test('LOGIN_05: Login từ CSV', async ({ loginPage }) => {
    const row = getCsvScenario('validUser');
    await loginPage.login(row.username, row.password);
    await loginPage.expectLoggedIn();
    await new ProductPage(loginPage.page).expectProductsPageLoaded();
  });
});
