@echo off
echo Installing required packages...
echo.

echo Installing resend...
call npm install resend

echo.
echo Installing groq-sdk (latest version)...
call npm install groq-sdk@latest

echo.
echo Done! All packages should now be installed.
echo You can now start the dev server with: npm run dev
echo.
pause

