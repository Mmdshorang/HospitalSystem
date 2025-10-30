using HospitalSystem.Domain.Entities.Lookups;

namespace HospitalSystem.Domain.Entities
{
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
        public short? PaymentMethodId { get; set; }
        public PaymentMethod? PaymentMethod { get; set; }
        public string? TransactionId { get; set; }
        public short PaymentStatusId { get; set; }
        public PaymentStatus PaymentStatus { get; set; } = null!;
        public DateTime? PaidAt { get; set; }
    }
}