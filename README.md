# SauceDemo Automation Framework

Repo gồm **2 framework** song song, cùng target [saucedemo.com](https://www.saucedemo.com):

| Folder | Stack | Chạy test |
|--------|-------|-----------|
| `./` (root) | Python + Pytest + Allure | `pytest` |
| `./automation-framework/` | TypeScript + Playwright | `npm test` |

---

## Python Framework (root)

Framework automation test sử dụng **Playwright Python**, **Pytest**, **Allure Report** và **Page Object Model (POM)**.

> **Nguyên tắc cốt lõi:** Mọi file, class, method đều được tạo ra xuất phát từ testcase — không tạo thừa, không tạo thiếu.

---

## Cấu trúc framework

```
project_root/
├── pages/                          # Page Object + Locators
│   ├── __init__.py
│   ├── locators.py                 # Toàn bộ locator, chia theo class từng màn hình
│   ├── base_page.py                # Base class + utility functions
│   ├── login.py
│   ├── product.py
│   ├── cart.py
│   └── checkout.py
│
├── tests/
│   ├── login_screen/
│   ├── product_screen/
│   ├── cart_screen/
│   └── checkout_screen/
│
├── test_data/                      # Test Data Management
│   ├── login_data.json
│   ├── product_data.json
│   └── users.csv
│
├── ultis/                          # Tiện ích dùng chung
│   ├── messages.py                 # Error messages / constants
│   └── data_reader.py              # Đọc JSON / CSV
│
├── conftest.py                     # Fixtures: page, login, product_page, cart_page
├── pytest.ini
├── requirement.txt
├── requirements.txt                # Cùng nội dung requirement.txt
├── .env.sample                     # Mẫu đầy đủ (BROWSER, HEADLESS)
├── .env.example                    # Mẫu cơ bản theo guideline training
├── run_tests.sh                    # Script chạy test (macOS/Linux)
└── run_tests.bat                   # Script chạy test (Windows)
```

---

## Cài đặt

### 1. Clone source code

```bash
git clone <URL_repository>
cd playwright-auto-pom
```

### 2. Tạo môi trường ảo

**Windows (PowerShell):**

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirement.txt
playwright install
```

**macOS / Linux:**

```bash
python3 -m venv venv --without-pip
source venv/bin/activate
curl https://bootstrap.pypa.io/get-pip.py | python3
pip install -r requirement.txt
playwright install
```

### 3. Tạo file `.env`

Copy file mẫu và điền giá trị:

```bash
# Windows
copy .env.sample .env

# macOS / Linux
cp .env.sample .env
```

Nội dung `.env`:

```
BASE_URL=https://www.saucedemo.com
USERNAME=standard_user
PASSWORD=secret_sauce
```

> **Lưu ý:** File `.env` đã được thêm vào `.gitignore` — không đẩy lên git.

### 4. Cài Allure CLI

Hướng dẫn: https://allurereport.org/docs/install/

---

## Cách chạy test

```bash
# Chạy toàn bộ test
pytest

# Chạy theo module
pytest tests/login_screen/
pytest tests/product_screen/
pytest tests/cart_screen/

# Chạy một test cụ thể
pytest tests/login_screen/test_login.py::TestLogin::test_login_with_valid_credentials

# Verbose
pytest -v
```

### Xuất Allure Report

```bash
allure generate allure-results -o allure-report --clean --single-file
```

**Windows:** `start allure-report\index.html`  
**macOS:** `open allure-report/index.html`

### Script gộp lệnh

```bash
# macOS / Linux
./run_tests.sh
./run_tests.sh login

# Windows
run_tests.bat
run_tests.bat login
```

---

## Test cases

| Module | ID | Mô tả |
|--------|-----|-------|
| Login | LOGIN_01 | Login thành công |
| Login | LOGIN_02 | Login sai password |
| Login | LOGIN_03 | Login sai username |
| Login | LOGIN_04 | Login để trống dữ liệu |
| Product | PRODUCT_01 | Hiển thị danh sách sản phẩm |
| Product | PRODUCT_02 | Xem chi tiết sản phẩm |
| Cart | CART_01 | Add product vào cart |
| Cart | CART_02 | Remove product khỏi cart |

---

## Cách quản lý test data

### JSON

File `test_data/login_data.json`:

```json
{
  "valid_user": {
    "username": "standard_user",
    "password": "secret_sauce"
  }
}
```

Đọc trong test:

```python
from ultis.data_reader import load_json_data

data = load_json_data("login_data.json")["valid_user"]
```

### CSV

File `test_data/users.csv`:

```csv
scenario,username,password,expected_result
valid_user,standard_user,secret_sauce,success
```

Đọc trong test:

```python
from ultis.data_reader import load_csv_data

rows = load_csv_data("users.csv")
```

---

## Giải thích POM

| Layer | Vai trò |
|-------|---------|
| `pages/locators.py` | Chứa selector — sửa UI chỉ cần sửa một nơi |
| `pages/*.py` | Page Object — method mô tả hành vi người dùng |
| `tests/**/*.py` | Test case — gọi Page Object, không chứa locator |
| `test_data/` | Dữ liệu đầu vào tách khỏi code |
| `ultis/messages.py` | Error message tập trung một chỗ |

**Ví dụ:**

```python
# ❌ Không làm — locator trong test case
page.fill('[data-test="username"]', 'standard_user')

# ✅ Đúng — dùng Page Object
open_login_page.login(username, password)
```

**Fixture chain:**

```
page               → browser được mở (cấu hình qua BROWSER, HEADLESS trong .env)
open_login_page    → page + điều hướng đến trang Login
login_successfully → open_login_page + đã đăng nhập thành công
product_page       → ProductPage sau khi login
cart_page          → CartPage sau khi login
login_data         → dữ liệu từ login_data.json (session scope)
product_data       → dữ liệu từ product_data.json (session scope)
```

---

## Best practices đã áp dụng

1. **Test độc lập** — mỗi test tự chuẩn bị dữ liệu qua fixture, không phụ thuộc thứ tự chạy
2. **Smart Wait** — dùng `expect(...).to_be_visible()`, `wait_for_url()`, không dùng `wait_for_timeout`
3. **Tách locator** — `locators.py` riêng, Page Object import và dùng
4. **Allure reporting** — `@allure.story`, `@allure.title`, `@allure.step`, auto screenshot PASSED/FAILED
5. **Test data tách file** — JSON + CSV qua `ultis/data_reader.py`

---

## Training report gợi ý

- **Cấu trúc framework:** pages / tests / test_data / ultis
- **Quản lý dữ liệu:** JSON cho credentials, CSV cho data-driven
- **Best practices:** POM, smart wait, fixture chain, Allure steps
- **Khó khăn:** dynamic locator theo tên sản phẩm, cấu hình Allure CLI trên Windows

---

*Deadline: 01/07/2026*
