using HospitalSystem.Domain.Entities.Enums;

namespace HospitalSystem.Domain.Entities;

public class Clinic
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Phone { get; set; }
    public long? ManagerId { get; set; }
    public User? Manager { get; set; }
    public string? LogoUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<ClinicWorkHours>? WorkHours { get; set; }
    public ICollection<ClinicAddress>? Addresses { get; set; }
    public ICollection<ClinicInsurance>? ClinicInsurances { get; set; }
    public ICollection<ClinicService>? ClinicServices { get; set; }
    public ICollection<ClinicManager>? ClinicManagers { get; set; }
}

public class ClinicWorkHours
{
    public long Id { get; set; }
    public long ClinicId { get; set; }
    public Clinic Clinic { get; set; } = null!;
    public DayOfWeekEnum DayOfWeek { get; set; }
    public TimeSpan? StartTime { get; set; }
    public TimeSpan? EndTime { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class ClinicAddress
{
    public long Id { get; set; }
    public long ClinicId { get; set; }
    public Clinic Clinic { get; set; } = null!;
    public string? Street { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
}
