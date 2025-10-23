# 🚀 Quick Start - Hospital System

## ⚡ سریع‌ترین راه برای اجرای پروژه

### 1️⃣ کلون کردن پروژه
```bash
git clone <repository-url>
cd hospital-system
```

### 2️⃣ اجرای Quick Deploy
```bash
# Windows
npm run deploy

# یا مستقیماً
quick-deploy.bat
```

### 3️⃣ انتخاب روش Deploy
- **گزینه 1**: Docker (پیشنهادی - آسان)
- **گزینه 2**: Manual Setup (پیشرفته)
- **گزینه 3**: بررسی Prerequisites

## 🐳 Docker (پیشنهادی)

```bash
# اجرای کامل
docker-compose up -d

# یا
npm run docker:up
```

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Swagger: http://localhost:5000

## 🛠️ Manual Setup

```bash
# Setup اولیه
npm run setup

# اجرای پروژه
npm start
```

## 🔧 حل مشکلات

```bash
# مشکل .NET version
npm run fix:dotnet

# Rebuild Docker
npm run docker:rebuild

# بررسی Prerequisites
npm run deploy
```

## 📚 راهنمای کامل

برای راهنمای کامل، فایل `DEPLOYMENT_GUIDE.md` را مطالعه کنید.

---

**نکته**: برای اولین بار، از `npm run deploy` استفاده کنید تا همه چیز خودکار setup شود.
