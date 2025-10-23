# راهنمای نصب دیتابیس - سیستم بیمارستانی

## برای سیستم‌های جدید (اولین بار)

### مرحله 1: نصب PostgreSQL

#### Windows:
1. برو به https://www.postgresql.org/download/windows/
2. PostgreSQL 16 را دانلود کن
3. نصب کن با تنظیمات زیر:
   - **Password**: `password`
   - **Port**: `5432`
   - **Username**: `postgres`

#### یا با Chocolatey:
```bash
choco install postgresql
```

#### یا با Winget:
```bash
winget install PostgreSQL.PostgreSQL
```

### مرحله 2: راه‌اندازی دیتابیس

```bash
# اجرای اسکریپت خودکار
npm run setup:database:first-time

# یا دستی:
setup-database-first-time.bat
```

### مرحله 3: بررسی اتصال

```bash
# تست اتصال
psql -U postgres -d HospitalSystem -c "SELECT version();"
```

## برای سیستم‌های موجود

```bash
# فقط migration
npm run setup:database

# یا
setup-database.bat
```

## عیب‌یابی مشکلات رایج

### مشکل 1: "psql is not recognized"
**راه‌حل**: PostgreSQL نصب نشده یا PATH تنظیم نشده
```bash
# بررسی نصب
where psql
# اگر پیدا نشد، PostgreSQL را دوباره نصب کن
```

### مشکل 2: "password authentication failed"
**راه‌حل**: رمز عبور اشتباه
```bash
# تغییر رمز عبور
psql -U postgres
ALTER USER postgres PASSWORD 'password';
```

### مشکل 3: "database does not exist"
**راه‌حل**: دیتابیس ایجاد نشده
```bash
# ایجاد دیتابیس
psql -U postgres -c "CREATE DATABASE \"HospitalSystem\";"
```

### مشکل 4: "connection refused"
**راه‌حل**: سرویس PostgreSQL اجرا نشده
```bash
# Windows
net start postgresql-x64-16

# یا از Services.msc
```

## تنظیمات Connection String

در `backend/HospitalSystem.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=HospitalSystem;Username=postgres;Password=password"
  }
}
```

## دستورات مفید

```bash
# شروع سرویس PostgreSQL
net start postgresql-x64-16

# توقف سرویس PostgreSQL  
net stop postgresql-x64-16

# اتصال به دیتابیس
psql -U postgres -d HospitalSystem

# مشاهده جداول
\dt

# خروج از psql
\q
```

## پورت‌های مورد نیاز

- **PostgreSQL**: 5432
- **Redis**: 6379 (اختیاری)
- **Backend API**: 5000
- **Frontend**: 3000
