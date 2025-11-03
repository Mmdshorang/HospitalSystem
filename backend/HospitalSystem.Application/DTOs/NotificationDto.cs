using HospitalSystem.Domain.Entities.Enums;

namespace HospitalSystem.Application.DTOs;

public class NotificationDto
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public string? UserName { get; set; }
    public string? Title { get; set; }
    public string? Message { get; set; }
    public NotificationType Type { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateNotificationDto
{
    public long UserId { get; set; }
    public string? Title { get; set; }
    public string? Message { get; set; }
    public NotificationType Type { get; set; }
}

public class UpdateNotificationDto
{
    public long Id { get; set; }
    public bool IsRead { get; set; }
}

