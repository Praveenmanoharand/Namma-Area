@echo off
set GIT="%LOCALAPPDATA%\mingit\cmd\git.exe"
set REPO=g:\Namma-Area\namma-area

echo [1/7] Setting git config...
%GIT% -C "%REPO%" config user.email "mppraveen110@gmail.com"
%GIT% -C "%REPO%" config user.name "Praveenmanoharand"
%GIT% -C "%REPO%" branch -M main

echo [2/7] Setting remote...
%GIT% -C "%REPO%" remote remove origin 2>nul
%GIT% -C "%REPO%" remote add origin https://github.com/Praveenmanoharand/Namma-Area.git

echo [3/7] Adding all files...
%GIT% -C "%REPO%" add .

echo [4/7] Committing...
%GIT% -C "%REPO%" commit -m "feat: initial commit - Namma Area civic platform"

echo [5/7] Pushing to GitHub...
%GIT% -C "%REPO%" push -u origin main

echo.
echo ================================================
echo   Done! Check GitHub for your code.
echo ================================================
pause
