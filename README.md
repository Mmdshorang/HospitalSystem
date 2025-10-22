# 🏥 Hospital Management System

A modern, comprehensive hospital management system built with ASP.NET Core backend and React frontend, following Clean Architecture principles and modern development best practices.

## 🏗️ Architecture

### Backend (ASP.NET Core)
- **Clean Architecture** with Domain, Application, Infrastructure, and API layers
- **Entity Framework Core** with PostgreSQL
- **Swagger/OpenAPI** for API documentation
- **Repository Pattern** with Unit of Work
- **AutoMapper** for object mapping
- **MediatR** for CQRS pattern

### Frontend (React + TypeScript + Modern Stack)
- **React 18** with TypeScript
- **Tailwind CSS v4** with modern design system
- **TanStack Query v5** for state management
- **TanStack Router** for navigation
- **React Hook Form** with Zod validation
- **Radix UI** components for accessibility
- **Victory** for data visualization
- **Biome** for linting and formatting
- **Storybook** for component development
- **Vitest** for testing
- **React Toastify** for notifications

## 🚀 Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+ and pnpm
- PostgreSQL 14+

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Update connection string in `HospitalSystem.Api/appsettings.json`:**
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=HospitalSystem;Username=your_username;Password=your_password"
     }
   }
   ```

3. **Restore packages:**
   ```bash
   dotnet restore
   ```

4. **Run the application:**
   ```bash
   dotnet run --project HospitalSystem.Api
   ```

5. **Access Swagger UI:**
   - Navigate to `https://localhost:5001` (or the port shown in console)
   - API documentation will be available at the root URL

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Update environment variables in `.env`:**
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

5. **Start development server:**
   ```bash
   pnpm dev
   ```

6. **Access the application:**
   - Navigate to `http://localhost:5173`

## 📁 Project Structure

```
hospital-system/
├── backend/
│   ├── HospitalSystem.Api/           # Web API layer
│   ├── HospitalSystem.Application/   # Application layer (DTOs, Interfaces)
│   ├── HospitalSystem.Domain/        # Domain layer (Entities)
│   └── HospitalSystem.Infrastructure/ # Infrastructure layer (Data, Repositories)
└── frontend/
    ├── src/
    │   ├── api/                      # API client and services
    │   ├── components/               # Reusable components
    │   ├── pages/                    # Page components
    │   └── types/                    # TypeScript type definitions
    └── public/                       # Static assets
```

## 🔧 Features

### Backend Features
- ✅ Clean Architecture implementation
- ✅ Entity Framework Core with PostgreSQL
- ✅ Repository Pattern with Unit of Work
- ✅ Swagger/OpenAPI documentation
- ✅ CORS configuration for frontend
- ✅ Soft delete implementation
- ✅ Comprehensive error handling

### Frontend Features
- ✅ Modern React with TypeScript
- ✅ Responsive design with Tailwind CSS
- ✅ Patient management (CRUD operations)
- ✅ Doctor management (CRUD operations)
- ✅ Appointment scheduling
- ✅ Dashboard with statistics
- ✅ Form validation
- ✅ Loading states and error handling

## 🗄️ Database Schema

### Entities
- **Patient**: Personal information, contact details, medical info
- **Doctor**: Professional information, specialization, availability
- **Appointment**: Scheduling between patients and doctors
- **MedicalRecord**: Patient medical history and records

### Key Features
- Soft delete implementation
- Audit fields (CreatedAt, UpdatedAt)
- Foreign key relationships
- Unique constraints (National ID, License Number)

## 🔌 API Endpoints

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/{id}` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/{id}` - Get doctor by ID
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/{id}` - Update doctor
- `DELETE /api/doctors/{id}` - Delete doctor

## 🎨 Frontend Pages

- **Dashboard**: Overview with statistics and recent activity
- **Patients**: Patient list with CRUD operations
- **Doctors**: Doctor list with CRUD operations
- **Appointments**: Appointment scheduling and management

## 🛠️ Development

### Adding New Features

1. **Backend**: Add entities to Domain layer, DTOs to Application layer, controllers to API layer
2. **Frontend**: Create components in `src/components`, pages in `src/pages`, update routing

### Code Generation

To generate TypeScript types from OpenAPI schema:
```bash
cd frontend
pnpm generate-api
```

## 📝 Notes

- The backend uses PostgreSQL as the database
- Frontend is configured to work with the backend API
- CORS is configured to allow frontend requests
- All entities support soft delete
- The system follows Clean Architecture principles
- TypeScript types are manually maintained for better control

## 🚀 Deployment

### Backend
- Deploy to Azure App Service, AWS, or any .NET hosting platform
- Update connection string for production database
- Configure CORS for production frontend URL

### Frontend
- Build: `pnpm build`
- Deploy to Vercel, Netlify, or any static hosting platform
- Update API base URL for production backend

## 📄 License

This project is licensed under the MIT License.
