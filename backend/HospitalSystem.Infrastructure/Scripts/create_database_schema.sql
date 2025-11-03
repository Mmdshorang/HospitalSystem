-- ======================================
-- Hospital System Database Schema
-- This script drops existing tables and creates new schema
-- ======================================

-- Drop existing tables in correct order (respecting foreign keys)
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

-- Drop existing types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS gender_type CASCADE;
DROP TYPE IF EXISTS day_of_week CASCADE;
DROP TYPE IF EXISTS appointment_type CASCADE;
DROP TYPE IF EXISTS request_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;

-- ======================================
-- ENUM Types
-- ======================================
CREATE TYPE user_role AS ENUM ('admin','doctor','patient');
CREATE TYPE gender_type AS ENUM ('male','female','other');
CREATE TYPE day_of_week AS ENUM ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday');
CREATE TYPE appointment_type AS ENUM ('in_person','remote');
CREATE TYPE request_status AS ENUM ('pending','approved','in_progress','done','rejected');
CREATE TYPE payment_method AS ENUM ('online','cash','card');
CREATE TYPE payment_status AS ENUM ('pending','success','failed');
CREATE TYPE notification_type AS ENUM ('info','warning','success');

-- ======================================
-- Users & Profiles
-- ======================================
CREATE TABLE "User" (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    national_code VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(100),
    password_hash VARCHAR(255),
    role user_role,
    gender gender_type,
    birth_date DATE,
    avatar_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE SpecialtyCategory (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Specialty (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT REFERENCES SpecialtyCategory(id),
    name VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Clinic (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150),
    phone VARCHAR(20),
    email VARCHAR(100),
    manager_id BIGINT REFERENCES "User"(id),
    logo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ProviderProfile (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES "User"(id),
    clinic_id BIGINT REFERENCES Clinic(id),
    specialty_id BIGINT REFERENCES Specialty(id),
    degree VARCHAR(50),
    experience_years INT,
    share_percent NUMERIC(5,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE WorkSchedule (
    id BIGSERIAL PRIMARY KEY,
    provider_id BIGINT REFERENCES ProviderProfile(id),
    day_of_week day_of_week,
    start_time TIME,
    end_time TIME,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE PatientProfile (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES "User"(id),
    blood_type VARCHAR(5),
    height NUMERIC(5,2),
    weight NUMERIC(5,2),
    medical_history TEXT,
    emergency_name VARCHAR(100),
    emergency_relationship VARCHAR(50),
    emergency_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ======================================
-- Clinic & Related Tables
-- ======================================
CREATE TABLE ClinicWorkHours (
    id BIGSERIAL PRIMARY KEY,
    clinic_id BIGINT REFERENCES Clinic(id),
    day_of_week day_of_week,
    start_time TIME,
    end_time TIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ClinicAddress (
    id BIGSERIAL PRIMARY KEY,
    clinic_id BIGINT REFERENCES Clinic(id),
    street VARCHAR(150),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(50)
);

CREATE TABLE ServiceCategory (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Service (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150),
    description TEXT,
    category_id BIGINT REFERENCES ServiceCategory(id),
    base_price NUMERIC(10,2),
    duration_minutes INT,
    is_in_person BOOLEAN DEFAULT TRUE,
    requires_doctor BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Insurance (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    coverage_percent NUMERIC(5,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE PatientInsurance (
    id BIGSERIAL PRIMARY KEY,
    patient_profile_id BIGINT REFERENCES PatientProfile(id),
    insurance_id BIGINT REFERENCES Insurance(id),
    insurance_number VARCHAR(50),
    valid_from DATE,
    valid_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ClinicInsurance (
    id BIGSERIAL PRIMARY KEY,
    clinic_id BIGINT REFERENCES Clinic(id),
    insurance_id BIGINT REFERENCES Insurance(id)
);

CREATE TABLE ClinicService (
    id BIGSERIAL PRIMARY KEY,
    clinic_id BIGINT REFERENCES Clinic(id),
    service_id BIGINT REFERENCES Service(id),
    price NUMERIC(10,2),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ======================================
-- Requests, Results & Payments
-- ======================================
CREATE TABLE ServiceRequest (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT REFERENCES "User"(id),
    clinic_id BIGINT REFERENCES Clinic(id),
    service_id BIGINT REFERENCES Service(id),
    insurance_id BIGINT REFERENCES Insurance(id),
    performed_by_user_id BIGINT REFERENCES "User"(id),
    preferred_time TIMESTAMP,
    appointment_type appointment_type,
    status request_status DEFAULT 'pending',
    total_price NUMERIC(10,2),
    insurance_covered NUMERIC(10,2),
    patient_payable NUMERIC(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ServiceResult (
    id BIGSERIAL PRIMARY KEY,
    request_id BIGINT REFERENCES ServiceRequest(id),
    performed_by_user_id BIGINT REFERENCES "User"(id),
    result_text TEXT,
    attachment_url VARCHAR(255),
    submitted_at TIMESTAMP,
    approved_by_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE Payment (
    id BIGSERIAL PRIMARY KEY,
    request_id BIGINT REFERENCES ServiceRequest(id),
    amount NUMERIC(10,2),
    method payment_method,
    transaction_id VARCHAR(100),
    status payment_status DEFAULT 'pending',
    paid_at TIMESTAMP
);

-- ======================================
-- Notifications & Logs
-- ======================================
CREATE TABLE Notification (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES "User"(id),
    title VARCHAR(150),
    message TEXT,
    type notification_type,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE AuditLog (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES "User"(id),
    action VARCHAR(100),
    entity VARCHAR(50),
    entity_id BIGINT,
    old_value JSON,
    new_value JSON,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_user_national_code ON "User"(national_code);
CREATE INDEX idx_service_request_patient_id ON ServiceRequest(patient_id);
CREATE INDEX idx_service_request_status ON ServiceRequest(status);
CREATE INDEX idx_notification_user_id ON Notification(user_id);
CREATE INDEX idx_notification_is_read ON Notification(is_read);
CREATE INDEX idx_audit_log_user_id ON AuditLog(user_id);

