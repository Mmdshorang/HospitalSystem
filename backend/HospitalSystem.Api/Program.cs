using HospitalSystem.Api.Configuration;
using HospitalSystem.Infrastructure.Data;
using HospitalSystem.Infrastructure.Services;
using HospitalSystem.Api.Middleware;
using HospitalSystem.Api.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;
using Serilog;
using FluentValidation;
using FluentValidation.AspNetCore;
using HospitalSystem.Domain.Entities.Enums;
using HospitalSystem.Domain.Common.Interfaces;
using Npgsql;
using Microsoft.AspNetCore.DataProtection;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
builder.Services.AddSerilogConfiguration(builder.Configuration);

// Add services to the container.
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        options.SerializerSettings.Converters.Add(new Newtonsoft.Json.Converters.StringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();

// Configure Swagger/OpenAPI with JWT support
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Hospital Management System API",
        Version = "v1",
        Description = "A comprehensive hospital management system API with modern features",
        Contact = new OpenApiContact
        {
            Name = "Hospital System Team"
        }
    });

    // JWT Authentication in Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    // Include XML comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

// Database Configuration
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    // Get connection string from configuration (appsettings.json or environment variables)
    // Falls back to localhost for development if not found in configuration
    string connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? (builder.Environment.IsDevelopment() 
            ? "Host=localhost;Port=5432;Database=hospital-system;Username=postgres;Password=postgres;"
            : throw new InvalidOperationException("Connection string 'DefaultConnection' must be configured in appsettings.json or environment variables"));
    
    Log.Information("Using PostgreSQL connection from configuration: {ConnectionString}", 
        connectionString.Replace("Password=", "Password=***"));

    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        // Configure Npgsql to handle DateTime conversions properly
        // Reduced retry count to 3 with exponential backoff (max 5 seconds delay)
        npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorCodesToAdd: null);
        
        // Set command timeout
        npgsqlOptions.CommandTimeout(30);
    });

    // Configure to use UTC for all DateTime values
    AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", false);
});

// Services
builder.Services.AddScoped<IAuthService, HospitalSystem.Infrastructure.Services.AuthService>();
builder.Services.AddScoped<HospitalSystem.Infrastructure.Services.SpecialtyService>();
builder.Services.AddScoped<HospitalSystem.Infrastructure.Services.ProviderService>();
builder.Services.AddScoped<HospitalSystem.Infrastructure.Services.ClinicService>();
builder.Services.AddScoped<HospitalSystem.Infrastructure.Services.InsuranceService>();
builder.Services.AddScoped<HospitalSystem.Infrastructure.Services.ServiceCategoryService>();
builder.Services.AddScoped<HospitalSystem.Infrastructure.Services.ServiceService>();
builder.Services.AddScoped<HospitalSystem.Infrastructure.Services.ServiceRequestService>();

// OTP services
// در محیط فعلی از Kavenegar برای ارسال واقعی OTP استفاده می‌کنیم.
builder.Services.AddHttpClient<KavenegarOtpService>();
builder.Services.AddScoped<IOtpService, KavenegarOtpService>();
// در صورت نیاز هنوز می‌توانید از MockOtpService برای توسعه استفاده کنید:
// builder.Services.AddScoped<IOtpService, MockOtpService>();
builder.Services.AddHttpClient<SmsIrOtpService>();

// AutoMapper (optional, can be removed if not used)
builder.Services.AddAutoMapper(typeof(Program));

// FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

// Data Protection Configuration
// Configure Data Protection to persist keys to a persistent location
// This prevents keys from being lost when the container restarts
var dataProtectionKeysPath = Environment.GetEnvironmentVariable("DATA_PROTECTION_KEYS_PATH") 
    ?? Path.Combine(Directory.GetCurrentDirectory(), "data", "keys");

// Ensure the directory exists
if (!Directory.Exists(dataProtectionKeysPath))
{
    Directory.CreateDirectory(dataProtectionKeysPath);
    Log.Information("Created Data Protection keys directory: {Path}", dataProtectionKeysPath);
}

var dataProtectionBuilder = builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(dataProtectionKeysPath))
    .SetApplicationName("HospitalSystem")
    .SetDefaultKeyLifetime(TimeSpan.FromDays(90)); // Keys expire after 90 days

// Configure XML encryptor if a protection certificate path is provided
// For production, use a certificate stored in environment variables
var dataProtectionCertPath = Environment.GetEnvironmentVariable("DATA_PROTECTION_CERT_PATH");
if (!string.IsNullOrEmpty(dataProtectionCertPath) && File.Exists(dataProtectionCertPath))
{
    // Use a certificate for XML encryption (recommended for production)
    // This requires a .pfx certificate file
    try
    {
        var certPassword = Environment.GetEnvironmentVariable("DATA_PROTECTION_CERT_PASSWORD");
        var certificate = new System.Security.Cryptography.X509Certificates.X509Certificate2(
            dataProtectionCertPath, 
            certPassword ?? string.Empty);
        dataProtectionBuilder.ProtectKeysWithCertificate(certificate);
        Log.Information("Data Protection XML encryption enabled using certificate");
    }
    catch (Exception ex)
    {
        Log.Warning(ex, "Failed to load Data Protection certificate. Keys will be stored unencrypted.");
    }
}
else
{
    // In development/container environments, keys are stored unencrypted (warning will appear)
    // For production with multiple instances, consider using:
    // 1. A shared certificate (set DATA_PROTECTION_CERT_PATH)
    // 2. Redis for key storage (if available)
    // 3. Azure Key Vault or similar service
    Log.Warning("Data Protection keys will be stored unencrypted. " +
                "For production, set DATA_PROTECTION_CERT_PATH environment variable with a certificate path.");
}

Log.Information("Data Protection configured. Keys stored at: {Path}", dataProtectionKeysPath);

// JWT Authentication
builder.Services.AddJwtAuthentication(builder.Configuration);

// Rate Limiting
builder.Services.AddRateLimiting(builder.Configuration);

// Health Checks
builder.Services.AddHealthChecks()
    .AddCheck<DatabaseHealthCheck>("database")
    .AddDbContextCheck<ApplicationDbContext>("database_context");

// Caching
builder.Services.AddMemoryCache();

// Distributed Cache - Redis if available, otherwise use MemoryDistributedCache
var redisConnectionString = builder.Configuration.GetConnectionString("Redis");
if (!string.IsNullOrEmpty(redisConnectionString) && redisConnectionString != "localhost:6379")
{
    builder.Services.AddStackExchangeRedisCache(options =>
    {
        options.Configuration = redisConnectionString;
    });
}
else
{
    // Fallback to MemoryDistributedCache if Redis is not available
    builder.Services.AddDistributedMemoryCache();
}

// Response Compression
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});

// CORS - Allow all origins for flexibility
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod()
              .WithExposedHeaders("*");
    });
    
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod()
              .WithExposedHeaders("*");
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
// Enable Swagger in all environments for debugging
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hospital System API v1");
    c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
});

// Global Exception Handling
app.UseMiddleware<GlobalExceptionMiddleware>();

// Response Compression
app.UseResponseCompression();

// Rate Limiting - Using AspNetCoreRateLimit instead of built-in rate limiting
// app.UseIpRateLimiting(); // Commented out as it's not available in .NET 8.0

// Only use HTTPS redirection if we're behind a proxy (Liara handles HTTPS)
// app.UseHttpsRedirection();

// CORS must be before UseAuthentication and UseAuthorization
// CORS should be early in the pipeline to handle OPTIONS requests
// The CORS middleware automatically handles OPTIONS preflight requests
app.UseCors("AllowFrontend");

// Security Headers (after CORS to avoid interfering with preflight requests)
app.Use(async (context, next) =>
{
    // Skip security headers for OPTIONS requests (CORS preflight)
    if (context.Request.Method != "OPTIONS")
    {
        context.Response.Headers["X-Content-Type-Options"] = "nosniff";
        context.Response.Headers["X-Frame-Options"] = "DENY";
        context.Response.Headers["X-XSS-Protection"] = "1; mode=block";
    }
    await next();
});

// Routing
app.UseRouting();

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Health Checks
app.MapHealthChecks("/health");

// List available databases endpoint - connects to postgres first to check databases
app.MapGet("/health/databases", async (IConfiguration configuration, IWebHostEnvironment env) =>
{
    try
    {
        // Get connection string from configuration
        var defaultConnection = configuration.GetConnectionString("DefaultConnection") 
            ?? (env.IsDevelopment() 
                ? "Host=localhost;Port=5432;Database=hospital-system;Username=postgres;Password=postgres;"
                : throw new InvalidOperationException("Connection string 'DefaultConnection' must be configured"));
        
        // Extract connection details to build postgres connection string
        var postgresUri = configuration.GetConnectionString("PostgreSQL");
        string postgresConnectionString;
        
        if (!string.IsNullOrEmpty(postgresUri))
        {
            // Parse PostgreSQL URI format: postgresql://user:pass@host:port/db
            var uri = new Uri(postgresUri);
            postgresConnectionString = $"Host={uri.Host};Port={uri.Port};Database=postgres;Username={uri.UserInfo.Split(':')[0]};Password={uri.UserInfo.Split(':')[1]};";
        }
        else
        {
            // Build postgres connection string from DefaultConnection
            // Replace database name with "postgres"
            postgresConnectionString = defaultConnection.Replace("Database=hospital-system", "Database=postgres");
        }
        
        await using var connection = new NpgsqlConnection(postgresConnectionString);
        await connection.OpenAsync();
        
        var databases = new List<string>();
        await using var command = new NpgsqlCommand(
            "SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname;",
            connection);
        
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            databases.Add(reader.GetString(0));
        }
        
        // Step 2: Try to connect to hospital-system database using configured connection string
        bool canConnectToHospitalSystem = false;
        string? hospitalSystemError = null;
        
        try
        {
            await using var hospitalSystemConnection = new NpgsqlConnection(defaultConnection);
            await hospitalSystemConnection.OpenAsync();
            canConnectToHospitalSystem = true;
        }
        catch (Exception ex)
        {
            hospitalSystemError = ex.Message;
        }
        
        return Results.Ok(new
        {
            databases = databases,
            count = databases.Count,
            hospitalSystemExists = databases.Contains("hospital-system"),
            canConnectToHospitalSystem = canConnectToHospitalSystem,
            hospitalSystemError = hospitalSystemError,
            timestamp = DateTime.UtcNow
        });
    }
    catch (Exception ex)
    {
        Log.Error(ex, "Error listing databases: {Message}", ex.Message);
        return Results.Problem(
            title: "Failed to list databases",
            detail: ex.Message,
            statusCode: 500
        );
    }
}).WithTags("Health");

// Detailed database health check endpoint
app.MapGet("/health/database", async (ApplicationDbContext context, IConfiguration configuration, IWebHostEnvironment env) =>
{
    try
    {
        // Get connection string from configuration
        var connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? (env.IsDevelopment() 
                ? "Host=localhost;Port=5432;Database=hospital-system;Username=postgres;Password=postgres;"
                : throw new InvalidOperationException("Connection string 'DefaultConnection' must be configured"));
        
        // Parse connection string to extract connection info
        var connectionStringBuilder = new Npgsql.NpgsqlConnectionStringBuilder(connectionString);
        var dbHost = connectionStringBuilder.Host;
        var dbPort = connectionStringBuilder.Port.ToString();
        var dbName = connectionStringBuilder.Database;
        var dbUser = connectionStringBuilder.Username;
        
        var canConnect = await context.Database.CanConnectAsync();
        if (canConnect)
        {
            return Results.Ok(new
            {
                status = "healthy",
                database = "connected",
                host = dbHost,
                port = dbPort,
                databaseName = dbName,
                user = dbUser,
                timestamp = DateTime.UtcNow
            });
        }
        else
        {
            return Results.Problem(
                title: "Database connection failed",
                detail: "Cannot connect to database",
                statusCode: 503,
                extensions: new Dictionary<string, object?>
                {
                    ["host"] = dbHost,
                    ["port"] = dbPort,
                    ["database"] = dbName,
                    ["user"] = dbUser
                }
            );
        }
    }
    catch (Npgsql.NpgsqlException npgsqlEx)
    {
        Log.Error(npgsqlEx, "Npgsql error: {SqlState}, {Message}", npgsqlEx.SqlState, npgsqlEx.Message);
        return Results.Problem(
            title: "Database connection failed (Npgsql)",
            detail: npgsqlEx.Message,
            statusCode: 503,
            extensions: new Dictionary<string, object?>
            {
                ["sqlState"] = npgsqlEx.SqlState ?? "unknown",
                ["errorCode"] = npgsqlEx.ErrorCode.ToString(),
                ["innerException"] = npgsqlEx.InnerException?.Message
            }
        );
    }
    catch (Exception ex)
    {
        Log.Error(ex, "Database connection error: {Message}", ex.Message);
        return Results.Problem(
            title: "Database connection failed",
            detail: ex.Message,
            statusCode: 503,
            extensions: new Dictionary<string, object?>
            {
                ["exceptionType"] = ex.GetType().Name,
                ["innerException"] = ex.InnerException?.Message,
                ["stackTrace"] = ex.StackTrace
            }
        );
    }
}).WithTags("Health");

// Root endpoint for testing
app.MapGet("/", () => new { 
    message = "Hospital System API is running", 
    version = "1.0.0",
    endpoints = new {
        health = "/health",
        swagger = "/swagger",
        api = "/api"
    }
}).WithTags("Root");

app.MapControllers();

// Apply database migrations on startup
using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        Log.Information("Applying database migrations...");
        context.Database.Migrate();
        Log.Information("Database migrations applied successfully");
    }
    catch (Exception ex)
    {
        Log.Error(ex, "Error applying database migrations: {Message}", ex.Message);
        // Don't throw - let the app start even if migrations fail
        // The error will be logged and can be fixed manually
    }
}

try
{
    Log.Information("Starting Hospital Management System API");
    
    // Use PORT env var if provided (e.g., by Liara), otherwise use ASPNETCORE_URLS or default
    var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
    
    // In Development, always use localhost:5000
    var urls = app.Environment.IsDevelopment() 
        ? $"http://localhost:{port}"
        : (builder.Configuration["ASPNETCORE_URLS"] ?? $"http://0.0.0.0:{port}");
    
    // Override ASPNETCORE_URLS if PORT is set
    if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("PORT")))
    {
        Environment.SetEnvironmentVariable("ASPNETCORE_URLS", urls);
    }
    else if (app.Environment.IsDevelopment())
    {
        // Ensure Development always uses localhost:5000
        Environment.SetEnvironmentVariable("ASPNETCORE_URLS", $"http://localhost:5000");
        urls = "http://localhost:5000";
    }
    
    var environment = app.Environment.EnvironmentName;
    
    Log.Information("═══════════════════════════════════════════════════════════");
    Log.Information("🏥 Hospital Management System API - {Environment} Mode", environment);
    Log.Information("═══════════════════════════════════════════════════════════");
    Log.Information("📍 Configuration:");
    Log.Information("   • Environment:        {Environment}", environment);
    Log.Information("   • Listening URLs:     {Urls}", urls);
    
    if (app.Environment.IsDevelopment())
    {
        Log.Information("   • API Base URL:      http://localhost:5000");
        Log.Information("   • Swagger UI:        http://localhost:5000");
        Log.Information("   • Swagger JSON:      http://localhost:5000/swagger/v1/swagger.json");
        Log.Information("   • Health Check:      http://localhost:5000/health");
    }
    else
    {
        Log.Information("   • Health Check:      /health");
        Log.Information("   • Swagger JSON:      /swagger/v1/swagger.json");
    }
    Log.Information("═══════════════════════════════════════════════════════════");
    
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
