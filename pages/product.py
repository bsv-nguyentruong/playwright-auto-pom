import allure
from playwright.sync_api import expect

from pages.base_page import BasePage
from pages.locators import CommonLocators as common_locators
from pages.locators import ProductPageLocators as product_locators
from ultis.messages import BUTTON_REMOVE, PRODUCTS_PAGE_TITLE


class ProductPage(BasePage):
    @allure.step("Verify products page is loaded")
    def expect_products_page_loaded(self):
        expect(self.page).to_have_url(self.URL_INVENTORY)
        self._expect_page_title(PRODUCTS_PAGE_TITLE)
        expect(self.page.locator(product_locators.INVENTORY_LIST)).to_be_visible()

    @allure.step("Verify products are displayed")
    def expect_products_not_empty(self):
        items = self.page.locator(product_locators.INVENTORY_ITEM)
        expect(items.first).to_be_visible()
        expect(items).not_to_have_count(0)

    @allure.step("Get product count")
    def get_product_count(self) -> int:
        items = self.page.locator(product_locators.INVENTORY_ITEM)
        expect(items.first).to_be_visible()
        return items.count()

    def _get_product_item(self, product_name: str):
        return self.page.locator(product_locators.INVENTORY_ITEM).filter(has_text=product_name)

    @allure.step("Open product details: {product_name}")
    def open_product_details(self, product_name: str):
        product = self._get_product_item(product_name)
        expect(product).to_be_visible()
        product.locator(product_locators.INVENTORY_ITEM_NAME).click()
        expect(self.page.locator(product_locators.PRODUCT_DETAIL_NAME)).to_be_visible()

    @allure.step("Verify product details: {product_name}")
    def expect_product_details(self, product_name: str):
        expect(self.page).to_have_url(self.URL_INVENTORY_ITEM)
        expect(self.page.locator(product_locators.PRODUCT_DETAIL_NAME)).to_have_text(product_name)
        expect(self.page.locator(product_locators.PRODUCT_DETAIL_DESC)).to_be_visible()

    @allure.step("Add product to cart: {product_name}")
    def add_product_to_cart(self, product_name: str):
        product = self._get_product_item(product_name)
        expect(product).to_be_visible()
        product.locator(common_locators.BUTTON_ACTION).click()

    @allure.step("Verify product added to cart: {product_name}")
    def expect_product_added_to_cart(self, product_name: str):
        expect(
            self._get_product_item(product_name).locator(common_locators.BUTTON_ACTION)
        ).to_have_text(BUTTON_REMOVE)
