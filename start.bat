@echo off
echo Starting Hospital System...
echo.

echo Starting Backend (ASP.NET Core)...
start "Backend" cmd /k "cd backend\HospitalSystem.Api && dotnet run"

timeout /t 3 /nobreak >nul

echo Starting Frontend (React + Vite)...
start "Frontend" cmd /k "cd frontend && pnpm run dev"

echo.
echo Both services are starting...
echo Backend will be available at: http://localhost:5255
echo Frontend will be available at: http://localhost:3000 (or next available port)
echo.
echo Press any key to exit...
pause >nul
