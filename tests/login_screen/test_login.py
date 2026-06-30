import allure

from ultis.data_reader import get_login_scenario, load_csv_data
from ultis.messages import ERROR_USERNAME_PASSWORD_MISMATCH, ERROR_USERNAME_REQUIRED


@allure.story("Login")
class TestLogin:
    @allure.title("LOGIN_01: Login thành công với credentials hợp lệ")
    def test_login_with_valid_credentials(self, login_successfully):
        login_successfully.expect_logged_in()

    @allure.title("LOGIN_02: Login sai password")
    def test_login_with_invalid_password(self, open_login_page):
        credentials = get_login_scenario("invalid_password")
        open_login_page.login(credentials["username"], credentials["password"])
        open_login_page.expect_error_message(ERROR_USERNAME_PASSWORD_MISMATCH)

    @allure.title("LOGIN_03: Login sai username")
    def test_login_with_invalid_username(self, open_login_page):
        credentials = get_login_scenario("invalid_username")
        open_login_page.login(credentials["username"], credentials["password"])
        open_login_page.expect_error_message(ERROR_USERNAME_PASSWORD_MISMATCH)

    @allure.title("LOGIN_04: Login để trống dữ liệu")
    def test_login_with_empty_credentials(self, open_login_page):
        credentials = get_login_scenario("empty_credentials")
        open_login_page.login(credentials["username"], credentials["password"])
        open_login_page.expect_error_message(ERROR_USERNAME_REQUIRED)

    @allure.title("LOGIN_05: Login scenario từ CSV")
    def test_login_from_csv(self, open_login_page):
        row = next(item for item in load_csv_data("users.csv") if item["scenario"] == "valid_user")
        open_login_page.login(row["username"], row["password"])
        open_login_page.expect_logged_in()
