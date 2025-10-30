using HospitalSystem.Domain.Entities.Lookups;

namespace HospitalSystem.Domain.Entities
{
    public class Notification
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public User User { get; set; } = null!;
        public string? Title { get; set; }
        public string? Message { get; set; }
        public short? NotificationTypeId { get; set; }
        public NotificationType? NotificationType { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; }
    }

    public class AuditLog
    {
        public long Id { get; set; }
        public long? UserId { get; set; }
        public User? User { get; set; }
        public string? Action { get; set; }
        public string? Entity { get; set; }
        public long? EntityId { get; set; }
        public string? OldValue { get; set; }
        public string? NewValue { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}