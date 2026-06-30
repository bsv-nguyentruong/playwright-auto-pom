import allure
from playwright.sync_api import expect

from pages.base_page import BasePage
from pages.locators import CartPageLocators as cart_locators
from pages.locators import CheckoutPageLocators as checkout_locators
from ultis.messages import CHECKOUT_INFO_TITLE, ORDER_COMPLETE


class CheckoutPage(BasePage):
    @allure.step("Go to checkout from cart")
    def go_to_checkout(self):
        self.page.click(cart_locators.BUTTON_CHECKOUT)
        expect(self.page).to_have_url(self.URL_CHECKOUT_STEP_ONE)
        self._expect_page_title(CHECKOUT_INFO_TITLE)

    @allure.step("Fill customer info: {first_name} {last_name}")
    def fill_customer_info(self, first_name: str, last_name: str, postal_code: str):
        self.page.fill(checkout_locators.INPUT_FIRST_NAME, first_name)
        self.page.fill(checkout_locators.INPUT_LAST_NAME, last_name)
        self.page.fill(checkout_locators.INPUT_POSTAL_CODE, postal_code)

    @allure.step("Continue to checkout overview")
    def continue_to_overview(self):
        self.page.click(checkout_locators.BUTTON_CONTINUE)
        expect(self.page).to_have_url(self.URL_CHECKOUT_STEP_TWO)

    @allure.step("Finish checkout")
    def finish_checkout(self):
        self.page.click(checkout_locators.BUTTON_FINISH)
        expect(self.page.locator(checkout_locators.COMPLETE_HEADER)).to_have_text(ORDER_COMPLETE)
