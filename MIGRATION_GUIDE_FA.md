# 📝 راهنمای Migration - پس از تغییر در مدل‌ها

## 🎯 خلاصه سریع

پس از هر تغییر در مدل‌ها (Entities) در پوشه `backend/HospitalSystem.Domain/Entities`:

### روش 1: استفاده از اسکریپت (پیشنهادی) ⚡

```bash
# ایجاد Migration جدید و اعمال به دیتابیس
add-migration.bat AddNewFieldToUser

# یا فقط اعمال Migration های موجود
update-database.bat
```

### روش 2: دستی 🔧

```bash
cd backend/HospitalSystem.Api
dotnet ef migrations add AddNewFieldToUser --project ../HospitalSystem.Infrastructure
dotnet ef database update --project ../HospitalSystem.Infrastructure
```

---

## 📋 مراحل کامل

### مرحله 1: تغییر در مدل‌ها

مدل‌های خود را در `backend/HospitalSystem.Domain/Entities` تغییر دهید.

**مثال:**

```csharp
public class User : BaseEntity
{
    public string Email { get; set; }  // فیلد جدید
    public string PhoneNumber { get; set; }  // فیلد جدید
}
```

### مرحله 2: ایجاد Migration

```bash
# روش سریع
add-migration.bat AddUserEmailAndPhone

# یا دستی
cd backend/HospitalSystem.Api
dotnet ef migrations add AddUserEmailAndPhone --project ../HospitalSystem.Infrastructure
```

**نکته:** از نام‌های توصیفی استفاده کنید:

- ✅ `AddUserEmailField`
- ✅ `UpdatePatientTable`
- ✅ `CreateAppointmentTable`
- ❌ `Migration1`
- ❌ `Update`

### مرحله 3: بررسی Migration

فایل Migration در `backend/HospitalSystem.Infrastructure/Migrations` ایجاد می‌شود.

می‌توانید فایل را بررسی کنید تا مطمئن شوید تغییرات درست هستند.

### مرحله 4: اعمال به دیتابیس

```bash
# روش سریع
update-database.bat

# یا دستی
cd backend/HospitalSystem.Api
dotnet ef database update --project ../HospitalSystem.Infrastructure
```

---

## 🔍 دستورات مفید

### مشاهده لیست Migration ها

```bash
cd backend/HospitalSystem.Api
dotnet ef migrations list --project ../HospitalSystem.Infrastructure
```

### مشاهده SQL که اجرا می‌شود

```bash
cd backend/HospitalSystem.Api
dotnet ef migrations script --project ../HospitalSystem.Infrastructure
```

### حذف آخرین Migration (اگر commit نشده)

```bash
cd backend/HospitalSystem.Api
dotnet ef migrations remove --project ../HospitalSystem.Infrastructure
```

**⚠️ توجه:** فقط اگر Migration را commit نکرده‌اید!

---

## ❌ عیب‌یابی مشکلات رایج

### مشکل 1: "No DbContext was found"

**راه‌حل:** مطمئن شوید از پوشه `backend/HospitalSystem.Api` دستور را اجرا می‌کنید:

```bash
cd backend/HospitalSystem.Api
dotnet ef migrations add MigrationName --project ../HospitalSystem.Infrastructure
```

### مشکل 2: "Connection refused"

**راه‌حل:** PostgreSQL را راه‌اندازی کنید:

```bash
net start postgresql-x64-16
```

### مشکل 3: "password authentication failed"

**راه‌حل:** Connection String را در `appsettings.json` بررسی کنید:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=HospitalSystem;Username=postgres;Password=1234"
  }
}
```

### مشکل 4: "Migration already exists"

**راه‌حل:** از نام دیگری استفاده کنید یا Migration قبلی را حذف کنید:

```bash
dotnet ef migrations remove --project ../HospitalSystem.Infrastructure
dotnet ef migrations add NewMigrationName --project ../HospitalSystem.Infrastructure
```

---

## 📚 مثال کامل

فرض کنید می‌خواهید فیلد `Email` را به Entity `User` اضافه کنید:

### 1. تغییر مدل

```csharp
// backend/HospitalSystem.Domain/Entities/User.cs
public class User : BaseEntity
{
    public string Username { get; set; }
    public string Email { get; set; }  // ← فیلد جدید
    // ...
}
```

### 2. ایجاد Migration

```bash
add-migration.bat AddEmailToUser
```

### 3. بررسی فایل Migration

فایل `backend/HospitalSystem.Infrastructure/Migrations/YYYYMMDDHHMMSS_AddEmailToUser.cs` ایجاد می‌شود.

### 4. اعمال به دیتابیس

```bash
update-database.bat
```

### 5. بررسی نتیجه

```bash
psql -U postgres -d HospitalSystem -c "\d \"User\""
```

---

## ✅ چک‌لیست

- [ ] مدل‌ها را تغییر دادم
- [ ] Migration با نام توصیفی ایجاد کردم
- [ ] فایل Migration را بررسی کردم
- [ ] Migration را به دیتابیس اعمال کردم
- [ ] نتیجه را در دیتابیس بررسی کردم

---

## 📖 منابع بیشتر

- فایل `backend/ef-commands.md` برای دستورات کامل
- فایل `DATABASE_SETUP_GUIDE.md` برای راه‌اندازی اولیه
