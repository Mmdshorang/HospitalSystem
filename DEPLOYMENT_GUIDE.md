# 🏥 Hospital System - Deployment Guide

## 📋 Prerequisites (پیش‌نیازها)

### 1. نصب نرم‌افزارهای مورد نیاز:

```bash
# .NET 8.0 SDK
# دانلود از: https://dotnet.microsoft.com/download/dotnet/8.0

# Node.js 20+ (برای frontend)
# دانلود از: https://nodejs.org/

# PostgreSQL (اختیاری - می‌توانید از Docker استفاده کنید)
# دانلود از: https://www.postgresql.org/download/

# Docker Desktop (پیشنهادی)
# دانلود از: https://www.docker.com/products/docker-desktop/

# Git
# دانلود از: https://git-scm.com/
```

### 2. بررسی نصب:

```bash
# بررسی .NET
dotnet --version

# بررسی Node.js
node --version

# بررسی Docker
docker --version
docker-compose --version
```

## 🚀 روش 1: Deploy با Docker (پیشنهادی)

### مرحله 1: کلون کردن پروژه
```bash
git clone <repository-url>
cd hospital-system
```

### مرحله 2: اجرای کامل با Docker
```bash
# اجرای کامل سیستم
docker-compose up -d

# یا استفاده از npm script
npm run docker:up
```

### مرحله 3: بررسی وضعیت
```bash
# مشاهده logs
docker-compose logs -f

# یا
npm run docker:logs

# بررسی containers
docker ps
```

### مرحله 4: دسترسی به سرویس‌ها
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Swagger**: http://localhost:5000
- **Database**: localhost:5432

## 🛠️ روش 2: Deploy دستی (بدون Docker)

### مرحله 1: کلون و Setup
```bash
git clone <repository-url>
cd hospital-system

# اجرای setup اولیه
npm run setup
```

### مرحله 2: تنظیم Database

#### گزینه A: استفاده از Docker برای Database
```bash
# فقط PostgreSQL و Redis
docker run -d --name hospital-postgres \
  -e POSTGRES_DB=HospitalSystem \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15-alpine

docker run -d --name hospital-redis \
  -p 6379:6379 \
  redis:7-alpine
```

#### گزینه B: نصب PostgreSQL روی سیستم
```sql
-- ایجاد دیتابیس
CREATE DATABASE "HospitalSystem";
```

### مرحله 3: تنظیم Backend
```bash
# حل مشکل .NET version (اگر .NET 9 هم نصب است)
npm run fix:dotnet

# یا دستی
fix-dotnet-version.bat

# Restore packages
cd backend
dotnet restore

# ایجاد Migration
cd HospitalSystem.Api
dotnet ef migrations add InitialCreate

# اعمال Migration
dotnet ef database update
```

### مرحله 4: تنظیم Frontend
```bash
# نصب dependencies
cd frontend
pnpm install

# یا
npm install
```

### مرحله 5: اجرای پروژه
```bash
# اجرای کامل
npm start

# یا اجرای جداگانه
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend
npm run frontend
```

## 🔧 حل مشکلات رایج

### مشکل 1: .NET Version Conflict
```bash
# اجرای script حل مشکل
npm run fix:dotnet

# یا دستی
fix-dotnet-version.bat
```

### مشکل 2: Database Connection
```bash
# بررسی connection string در:
# backend/HospitalSystem.Api/appsettings.json

# تست connection
cd backend/HospitalSystem.Api
dotnet ef database update
```

### مشکل 3: Frontend Build Error
```bash
# پاک کردن cache
cd frontend
rm -rf node_modules
rm pnpm-lock.yaml

# نصب مجدد
pnpm install
```

### مشکل 4: Docker Build Error
```bash
# Rebuild کامل
npm run docker:rebuild

# یا دستی
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### مشکل 5: Frontend Build Error (Rollup)
```bash
# حل مشکل rollup
npm run fix:frontend

# یا دستی
cd frontend
rm -rf node_modules
npm install
npm run build
```

## 📝 دستورات مفید

### Docker Commands
```bash
# اجرای Docker
npm run docker:up

# متوقف کردن
npm run docker:down

# Rebuild
npm run docker:rebuild

# مشاهده logs
npm run docker:logs

# Production
npm run docker:prod
```

### Development Commands
```bash
# اجرای کامل
npm start

# فقط Backend
npm run backend

# فقط Frontend
npm run frontend

# Build
npm run build:backend
npm run build:frontend

# Test
npm run test:frontend
```

### Database Commands
```bash
# Migration جدید
npm run migration:add MigrationName

# اعمال Migration
npm run migrate

# Setup Database
npm run setup:database
```

## 🌐 Environment Variables

### Backend (.env یا appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=HospitalSystem;Username=postgres;Password=password",
    "Redis": "localhost:6379"
  },
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "HospitalSystem",
    "Audience": "HospitalSystemUsers",
    "ExpiryInMinutes": 60
  }
}
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000
```

## 🔒 Production Deployment

### 1. تنظیمات Production
```bash
# استفاده از docker-compose.prod.yml
npm run docker:prod
```

### 2. Environment Variables
```bash
# تنظیم password برای production
export POSTGRES_PASSWORD=your_secure_password
```

### 3. Security
- تغییر JWT Secret Key
- استفاده از HTTPS
- تنظیم Firewall
- Backup Database

## 📊 Monitoring

### Health Checks
- **Backend**: http://localhost:5000/health
- **Database**: بررسی connection
- **Redis**: بررسی cache

### Logs
```bash
# Docker logs
docker-compose logs -f

# Backend logs
tail -f backend/logs/hospital-system-*.txt
```

## 🆘 Troubleshooting

### اگر پروژه بالا نمی‌آید:
1. بررسی Prerequisites
2. اجرای `npm run fix:dotnet`
3. بررسی Database connection
4. اجرای `npm run docker:rebuild`

### اگر Database مشکل دارد:
1. بررسی PostgreSQL running
2. بررسی connection string
3. اجرای Migration مجدد

### اگر Frontend مشکل دارد:
1. بررسی Node.js version (20+)
2. پاک کردن node_modules
3. نصب مجدد dependencies

## 📞 Support

اگر مشکلی پیش آمد:
1. بررسی logs
2. اجرای health checks
3. بررسی این راهنما
4. تماس با تیم توسعه

---

**نکته**: برای production، حتماً از Docker استفاده کنید و environment variables را به درستی تنظیم کنید.
