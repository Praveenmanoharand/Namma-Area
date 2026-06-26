@echo off
title Namma Area - Dev Server
color 0A

REM ---- Keep window open always (self-relaunch via cmd /k) ----
if not "%~1"=="KEEP_OPEN" (
    cmd /k ""%~f0" KEEP_OPEN"
    exit /b
)

echo.
echo  ================================================
echo   NAMMA AREA - Starting Development Server...
echo  ================================================
echo.

cd /d "%~dp0"

REM ---- Settings ----
set NODE_VERSION=20.18.3
set NODE_DIR=%LOCALAPPDATA%\namma_node
set NODE_EXE=%NODE_DIR%\node.exe
set NODE_ZIP=%TEMP%\namma_node.zip
set NODE_URL=https://nodejs.org/dist/v%NODE_VERSION%/node-v%NODE_VERSION%-win-x64.zip
set NODE_INNER=node-v%NODE_VERSION%-win-x64
set NODE_TMP=%TEMP%\namma_node_tmp

REM ---- Check if portable node already exists ----
if exist "%NODE_EXE%" (
    set "PATH=%NODE_DIR%;%PATH%"
    goto :node_ready
)

REM ---- Check if system npm is available ----
where npm >nul 2>&1
if %errorlevel% == 0 goto :node_ready

REM ---- If zip already downloaded, skip download ----
if exist "%NODE_ZIP%" goto :extract_node

REM ---- Download Portable Node.js ----
color 0E
echo  [INFO] Node.js not found. Downloading portable Node.js v%NODE_VERSION%...
echo  [INFO] This is a one-time download (~30 MB). Please wait...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%NODE_URL%' -OutFile '%NODE_ZIP%' -UseBasicParsing"
if errorlevel 1 (
    color 0C
    echo.
    echo  [ERROR] Download failed. Check your internet connection.
    echo.
    goto :end
)
echo  [OK] Download complete.
echo.

:extract_node
echo  [INFO] Extracting Node.js (please wait)...

if exist "%NODE_TMP%" rmdir /s /q "%NODE_TMP%"
mkdir "%NODE_TMP%"

REM Try tar first (built-in Windows 10+, fast)
tar -xf "%NODE_ZIP%" -C "%NODE_TMP%" >nul 2>&1
if %errorlevel% == 0 (
    echo  [OK] Extraction complete.
    goto :move_node
)

REM Fallback: PowerShell Expand-Archive
echo  [INFO] Using PowerShell for extraction...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path '%NODE_ZIP%' -DestinationPath '%NODE_TMP%' -Force"
if errorlevel 1 (
    color 0C
    echo  [ERROR] Extraction failed.
    goto :end
)
echo  [OK] Extraction complete.

:move_node
REM ---- Rename extracted folder (same drive = instant) ----
if exist "%NODE_TMP%\%NODE_INNER%" (
    if exist "%NODE_DIR%" rmdir /s /q "%NODE_DIR%"
    rename "%NODE_TMP%\%NODE_INNER%" "." 2>nul
    move "%NODE_TMP%\%NODE_INNER%" "%NODE_DIR%" 2>nul
    if not exist "%NODE_DIR%" (
        REM last resort: xcopy
        xcopy "%NODE_TMP%\%NODE_INNER%" "%NODE_DIR%\" /E /I /Q /Y >nul 2>&1
    )
    rmdir /s /q "%NODE_TMP%" >nul 2>&1
    del /q "%NODE_ZIP%" >nul 2>&1
) else (
    color 0C
    echo  [ERROR] Extracted folder not found inside %NODE_TMP%
    dir "%NODE_TMP%" /b 2>nul
    goto :end
)

if not exist "%NODE_EXE%" (
    color 0C
    echo  [ERROR] node.exe not found after extraction. Setup failed.
    goto :end
)

color 0A
echo  [OK] Portable Node.js is ready!
echo.

set "PATH=%NODE_DIR%;%PATH%"

:node_ready
REM ---- Verify node works ----
node -v >nul 2>&1
if errorlevel 1 goto :node_bad

for /f "tokens=*" %%i in ('node -v') do echo  [INFO] Node.js %%i ready.
goto :check_modules

:node_bad
color 0C
echo  [ERROR] node.exe not working. PATH may be wrong.
goto :end

:check_modules
if exist "node_modules" goto :check_env
echo  [INFO] Installing dependencies (first time only)...
echo.
call npm install
if errorlevel 1 goto :npm_fail
echo.
goto :check_env

:npm_fail
color 0C
echo  [ERROR] npm install failed!
goto :end

:check_env
if exist ".env" goto :start_server
color 0E
echo  [WARN] .env file not found!
echo  [WARN] Copy .env.example to .env and add your GEMINI_API_KEY.
color 0A
echo.

:start_server
echo  [INFO] Starting server at http://localhost:3000
echo  [INFO] Press Ctrl+C to stop the server.
echo.

call npm run dev

:end
echo.
echo  ================================================
echo   Stopped. Press any key to close window.
echo  ================================================
pause >nul
