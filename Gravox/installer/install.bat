@echo off
echo Installing Gravox for Windows...

:: Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Administrative permissions confirmed.
) else (
    echo Note: You might need to run this script as Administrator if copying to protected folders.
)

echo.
echo This script will help you set up Gravox.
echo.
echo Option 1: Add current folder to PATH (Recommended for portable usage)
echo Option 2: Copy executable to C:\Windows (Requires Admin)
echo Option 3: Exit
echo.

set /p choice="Enter your choice (1/2/3): "

if "%choice%"=="1" goto AddPath
if "%choice%"=="2" goto CopySystem
if "%choice%"=="3" goto End

:AddPath
set "SCRIPT_DIR=%~dp0"
echo Adding %SCRIPT_DIR% to User PATH...
setx PATH "%PATH%;%SCRIPT_DIR%"
echo.
echo Done! You may need to restart your terminal/command prompt.
goto End

:CopySystem
echo Copying gravox.exe to C:\Windows...
copy "%~dp0gravox.exe" "C:\Windows\gravox.exe"
if %errorLevel% == 0 (
    echo Success! You can now run 'gravox' from anywhere.
) else (
    echo Failed to copy. Please run this script as Administrator.
)
goto End

:End
echo.
echo Press any key to exit...
pause >nul
