@echo off
REM Lance NutriChoix pour Expo Go : scanner le QR code avec le telephone
REM (telephone et PC sur le meme Wi-Fi, et connecte a Expo avec "npx.cmd expo login")
cd /d "%~dp0mobile"
if not exist node_modules (
  echo Installation des dependances...
  call npm.cmd install
)
call npm.cmd start
pause
