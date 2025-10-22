@echo off
title Hospital System Launcher
color 0A

echo.
echo ========================================
echo    🏥 HOSPITAL SYSTEM LAUNCHER 🏥
echo ========================================
echo.

echo [1/3] Starting Backend Server...
start "Backend - Hospital API" cmd /k "title Backend Server && cd backend\HospitalSystem.Api && echo Starting Backend... && dotnet run"

echo [2/3] Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak >nul

echo [3/3] Starting Frontend Server...
start "Frontend - Hospital UI" cmd /k "title Frontend Server && cd frontend && echo Starting Frontend... && pnpm run dev"

echo.
echo ✅ Both services are starting!
echo.
echo 📍 URLs:
echo    Backend API:  http://localhost:5255
echo    Frontend UI:  http://localhost:3000
echo    Swagger API:  http://localhost:5255
echo.
echo Press any key to close this launcher...
pause >nul
