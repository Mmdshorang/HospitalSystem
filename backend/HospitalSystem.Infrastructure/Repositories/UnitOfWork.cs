using HospitalSystem.Application.Common.Interfaces;
using HospitalSystem.Domain.Entities;
using HospitalSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Storage;

namespace HospitalSystem.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly HospitalDbContext _context;
    private IDbContextTransaction? _transaction;
    private bool _disposed = false;

    public UnitOfWork(HospitalDbContext context)
    {
        _context = context;
        Patients = new Repository<Patient>(_context);
        Doctors = new Repository<Doctor>(_context);
        Appointments = new Repository<Appointment>(_context);
        MedicalRecords = new Repository<MedicalRecord>(_context);
    }

    public IRepository<Patient> Patients { get; }
    public IRepository<Doctor> Doctors { get; }
    public IRepository<Appointment> Appointments { get; }
    public IRepository<MedicalRecord> MedicalRecords { get; }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed && disposing)
        {
            _transaction?.Dispose();
            _context.Dispose();
            _disposed = true;
        }
    }
}
