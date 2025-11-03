# دستورات Entity Framework

## ⚠️ نکته مهم

همیشه دستورات `dotnet ef` را از پوشه **HospitalSystem.Api** اجرا کنید، نه از Application!

## دستورات مفید

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

# 2. ایجاد Migration
dotnet ef migrations add MigrationName --project ../HospitalSystem.Infrastructure

# 3. اعمال به Database
dotnet ef database update --project ../HospitalSystem.Infrastructure

# 4. مشاهده لیست Migrations
dotnet ef migrations list --project ../HospitalSystem.Infrastructure

# 5. حذف آخرین Migration (اگر commit نشده)
dotnet ef migrations remove --project ../HospitalSystem.Infrastructure

## نکته: فقط یک DbContext
- تنها DbContext موجود: **ApplicationDbContext**
- فایل قدیمی `HospitalDbContext` حذف شده است
- نیازی به تعیین `--context` نیست (مگر اینکه در آینده DbContext جدیدی اضافه شود)
```
