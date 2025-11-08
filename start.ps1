Write-Host "Starting Hospital System..." -ForegroundColor Green
Write-Host ""

Write-Host "Starting Backend (ASP.NET Core)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend\HospitalSystem.Api; dotnet run"

Start-Sleep -Seconds 3

Write-Host "Starting Frontend (React + Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; pnpm run dev"

Write-Host ""
Write-Host "Both services are starting..." -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://localhost:3000 (or next available port)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
