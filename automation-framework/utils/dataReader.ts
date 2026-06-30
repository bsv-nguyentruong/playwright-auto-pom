import fs from 'fs';
import path from 'path';

const TEST_DATA_DIR = path.join(__dirname, '..', 'test-data');

export function readJsonData<T>(fileName: string): T {
  return JSON.parse(fs.readFileSync(path.join(TEST_DATA_DIR, fileName), 'utf-8')) as T;
}

export function readCsvData(fileName: string): Record<string, string>[] {
  const lines = fs.readFileSync(path.join(TEST_DATA_DIR, fileName), 'utf-8').trim().split(/\r?\n/);
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    return headers.reduce<Record<string, string>>((row, header, i) => {
      row[header] = values[i] ?? '';
      return row;
    }, {});
  });
}

export interface TestUsersJson {
  validUser: { username: string; password: string };
  invalidPassword: { username: string; password: string };
  invalidUsername: { username: string; password: string };
  emptyCredentials: { username: string; password: string };
  products: { backpack: string; bikeLight: string };
}

export function getUsersFromJson(): TestUsersJson {
  return readJsonData<TestUsersJson>('users.json');
}

export type LoginScenarioKey = 'validUser' | 'invalidPassword' | 'invalidUsername' | 'emptyCredentials';

export function getLoginScenario(scenario: LoginScenarioKey) {
  return getUsersFromJson()[scenario];
}

export function getCsvScenario(scenario: string): Record<string, string> {
  const row = readCsvData('users.csv').find((item) => item.scenario === scenario);
  if (!row) throw new Error(`CSV scenario not found: ${scenario}`);
  return row;
}

export function getCheckoutCustomer() {
  return readJsonData<{ validCustomer: { firstName: string; lastName: string; postalCode: string } }>(
    'checkout_data.json',
  ).validCustomer;
}
