@echo off
title First Time Database Setup - Hospital System
color 0A

echo.
echo ========================================
echo    🗄️ FIRST TIME DATABASE SETUP
echo ========================================
echo.

echo [1/5] Checking PostgreSQL installation...
psql --version
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL is not installed!
    echo Please install PostgreSQL from: https://www.postgresql.org/download/
    echo.
    echo For Windows:
    echo 1. Download PostgreSQL 16
    echo 2. Install with default settings
    echo 3. Set password to: password
    echo 4. Use port: 5432
    echo.
    pause
    exit /b 1
)
echo ✅ PostgreSQL is installed!

echo.
echo [2/5] Starting PostgreSQL service...
net start postgresql-x64-16
if %errorlevel% neq 0 (
    echo ⚠️ PostgreSQL service might already be running
)

echo.
echo [3/5] Creating database 'HospitalSystem'...
psql -U postgres -c "CREATE DATABASE \"HospitalSystem\";"
if %errorlevel% neq 0 (
    echo ❌ Failed to create database!
    echo Make sure PostgreSQL is running and password is correct
    echo.
    echo Try running this manually:
    echo psql -U postgres
    echo CREATE DATABASE "HospitalSystem";
    echo \q
    pause
    exit /b 1
)
echo ✅ Database 'HospitalSystem' created successfully!

echo.
echo [4/5] Adding Entity Framework tools...
cd backend/HospitalSystem.Api
dotnet tool install --global dotnet-ef
if %errorlevel% neq 0 (
    echo ⚠️ EF tools might already be installed, continuing...
)

echo.
echo [5/5] Creating and applying migrations...
dotnet ef migrations add InitialCreate
if %errorlevel% neq 0 (
    echo ❌ Migration failed! Check connection string
    echo.
    echo Make sure your appsettings.json has:
    echo "ConnectionStrings": {
    echo   "DefaultConnection": "Host=localhost;Database=HospitalSystem;Username=postgres;Password=password"
    echo }
    pause
    exit /b 1
)

dotnet ef database update
if %errorlevel% neq 0 (
    echo ❌ Database update failed!
    pause
    exit /b 1
)

echo.
echo 🎉 Database setup completed successfully!
echo 📍 Database: HospitalSystem
echo 🔗 Connection: localhost:5432
echo 👤 Username: postgres
echo 🔑 Password: password
echo.
echo You can now run the application!
echo.
pause
