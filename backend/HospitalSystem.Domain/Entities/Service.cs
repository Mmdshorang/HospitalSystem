using HospitalSystem.Domain.Entities.Enums;

namespace HospitalSystem.Domain.Entities;

public class ServiceCategory
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Service>? Services { get; set; }
}

public class Service
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public long? CategoryId { get; set; }
    public ServiceCategory? Category { get; set; }
    public decimal? BasePrice { get; set; }
    public int? DurationMinutes { get; set; }
    public bool IsInPerson { get; set; } = true; // legacy flag
    public bool RequiresDoctor { get; set; } = false;
    public bool IsActive { get; set; } = true;
    public string? ImageUrl { get; set; }
    public long? ParentServiceId { get; set; }
    public Service? ParentService { get; set; }
    public ICollection<Service>? SubServices { get; set; }
    public ServiceDeliveryType DeliveryType { get; set; } = ServiceDeliveryType.InClinic;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class ClinicService
{
    public long Id { get; set; }
    public long ClinicId { get; set; }
    public Clinic Clinic { get; set; } = null!;
    public long ServiceId { get; set; }
    public Service Service { get; set; } = null!;
    public decimal? Price { get; set; }
    public bool Active { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
