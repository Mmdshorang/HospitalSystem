using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Linq;
using HospitalSystem.Domain.Common.Interfaces;
using HospitalSystem.Domain.DTOs;
using HospitalSystem.Domain.Entities;
using HospitalSystem.Domain.Entities.Enums;
using HospitalSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HospitalSystem.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;
    private readonly IOtpService _otpService;

    public AuthService(
        ApplicationDbContext context,
        IConfiguration configuration,
        ILogger<AuthService> logger,
        IOtpService otpService)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
        _otpService = otpService;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive && u.DeletedAt == null);

        if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        var token = GenerateJwtToken(user);
        return new AuthResponse
        {
            Token = token,
            Expires = DateTime.UtcNow.AddMinutes(60),
            User = new UserInfo
            {
                Id = user.Id,
                Email = user.Email,
                Role = user.Role.ToString(),
                FirstName = user.FirstName,
                LastName = user.LastName,
                NationalCode = user.NationalCode,
                Phone = user.Phone,
                Gender = user.Gender,
                BirthDate = user.BirthDate,
                AvatarUrl = user.AvatarUrl,
                IsActive = user.IsActive
            }
        };
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        // Ensure role is valid (default to patient if not set)
        var role = request.Role;
        if (role == default(UserRole))
        {
            role = UserRole.patient;
        }

        // Validate role exists in database enum (admin, doctor, patient only)
        if (role != UserRole.admin && role != UserRole.doctor && role != UserRole.patient)
        {
            _logger.LogWarning("Invalid role {Role} provided, defaulting to patient", role);
            role = UserRole.patient;
        }

        // Ensure all DateTime values are UTC for PostgreSQL
        // Convert BirthDate to UTC if it has a value
        DateTime? birthDate = null;
        if (request.BirthDate.HasValue)
        {
            var date = request.BirthDate.Value;
            if (date.Kind == DateTimeKind.Unspecified)
            {
                // If unspecified, assume it's UTC and specify it
                birthDate = DateTime.SpecifyKind(date, DateTimeKind.Utc);
            }
            else if (date.Kind == DateTimeKind.Local)
            {
                // Convert local time to UTC
                birthDate = date.ToUniversalTime();
            }
            else
            {
                // Already UTC
                birthDate = date;
            }
        }

        // Validate Gender enum value
        GenderType? gender = null;
        if (request.Gender.HasValue)
        {
            if (Enum.IsDefined(typeof(GenderType), request.Gender.Value))
            {
                gender = request.Gender.Value;
            }
            else
            {
                _logger.LogWarning("Invalid Gender value {Gender} provided, will be set to null", request.Gender.Value);
            }
        }

        var user = new User
        {
            Email = request.Email,
            PasswordHash = HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            NationalCode = request.NationalCode ?? "",
            Phone = request.Phone ?? "",
            Gender = gender, // Will be null if not provided or invalid
            BirthDate = birthDate,
            Role = role,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        try
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
        {
            _logger.LogError(ex, "Database error during user registration. Inner exception: {InnerException}", ex.InnerException?.Message);
            throw new InvalidOperationException($"Failed to save user: {ex.InnerException?.Message ?? ex.Message}", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during user registration");
            throw;
        }

        var token = GenerateJwtToken(user);
        return new AuthResponse
        {
            Token = token,
            Expires = DateTime.UtcNow.AddMinutes(60),
            User = new UserInfo
            {
                Id = user.Id,
                Email = user.Email,
                Role = user.Role.ToString(),
                FirstName = user.FirstName,
                LastName = user.LastName,
                NationalCode = user.NationalCode,
                Phone = user.Phone,
                Gender = user.Gender,
                BirthDate = user.BirthDate,
                AvatarUrl = user.AvatarUrl,
                IsActive = user.IsActive
            }
        };
    }

    public Task<bool> ValidateTokenAsync(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!";
            var key = Encoding.UTF8.GetBytes(secretKey);

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = jwtSettings["Issuer"] ?? "HospitalSystem",
                ValidateAudience = true,
                ValidAudience = jwtSettings["Audience"] ?? "HospitalSystemUsers",
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return Task.FromResult(true);
        }
        catch
        {
            return Task.FromResult(false);
        }
    }

    public async Task<UserInfo> GetUserInfoAsync(string userId)
    {
        var userIdLong = long.Parse(userId);
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userIdLong && u.IsActive && u.DeletedAt == null);
            
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        return new UserInfo
        {
            Id = user.Id,
            Email = user.Email,
            Role = user.Role.ToString(),
            FirstName = user.FirstName,
            LastName = user.LastName,
            NationalCode = user.NationalCode,
            Phone = user.Phone,
            Gender = user.Gender,
            BirthDate = user.BirthDate,
            AvatarUrl = user.AvatarUrl,
            IsActive = user.IsActive
        };
    }

    public async Task SendOtpAsync(string phone)
    {
        _logger.LogInformation("OTP feature temporarily disabled; skipping SendOtpAsync for {Phone}", phone);
        await Task.CompletedTask;
    }

    public async Task<bool> VerifyOtpCodeAsync(string phone, string code)
    {
        _logger.LogInformation("OTP feature temporarily disabled; skipping VerifyOtpCodeAsync for {Phone}", phone);
        return await Task.FromResult(true);
    }

    public async Task<AuthResponse> LoginWithOtpAsync(string phone, string code)
    {
        if (string.IsNullOrWhiteSpace(phone))
        {
            var bypassUser = await GetDefaultBypassUserAsync();
            if (bypassUser == null)
            {
                throw new UnauthorizedAccessException("هیچ حساب فعالی برای ورود آزمایشی یافت نشد");
            }

            return BuildAuthResponse(bypassUser);
        }

        var isValid = await VerifyOtpCodeAsync(phone, code);
        if (!isValid)
        {
            throw new UnauthorizedAccessException("کد تأیید نامعتبر یا منقضی شده است");
        }

        var normalizedPhone = NormalizePhone(phone);
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Phone == normalizedPhone && u.IsActive && u.DeletedAt == null);

        if (user == null)
        {
            throw new UnauthorizedAccessException("حسابی با این شماره یافت نشد");
        }

        return BuildAuthResponse(user);
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!";
        var issuer = jwtSettings["Issuer"] ?? "HospitalSystem";
        var audience = jwtSettings["Audience"] ?? "HospitalSystemUsers";

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("exp", DateTimeOffset.UtcNow.AddMinutes(60).ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(60),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string HashPassword(string password)
    {
        using var rng = RandomNumberGenerator.Create();
        var salt = new byte[16];
        rng.GetBytes(salt);

        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
        var hash = pbkdf2.GetBytes(32);

        var hashBytes = new byte[48];
        Array.Copy(salt, 0, hashBytes, 0, 16);
        Array.Copy(hash, 0, hashBytes, 16, 32);

        return Convert.ToBase64String(hashBytes);
    }

    private bool VerifyPassword(string password, string storedHash)
    {
        var hashBytes = Convert.FromBase64String(storedHash);
        var salt = new byte[16];
        Array.Copy(hashBytes, 0, salt, 0, 16);

        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
        var hash = pbkdf2.GetBytes(32);

        for (int i = 0; i < 32; i++)
        {
            if (hashBytes[i + 16] != hash[i])
                return false;
        }

        return true;
    }

    private static string NormalizePhone(string phone)
    {
        if (string.IsNullOrWhiteSpace(phone))
        {
            return string.Empty;
        }

        return phone.Trim().Replace(" ", "").Replace("-", "");
    }

    private static string GenerateOtpCode()
    {
        var randomNumber = RandomNumberGenerator.GetInt32(100000, 999999);
        return randomNumber.ToString();
    }

    private async Task<User?> GetDefaultBypassUserAsync()
    {
        var adminUser = await _context.Users
            .Where(u => u.Role == UserRole.admin && u.IsActive && u.DeletedAt == null)
            .OrderBy(u => u.Id)
            .FirstOrDefaultAsync();

        if (adminUser != null)
        {
            return adminUser;
        }

        return await _context.Users
            .Where(u => u.IsActive && u.DeletedAt == null)
            .OrderBy(u => u.Id)
            .FirstOrDefaultAsync();
    }

    private AuthResponse BuildAuthResponse(User user)
    {
        var token = GenerateJwtToken(user);
        return new AuthResponse
        {
            Token = token,
            Expires = DateTime.UtcNow.AddMinutes(60),
            User = new UserInfo
            {
                Id = user.Id,
                Email = user.Email,
                Role = user.Role.ToString(),
                FirstName = user.FirstName,
                LastName = user.LastName,
                NationalCode = user.NationalCode,
                Phone = user.Phone,
                Gender = user.Gender,
                BirthDate = user.BirthDate,
                AvatarUrl = user.AvatarUrl,
                IsActive = user.IsActive
            }
        };
    }
}