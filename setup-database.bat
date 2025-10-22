@echo off
title Database Setup - Hospital System
color 0C

echo.
echo ========================================
echo    🗄️ DATABASE SETUP - HOSPITAL SYSTEM
echo ========================================
echo.

echo [1/4] Checking PostgreSQL connection...
echo Please make sure PostgreSQL is running and database 'HospitalSystem' exists
echo.
echo Press any key when ready...
pause

echo.
echo [2/4] Adding Entity Framework tools...
cd backend/HospitalSystem.Api
dotnet tool install --global dotnet-ef
if %errorlevel% neq 0 (
    echo ⚠️ EF tools might already be installed, continuing...
)

echo.
echo [3/4] Creating initial migration...
dotnet ef migrations add InitialCreate
if %errorlevel% neq 0 (
    echo ❌ Migration failed! Check connection string
    pause
    exit /b 1
)
echo ✅ Migration created successfully!

echo.
echo [4/4] Updating database...
dotnet ef database update
if %errorlevel% neq 0 (
    echo ❌ Database update failed! Check connection string
    pause
    exit /b 1
)
echo ✅ Database updated successfully!

echo.
echo 🎉 Database setup completed!
echo 📍 Database: HospitalSystem
echo 🔗 Connection: Check appsettings.json
echo.
echo Press any key to exit...
pause
