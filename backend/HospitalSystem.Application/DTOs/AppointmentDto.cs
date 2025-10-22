namespace HospitalSystem.Application.DTOs;

public class AppointmentDto
{
    public Guid Id { get; set; }
    public DateTime AppointmentDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    public PatientDto Patient { get; set; } = null!;
    public DoctorDto Doctor { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateAppointmentDto
{
    public DateTime AppointmentDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string Notes { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
}

public class UpdateAppointmentDto
{
    public Guid Id { get; set; }
    public DateTime AppointmentDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
}
