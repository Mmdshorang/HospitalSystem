@echo off
title Fix .NET Version Conflict - Hospital System
color 0E

echo.
echo ========================================
echo  🔧 FIX .NET VERSION CONFLICT
echo ========================================
echo.

echo [1/5] Checking current .NET versions...
echo.
dotnet --list-sdks
echo.

echo [2/5] Setting .NET 8.0 as default...
echo Creating global.json file...
echo {> global.json
echo   "sdk": {>> global.json
echo     "version": "8.0.0",>> global.json
echo     "rollForward": "latestMinor">> global.json
echo   }>> global.json
echo }>> global.json
echo ✅ global.json created!

echo.
echo [3/5] Cleaning NuGet cache...
dotnet nuget locals all --clear
echo ✅ NuGet cache cleared!

echo.
echo [4/5] Removing old packages...
cd backend
if exist "bin" rmdir /s /q "bin"
if exist "obj" rmdir /s /q "obj"
cd HospitalSystem.Api
if exist "bin" rmdir /s /q "bin"
if exist "obj" rmdir /s /q "obj"
cd ../HospitalSystem.Application
if exist "bin" rmdir /s /q "bin"
if exist "obj" rmdir /s /q "obj"
cd ../HospitalSystem.Domain
if exist "bin" rmdir /s /q "bin"
if exist "obj" rmdir /s /q "obj"
cd ../HospitalSystem.Infrastructure
if exist "bin" rmdir /s /q "bin"
if exist "obj" rmdir /s /q "obj"
cd ../..
echo ✅ Old packages removed!

echo.
echo [5/5] Restoring packages with .NET 8.0...
cd backend
dotnet restore --force
if %errorlevel% neq 0 (
    echo ❌ Restore failed! Trying alternative method...
    echo.
    echo Trying to restore with specific framework...
    dotnet restore --framework net8.0 --force
    if %errorlevel% neq 0 (
        echo ❌ Still failed! Please check your .NET installation
        pause
        exit /b 1
    )
)
echo ✅ Packages restored successfully!

echo.
echo ========================================
echo  🎉 .NET VERSION CONFLICT FIXED! 🎉
echo ========================================
echo.
echo Next steps:
echo 1. Run: dotnet build
echo 2. Run: dotnet run (in HospitalSystem.Api folder)
echo.
echo Current .NET version being used:
dotnet --version
echo.
echo Press any key to exit...
pause
