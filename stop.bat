@echo off
title Namma Area - Stop Server
color 0C

echo.
echo  ================================================
echo   NAMMA AREA - Stopping Development Server...
echo  ================================================
echo.

REM Kill node processes related to tsx / vite / server
echo  [INFO] Terminating Node.js processes...

taskkill /F /IM node.exe >nul 2>&1
if errorlevel 1 (
    echo  [INFO] No running Node.js process found.
) else (
    echo  [OK]   Node.js processes stopped successfully.
)

REM Also kill any tsx process if running separately
taskkill /F /IM tsx.exe >nul 2>&1

echo.
echo  [DONE] Namma Area server has been stopped.
echo.
pause
