import allure

from pages.checkout import CheckoutPage
from ultis.data_reader import get_product_name


@allure.story("Checkout")
class TestCheckout:
    @allure.title("CHECKOUT_01: Checkout với thông tin khách hàng hợp lệ")
    def test_checkout_with_valid_customer_info(self, product_page, cart_page):
        product_name = get_product_name("backpack")
        product_page.expect_products_page_loaded()
        product_page.add_product_to_cart(product_name)
        cart_page.open_cart()

        checkout_page = CheckoutPage(cart_page.page)
        checkout_page.go_to_checkout()
        checkout_page.fill_customer_info("Nguyen", "Truong", "700000")
        checkout_page.continue_to_overview()
        checkout_page.finish_checkout()
