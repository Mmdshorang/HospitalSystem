using HospitalSystem.Domain.Entities.Enums;

namespace HospitalSystem.Application.DTOs;

public class UserDto
{
    public long Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string NationalCode { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public GenderType? Gender { get; set; }
    public DateTime? BirthDate { get; set; }
    public string? AvatarUrl { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Profile information
    public PatientProfileDto? PatientProfile { get; set; }
    public ProviderProfileDto? ProviderProfile { get; set; }
}

public class CreateUserDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string NationalCode { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public GenderType? Gender { get; set; }
    public DateTime? BirthDate { get; set; }
    public string? AvatarUrl { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateUserDto
{
    public long Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string NationalCode { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public GenderType? Gender { get; set; }
    public DateTime? BirthDate { get; set; }
    public string? AvatarUrl { get; set; }
    public bool IsActive { get; set; } = true;
}

