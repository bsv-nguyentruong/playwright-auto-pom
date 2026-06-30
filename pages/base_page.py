import random
import re
import string

from playwright.sync_api import Page, expect


class BasePage:
    URL_INVENTORY = re.compile(r".*inventory\.html")
    URL_INVENTORY_ITEM = re.compile(r".*inventory-item\.html")
    URL_CART = re.compile(r".*cart\.html")
    URL_CHECKOUT_STEP_ONE = re.compile(r".*checkout-step-one\.html")
    URL_CHECKOUT_STEP_TWO = re.compile(r".*checkout-step-two\.html")

    def __init__(self, page: Page):
        self.page = page

    def _expect_page_title(self, title: str):
        expect(self.page.locator(".title")).to_have_text(title)


def generate_random_string(length: int = 8) -> str:
    return "".join(random.choice(string.ascii_letters) for _ in range(length))
