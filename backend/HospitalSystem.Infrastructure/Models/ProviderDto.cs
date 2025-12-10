namespace HospitalSystem.Infrastructure.Models;

public class ProviderProfileDto
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public string? UserFirstName { get; set; }
    public string? UserLastName { get; set; }
    public string? UserPhone { get; set; }
    public long? ClinicId { get; set; }
    public string? ClinicName { get; set; }
    public long? SpecialtyId { get; set; }
    public string? SpecialtyName { get; set; }
    public string? Degree { get; set; }
    public int? ExperienceYears { get; set; }
    public decimal? SharePercent { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<WorkScheduleDto>? WorkSchedules { get; set; }
}

public class CreateProviderProfileDto
{
    public long UserId { get; set; }
    public long? ClinicId { get; set; }
    public long? SpecialtyId { get; set; }
    public string? Degree { get; set; }
    public int? ExperienceYears { get; set; }
    public decimal? SharePercent { get; set; }
    public bool IsActive { get; set; } = true;
    public List<CreateWorkScheduleDto>? WorkSchedules { get; set; }
}

public class UpdateProviderProfileDto
{
    public long Id { get; set; }
    public long? ClinicId { get; set; }
    public long? SpecialtyId { get; set; }
    public string? Degree { get; set; }
    public int? ExperienceYears { get; set; }
    public decimal? SharePercent { get; set; }
    public bool IsActive { get; set; } = true;
}

public class WorkScheduleDto
{
    public long Id { get; set; }
    public string DayOfWeek { get; set; } = string.Empty;
    public TimeSpan? StartTime { get; set; }
    public TimeSpan? EndTime { get; set; }
    public bool IsActive { get; set; }
}

public class CreateWorkScheduleDto
{
    public string DayOfWeek { get; set; } = string.Empty;
    public TimeSpan? StartTime { get; set; }
    public TimeSpan? EndTime { get; set; }
    public bool IsActive { get; set; } = true;
}

