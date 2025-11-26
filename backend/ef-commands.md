# دستورات Entity Framework

## ⚠️ نکته مهم

همیشه دستورات `dotnet ef` را از پوشه **HospitalSystem.Api** اجرا کنید، نه از Application!

## 🔄 پس از تغییر در مدل‌ها (Entities)

### روش سریع (استفاده از اسکریپت):

```bash
# ایجاد Migration جدید و اعمال به دیتابیس
add-migration.bat AddNewFieldToUser

# یا فقط اعمال Migration های موجود
update-database.bat
```

### روش دستی:

```bash
# 1. رفتن به پوشه API
cd backend/HospitalSystem.Api

# 2. ایجاد Migration جدید (با نام توصیفی)
dotnet ef migrations add AddNewFieldToUser --project ../HospitalSystem.Infrastructure

# 3. اعمال به Database
dotnet ef database update --project ../HospitalSystem.Infrastructure
```

## 📋 دستورات مفید

### اجرای از پوشه API (توصیه می‌شود):

```bash
cd backend/HospitalSystem.Api
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### یا با تعیین startup project:

```bash
cd backend/HospitalSystem.Application
dotnet ef migrations add InitialCreate --startup-project ../HospitalSystem.Api
dotnet ef database update --startup-project ../HospitalSystem.Api
```

## چرا؟

- `dotnet ef` نیاز به یک **startup project** دارد که `Microsoft.EntityFrameworkCore.Design` را داشته باشد
- **HospitalSystem.Api** این پکیج را دارد
- **HospitalSystem.Application** این پکیج را ندارد (و نباید داشته باشد)
- فقط یک **DbContext** در پروژه وجود دارد: `ApplicationDbContext`

## دستورات کامل

```bash
# 1. رفتن به پوشه API
cd backend/HospitalSystem.Api

# 2. ایجاد Migration (با نام توصیفی)
dotnet ef migrations add MigrationName --project ../HospitalSystem.Infrastructure
# مثال: dotnet ef migrations add AddUserEmailField --project ../HospitalSystem.Infrastructure

# 3. اعمال به Database
dotnet ef database update --project ../HospitalSystem.Infrastructure

# 4. مشاهده لیست Migrations
dotnet ef migrations list --project ../HospitalSystem.Infrastructure

# 5. حذف آخرین Migration (اگر commit نشده)
dotnet ef migrations remove --project ../HospitalSystem.Infrastructure

# 6. مشاهده SQL که اجرا می‌شود (بدون اعمال)
dotnet ef migrations script --project ../HospitalSystem.Infrastructure

# 7. مشاهده SQL بین دو Migration
dotnet ef migrations script FromMigration ToMigration --project ../HospitalSystem.Infrastructure
```

## 📝 نکات مهم

### نام‌گذاری Migration ها:
- از نام‌های توصیفی استفاده کنید
- مثال‌های خوب:
  - `AddUserEmailField`
  - `UpdatePatientTable`
  - `CreateAppointmentTable`
  - `AddIndexToUserEmail`

### نکته: فقط یک DbContext
- تنها DbContext موجود: **ApplicationDbContext**
- فایل قدیمی `HospitalDbContext` حذف شده است
- نیازی به تعیین `--context` نیست (مگر اینکه در آینده DbContext جدیدی اضافه شود)

## 🔍 عیب‌یابی

### اگر Migration ایجاد نشد:
1. بررسی کنید که مدل‌ها در `HospitalSystem.Domain/Entities` تغییر کرده‌اند
2. بررسی کنید که `ApplicationDbContext` به‌روزرسانی شده باشد
3. بررسی Connection String در `appsettings.json`

### اگر Database Update شکست خورد:
1. بررسی کنید PostgreSQL در حال اجرا است
2. بررسی کنید دیتابیس `HospitalSystem` وجود دارد
3. Migration فایل‌ها را بررسی کنید برای خطاهای SQL
