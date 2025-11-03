# Migration Guide

## تنظیمات اولیه دیتابیس

### 1. پاک کردن جداول قدیمی (اگر وجود دارند)

قبل از ایجاد migration جدید، جداول قدیمی را پاک کنید:

```bash
# Windows PowerShell
psql -U postgres -d HospitalSystem -f "backend/HospitalSystem.Infrastructure/Scripts/drop_old_tables.sql"

# یا از psql مستقیم:
\i backend/HospitalSystem.Infrastructure/Scripts/drop_old_tables.sql
```

### 2. حذف Migration های قبلی (اگر وجود دارند)

اگر migration های قبلی دارید، آنها را حذف کنید:

```bash
cd backend/HospitalSystem.Api
Remove-Item -Recurse -Force "..\HospitalSystem.Infrastructure\Migrations\*"
```

### 3. ایجاد Migration جدید

از دایرکتوری `HospitalSystem.Api` این دستور را اجرا کنید:

```bash
cd backend/HospitalSystem.Api
dotnet ef migrations add InitialCreate --project ../HospitalSystem.Infrastructure --context ApplicationDbContext
```

### 4. اعمال Migration به دیتابیس

```bash
dotnet ef database update --project ../HospitalSystem.Infrastructure --context ApplicationDbContext
```

## نکات مهم

- همه جداول به صورت خودکار با EF Core ساخته می‌شوند
- ENUM types در PostgreSQL به صورت خودکار ایجاد می‌شوند
- نام جداول و ستون‌ها به صورت snake_case هستند (با استفاده از `UseSnakeCaseNamingConvention`)
- Foreign keys و indexes به صورت خودکار ایجاد می‌شوند

## بررسی دیتابیس

برای بررسی جداول ایجاد شده:

```sql
-- لیست جداول
\dt

-- لیست ENUM types
SELECT typname FROM pg_type WHERE typtype = 'e';

-- بررسی یک جدول خاص
\d "User"
```
