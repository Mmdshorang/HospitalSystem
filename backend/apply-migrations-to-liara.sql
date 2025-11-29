-- Drop migration history to force re-apply all migrations
DROP TABLE IF EXISTS "__EFMigrationsHistory" CASCADE;

-- Now run: dotnet ef database update

