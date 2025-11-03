-- ======================================
-- Drop Old Database Tables (if they exist)
-- Run this script to clean up old tables from previous schema
-- ======================================

-- Drop old tables from previous schema (if they exist)
DROP TABLE IF EXISTS Payment CASCADE;
DROP TABLE IF EXISTS ServiceResult CASCADE;
DROP TABLE IF EXISTS ServiceRequest CASCADE;
DROP TABLE IF EXISTS AuditLog CASCADE;
DROP TABLE IF EXISTS Notification CASCADE;
DROP TABLE IF EXISTS PatientInsurance CASCADE;
DROP TABLE IF EXISTS ClinicInsurance CASCADE;
DROP TABLE IF EXISTS ClinicService CASCADE;
DROP TABLE IF EXISTS WorkSchedule CASCADE;
DROP TABLE IF EXISTS ClinicWorkHours CASCADE;
DROP TABLE IF EXISTS ClinicAddress CASCADE;
DROP TABLE IF EXISTS ProviderProfile CASCADE;
DROP TABLE IF EXISTS PatientProfile CASCADE;
DROP TABLE IF EXISTS Appointment CASCADE;
DROP TABLE IF EXISTS MedicalRecord CASCADE;
DROP TABLE IF EXISTS Patient CASCADE;
DROP TABLE IF EXISTS Doctor CASCADE;
DROP TABLE IF EXISTS Service CASCADE;
DROP TABLE IF EXISTS ServiceCategory CASCADE;
DROP TABLE IF EXISTS Insurance CASCADE;
DROP TABLE IF EXISTS Clinic CASCADE;
DROP TABLE IF EXISTS Specialty CASCADE;
DROP TABLE IF EXISTS SpecialtyCategory CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Drop old ENUM types (if they exist)
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS gender_type CASCADE;
DROP TYPE IF EXISTS day_of_week CASCADE;
DROP TYPE IF EXISTS appointment_type CASCADE;
DROP TYPE IF EXISTS request_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;

-- Drop EF Core migrations history (will be recreated by EF Core)
DROP TABLE IF EXISTS __EFMigrationsHistory CASCADE;

