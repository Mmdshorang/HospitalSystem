@echo off
title Add Migration - Hospital System
color 0B

echo.
echo ========================================
echo    📝 ADD MIGRATION - HOSPITAL SYSTEM
echo ========================================
echo.

if "%1"=="" (
    echo Usage: add-migration.bat MigrationName
    echo Example: add-migration.bat AddUserEmailField
    echo.
    echo Or run without arguments to enter migration name:
    set /p MIGRATION_NAME="Enter migration name: "
) else (
    set MIGRATION_NAME=%1
)

if "%MIGRATION_NAME%"=="" (
    echo ❌ Migration name is required!
    pause
    exit /b 1
)

echo.
echo [1/3] Checking PostgreSQL connection...
echo Please make sure PostgreSQL is running and database 'HospitalSystem' exists
echo.
echo Press any key when ready...
pause >nul

echo.
echo [2/3] Creating migration: %MIGRATION_NAME%
cd backend/HospitalSystem.Api
dotnet ef migrations add %MIGRATION_NAME% --project ../HospitalSystem.Infrastructure
if %errorlevel% neq 0 (
    echo ❌ Migration creation failed!
    echo.
    echo Common issues:
    echo - Check connection string in appsettings.json
    echo - Make sure PostgreSQL is running
    echo - Ensure database 'HospitalSystem' exists
    pause
    exit /b 1
)
echo ✅ Migration '%MIGRATION_NAME%' created successfully!

echo.
echo [3/3] Updating database...
dotnet ef database update --project ../HospitalSystem.Infrastructure
if %errorlevel% neq 0 (
    echo ❌ Database update failed!
    echo.
    echo Common issues:
    echo - Check connection string in appsettings.json
    echo - Review migration files for errors
    echo - Ensure database is accessible
    pause
    exit /b 1
)
echo ✅ Database updated successfully!

echo.
echo 🎉 Migration completed!
echo 📝 Migration: %MIGRATION_NAME%
echo 📍 Database: HospitalSystem
echo.
echo Press any key to exit...
pause >nul

