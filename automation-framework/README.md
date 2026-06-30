# SauceDemo Automation Framework (TypeScript)

Playwright + Page Object Model cho [saucedemo.com](https://www.saucedemo.com).

## Cấu trúc thư mục

```
automation-framework/
├── pages/
│   ├── locators.ts       # Tập trung toàn bộ locator
│   ├── BasePage.ts       # URL, title, helper dùng chung
│   ├── LoginPage.ts
│   ├── ProductPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── test-data/
│   ├── users.json        # Login + product name
│   ├── users.csv         # Login scenarios (CSV)
│   └── checkout_data.json
├── utils/
│   ├── dataReader.ts     # Đọc JSON/CSV
│   └── messages.ts       # Text/label dùng trong assertion
├── tests/
│   ├── fixtures.ts       # loginPage, productPage, cartPage, checkoutPage
│   ├── login/
│   ├── product/
│   ├── cart/
│   └── checkout/
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

## Cài đặt

```bash
cd automation-framework
npm install
npx playwright install
```

## Chạy test

```bash
npm test                  # Chromium + Firefox + WebKit (parallel)
npm run test:chromium     # Chỉ Chromium
npm run test:login        # Module login
npm run test:product
npm run test:cart
npm run test:checkout
```

## Test cases

| ID | Module | Mô tả |
|----|--------|-------|
| LOGIN_01 | Login | Đăng nhập thành công (JSON) |
| LOGIN_02 | Login | Sai password |
| LOGIN_03 | Login | Locked out user |
| LOGIN_04 | Login | Username trống |
| LOGIN_05 | Login | Đăng nhập từ CSV |
| PRODUCT_01 | Product | Hiển thị danh sách sản phẩm |
| PRODUCT_02 | Product | Xem chi tiết sản phẩm |
| CART_01 | Cart | Thêm sản phẩm vào giỏ |
| CART_02 | Cart | Xóa sản phẩm khỏi giỏ |
| CHECKOUT_01 | Checkout | Checkout với thông tin hợp lệ |

## Test data

### JSON — `test-data/users.json`

```json
{
  "validUser": { "username": "standard_user", "password": "secret_sauce" },
  "products": { "backpack": "Sauce Labs Backpack" }
}
```

Đọc bằng `getUsersFromJson()` hoặc `getLoginScenario('validUser')`.

### CSV — `test-data/users.csv`

```csv
scenario,username,password,expected
validUser,standard_user,secret_sauce,success
```

Đọc bằng `getCsvScenario('validUser')`.

### Checkout — `test-data/checkout_data.json`

Đọc bằng `getCheckoutCustomer()`.

### Thêm data mới

1. Thêm key/scenario vào file JSON hoặc dòng mới vào CSV.
2. Tạo helper trong `utils/dataReader.ts` nếu cần (hoặc dùng helper có sẵn).
3. Gọi helper trong test — **không hard-code** username/password trong spec.

## Page Object Model

- **Locators** nằm trong `pages/locators.ts`.
- **Actions + assertions** nằm trong từng Page class (`LoginPage`, `ProductPage`, …).
- **Tests** chỉ gọi method Page Object và đọc data — **không chứa locator**.

Ví dụ:

```typescript
test('LOGIN_01', async ({ loginPage }) => {
  const user = getLoginScenario('validUser');
  await loginPage.login(user.username, user.password);
  await loginPage.expectLoggedIn();
});
```

## Cấu hình Playwright

`playwright.config.ts`:

- `baseURL`: https://www.saucedemo.com
- `timeout`: 30s
- `fullyParallel`: true
- Projects: `chromium`, `firefox`, `webkit`

## Thêm test / Page Object mới

1. Thêm locator vào `pages/locators.ts`.
2. Thêm method vào Page class tương ứng.
3. Tạo spec trong `tests/<module>/`.
4. Dùng fixture từ `tests/fixtures.ts` khi cần login sẵn.
