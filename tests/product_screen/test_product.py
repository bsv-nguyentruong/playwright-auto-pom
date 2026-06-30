import allure

from ultis.data_reader import get_product_name


@allure.story("Product")
class TestProduct:
    @allure.title("PRODUCT_01: Hiển thị danh sách sản phẩm")
    def test_display_product_list(self, product_page):
        product_page.expect_products_page_loaded()
        assert product_page.get_product_count() > 0

    @allure.title("PRODUCT_02: Xem chi tiết sản phẩm")
    def test_view_product_details(self, product_page):
        product_name = get_product_name("backpack")
        product_page.expect_products_page_loaded()
        product_page.open_product_details(product_name)
        product_page.expect_product_details(product_name)
