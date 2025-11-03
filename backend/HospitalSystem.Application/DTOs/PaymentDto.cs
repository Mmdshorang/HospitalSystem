using HospitalSystem.Domain.Entities.Enums;

namespace HospitalSystem.Application.DTOs;

public class PaymentDto
{
    public long Id { get; set; }
    public long RequestId { get; set; }
    public decimal? Amount { get; set; }
    public PaymentMethod? Method { get; set; }
    public string? TransactionId { get; set; }
    public PaymentStatus Status { get; set; }
    public DateTime? PaidAt { get; set; }
}

public class CreatePaymentDto
{
    public long RequestId { get; set; }
    public decimal? Amount { get; set; }
    public PaymentMethod? Method { get; set; }
    public string? TransactionId { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.pending;
}

public class UpdatePaymentDto
{
    public long Id { get; set; }
    public decimal? Amount { get; set; }
    public PaymentMethod? Method { get; set; }
    public string? TransactionId { get; set; }
    public PaymentStatus? Status { get; set; }
    public DateTime? PaidAt { get; set; }
}

