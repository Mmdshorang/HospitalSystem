# Fix .NET Version Conflict - Hospital System
# PowerShell Script

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  🔧 FIX .NET VERSION CONFLICT" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "[1/5] Checking current .NET versions..." -ForegroundColor Cyan
Write-Host ""
dotnet --list-sdks
Write-Host ""

Write-Host "[2/5] Setting .NET 8.0 as default..." -ForegroundColor Cyan
Write-Host "Creating global.json file..."

$globalJson = @"
{
  "sdk": {
    "version": "8.0.0",
    "rollForward": "latestMinor"
  }
}
"@

$globalJson | Out-File -FilePath "global.json" -Encoding UTF8
Write-Host "✅ global.json created!" -ForegroundColor Green

Write-Host ""
Write-Host "[3/5] Cleaning NuGet cache..." -ForegroundColor Cyan
dotnet nuget locals all --clear
Write-Host "✅ NuGet cache cleared!" -ForegroundColor Green

Write-Host ""
Write-Host "[4/5] Removing old packages..." -ForegroundColor Cyan

# Remove bin and obj folders
$folders = @(
    "backend\bin",
    "backend\obj",
    "backend\HospitalSystem.Api\bin",
    "backend\HospitalSystem.Api\obj",
    "backend\HospitalSystem.Application\bin",
    "backend\HospitalSystem.Application\obj",
    "backend\HospitalSystem.Domain\bin",
    "backend\HospitalSystem.Domain\obj",
    "backend\HospitalSystem.Infrastructure\bin",
    "backend\HospitalSystem.Infrastructure\obj"
)

foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Remove-Item -Path $folder -Recurse -Force
        Write-Host "Removed: $folder" -ForegroundColor Gray
    }
}

Write-Host "✅ Old packages removed!" -ForegroundColor Green

Write-Host ""
Write-Host "[5/5] Restoring packages with .NET 8.0..." -ForegroundColor Cyan
Set-Location backend

try {
    dotnet restore --force
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Restore failed! Trying alternative method..." -ForegroundColor Red
        Write-Host ""
        Write-Host "Trying to restore with specific framework..." -ForegroundColor Yellow
        dotnet restore --framework net8.0 --force
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Still failed! Please check your .NET installation" -ForegroundColor Red
            Read-Host "Press Enter to exit"
            exit 1
        }
    }
    Write-Host "✅ Packages restored successfully!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error occurred: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  🎉 .NET VERSION CONFLICT FIXED! 🎉" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: dotnet build" -ForegroundColor White
Write-Host "2. Run: dotnet run (in HospitalSystem.Api folder)" -ForegroundColor White
Write-Host ""
Write-Host "Current .NET version being used:" -ForegroundColor Cyan
dotnet --version
Write-Host ""
Read-Host "Press Enter to exit"
