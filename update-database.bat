@echo off
title Update Database - Hospital System
color 0E

echo.
echo ========================================
echo    🔄 UPDATE DATABASE - HOSPITAL SYSTEM
echo ========================================
echo.

echo [1/2] Checking PostgreSQL connection...
echo Please make sure PostgreSQL is running and database 'HospitalSystem' exists
echo.
echo Press any key when ready...
pause >nul

echo.
echo [2/2] Applying pending migrations...
cd backend/HospitalSystem.Api
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
echo 🎉 All pending migrations applied!
echo 📍 Database: HospitalSystem
echo.
echo Press any key to exit...
pause >nul

