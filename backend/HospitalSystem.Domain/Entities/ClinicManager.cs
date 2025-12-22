namespace HospitalSystem.Domain.Entities;

public class ClinicManager
{
    public long Id { get; set; }
    public long ClinicId { get; set; }
    public Clinic Clinic { get; set; } = null!;
    public long UserId { get; set; }
    public User User { get; set; } = null!;
}
