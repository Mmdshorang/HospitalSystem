using HospitalSystem.Domain.Entities.Enums;

namespace HospitalSystem.Domain.Entities;

public class ServiceResult
{
    public long Id { get; set; }
    public long RequestId { get; set; }
    public ServiceRequest Request { get; set; } = null!;
    public long? PerformedByUserId { get; set; }
    public User? PerformedByUser { get; set; }
    public string? ResultText { get; set; }
    public string? AttachmentUrl { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public bool ApprovedByAdmin { get; set; } = false;
}

public class Payment
{
    public long Id { get; set; }
    public long RequestId { get; set; }
    public ServiceRequest Request { get; set; } = null!;
    public decimal? Amount { get; set; }
    public PaymentMethod? Method { get; set; }
    public string? TransactionId { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.pending;
    public DateTime? PaidAt { get; set; }
}
