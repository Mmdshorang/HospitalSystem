@echo off
title Rebuild Docker Images - Hospital System
color 0B

echo.
echo ========================================
echo  🔄 REBUILD DOCKER IMAGES
echo ========================================
echo.

echo [1/4] Stopping existing containers...
docker-compose down
echo ✅ Containers stopped!

echo.
echo [2/4] Removing old images...
docker image prune -f
docker system prune -f
echo ✅ Old images removed!

echo.
echo [3/4] Building new images...
docker-compose build --no-cache
if %errorlevel% neq 0 (
    echo ❌ Build failed! Check the logs above
    pause
    exit /b 1
)
echo ✅ Images built successfully!

echo.
echo [4/4] Starting containers...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ❌ Failed to start containers!
    pause
    exit /b 1
)
echo ✅ Containers started successfully!

echo.
echo ========================================
echo  🎉 DOCKER REBUILD COMPLETED! 🎉
echo ========================================
echo.
echo Services are running:
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:3000
echo - Database: localhost:5432
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
echo.
echo Press any key to exit...
pause
