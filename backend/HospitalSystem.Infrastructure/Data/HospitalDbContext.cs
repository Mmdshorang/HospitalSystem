// NOTE: This DbContext is kept for backward compatibility but is no longer actively used
// The new schema uses ApplicationDbContext instead
// This file can be removed or kept for legacy support

using HospitalSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HospitalSystem.Infrastructure.Data;

public class HospitalDbContext : DbContext
{
    public HospitalDbContext(DbContextOptions<HospitalDbContext> options) : base(options)
    {
    }

    // Old entities removed: Patient, Doctor, Appointment, MedicalRecord
    // These entities are no longer in the new schema
    // Use ApplicationDbContext for new development

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Old configurations removed - use ApplicationDbContext instead
    }
}
