import { Messages } from '../../utils/messages';
import { getCsvScenario, getLoginScenario } from '../../utils/dataReader';
import { ProductPage } from '../../pages/ProductPage';
import { test } from '../fixtures';

test.describe('Login Module', () => {
  test('LOGIN_01: Login thành công với dữ liệu JSON', async ({ loginPage }) => {
    const credentials = getLoginScenario('validUser');
    await loginPage.login(credentials.username, credentials.password);
    await loginPage.expectLoggedIn();
  });

  test('LOGIN_02: Login sai password', async ({ loginPage }) => {
    const credentials = getLoginScenario('invalidPassword');
    await loginPage.login(credentials.username, credentials.password);
    await loginPage.expectErrorMessage(Messages.ERROR_USERNAME_PASSWORD_MISMATCH);
  });

  test('LOGIN_03: Login sai username', async ({ loginPage }) => {
    const credentials = getLoginScenario('invalidUsername');
    await loginPage.login(credentials.username, credentials.password);
    await loginPage.expectErrorMessage(Messages.ERROR_USERNAME_PASSWORD_MISMATCH);
  });

  test('LOGIN_04: Login để trống dữ liệu', async ({ loginPage }) => {
    const credentials = getLoginScenario('emptyCredentials');
    await loginPage.login(credentials.username, credentials.password);
    await loginPage.expectErrorMessage(Messages.ERROR_USERNAME_REQUIRED);
  });

  test('LOGIN_05: Login scenario từ CSV', async ({ loginPage }) => {
    const scenario = getCsvScenario('validUser');
    await loginPage.login(scenario.username, scenario.password);
    await loginPage.expectLoggedIn();
    await new ProductPage(loginPage.page).expectProductsPageLoaded();
  });
});
