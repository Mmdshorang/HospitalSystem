namespace HospitalSystem.Application.DTOs;

public class ServiceResultDto
{
    public long Id { get; set; }
    public long RequestId { get; set; }
    public long? PerformedByUserId { get; set; }
    public string? PerformedByUserName { get; set; }
    public string? ResultText { get; set; }
    public string? AttachmentUrl { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public bool ApprovedByAdmin { get; set; }
}

public class CreateServiceResultDto
{
    public long RequestId { get; set; }
    public long? PerformedByUserId { get; set; }
    public string? ResultText { get; set; }
    public string? AttachmentUrl { get; set; }
    public bool ApprovedByAdmin { get; set; } = false;
}

public class UpdateServiceResultDto
{
    public long Id { get; set; }
    public long? PerformedByUserId { get; set; }
    public string? ResultText { get; set; }
    public string? AttachmentUrl { get; set; }
    public bool ApprovedByAdmin { get; set; }
}

