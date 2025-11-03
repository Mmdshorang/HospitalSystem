namespace HospitalSystem.Application.DTOs;

public class ClinicDto
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public long? ManagerId { get; set; }
    public string? ManagerName { get; set; }
    public string? LogoUrl { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<ClinicWorkHoursDto>? WorkHours { get; set; }
    public List<ClinicAddressDto>? Addresses { get; set; }
}

public class CreateClinicDto
{
    public string? Name { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public long? ManagerId { get; set; }
    public string? LogoUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public List<CreateClinicWorkHoursDto>? WorkHours { get; set; }
    public List<CreateClinicAddressDto>? Addresses { get; set; }
}

public class UpdateClinicDto
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public long? ManagerId { get; set; }
    public string? LogoUrl { get; set; }
    public bool IsActive { get; set; } = true;
}

public class ClinicWorkHoursDto
{
    public long Id { get; set; }
    public string DayOfWeek { get; set; } = string.Empty;
    public TimeSpan? StartTime { get; set; }
    public TimeSpan? EndTime { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateClinicWorkHoursDto
{
    public string DayOfWeek { get; set; } = string.Empty;
    public TimeSpan? StartTime { get; set; }
    public TimeSpan? EndTime { get; set; }
    public bool IsActive { get; set; } = true;
}

public class ClinicAddressDto
{
    public long Id { get; set; }
    public string? Street { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
}

public class CreateClinicAddressDto
{
    public string? Street { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
}

