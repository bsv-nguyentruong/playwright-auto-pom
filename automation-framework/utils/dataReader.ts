import fs from 'fs';
import path from 'path';

const TEST_DATA_DIR = path.join(__dirname, '..', 'test-data');

export function readJsonData<T>(fileName: string): T {
  const filePath = path.join(TEST_DATA_DIR, fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

export function readCsvData(fileName: string): Record<string, string>[] {
  const filePath = path.join(TEST_DATA_DIR, fileName);
  const lines = fs.readFileSync(filePath, 'utf-8').trim().split(/\r?\n/);
  const headers = lines[0].split(',').map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(',').map((value) => value.trim());
    return headers.reduce<Record<string, string>>((row, header, index) => {
      row[header] = values[index] ?? '';
      return row;
    }, {});
  });
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface TestUsersJson {
  validUser: UserCredentials;
  invalidPassword: UserCredentials;
  invalidUsername: UserCredentials;
  emptyCredentials: UserCredentials;
  products: {
    backpack: string;
    bikeLight: string;
  };
}

export function getUsersFromJson(): TestUsersJson {
  return readJsonData<TestUsersJson>('users.json');
}

export type LoginScenarioKey =
  | 'validUser'
  | 'invalidPassword'
  | 'invalidUsername'
  | 'emptyCredentials';

export function getLoginScenario(scenario: LoginScenarioKey): UserCredentials {
  return getUsersFromJson()[scenario];
}

export function getCsvScenario(scenario: string): Record<string, string> {
  const row = readCsvData('users.csv').find((item) => item.scenario === scenario);
  if (!row) {
    throw new Error(`CSV scenario not found: ${scenario}`);
  }
  return row;
}

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export function getCheckoutCustomer(): CheckoutCustomer {
  return readJsonData<{ validCustomer: CheckoutCustomer }>('checkout_data.json').validCustomer;
}
