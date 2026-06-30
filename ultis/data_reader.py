import csv
import json
from pathlib import Path

_PROJECT_ROOT = Path(__file__).resolve().parent.parent
_TEST_DATA_DIR = _PROJECT_ROOT / "test_data"


def load_json_data(file_name: str) -> dict:
    with open(_TEST_DATA_DIR / file_name, encoding="utf-8") as file:
        return json.load(file)


def load_csv_data(file_name: str):
    with open(_TEST_DATA_DIR / file_name, encoding="utf-8", newline="") as file:
        return list(csv.DictReader(file))


def get_login_scenario(scenario_name: str) -> dict:
    return load_json_data("login_data.json")[scenario_name]


def get_product_name(product_key: str) -> str:
    return load_json_data("product_data.json")[product_key]["name"]


def get_csv_scenario(scenario_name: str) -> dict:
    for row in load_csv_data("users.csv"):
        if row["scenario"] == scenario_name:
            return row
    raise KeyError(f"CSV scenario not found: {scenario_name}")


def get_checkout_customer() -> dict:
    return load_json_data("checkout_data.json")["valid_customer"]
