-- ======================================
-- Remove 'other' gender type
-- This script updates existing 'other' values to NULL
-- and removes the default value
-- ======================================

-- Update existing records with 'other' to NULL
UPDATE "User"
SET "Gender" = NULL
WHERE "Gender" = 'other';

-- Remove the default value from Gender column
ALTER TABLE "User"
    ALTER COLUMN "Gender" DROP DEFAULT;

-- Verify the changes
SELECT
    "Id",
    "Email",
    "Gender"
FROM "User"
ORDER BY "Id";
