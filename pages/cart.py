import allure
from playwright.sync_api import expect

from pages.base_page import BasePage
from pages.locators import CartPageLocators as cart_locators
from pages.locators import CommonLocators as common_locators
from ultis.messages import CART_PAGE_TITLE


class CartPage(BasePage):
    @allure.step("Open cart page")
    def open_cart(self):
        self.page.click(cart_locators.LINK_CART)
        expect(self.page).to_have_url(self.URL_CART)
        self._expect_page_title(CART_PAGE_TITLE)

    @allure.step("Verify cart badge count: {count}")
    def expect_cart_badge_count(self, count: int):
        badge = self.page.locator(cart_locators.BADGE_CART)
        if count == 0:
            expect(badge).to_have_count(0)
        else:
            expect(badge).to_have_text(str(count))

    def _get_cart_item(self, product_name: str):
        return self.page.locator(cart_locators.CART_ITEM).filter(has_text=product_name)

    @allure.step("Verify product in cart: {product_name}")
    def expect_product_in_cart(self, product_name: str):
        expect(self._get_cart_item(product_name)).to_be_visible()

    @allure.step("Remove product from cart: {product_name}")
    def remove_product_from_cart(self, product_name: str):
        item = self._get_cart_item(product_name)
        expect(item).to_be_visible()
        item.locator(common_locators.BUTTON_ACTION).click()

    @allure.step("Verify product not in cart: {product_name}")
    def expect_product_not_in_cart(self, product_name: str):
        expect(self._get_cart_item(product_name)).to_have_count(0)

    @allure.step("Verify cart is empty")
    def expect_cart_empty(self):
        expect(self.page.locator(cart_locators.CART_ITEM)).to_have_count(0)
        self.expect_cart_badge_count(0)
