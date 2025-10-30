using HospitalSystem.Domain.Entities.Lookups;

namespace HospitalSystem.Domain.Entities
{
    public class ProviderProfile
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public User User { get; set; } = null!;
        public long? ClinicId { get; set; }
        public Clinic? Clinic { get; set; }
        public long? SpecialtyId { get; set; }
        public Specialty? Specialty { get; set; }
        public string? Degree { get; set; }
        public int? ExperienceYears { get; set; }
        public decimal? SharePercent { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ICollection<WorkSchedule>? WorkSchedules { get; set; }
    }

    public class WorkSchedule
    {
        public long Id { get; set; }
        public long ProviderId { get; set; }
        public ProviderProfile Provider { get; set; } = null!;
        public short WeekDayId { get; set; }
        public WeekDay WeekDay { get; set; } = null!;
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
        public bool IsActive { get; set; } = true;
    }
}