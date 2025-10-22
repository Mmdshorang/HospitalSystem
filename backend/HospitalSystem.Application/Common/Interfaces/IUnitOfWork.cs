namespace HospitalSystem.Application.Common.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<Domain.Entities.Patient> Patients { get; }
    IRepository<Domain.Entities.Doctor> Doctors { get; }
    IRepository<Domain.Entities.Appointment> Appointments { get; }
    IRepository<Domain.Entities.MedicalRecord> MedicalRecords { get; }
    
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
