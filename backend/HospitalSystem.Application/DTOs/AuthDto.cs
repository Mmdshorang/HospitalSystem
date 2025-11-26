using System.ComponentModel.DataAnnotations;
using HospitalSystem.Domain.Entities.Enums;

namespace HospitalSystem.Application.DTOs;

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [Compare(nameof(Password))]
    public string ConfirmPassword { get; set; } = string.Empty;

    [Required]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    public string LastName { get; set; } = string.Empty;
    
    public string? NationalCode { get; set; }
    public string? Phone { get; set; }
    public GenderType? Gender { get; set; }
    public DateTime? BirthDate { get; set; }
    public UserRole Role { get; set; } = UserRole.patient;
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public DateTime Expires { get; set; }
    public UserInfo User { get; set; } = new();
}

public class UserInfo
{
    public long Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? NationalCode { get; set; }
    public string? Phone { get; set; }
    public GenderType? Gender { get; set; }
    public DateTime? BirthDate { get; set; }
    public string? AvatarUrl { get; set; }
    public bool IsActive { get; set; }
}

public class SendOtpRequest
{
    [Phone]
    public string Phone { get; set; } = string.Empty;
}

public class VerifyOtpRequest
{
    [Phone]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [MinLength(4)]
    [MaxLength(6)]
    public string Code { get; set; } = string.Empty;
}