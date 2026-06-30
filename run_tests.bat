@echo off
if "%1"=="" (
    pytest
) else (
    pytest -k %1
)
allure generate allure-results -o allure-report --clean --single-file
start allure-report\index.html
