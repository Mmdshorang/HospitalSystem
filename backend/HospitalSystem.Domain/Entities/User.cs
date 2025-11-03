using HospitalSystem.Domain.Entities.Enums;

namespace HospitalSystem.Domain.Entities;

public class User
{
    public long Id { get; set; }
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string NationalCode { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public UserRole Role { get; set; }
    public GenderType? Gender { get; set; }
    public DateTime? BirthDate { get; set; }
    public string? AvatarUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }

    // Navigation properties
    public ProviderProfile? ProviderProfile { get; set; }
    public PatientProfile? PatientProfile { get; set; }
    public ICollection<ServiceRequest>? ServiceRequests { get; set; }
    public ICollection<Notification>? Notifications { get; set; }
    public ICollection<AuditLog>? AuditLogs { get; set; }
}
