-- ======================================
-- Drop PostgreSQL ENUM Types
-- This script removes all custom enum types from the database
-- Run this AFTER converting all columns to VARCHAR
-- ======================================

-- Drop all enum types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS gender_type CASCADE;
DROP TYPE IF EXISTS day_of_week CASCADE;
DROP TYPE IF EXISTS appointment_type CASCADE;
DROP TYPE IF EXISTS request_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;

-- Verify that all enum types have been dropped
SELECT
    typname AS enum_type_name,
    typtype AS type_type
FROM pg_type
WHERE typtype = 'e'  -- 'e' stands for enum type
    AND typnamespace = (
        SELECT oid FROM pg_namespace WHERE nspname = 'public'
    )
ORDER BY typname;
