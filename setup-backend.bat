@echo off
title Backend Setup - Hospital System
color 0B

echo.
echo ========================================
echo    🔧 BACKEND SETUP - HOSPITAL SYSTEM
echo ========================================
echo.

echo [1/5] Checking .NET SDK...
dotnet --version
if %errorlevel% neq 0 (
    echo ❌ .NET SDK not found! Please install .NET 8.0 SDK
    pause
    exit /b 1
)
echo ✅ .NET SDK found!

echo.
echo [2/5] Restoring NuGet packages...
cd backend
dotnet restore
if %errorlevel% neq 0 (
    echo ❌ Failed to restore packages
    pause
    exit /b 1
)
echo ✅ Packages restored successfully!

echo.
echo [3/5] Building solution...
dotnet build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)
echo ✅ Build successful!

echo.
echo [4/5] Database setup...
echo Please make sure PostgreSQL is installed and running
echo Create a database named 'HospitalSystem'
echo Update connection string in appsettings.json
echo.
echo Press any key when database is ready...
pause

echo.
echo [5/5] Starting backend server...
cd HospitalSystem.Api
echo ✅ Backend is starting...
echo 📍 API will be available at: http://localhost:5255
echo 📚 Swagger UI: http://localhost:5255
echo.
dotnet run

pause
