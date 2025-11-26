<!-- 61eda0ad-a66e-4da0-8e4e-cd60662da922 582d489c-5210-4b5a-b2d0-81e609332a64 -->
# فاز 1: لاگین OTP و پنل ادمین با طراحی مدرن

## تغییرات بک‌اند (حداقل برای پشتیبانی از OTP)

### 1. اضافه کردن Role جدید

- **فایل**: `backend/HospitalSystem.Domain/Entities/Enums/UserRole.cs`
- اضافه کردن `manager` به enum

### 2. ایجاد Entity برای OTP

- **فایل جدید**: `backend/HospitalSystem.Domain/Entities/OtpVerification.cs`
- فیلدها: Phone, Code, ExpiresAt, IsUsed, CreatedAt

### 3. ایجاد Interface برای سرویس OTP

- **فایل جدید**: `backend/HospitalSystem.Domain/Common/Interfaces/IOtpService.cs`
- متدهای: `SendOtpAsync(string phone, string code)`, `VerifyOtpAsync(string phone, string code)`
- این interface برای جداسازی منطق ارسال OTP از AuthService است

### 4. پیاده‌سازی Mock OTP Service

- **فایل جدید**: `backend/HospitalSystem.Infrastructure/Services/MockOtpService.cs`
- پیاده‌سازی `IOtpService` با mock (چاپ در console/log)
- برای استفاده در development و تست
- بعداً می‌تواند با `SmsIrOtpService` جایگزین شود

### 5. پیاده‌سازی SMS.ir OTP Service (برای آینده)

- **فایل جدید**: `backend/HospitalSystem.Infrastructure/Services/SmsIrOtpService.cs`
- پیاده‌سازی `IOtpService` با اتصال به SMS.ir
- اضافه کردن configuration برای API key و تنظیمات SMS.ir در `appsettings.json`
- **نکته**: این فایل را ایجاد می‌کنیم اما فعلاً استفاده نمی‌شود

### 6. تغییر AuthService برای پشتیبانی از OTP

- **فایل**: `backend/HospitalSystem.Infrastructure/Services/AuthService.cs`
- متدهای جدید: `SendOtpAsync`, `VerifyOtpAsync`, `LoginWithOtpAsync`
- استفاده از `IOtpService` (dependency injection)
- در `Program.cs` فعلاً `MockOtpService` را register می‌کنیم

### 7. تغییر AuthController

- **فایل**: `backend/HospitalSystem.Api/Controllers/AuthController.cs`
- اضافه کردن endpoint های: `/api/auth/send-otp`, `/api/auth/verify-otp`

### 8. تنظیمات Configuration

- **فایل**: `backend/HospitalSystem.Api/appsettings.json`
- اضافه کردن section `OtpSettings` برای تنظیمات آینده SMS.ir (فعلاً optional)

## تغییرات فرانت‌اند - طراحی UI/UX جدید و مدرن

### 1. طراحی سیستم Design System

- **کامپوننت‌های جدید UI**: 
- `frontend/src/components/ui/otp-input.tsx` - کامپوننت OTP با طراحی مدرن
- `frontend/src/components/ui/phone-input.tsx` - ورودی شماره موبایل با اعتبارسنجی
- بهبود کامپوننت‌های موجود: card, table, badge, tabs, select
- **استایل‌های جدید**: استفاده از gradient، shadow، animation های smooth

### 2. صفحه لاگین جدید با طراحی مدرن

- **فایل**: `frontend/src/pages/Login.tsx` (بازنویسی کامل)
- طراحی دو ستونی: تصویر/گرافیک در سمت راست، فرم در سمت چپ
- انیمیشن‌های ورود و خروج
- فیلد شماره موبایل با اعتبارسنجی و فرمت خودکار
- کامپوننت OTP با طراحی مدرن (6 خانه با انیمیشن)
- نمایش countdown برای ارسال مجدد OTP
- طراحی responsive و mobile-first

### 3. تغییر AuthContext

- **فایل**: `frontend/src/contexts/AuthContext.tsx`
- اضافه کردن متدهای `sendOtp`, `verifyOtp`, `loginWithOtp`
- مدیریت state برای مرحله لاگین (شماره موبایل / OTP)

### 4. تغییر AuthService API

- **فایل**: `frontend/src/api/services/authService.ts`
- اضافه کردن متدهای `sendOtp`, `verifyOtp`, `loginWithOtp`

### 5. پنل ادمین - مدیریت کلنیک‌ها (طراحی جدید)

- **صفحه اصلی**: `frontend/src/pages/admin/Clinics/ClinicsList.tsx`
- Header با آمار و دکمه افزودن
- جدول مدرن با search، filter، pagination
- کارت‌های کلنیک با تصویر، آدرس، وضعیت
- Action buttons با icon های lucide-react
- **کامپوننت افزودن/ویرایش**: `frontend/src/pages/admin/Clinics/ClinicFormDialog.tsx`
- فرم چند مرحله‌ای (اطلاعات اصلی، آدرس، ساعات کاری، بیمه‌ها)
- استفاده از Tabs برای سازماندهی
- Preview تصویر لوگو
- انتخاب مدیر از لیست کاربران
- **سرویس API**: `frontend/src/api/services/clinicService.ts`

### 6. پنل ادمین - مدیریت بیمه‌ها (طراحی جدید)

- **صفحه اصلی**: `frontend/src/pages/admin/Insurances/InsurancesList.tsx`
- Grid layout با کارت‌های بیمه
- نمایش درصد پوشش با progress bar
- فیلتر بر اساس وضعیت فعال/غیرفعال
- Search با highlight نتایج
- **کامپوننت افزودن/ویرایش**: `frontend/src/pages/admin/Insurances/InsuranceFormDialog.tsx`
- فرم ساده و تمیز
- Slider برای درصد پوشش
- Toggle برای وضعیت فعال
- **سرویس API**: `frontend/src/api/services/insuranceService.ts`

### 7. پنل ادمین - مدیریت دسته‌بندی خدمات (طراحی جدید)

- **صفحه اصلی**: `frontend/src/pages/admin/ServiceCategories/ServiceCategoriesList.tsx`
- Tree view برای دسته‌بندی‌های تودرتو (اگر نیاز باشد)
- لیست با drag & drop برای مرتب‌سازی
- نمایش تعداد خدمات هر دسته
- Badge برای دسته‌های فعال
- **کامپوننت افزودن/ویرایش**: `frontend/src/pages/admin/ServiceCategories/ServiceCategoryFormDialog.tsx`
- فرم با icon picker
- انتخاب دسته والد (اگر تودرتو باشد)
- **سرویس API**: `frontend/src/api/services/serviceCategoryService.ts`

### 8. پنل ادمین - ثبت پزشک و پرسنل (طراحی جدید)

- **صفحه اصلی**: `frontend/src/pages/admin/Doctors/DoctorsList.tsx` (بازنویسی)
- Tab برای تفکیک پزشک/پرسنل
- فیلتر پیشرفته (تخصص، وضعیت، تاریخ)
- کارت‌های پزشک با تصویر، تخصص، کلنیک
- نمایش وضعیت تایید با badge رنگی
- **کامپوننت افزودن/ویرایش**: `frontend/src/pages/admin/Doctors/DoctorFormDialog.tsx`
- فرم چند مرحله‌ای (اطلاعات شخصی، تخصص، کلنیک، مدارک)
- آپلود تصویر پروفایل
- انتخاب تخصص از dropdown با search
- انتخاب کلنیک
- **سرویس API**: به‌روزرسانی `frontend/src/api/services/doctorService.ts`

### 9. Layout و Sidebar جدید

- **فایل**: `frontend/src/components/Layout.tsx` (بازنویسی)
- Sidebar مدرن با icon های lucide-react
- Collapsible sidebar
- Active state برای منوها
- User menu در header
- Breadcrumb navigation
- Dark mode toggle (اختیاری)

### 10. Dashboard ادمین (بهبود)

- **فایل**: `frontend/src/pages/admin/Home/Home.tsx`
- Grid layout با کارت‌های آماری
- Chart های زیبا برای آمار
- Quick actions با hover effects
- Recent activities با timeline design

### 11. به‌روزرسانی Routing

- **فایل**: `frontend/src/App.tsx`
- اضافه کردن route های جدید برای صفحات ادمین
- Protected routes با role-based access

### 12. کامپوننت‌های مشترک

- **Loading states**: Skeleton loaders برای صفحات
- **Empty states**: طراحی زیبا برای حالت‌های خالی
- **Error states**: نمایش خطا با طراحی کاربرپسند
- **Toast notifications**: بهبود طراحی toast ها

## وابستگی‌ها و پکیج‌ها

### بک‌اند

- فعلاً نیازی به پکیج اضافی نیست (استفاده از MockOtpService)
- برای آینده: نصب پکیج SMS.ir SDK یا استفاده از HTTP client برای API
- اضافه کردن configuration در `appsettings.json` برای SMS.ir (فعلاً optional)

### فرانت‌اند

- پکیج `input-otp` از قبل نصب شده است
- استفاده از `lucide-react` برای icon ها
- استفاده از `framer-motion` برای animation (اختیاری)

## ترتیب پیاده‌سازی

1. تغییرات بک‌اند (Role، Entity OTP، Interface، MockOtpService، SmsIrOtpService، AuthService، AuthController)
2. طراحی Design System و کامپوننت‌های UI پایه
3. صفحه لاگین جدید با OTP
4. Layout و Sidebar جدید
5. پنل ادمین (کلنیک‌ها، بیمه‌ها، دسته‌بندی خدمات)
6. به‌روزرسانی ثبت پزشک/پرسنل
7. Dashboard و کامپوننت‌های مشترک

## نکات مهم

- MockOtpService برای development استفاده می‌شود و OTP را در log چاپ می‌کند
- برای production، فقط کافی است در `Program.cs` به جای `MockOtpService`، `SmsIrOtpService` را register کنید
- Configuration SMS.ir در `appsettings.json` اضافه می‌شود اما فعلاً استفاده نمی‌شود

### To-dos

- [ ] اضافه کردن role manager به UserRole enum
- [ ] ایجاد entity OtpVerification برای ذخیره OTP
- [ ] پیاده‌سازی سرویس ارسال OTP با SMS.ir در AuthService
- [ ] اضافه کردن endpoint های send-otp و verify-otp به AuthController
- [ ] تغییر صفحه Login برای استفاده از شماره موبایل و OTP
- [ ] به‌روزرسانی AuthContext برای پشتیبانی از OTP
- [ ] اضافه کردن متدهای sendOtp و verifyOtp به authService
- [ ] ایجاد صفحه و کامپوننت‌های مدیریت کلنیک‌ها
- [ ] ایجاد صفحه و کامپوننت‌های مدیریت بیمه‌ها
- [ ] ایجاد صفحه و کامپوننت‌های مدیریت دسته‌بندی خدمات
- [ ] به‌روزرسانی صفحه ثبت پزشک/پرسنل
- [ ] به‌روزرسانی منو و routing برای صفحات جدید