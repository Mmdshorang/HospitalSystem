namespace HospitalSystem.Domain.Entities;

public class MedicalRecord : BaseEntity
{
    public DateTime RecordDate { get; set; }
    public string Diagnosis { get; set; } = string.Empty;
    public string Treatment { get; set; } = string.Empty;
    public string Prescription { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public string VitalSigns { get; set; } = string.Empty; // JSON string for vital signs
    public string Attachments { get; set; } = string.Empty; // JSON string for file paths
    
    // Foreign Keys
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    
    // Navigation properties
    public Patient Patient { get; set; } = null!;
    public Doctor Doctor { get; set; } = null!;
}
