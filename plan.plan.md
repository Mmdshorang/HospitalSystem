<!-- d419f1fa-cc45-40de-be62-ab752c68c6ec 61280ab4-b709-4904-9773-985873ec0bf2 -->
# پیاده‌سازی کامل اتصال فرانت‌اند به بک‌اند برای CRUD کامل (نسخه بهبود یافته)

## وضعیت فعلی

### موجود در بک‌اند:

- ✅ Entities: Clinic, Insurance, Service, ServiceCategory, ServiceRequest, ProviderProfile, Specialty
- ✅ Controllers: AuthController, SpecialtiesController, ProvidersController
- ✅ Services: SpecialtyService, ProviderService, AuthService
- ✅ Infrastructure: ApplicationDbContext, Repository Pattern

### موجود در فرانت‌اند:

- ✅ صفحات اولیه: ClinicsList, InsurancesList, ServiceCategoriesList, DoctorsList
- ✅ React Query setup شده در App.tsx
- ✅ برخی Shared Components: DataTable, Layout, EmptyState, ErrorState
- ⚠️ فقط Mock Data استفاده می‌شود - اتصال به بک‌اند کامل نیست

## بهبودهای معماری

### 1. Backend - Base Classes برای کاهش تکرار

#### 1.1 BaseService<T> و IBaseService<T>

برای CRUDهای ساده (Insurance, Service, ServiceCategory):

- `GetAllAsync()`
- `GetByIdAsync(id)`
- `CreateAsync(dto)`
- `UpdateAsync(id, dto)`
- `DeleteAsync(id)`

**فایل‌ها:**

- `backend/HospitalSystem.Infrastructure/Services/Base/BaseService.cs` (ایجاد)
- `backend/HospitalSystem.Domain/Common/Interfaces/IBaseService.cs` (ایجاد)

#### 1.2 BaseController<T> 

برای controllers ساده:

- `GET /api/{resource}`
- `GET /api/{resource}/{id}`
- `POST /api/{resource}`
- `PUT /api/{resource}/{id}`
- `DELETE /api/{resource}/{id}`

**فایل:**

- `backend/HospitalSystem.Api/Controllers/Base/BaseController.cs` (ایجاد)

### 2. Backend - Controllers و Services

#### 2.1 ClinicController و ClinicService (با ادغام ClinicServices)

**Routes:**

- `GET /api/clinics` - لیست با فیلتر (نام، شهر، وضعیت)
- `GET /api/clinics/{id}` - جزئیات کلینیک
- `POST /api/clinics` - ایجاد کلینیک
- `PUT /api/clinics/{id}` - ویرایش کلینیک
- `DELETE /api/clinics/{id}` - حذف کلینیک

**خدمات کلینیک (ادغام شده در ClinicsController):**

- `GET /api/clinics/{id}/services` - خدمات کلینیک
- `POST /api/clinics/{id}/services` - افزودن خدمت به کلینیک
- `PUT /api/clinics/{id}/services/{serviceId}` - ویرایش خدمت کلینیک
- `DELETE /api/clinics/{id}/services/{serviceId}` - حذف خدمت از کلینیک

**فایل‌ها:**

- `backend/HospitalSystem.Infrastructure/Services/ClinicService.cs` (ایجاد)
- `backend/HospitalSystem.Api/Controllers/ClinicsController.cs` (ایجاد - شامل endpoints خدمات)

#### 1.2 InsuranceController و InsuranceService

- `GET /api/insurances` - لیست با فیلتر
- `GET /api/insurances/{id}`
- `POST /api/insurances`
- `PUT /api/insurances/{id}`
- `DELETE /api/insurances/{id}`

**فایل‌ها:**

- `backend/HospitalSystem.Infrastructure/Services/InsuranceService.cs` (ایجاد)
- `backend/HospitalSystem.Api/Controllers/InsurancesController.cs` (ایجاد)

#### 1.3 ServiceCategoryController و ServiceService

- `GET /api/service-categories` - لیست دسته‌بندی‌ها
- `GET /api/service-categories/{id}`
- `POST /api/service-categories`
- `PUT /api/service-categories/{id}`
- `DELETE /api/service-categories/{id}`
- `GET /api/services` - لیست خدمات با فیلتر (دسته‌بندی، نام)
- `GET /api/services/{id}`
- `POST /api/services`
- `PUT /api/services/{id}`
- `DELETE /api/services/{id}`

**فایل‌ها:**

- `backend/HospitalSystem.Infrastructure/Services/ServiceCategoryService.cs` (ایجاد)
- `backend/HospitalSystem.Infrastructure/Services/ServiceService.cs` (ایجاد)
- `backend/HospitalSystem.Api/Controllers/ServiceCategoriesController.cs` (ایجاد)
- `backend/HospitalSystem.Api/Controllers/ServicesController.cs` (ایجاد)

#### 1.4 ServiceRequestController (نوبت‌ها)

- `GET /api/service-requests` - لیست با فیلتر (وضعیت، کلینیک، بیمار، تاریخ) و pagination
- `GET /api/service-requests/{id}` - جزئیات نوبت
- `POST /api/service-requests` - ایجاد نوبت
- `PUT /api/service-requests/{id}` - ویرایش نوبت
- `PATCH /api/service-requests/{id}/status` - تغییر وضعیت
- `GET /api/service-requests/{id}/history` - تاریخچه تغییرات (از AuditLog)
- `POST /api/service-requests/{id}/performer` - تعیین انجام‌دهنده

**فایل‌ها:**

- `backend/HospitalSystem.Infrastructure/Services/ServiceRequestService.cs` (ایجاد)
- `backend/HospitalSystem.Api/Controllers/ServiceRequestsController.cs` (ایجاد)

#### 1.5 ثبت Services در Program.cs

- افزودن کل سرویس‌های جدید به DI container

### 2. Frontend - اتصال به Backend

#### 2.1 به‌روزرسانی API Services

**فایل‌های موجود که باید به‌روزرسانی شوند:**

- `frontend/src/api/services/clinicService.ts` - حذف mock، اتصال واقعی
- `frontend/src/api/services/insuranceService.ts` - حذف mock، اتصال واقعی
- `frontend/src/api/services/serviceCategoryService.ts` - حذف mock، اتصال واقعی
- `frontend/src/api/services/providerService.ts` - بررسی و تکمیل
- `frontend/src/api/services/specialtyService.ts` - بررسی و تکمیل

**فایل‌های جدید:**

- `frontend/src/api/services/serviceService.ts` - برای مدیریت خدمات
- `frontend/src/api/services/clinicServiceService.ts` - برای خدمات کلینیک
- `frontend/src/api/services/serviceRequestService.ts` - برای نوبت‌ها

#### 2.2 صفحات موجود - تکمیل و اتصال

**Clinics:**

- `frontend/src/pages/admin/Clinics/ClinicsList.tsx` - اتصال به API واقعی
- `frontend/src/pages/admin/Clinics/ClinicFormDialog.tsx` - تکمیل CRUD

**Insurances:**

- `frontend/src/pages/admin/Insurances/InsurancesList.tsx` - اتصال به API واقعی
- `frontend/src/pages/admin/Insurances/InsuranceFormDialog.tsx` - تکمیل CRUD

**ServiceCategories:**

- `frontend/src/pages/admin/ServiceCategories/ServiceCategoriesList.tsx` - اتصال به API واقعی
- `frontend/src/pages/admin/ServiceCategories/ServiceCategoryFormDialog.tsx` - تکمیل CRUD

**Services (صفحه جدید):**

- `frontend/src/pages/admin/Services/ServicesList.tsx` (ایجاد)
- `frontend/src/pages/admin/Services/ServiceFormDialog.tsx` (ایجاد)

**ClinicServices (صفحه جدید):**

- `frontend/src/pages/admin/ClinicServices/ClinicServicesList.tsx` (ایجاد) - نمایش و مدیریت خدمات هر کلینیک
- `frontend/src/pages/admin/ClinicServices/AddClinicServiceDialog.tsx` (ایجاد)

#### 2.3 صفحه نوبت‌ها (ServiceRequests/Appointments)

**صفحه اصلی:**

- `frontend/src/pages/admin/Appointments/AppointmentsList.tsx` (ایجاد مجدد)
- جدول کامل با ستون‌های: بیمار، کلینیک، خدمت، انجام‌دهنده، تاریخ/زمان، وضعیت، قیمت
- فیلترها: وضعیت، کلینیک، بیمار، بازه تاریخ
- Pagination
- جستجو
- دکمه تغییر وضعیت
- مشاهده جزئیات
- تاریخچه تغییرات

**کامپوننت‌های مرتبط:**

- `frontend/src/pages/admin/Appointments/AppointmentFormDialog.tsx` - ایجاد/ویرایش نوبت
- `frontend/src/pages/admin/Appointments/ChangeStatusDialog.tsx` - تغییر وضعیت
- `frontend/src/pages/admin/Appointments/AppointmentHistoryDialog.tsx` - تاریخچه
- `frontend/src/pages/admin/Appointments/AssignPerformerDialog.tsx` - تعیین انجام‌دهنده

#### 2.4 Routing و Navigation

- افزودن route برای صفحات جدید
- به‌روزرسانی منوی ادمین

### 3. Type Definitions

**Backend DTOs:**

- بررسی DTOs موجود در `backend/HospitalSystem.Application/DTOs/`
- ایجاد DTOs جدید در صورت نیاز

**Frontend Types:**

- همگام‌سازی TypeScript interfaces با DTOs بک‌اند
- `frontend/src/api/services/*Service.ts` - به‌روزرسانی interfaces

### 4. Validation و Error Handling

**Backend:**

- FluentValidation validators برای DTOs جدید

**Frontend:**

- Error handling در API calls
- Toast notifications برای موفقیت/خطا
- Loading states

## ساختار پیاده‌سازی

### Phase 1: Backend Services و Controllers

1. ClinicService + ClinicsController
2. InsuranceService + InsurancesController
3. ServiceCategoryService + ServiceCategoriesController
4. ServiceService + ServicesController
5. ServiceRequestService + ServiceRequestsController
6. ClinicServicesController
7. ثبت تمام services در Program.cs

### Phase 2: Frontend API Services

1. به‌روزرسانی service files موجود
2. ایجاد service files جدید
3. Type definitions

### Phase 3: Frontend Pages

1. تکمیل صفحات موجود (Clinics, Insurances, ServiceCategories)
2. ایجاد صفحه Services
3. ایجاد صفحه ClinicServices
4. ایجاد صفحه Appointments کامل

### Phase 4: Integration و Testing

1. تست اتصال فرانت به بک‌اند
2. تست CRUD operations
3. تست فیلترها و pagination
4. تست تغییر وضعیت نوبت‌ها

## تصمیم‌گیری‌ها

1. **انجام‌دهنده‌ها**: از `PerformedByUserId` در ServiceRequest استفاده می‌شود که به User (ProviderProfile) اشاره می‌کند.

2. **خدمات کلینیک**: مدیریت کامل (افزودن/حذف/ویرایش) با استفاده از ClinicService entity موجود.

3. **تاریخچه نوبت‌ها**: از AuditLog موجود استفاده می‌شود برای ردیابی تغییرات.

4. **Pagination**: استاندارد با query parameters: `page`, `pageSize`, `sortBy`, `sortDirection`.

5. **فیلترها**: Query parameters برای فیلتر کردن نتایج.

### To-dos

- [ ] ایجاد ClinicService و ClinicsController با CRUD کامل + مدیریت خدمات کلینیک
- [ ] ایجاد InsuranceService و InsurancesController با CRUD کامل
- [ ] ایجاد ServiceCategoryService و ServiceCategoriesController با CRUD کامل
- [ ] ایجاد ServiceService و ServicesController با CRUD کامل
- [ ] ایجاد ServiceRequestService و ServiceRequestsController با CRUD + فیلتر + pagination + تغییر وضعیت
- [ ] ایجاد ClinicServicesController برای مدیریت خدمات کلینیک
- [ ] ثبت تمام services جدید در Program.cs (DI container)
- [ ] به‌روزرسانی و ایجاد تمام API service files در frontend (حذف mock data)
- [ ] اتصال صفحه ClinicsList و ClinicFormDialog به API واقعی
- [ ] اتصال صفحه InsurancesList و InsuranceFormDialog به API واقعی
- [ ] اتصال صفحه ServiceCategoriesList و ServiceCategoryFormDialog به API واقعی
- [ ] ایجاد صفحه ServicesList و ServiceFormDialog کامل
- [ ] ایجاد صفحه ClinicServicesList برای مدیریت خدمات هر کلینیک
- [ ] ایجاد صفحه AppointmentsList کامل با جدول، فیلتر، pagination و تغییر وضعیت
- [ ] افزودن routes برای صفحات جدید و به‌روزرسانی navigation
- [ ] ایجاد ClinicService و ClinicsController با CRUD کامل + مدیریت خدمات کلینیک