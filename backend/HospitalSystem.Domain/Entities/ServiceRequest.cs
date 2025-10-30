using HospitalSystem.Domain.Entities.Lookups;

namespace HospitalSystem.Domain.Entities
{
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
        public short? AppointmentTypeId { get; set; }
        public AppointmentType? AppointmentType { get; set; }
        public short StatusId { get; set; }
        public RequestStatus Status { get; set; } = null!;
        public decimal? TotalPrice { get; set; }
        public decimal? InsuranceCovered { get; set; }
        public decimal? PatientPayable { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}