import allure
from playwright.sync_api import expect

from pages.base_page import BasePage
from pages.locators import CommonLocators as common_locators
from pages.locators import LoginPageLocators as login_locators


class LoginPage(BasePage):
    @allure.step("Input username: {username}")
    def input_username(self, username: str):
        self.page.fill(login_locators.INPUT_USERNAME, username)

    @allure.step("Input password: {password}")
    def input_password(self, password: str):
        self.page.fill(login_locators.INPUT_PASSWORD, password)

    @allure.step("Click login button")
    def click_login_button(self):
        self.page.click(login_locators.BUTTON_LOGIN)

    @allure.step("Login with username: {username} and password: {password}")
    def login(self, username: str, password: str):
        self.input_username(username)
        self.input_password(password)
        self.click_login_button()

    @allure.step("Verify login successful")
    def expect_logged_in(self):
        expect(self.page).to_have_url(self.URL_INVENTORY)

    @allure.step("Verify error message: {expected_message}")
    def expect_error_message(self, expected_message: str):
        error = self.page.locator(common_locators.ERROR_MESSAGE)
        expect(error).to_be_visible()
        expect(error).to_contain_text(expected_message)
