#!/bin/bash
if [ -n "$1" ]; then
    pytest -k "$1"
else
    pytest
fi
allure generate allure-results -o allure-report --clean --single-file
open allure-report/index.html
