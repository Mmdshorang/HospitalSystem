using HospitalSystem.Domain.Entities.Enums;

namespace HospitalSystem.Domain.Entities;

public class ServiceRequest
{
    public long Id { get; set; }
    public long PatientId { get; set; }
    public User Patient { get; set; } = null!;
    public long? ClinicId { get; set; }
    public Clinic? Clinic { get; set; }
    public long? ServiceId { get; set; }
    public Service? Service { get; set; }
    public long? InsuranceId { get; set; }
    public Insurance? Insurance { get; set; }
    public long? PerformedByUserId { get; set; }
    public User? PerformedByUser { get; set; }
    public DateTime? PreferredTime { get; set; }
    public AppointmentType? AppointmentType { get; set; }
    public RequestStatus Status { get; set; } = RequestStatus.pending;
    public decimal? TotalPrice { get; set; }
    public decimal? InsuranceCovered { get; set; }
    public decimal? PatientPayable { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation collections
    public ICollection<ServiceResult>? ServiceResults { get; set; }
    public ICollection<Payment>? Payments { get; set; }
}
