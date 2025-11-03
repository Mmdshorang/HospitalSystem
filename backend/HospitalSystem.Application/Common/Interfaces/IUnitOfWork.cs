namespace HospitalSystem.Application.Common.Interfaces;

public interface IUnitOfWork : IDisposable
{
    // Note: Old entities (Patient, Doctor, Appointment, MedicalRecord) have been removed
    // This UnitOfWork is kept for backward compatibility but is empty
    // New code should use ApplicationDbContext directly
    
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
