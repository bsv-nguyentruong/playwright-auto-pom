import allure

from ultis.data_reader import get_product_name


@allure.story("Cart")
class TestCart:
    @allure.title("CART_01: Add product vào cart")
    def test_add_product_to_cart(self, product_page, cart_page):
        product_name = get_product_name("backpack")

        product_page.expect_products_page_loaded()
        product_page.add_product_to_cart(product_name)
        product_page.expect_product_added_to_cart(product_name)
        cart_page.expect_cart_badge_count(1)
        cart_page.open_cart()
        cart_page.expect_product_in_cart(product_name)

    @allure.title("CART_02: Remove product khỏi cart")
    def test_remove_product_from_cart(self, product_page, cart_page):
        product_name = get_product_name("bike_light")

        product_page.expect_products_page_loaded()
        product_page.add_product_to_cart(product_name)
        cart_page.expect_cart_badge_count(1)
        cart_page.open_cart()
        cart_page.expect_product_in_cart(product_name)
        cart_page.remove_product_from_cart(product_name)
        cart_page.expect_product_not_in_cart(product_name)
        cart_page.expect_cart_empty()
