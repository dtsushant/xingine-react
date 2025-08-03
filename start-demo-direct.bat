@echo off
echo 🚀 Starting Direct Source Demo Environment...
echo.

REM Set the base directory
set BASE_DIR=%~dp0demo
cd /d "%BASE_DIR%"

echo 📁 Demo directory: %BASE_DIR%
echo.

echo 🔄 Starting demo with direct source integration...
npm run dev

echo.
echo ⏹️ Development environment stopped.
pause
