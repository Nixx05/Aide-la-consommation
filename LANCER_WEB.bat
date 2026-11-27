@echo off
REM Lance NutriChoix dans le navigateur (double-clic)
cd /d "%~dp0mobile"
if not exist node_modules (
  echo Installation des dependances...
  call npm.cmd install
)
call npm.cmd run web
pause
