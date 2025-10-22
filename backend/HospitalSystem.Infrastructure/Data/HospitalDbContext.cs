using HospitalSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HospitalSystem.Infrastructure.Data;

public class HospitalDbContext : DbContext
{
    public HospitalDbContext(DbContextOptions<HospitalDbContext> options) : base(options)
    {
    }

    public DbSet<Patient> Patients { get; set; }
    public DbSet<Doctor> Doctors { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<MedicalRecord> MedicalRecords { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Patient configuration
        modelBuilder.Entity<Patient>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.NationalId).IsRequired().HasMaxLength(20);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.BloodType).HasMaxLength(10);
            entity.HasIndex(e => e.NationalId).IsUnique();
        });

        // Doctor configuration
        modelBuilder.Entity<Doctor>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LicenseNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Specialization).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.HasIndex(e => e.LicenseNumber).IsUnique();
        });

        // Appointment configuration
        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Notes).HasMaxLength(1000);
            entity.Property(e => e.Reason).HasMaxLength(500);

            entity.HasOne(e => e.Patient)
                .WithMany(p => p.Appointments)
                .HasForeignKey(e => e.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Doctor)
                .WithMany(d => d.Appointments)
                .HasForeignKey(e => e.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // MedicalRecord configuration
        modelBuilder.Entity<MedicalRecord>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Diagnosis).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Treatment).HasMaxLength(1000);
            entity.Property(e => e.Prescription).HasMaxLength(1000);
            entity.Property(e => e.Notes).HasMaxLength(2000);
            entity.Property(e => e.VitalSigns).HasMaxLength(1000);
            entity.Property(e => e.Attachments).HasMaxLength(2000);

            entity.HasOne(e => e.Patient)
                .WithMany(p => p.MedicalRecords)
                .HasForeignKey(e => e.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Doctor)
                .WithMany(d => d.MedicalRecords)
                .HasForeignKey(e => e.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Global query filters for soft delete
        modelBuilder.Entity<Patient>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Doctor>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Appointment>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<MedicalRecord>().HasQueryFilter(e => !e.IsDeleted);
    }
}
