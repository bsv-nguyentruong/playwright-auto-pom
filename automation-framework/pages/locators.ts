export const CommonLocators = {
  PAGE_TITLE: '.title',
  ERROR_MESSAGE: '[data-test="error"]',
  BUTTON_ACTION: 'button',
} as const;

export const LoginPageLocators = {
  INPUT_USERNAME: '[data-test="username"]',
  INPUT_PASSWORD: '[data-test="password"]',
  BUTTON_LOGIN: '[data-test="login-button"]',
} as const;

export const ProductPageLocators = {
  INVENTORY_LIST: '.inventory_list',
  INVENTORY_ITEM: '.inventory_item',
  INVENTORY_ITEM_NAME: '.inventory_item_name',
  PRODUCT_DETAIL_NAME: '.inventory_details_name',
  PRODUCT_DETAIL_DESC: '.inventory_details_desc',
} as const;

export const CartPageLocators = {
  LINK_CART: '.shopping_cart_link',
  BADGE_CART: '.shopping_cart_badge',
  CART_ITEM: '.cart_item',
  BUTTON_CHECKOUT: '[data-test="checkout"]',
} as const;

export const CheckoutPageLocators = {
  INPUT_FIRST_NAME: '[data-test="firstName"]',
  INPUT_LAST_NAME: '[data-test="lastName"]',
  INPUT_POSTAL_CODE: '[data-test="postalCode"]',
  BUTTON_CONTINUE: '[data-test="continue"]',
  BUTTON_FINISH: '[data-test="finish"]',
  COMPLETE_HEADER: '.complete-header',
} as const;
