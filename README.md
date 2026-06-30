# SauceDemo Automation Framework

Automation test cho [saucedemo.com](https://www.saucedemo.com) — **Playwright Python + Pytest + Allure + POM**.

> Repo gồm 2 stack: **Python (root)** và **TypeScript (`automation-framework/`)**.

---

## Cấu trúc (không đổi)

```
playwright-auto-pom/
├── pages/                    # Page Object + locators.py
├── tests/
│   ├── login_screen/
│   ├── product_screen/
│   ├── cart_screen/
│   └── checkout_screen/
├── test_data/                # JSON + CSV
├── ultis/                    # messages.py, data_reader.py
├── conftest.py
├── automation-framework/     # Playwright TypeScript
└── README.md
```

---

## Cài đặt & chạy (Python)

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirement.txt
playwright install

copy .env.sample .env
pytest -v
```

Allure report:

```powershell
allure generate allure-results -o allure-report --clean --single-file
start allure-report\index.html
```

Hoặc: `run_tests.bat`

---

## Test cases (đủ theo spec)

| Module | ID | Mô tả |
|--------|-----|-------|
| Login | LOGIN_01–05 | Thành công, sai pass, sai user, trống, CSV |
| Product | PRODUCT_01–02 | Danh sách SP, chi tiết SP |
| Cart | CART_01–02 | Add, Remove |
| Checkout | CHECKOUT_01 | Checkout hợp lệ |

---

## Test data

| File | Nội dung |
|------|----------|
| `test_data/login_data.json` | Credentials các scenario login |
| `test_data/product_data.json` | Tên sản phẩm |
| `test_data/users.csv` | Data-driven login (CSV) |
| `test_data/checkout_data.json` | Thông tin khách hàng checkout |

Đọc data trong test:

```python
from ultis.data_reader import get_login_scenario, get_product_name, get_csv_scenario, get_checkout_customer
```

---

## POM & Best practices

- **Locator** → `pages/locators.py` (không hardcode trong test)
- **Hành vi UI** → `pages/*.py` với `@allure.step`
- **Test** → chỉ gọi Page Object + đọc test data
- **Smart wait** → `expect()`, không dùng `wait_for_timeout`
- **Test độc lập** → mỗi test tự setup qua fixture

**Fixture chain:**

```
page → open_login_page → login_successfully → product_page / cart_page
```

---

## TypeScript (`automation-framework/`)

```powershell
cd automation-framework
npm install
npx playwright install
npm test
```

Cấu hình: `baseURL`, timeout, parallel, 3 browser trong `playwright.config.ts`.

---

*Deadline training: 01/07/2026*
