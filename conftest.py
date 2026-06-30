import os

import allure
import dotenv
import pytest
from pathlib import Path
from playwright.sync_api import sync_playwright

from pages import CartPage, LoginPage, ProductPage
from ultis.data_reader import load_json_data

_PROJECT_ROOT = Path(__file__).resolve().parent
dotenv.load_dotenv(_PROJECT_ROOT / ".env", override=True)

_BROWSER_LAUNCHERS = {
    "chromium": lambda playwright, headless, channel: playwright.chromium.launch(
        headless=headless, **({"channel": channel} if channel else {})
    ),
    "firefox": lambda playwright, headless, channel: playwright.firefox.launch(headless=headless),
    "webkit": lambda playwright, headless, channel: playwright.webkit.launch(headless=headless),
}


def _get_page_from_item(item):
    for key in ("page", "open_login_page", "login_successfully", "product_page", "cart_page"):
        fixture = item.funcargs.get(key)
        if fixture is None:
            continue
        return fixture.page if hasattr(fixture, "page") else fixture
    return None


@pytest.fixture(scope="function")
def page():
    browser_name = os.getenv("BROWSER", "chromium")
    headless = os.getenv("HEADLESS", "false").lower() == "true"
    channel = os.getenv("BROWSER_CHANNEL")
    launcher = _BROWSER_LAUNCHERS.get(browser_name)

    if launcher is None:
        raise ValueError(f"Unsupported browser: {browser_name}")

    with sync_playwright() as playwright:
        browser = launcher(playwright, headless, channel)
        context = browser.new_context()
        test_page = context.new_page()
        yield test_page
        context.close()
        browser.close()


@pytest.fixture(scope="function")
def open_login_page(page):
    login_page = LoginPage(page)
    login_page.page.goto(os.getenv("BASE_URL"))
    yield login_page


@pytest.fixture(scope="function")
def login_successfully(open_login_page):
    open_login_page.login(
        username=os.getenv("USERNAME"),
        password=os.getenv("PASSWORD"),
    )
    open_login_page.expect_logged_in()
    yield open_login_page


@pytest.fixture(scope="session")
def login_data():
    return load_json_data("login_data.json")


@pytest.fixture(scope="session")
def product_data():
    return load_json_data("product_data.json")


@pytest.fixture(scope="function")
def product_page(login_successfully):
    return ProductPage(login_successfully.page)


@pytest.fixture(scope="function")
def cart_page(login_successfully):
    return CartPage(login_successfully.page)


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()

    if rep.when != "call":
        return

    test_page = _get_page_from_item(item)
    if not test_page:
        return

    status = "PASSED" if rep.passed else "FAILED"
    try:
        allure.attach(
            test_page.screenshot(full_page=True),
            name=f"{item.name}_{status}",
            attachment_type=allure.attachment_type.PNG,
        )
    except Exception as error:
        allure.attach(
            body=f"Could not capture screenshot: {error}",
            name=f"{item.name}_SCREENSHOT_ERROR",
            attachment_type=allure.attachment_type.TEXT,
        )
