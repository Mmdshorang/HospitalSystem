namespace HospitalSystem.Domain.Entities;

public class PatientProfile
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public User User { get; set; } = null!;
    public string? BloodType { get; set; }
    public decimal? Height { get; set; }
    public decimal? Weight { get; set; }
    public string? MedicalHistory { get; set; }
    public string? EmergencyName { get; set; }
    public string? EmergencyRelationship { get; set; }
    public string? EmergencyPhone { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<PatientInsurance>? Insurances { get; set; }
}
