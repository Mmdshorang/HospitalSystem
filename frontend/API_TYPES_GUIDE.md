# API Types Generation Guide

این راهنما توضیح می‌دهد که چگونه تایپ‌های TypeScript از OpenAPI schema تولید می‌شوند.

## فرآیند تولید تایپ‌ها

### 1. اجرای Backend
ابتدا backend را اجرا کنید:
```bash
cd backend
dotnet run
```

### 2. تولید تایپ‌ها
پس از اجرای backend، تایپ‌ها را تولید کنید:
```bash
cd frontend
npm run gen:types
```

### 3. استفاده از تایپ‌ها
تایپ‌های تولید شده در `src/api/generated-types.ts` قرار دارند و می‌توانید آن‌ها را در سرویس‌ها استفاده کنید:

```typescript
import { LoginRequest, AuthResponse, UserInfo } from '../api/generated-types';
```

## فایل‌های مرتبط

- `scripts/generate-types.js` - اسکریپت تولید تایپ‌ها
- `src/api/generated-types.ts` - تایپ‌های تولید شده
- `src/api/services/` - سرویس‌هایی که از تایپ‌ها استفاده می‌کنند

## نکات مهم

1. **همگام‌سازی**: هر بار که backend DTO ها تغییر می‌کنند، تایپ‌ها را دوباره تولید کنید
2. **نسخه‌گیری**: فایل `generated-types.ts` نباید در git commit شود (در .gitignore قرار دهید)
3. **تست**: پس از تولید تایپ‌ها، حتماً frontend را تست کنید

## عیب‌یابی

اگر خطای اتصال دریافت کردید:
- مطمئن شوید backend روی پورت 5000 اجرا می‌شود
- بررسی کنید که Swagger UI در دسترس است: http://localhost:5000
- لاگ‌های backend را بررسی کنید
