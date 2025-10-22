@echo off
title First Time Setup - Hospital System
color 0A

echo.
echo ========================================
echo  🏥 FIRST TIME SETUP - HOSPITAL SYSTEM
echo ========================================
echo.

echo This script will set up the Hospital System for the first time
echo.
echo Prerequisites:
echo - .NET 8.0 SDK installed
echo - PostgreSQL installed and running
echo - Database 'HospitalSystem' created
echo.
echo Press any key to continue...
pause

echo.
echo [1/6] Checking .NET SDK...
dotnet --version
if %errorlevel% neq 0 (
    echo ❌ .NET SDK not found! Please install .NET 8.0 SDK
    pause
    exit /b 1
)
echo ✅ .NET SDK found!

echo.
echo [2/6] Installing Entity Framework tools...
dotnet tool install --global dotnet-ef
echo ✅ EF tools installed!

echo.
echo [3/6] Restoring NuGet packages...
cd backend
dotnet restore
if %errorlevel% neq 0 (
    echo ❌ Failed to restore packages
    pause
    exit /b 1
)
echo ✅ Packages restored!

echo.
echo [4/6] Building solution...
dotnet build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)
echo ✅ Build successful!

echo.
echo [5/6] Setting up database...
cd HospitalSystem.Api
echo Creating initial migration...
dotnet ef migrations add InitialCreate
if %errorlevel% neq 0 (
    echo ❌ Migration failed! Check connection string in appsettings.json
    echo Make sure PostgreSQL is running and database exists
    pause
    exit /b 1
)
echo ✅ Migration created!

echo Updating database...
dotnet ef database update
if %errorlevel% neq 0 (
    echo ❌ Database update failed! Check connection string
    pause
    exit /b 1
)
echo ✅ Database updated!

echo.
echo [6/6] Installing frontend dependencies...
cd ../../frontend
pnpm install
if %errorlevel% neq 0 (
    echo ❌ Frontend dependencies failed
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed!

echo.
echo ========================================
echo  🎉 SETUP COMPLETED SUCCESSFULLY! 🎉
echo ========================================
echo.
echo Next steps:
echo 1. Update connection string in appsettings.json if needed
echo 2. Run: npm start
echo.
echo URLs:
echo - Backend API: http://localhost:5255
echo - Frontend UI: http://localhost:3000
echo - Swagger API: http://localhost:5255
echo.
echo Press any key to exit...
pause
