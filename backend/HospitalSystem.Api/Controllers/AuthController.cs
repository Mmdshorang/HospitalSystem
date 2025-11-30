using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using HospitalSystem.Domain.Common.Interfaces;
using HospitalSystem.Domain.DTOs;
using HospitalSystem.Domain.Entities.Enums;

namespace HospitalSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Login endpoint for authentication
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { message = "Invalid credentials" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Register endpoint for new user registration
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            // Check model validation
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .SelectMany(x => x.Value!.Errors)
                    .Select(x => x.ErrorMessage)
                    .ToList();
                
                _logger.LogWarning("Registration validation failed: {Errors}", string.Join(", ", errors));
                return BadRequest(new { message = "Validation failed", errors = errors });
            }

            // Validate password confirmation manually (Compare attribute might not work with JSON)
            if (request.Password != request.ConfirmPassword)
            {
                return BadRequest(new { message = "Password and confirm password do not match" });
            }

            // Ensure role defaults to patient (already set in DTO, but double-check)
            if (request.Role == default(UserRole))
            {
                request.Role = UserRole.patient;
            }

            var result = await _authService.RegisterAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Registration business logic error: {Message}", ex.Message);
            // Include inner exception details if available
            var errorMessage = ex.Message;
            if (ex.InnerException != null)
            {
                errorMessage += $" | Inner: {ex.InnerException.Message}";
            }
            return BadRequest(new { message = errorMessage });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration: {Message}", ex.Message);
            var errorDetails = ex.Message;
            if (ex.InnerException != null)
            {
                errorDetails += $" | Inner: {ex.InnerException.Message}";
            }
            return StatusCode(500, new { message = "Internal server error", details = errorDetails });
        }
    }

    /// <summary>
    /// Validate token endpoint
    /// </summary>
    [HttpPost("validate")]
    [Authorize]
    public async Task<IActionResult> ValidateToken()
    {
        try
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var userInfo = await _authService.GetUserInfoAsync(userId);
            return Ok(new
            {
                valid = true,
                user = userInfo
            });
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "User not found for token validation");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating token");
            return Unauthorized(new { message = "Invalid token" });
        }
    }

    /// <summary>
    /// Get current user info
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        try
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var userInfo = await _authService.GetUserInfoAsync(userId);
            return Ok(userInfo);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "User not found for current user request");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current user");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// ارسال کد تایید به شماره موبایل
    /// </summary>
    [HttpPost("send-otp")]
    public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            await _authService.SendOtpAsync(request.Phone ?? string.Empty);
            return Ok(new { message = string.IsNullOrWhiteSpace(request.Phone) ? "ورود آزمایشی بدون شماره" : "کد تایید ارسال شد" });
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "User not found for phone number");
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid phone number");
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Error sending OTP");
            return StatusCode(500, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error sending OTP");
            return StatusCode(500, new { message = "خطای داخلی سرور در ارسال کد تایید" });
        }
    }

    /// <summary>
    /// بررسی کد تایید
    /// </summary>
    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var isValid = await _authService.VerifyOtpCodeAsync(request.Phone, request.Code);
        if (!isValid)
        {
            return BadRequest(new { message = "کد تایید نامعتبر یا منقضی شده است" });
        }

        return Ok(new { message = "کد تایید معتبر است" });
    }

    /// <summary>
    /// ورود با شماره موبایل و کد تایید
    /// </summary>
    [HttpPost("login-otp")]
    public async Task<IActionResult> LoginWithOtp([FromBody] VerifyOtpRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var result = await _authService.LoginWithOtpAsync(request.Phone, request.Code);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized OTP login attempt");
            return Unauthorized(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "User not found for OTP login");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during OTP login");
            return StatusCode(500, new { message = "خطای داخلی سرور" });
        }
    }
}
