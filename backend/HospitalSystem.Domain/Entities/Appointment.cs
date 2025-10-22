namespace HospitalSystem.Domain.Entities;

public class Appointment : BaseEntity
{
    public DateTime AppointmentDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string Status { get; set; } = "Scheduled"; // Scheduled, Completed, Cancelled, NoShow
    public string Notes { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    
    // Foreign Keys
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    
    // Navigation properties
    public Patient Patient { get; set; } = null!;
    public Doctor Doctor { get; set; } = null!;
}
