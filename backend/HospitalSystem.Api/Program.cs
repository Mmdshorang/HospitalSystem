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
            Name = "Hospital System Team",
            Email = "support@hospitalsystem.com"
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
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"), npgsqlOptions =>
    {
        // Configure Npgsql to handle DateTime conversions properly
        npgsqlOptions.EnableRetryOnFailure();
    });

    // Configure to use UTC for all DateTime values
    AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", false);
});

// Services
builder.Services.AddScoped<IAuthService, HospitalSystem.Infrastructure.Services.AuthService>();
builder.Services.AddScoped<HospitalSystem.Infrastructure.Services.SpecialtyService>();
builder.Services.AddScoped<HospitalSystem.Infrastructure.Services.ProviderService>();
builder.Services.AddScoped<IOtpService, MockOtpService>();
builder.Services.AddHttpClient<SmsIrOtpService>();

// AutoMapper (optional, can be removed if not used)
builder.Services.AddAutoMapper(typeof(Program));

// FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

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
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
});

// Response Compression
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hospital System API v1");
        c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
    });
}

// Global Exception Handling
app.UseMiddleware<GlobalExceptionMiddleware>();

// Response Compression
app.UseResponseCompression();

// Rate Limiting - Using AspNetCoreRateLimit instead of built-in rate limiting
// app.UseIpRateLimiting(); // Commented out as it's not available in .NET 8.0

// Security Headers
app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["X-XSS-Protection"] = "1; mode=block";
    await next();
});

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Health Checks
app.MapHealthChecks("/health");

app.MapControllers();

// Database schema is created via SQL script (see Infrastructure/Scripts/create_database_schema.sql)
// Uncomment below if you want EF Core to create tables automatically (not recommended with custom schema)
// using (var scope = app.Services.CreateScope())
// {
//     var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
//     context.Database.EnsureCreated();
// }

try
{
    Log.Information("Starting Hospital Management System API");
    
    // Log API endpoints
    var urls = app.Urls;
    if (app.Environment.IsDevelopment())
    {
        Log.Information("═══════════════════════════════════════════════════════════");
        Log.Information("🏥 Hospital Management System API - Development Mode");
        Log.Information("═══════════════════════════════════════════════════════════");
        Log.Information("📍 API Endpoints:");
        Log.Information("   • API Base URL:      http://localhost:5000");
        Log.Information("   • Swagger UI:        http://localhost:5000");
        Log.Information("   • Swagger JSON:      http://localhost:5000/swagger/v1/swagger.json");
        Log.Information("   • Health Check:      http://localhost:5000/health");
        Log.Information("   • Scalar Docs:       http://localhost:8080");
        Log.Information("═══════════════════════════════════════════════════════════");
    }
    
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
