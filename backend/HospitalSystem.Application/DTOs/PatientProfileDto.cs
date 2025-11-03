namespace HospitalSystem.Application.DTOs;

public class PatientProfileDto
{
    public long Id { get; set; }
    public long UserId { get; set; }
    // User info can be included separately to avoid circular reference
    public string? UserFirstName { get; set; }
    public string? UserLastName { get; set; }
    public string? UserEmail { get; set; }
    public string? BloodType { get; set; }
    public decimal? Height { get; set; }
    public decimal? Weight { get; set; }
    public string? MedicalHistory { get; set; }
    public string? EmergencyName { get; set; }
    public string? EmergencyRelationship { get; set; }
    public string? EmergencyPhone { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<PatientInsuranceDto>? Insurances { get; set; }
}

public class CreatePatientProfileDto
{
    public long UserId { get; set; }
    public string? BloodType { get; set; }
    public decimal? Height { get; set; }
    public decimal? Weight { get; set; }
    public string? MedicalHistory { get; set; }
    public string? EmergencyName { get; set; }
    public string? EmergencyRelationship { get; set; }
    public string? EmergencyPhone { get; set; }
}

public class UpdatePatientProfileDto
{
    public long Id { get; set; }
    public string? BloodType { get; set; }
    public decimal? Height { get; set; }
    public decimal? Weight { get; set; }
    public string? MedicalHistory { get; set; }
    public string? EmergencyName { get; set; }
    public string? EmergencyRelationship { get; set; }
    public string? EmergencyPhone { get; set; }
}

public class PatientInsuranceDto
{
    public long Id { get; set; }
    public long InsuranceId { get; set; }
    public string? InsuranceName { get; set; }
    public string? InsuranceNumber { get; set; }
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreatePatientInsuranceDto
{
    public long PatientProfileId { get; set; }
    public long InsuranceId { get; set; }
    public string? InsuranceNumber { get; set; }
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }
    public bool IsActive { get; set; } = true;
}

