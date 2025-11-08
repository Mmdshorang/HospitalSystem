-- ======================================
-- Convert PostgreSQL ENUMs to VARCHAR
-- This script converts all enum columns to VARCHAR(50)
-- ======================================

-- User table: Role and Gender
ALTER TABLE "User"
    ALTER COLUMN "Role" TYPE VARCHAR(50) USING "Role"::text,
    ALTER COLUMN "Gender" TYPE VARCHAR(20) USING "Gender"::text,
    ALTER COLUMN "Gender" SET DEFAULT 'other';

-- WorkSchedules table: DayOfWeek
ALTER TABLE "WorkSchedules"
    ALTER COLUMN "DayOfWeek" TYPE VARCHAR(20) USING "DayOfWeek"::text;

-- ClinicWorkHours table: DayOfWeek
ALTER TABLE "ClinicWorkHours"
    ALTER COLUMN "DayOfWeek" TYPE VARCHAR(20) USING "DayOfWeek"::text;

-- ServiceRequests table: Status and AppointmentType
ALTER TABLE "ServiceRequests"
    ALTER COLUMN "Status" TYPE VARCHAR(50) USING "Status"::text,
    ALTER COLUMN "AppointmentType" TYPE VARCHAR(50) USING "AppointmentType"::text;

-- Payments table: Method and Status
ALTER TABLE "Payments"
    ALTER COLUMN "Method" TYPE VARCHAR(50) USING "Method"::text,
    ALTER COLUMN "Status" TYPE VARCHAR(50) USING "Status"::text;

-- Notifications table: Type
ALTER TABLE "Notifications"
    ALTER COLUMN "Type" TYPE VARCHAR(50) USING "Type"::text;

-- Now we can drop the enum types (optional - if you want to completely remove them)
-- DROP TYPE IF EXISTS user_role CASCADE;
-- DROP TYPE IF EXISTS gender_type CASCADE;
-- DROP TYPE IF EXISTS day_of_week CASCADE;
-- DROP TYPE IF EXISTS appointment_type CASCADE;
-- DROP TYPE IF EXISTS request_status CASCADE;
-- DROP TYPE IF EXISTS payment_method CASCADE;
-- DROP TYPE IF EXISTS payment_status CASCADE;
-- DROP TYPE IF EXISTS notification_type CASCADE;

-- Verify the changes
SELECT
    table_name,
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
    AND column_name IN ('Role', 'Gender', 'DayOfWeek', 'Status', 'AppointmentType', 'Method', 'Type')
ORDER BY table_name, column_name;
