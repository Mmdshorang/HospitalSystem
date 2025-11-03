namespace HospitalSystem.Application.DTOs;

public class ServiceDto
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public long? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public decimal? BasePrice { get; set; }
    public int? DurationMinutes { get; set; }
    public bool IsInPerson { get; set; }
    public bool RequiresDoctor { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateServiceDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public long? CategoryId { get; set; }
    public decimal? BasePrice { get; set; }
    public int? DurationMinutes { get; set; }
    public bool IsInPerson { get; set; } = true;
    public bool RequiresDoctor { get; set; } = false;
}

public class UpdateServiceDto
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public long? CategoryId { get; set; }
    public decimal? BasePrice { get; set; }
    public int? DurationMinutes { get; set; }
    public bool IsInPerson { get; set; }
    public bool RequiresDoctor { get; set; }
}

public class ServiceCategoryDto
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateServiceCategoryDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
}

public class UpdateServiceCategoryDto
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
}

public class ClinicServiceDto
{
    public long Id { get; set; }
    public long ClinicId { get; set; }
    public string? ClinicName { get; set; }
    public long ServiceId { get; set; }
    public string? ServiceName { get; set; }
    public decimal? Price { get; set; }
    public bool Active { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateClinicServiceDto
{
    public long ClinicId { get; set; }
    public long ServiceId { get; set; }
    public decimal? Price { get; set; }
    public bool Active { get; set; } = true;
}

