using HospitalSystem.Domain.Entities.Enums;

namespace HospitalSystem.Application.DTOs;

public class ServiceRequestDto
{
    public long Id { get; set; }
    public long PatientId { get; set; }
    public string? PatientName { get; set; }
    public long? ClinicId { get; set; }
    public string? ClinicName { get; set; }
    public long? ServiceId { get; set; }
    public string? ServiceName { get; set; }
    public long? InsuranceId { get; set; }
    public string? InsuranceName { get; set; }
    public long? PerformedByUserId { get; set; }
    public string? PerformedByUserName { get; set; }
    public DateTime? PreferredTime { get; set; }
    public AppointmentType? AppointmentType { get; set; }
    public RequestStatus Status { get; set; }
    public decimal? TotalPrice { get; set; }
    public decimal? InsuranceCovered { get; set; }
    public decimal? PatientPayable { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<ServiceResultDto>? ServiceResults { get; set; }
    public List<PaymentDto>? Payments { get; set; }
}

public class CreateServiceRequestDto
{
    public long PatientId { get; set; }
    public long? ClinicId { get; set; }
    public long? ServiceId { get; set; }
    public long? InsuranceId { get; set; }
    public DateTime? PreferredTime { get; set; }
    public AppointmentType? AppointmentType { get; set; }
    public string? Notes { get; set; }
}

public class UpdateServiceRequestDto
{
    public long Id { get; set; }
    public long? ClinicId { get; set; }
    public long? ServiceId { get; set; }
    public long? InsuranceId { get; set; }
    public long? PerformedByUserId { get; set; }
    public DateTime? PreferredTime { get; set; }
    public AppointmentType? AppointmentType { get; set; }
    public RequestStatus? Status { get; set; }
    public decimal? TotalPrice { get; set; }
    public decimal? InsuranceCovered { get; set; }
    public decimal? PatientPayable { get; set; }
    public string? Notes { get; set; }
}

