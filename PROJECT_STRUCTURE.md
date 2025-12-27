# 🏥 ساختار پروژه سیستم مدیریت بیمارستان

این سند توضیح می‌دهد که هر بخش از پروژه چیست و چگونه به هم متصل می‌شوند.

## 📦 اجزای اصلی پروژه

پروژه شامل سه بخش اصلی است:

### 1. 🔧 Backend (ASP.NET Core)

**مسیر:** `backend/`

**توضیحات:**

- API اصلی سیستم که با ASP.NET Core 8.0 نوشته شده است
- از Clean Architecture استفاده می‌کند
- دیتابیس: PostgreSQL
- Authentication: JWT Token
- API Documentation: Swagger/OpenAPI

**ساختار:**

```
backend/
├── HospitalSystem.Api/          # لایه API (Controllers, Middleware)
├── HospitalSystem.Application/   # لایه Application (DTOs, Interfaces)
├── HospitalSystem.Domain/        # لایه Domain (Entities, Enums)
└── HospitalSystem.Infrastructure/ # لایه Infrastructure (Data, Services, Repositories)
```

**پورت پیش‌فرض:** `http://localhost:5000`

**API Base URL:** `http://localhost:5000/api`

**Environment Variables:**

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - تنظیمات دیتابیس
- `JWT_SECRET`, `JWT_ISSUER`, `JWT_AUDIENCE`, `JWT_EXPIRE_MINUTES` - تنظیمات JWT
- `KAVENEGAR_API_KEY`, `KAVENEGAR_TEMPLATE`, `KAVENEGAR_TYPE` - تنظیمات SMS
- `REDIS_CONNECTION_STRING` - اتصال Redis (اختیاری)
- `CORS_ORIGINS` - تنظیمات CORS (اختیاری)

---

### 2. 👥 Hospital Client (سایت کاربری)

**مسیر:** `hospital-client/`

**توضیحات:**

- سایت کاربری برای بیماران
- نوشته شده با React 19 + TypeScript + Vite
- UI Framework: Tailwind CSS
- State Management: TanStack Query (React Query)
- Routing: React Router DOM

**کاربران هدف:**

- بیماران که می‌خواهند:
  - ثبت‌نام و ورود کنند
  - درخواست ویزیت، آزمایش، سونوگرافی و... ثبت کنند
  - درخواست‌های خود را رهگیری کنند
  - پروفایل خود را مدیریت کنند

**ساختار صفحات:**

```
hospital-client/src/
├── pages/
│   ├── Patient/
│   │   ├── Login.tsx          # ورود بیمار
│   │   ├── Register.tsx      # ثبت‌نام بیمار
│   │   └── Profile.tsx        # پروفایل بیمار
│   ├── Services/              # صفحات خدمات
│   └── ...
├── api/
│   ├── client.ts              # تنظیمات axios و اتصال به backend
│   └── services/              # سرویس‌های API
└── contexts/
    └── AuthContext.tsx        # مدیریت احراز هویت
```

**پورت پیش‌فرض:** `http://localhost:5173`

**Environment Variables:**

- `VITE_API_BASE_URL` - آدرس API backend (مثال: `http://localhost:5000/api`)

**اتصال به Backend:**

- از طریق `src/api/client.ts` که با axios به backend متصل می‌شود
- Base URL از `VITE_API_BASE_URL` در `.env` خوانده می‌شود
- Token احراز هویت در localStorage ذخیره می‌شود

---

### 3. 🛠️ Panel (پنل مدیریت)

**مسیر:** `panel/`

**توضیحات:**

- پنل مدیریت برای ادمین‌ها و کارمندان
- نوشته شده با React 18 + TypeScript + Vite
- UI Framework: Tailwind CSS v4 + Radix UI
- State Management: TanStack Query (React Query)
- Routing: React Router DOM

**کاربران هدف:**

- ادمین‌های سیستم که می‌خواهند:
  - بیماران، پزشکان، کلینیک‌ها را مدیریت کنند
  - خدمات و دسته‌بندی‌ها را مدیریت کنند
  - درخواست‌های خدمات را بررسی و تایید کنند
  - گزارش‌ها و آمار را مشاهده کنند

**ساختار صفحات:**

```
panel/src/
├── pages/
│   ├── admin/
│   │   ├── Home/              # داشبورد
│   │   ├── Patients/          # مدیریت بیماران
│   │   ├── Doctors/           # مدیریت پزشکان
│   │   ├── Clinics/           # مدیریت کلینیک‌ها
│   │   ├── Services/          # مدیریت خدمات
│   │   └── ...
│   ├── Login.tsx              # ورود ادمین
│   └── Register.tsx           # ثبت‌نام ادمین
├── api/
│   ├── client.ts              # تنظیمات axios و اتصال به backend
│   └── services/              # سرویس‌های API
└── contexts/
    └── AuthContext.tsx        # مدیریت احراز هویت
```

**پورت پیش‌فرض:** `http://localhost:5173` (یا پورت بعدی)

**Environment Variables:**

- `VITE_API_BASE_URL` - آدرس API backend (مثال: `http://localhost:5000/api`)

**اتصال به Backend:**

- از طریق `src/api/client.ts` که با axios به backend متصل می‌شود
- Base URL از `VITE_API_BASE_URL` در `.env` خوانده می‌شود
- Token احراز هویت در localStorage ذخیره می‌شود

---

## 🔗 نحوه اتصال Frontend ها به Backend

### 1. تنظیمات Environment Variables

هر دو frontend (hospital-client و panel) از متغیر محیطی `VITE_API_BASE_URL` استفاده می‌کنند:

**hospital-client/.env:**

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**panel/.env:**

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2. API Client Configuration

هر دو پروژه از فایل `src/api/client.ts` برای اتصال به backend استفاده می‌کنند:

```typescript
// hospital-client/src/api/client.ts
// panel/src/api/client.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL environment variable is not set.");
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

### 3. Authentication Flow

1. کاربر در frontend وارد می‌شود (Login)
2. Frontend درخواست به `/api/auth/login` یا `/api/auth/login-with-otp` می‌فرستد
3. Backend JWT Token برمی‌گرداند
4. Frontend token را در localStorage ذخیره می‌کند
5. در هر درخواست بعدی، token در header `Authorization: Bearer <token>` ارسال می‌شود

### 4. CORS Configuration

Backend در `Program.cs` تنظیم شده است که:

- در Development: همه origins را می‌پذیرد
- در Production: می‌تواند از `CORS_ORIGINS` env var استفاده کند

---

## 🚀 نحوه اجرا

### 1. اجرای Backend

```bash
cd backend
dotnet restore
dotnet run --project HospitalSystem.Api
```

Backend روی `http://localhost:5000` اجرا می‌شود.

### 2. اجرای Hospital Client

```bash
cd hospital-client
npm install  # یا pnpm install
npm run dev
```

Hospital Client روی `http://localhost:5173` اجرا می‌شود.

### 3. اجرای Panel

```bash
cd panel
pnpm install
pnpm dev
```

Panel روی `http://localhost:5173` (یا پورت بعدی) اجرا می‌شود.

---

## 📝 نکات مهم

1. **Environment Variables**: حتماً فایل‌های `.env` را در هر پروژه تنظیم کنید
2. **CORS**: در Development مشکلی نیست، اما در Production باید `CORS_ORIGINS` را تنظیم کنید
3. **Ports**: اگر هر دو frontend را همزمان اجرا می‌کنید، Vite به صورت خودکار پورت بعدی را انتخاب می‌کند
4. **Authentication**: Token در localStorage ذخیره می‌شود، پس مراقب امنیت باشید

---

## 🔍 بررسی اتصال

برای بررسی اینکه اتصال‌ها درست کار می‌کنند:

1. Backend را اجرا کنید و به `http://localhost:5000/swagger` بروید
2. Frontend را اجرا کنید و در Console مرورگر بررسی کنید که خطای CORS یا 404 ندارید
3. یک درخواست Login بزنید و ببینید که token دریافت می‌شود
4. Network tab در DevTools را بررسی کنید که درخواست‌ها به درستی ارسال می‌شوند

---

## 📚 مستندات بیشتر

- Backend API: `http://localhost:5000/swagger`
- README اصلی: `README.md`
- راهنمای استقرار: `DEPLOYMENT_GUIDE.md`
- راهنمای تست: `TESTING_GUIDE.md`
