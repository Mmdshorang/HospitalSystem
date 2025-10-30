using System.ComponentModel.DataAnnotations;
using HospitalSystem.Domain.Entities.Lookups;

namespace HospitalSystem.Domain.Entities;

public class User : BaseEntity
{
    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }

    // Role
    public short RoleId { get; set; }
    public UserRole? Role { get; set; }

    // Gender
    public short? GenderId { get; set; }
    public Gender? Gender { get; set; }

    // ProviderProfile (یک به یک)
    public ProviderProfile? ProviderProfile { get; set; }

    // PatientProfile (یک به یک)
    public PatientProfile? PatientProfile { get; set; }

    // ServiceRequests (یک به چند)
    public ICollection<ServiceRequest>? ServiceRequests { get; set; }

    // Notifications (یک به چند)
    public ICollection<Notification>? Notifications { get; set; }

    // AuditLogs (یک به چند)
    public ICollection<AuditLog>? AuditLogs { get; set; }
}
