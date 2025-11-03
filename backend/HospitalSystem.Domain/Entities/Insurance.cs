namespace HospitalSystem.Domain.Entities;

public class Insurance
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? CoveragePercent { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class PatientInsurance
{
    public long Id { get; set; }
    public long PatientProfileId { get; set; }
    public PatientProfile PatientProfile { get; set; } = null!;
    public long InsuranceId { get; set; }
    public Insurance Insurance { get; set; } = null!;
    public string? InsuranceNumber { get; set; }
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ClinicInsurance
{
    public long Id { get; set; }
    public long ClinicId { get; set; }
    public Clinic Clinic { get; set; } = null!;
    public long InsuranceId { get; set; }
    public Insurance Insurance { get; set; } = null!;
}
