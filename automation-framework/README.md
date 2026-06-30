# SauceDemo Automation Framework

Framework automation test cho [saucedemo.com](https://www.saucedemo.com) sử dụng **Playwright** và **Page Object Model (POM)**.

## Cấu trúc framework

```
automation-framework/
├── pages/
│   ├── locators.ts           # Toàn bộ selector
│   ├── BasePage.ts           # Base class + URL constants
│   ├── LoginPage.ts
│   ├── ProductPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── test-data/
│   ├── users.json
│   └── users.csv
├── utils/
│   ├── dataReader.ts
│   └── messages.ts
├── tests/
│   ├── fixtures.ts           # Shared fixtures (loginPage, productPage, cartPage)
│   ├── login/
│   ├── product/
│   ├── cart/
│   └── checkout/
├── playwright.config.ts
├── package.json
└── README.md
```

## Yêu cầu hệ thống

- Node.js 18 trở lên
- npm hoặc yarn

## Cài đặt

```bash
cd automation-framework
npm install
npx playwright install
```

## Cách chạy test

```bash
# Chạy toàn bộ test (3 browser: Chromium, Firefox, WebKit)
npm test

# Chạy trên một browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Chạy theo module
npm run test:login
npm run test:product
npm run test:cart

# Chạy có giao diện browser
npm run test:headed

# Xem HTML report sau khi chạy
npm run report
```

## Cách thêm test data

### JSON (`test-data/users.json`)

Thêm key mới vào file JSON:

```json
{
  "validUser": {
    "username": "standard_user",
    "password": "secret_sauce"
  },
  "newScenario": {
    "username": "problem_user",
    "password": "secret_sauce"
  }
}
```

Đọc trong test:

```typescript
import { getUsersFromJson } from '../../utils/dataReader';

const users = getUsersFromJson();
await loginPage.login(users.newScenario.username, users.newScenario.password);
```

### CSV (`test-data/users.csv`)

Thêm dòng mới (giữ nguyên header):

```csv
scenario,username,password,expectedResult
validUser,standard_user,secret_sauce,success
lockedUser,locked_out_user,secret_sauce,Epic sadface: Sorry, this user has been locked out.
```

Đọc trong test:

```typescript
import { getLoginScenariosFromCsv } from '../../utils/dataReader';

const scenarios = getLoginScenariosFromCsv();
const row = scenarios.find((item) => item.scenario === 'lockedUser');
```

## Giải thích cách áp dụng POM

**Page Object Model** tách biệt **locator + hành vi UI** khỏi **logic test**.

| Layer | Vai trò |
|-------|---------|
| `pages/*.ts` | Chứa locator và method tương tác UI (click, fill, verify) |
| `tests/**/*.spec.ts` | Chỉ mô tả kịch bản test, không chứa locator |
| `test-data/` | Dữ liệu đầu vào tách khỏi code |
| `utils/dataReader.ts` | Helper đọc file dữ liệu |

**Ví dụ:**

```typescript
// ❌ Không làm — locator trong test case
await page.locator('[data-test="username"]').fill('standard_user');

// ✅ Đúng — dùng Page Object
const loginPage = new LoginPage(page);
await loginPage.login(username, password);
```

Mỗi Page Object:
- Nhận `page` qua constructor
- Khai báo locator ở một nơi duy nhất
- Expose method mô tả hành vi người dùng (`login`, `addProductToCart`, ...)

Khi UI thay đổi, chỉ cần sửa Page Object — test case không cần đổi.

## Test cases đã implement

### Login
- Login thành công (JSON)
- Login sai password
- Login sai username
- Login để trống dữ liệu
- Login scenario từ CSV

### Product
- Hiển thị danh sách sản phẩm
- Xem chi tiết sản phẩm

### Cart
- Add product vào cart
- Remove product khỏi cart

### Checkout (bonus)
- Checkout với thông tin khách hàng hợp lệ

## Best practices đã áp dụng

### 1. Test độc lập
Mỗi test tự chuẩn bị dữ liệu (login, add product...) — không phụ thuộc thứ tự chạy.

### 2. Smart Wait
Không dùng `waitForTimeout`. Dùng auto-wait của Playwright:

```typescript
await expect(locator).toBeVisible();
await expect(page).toHaveURL(/.*inventory\.html/);
await expect(locator).toHaveText('Products');
```

### 3. Cấu hình Playwright (`playwright.config.ts`)
- `baseURL`: `https://www.saucedemo.com`
- `timeout`: 30s (test), 10s (expect)
- `fullyParallel: true` — chạy song song
- 3 projects: **chromium**, **firefox**, **webkit**

### 4. Tách dữ liệu test
Hỗ trợ cả **JSON** và **CSV** qua `utils/dataReader.ts`.

## Khó khăn gặp phải (gợi ý báo cáo)

- **Dynamic locator theo sản phẩm**: nút Add/Remove thay đổi text sau khi click → dùng filter theo tên sản phẩm thay vì hard-code `data-test`.
- **Chạy đa browser**: một số test có thể chậm hơn trên WebKit → cấu hình `retries` trong CI.
- **CSV đơn giản**: parser hiện tại phù hợp CSV không có dấu phẩy trong giá trị; dữ liệu phức tạp nên dùng thư viện `csv-parse`.

## Tác giả

Training Playwright POM — Deadline 01/07/2026
