using Microsoft.EntityFrameworkCore;
using HospitalSystem.Domain.Entities;
using HospitalSystem.Domain.Entities.Lookups;

namespace HospitalSystem.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        #region DbSets
        public DbSet<UserRole> UserRoles { get; set; } = null!;
        public DbSet<Gender> Genders { get; set; } = null!;
        public DbSet<AppointmentType> AppointmentTypes { get; set; } = null!;
        public DbSet<RequestStatus> RequestStatuses { get; set; } = null!;
        public DbSet<PaymentMethod> PaymentMethods { get; set; } = null!;
        public DbSet<PaymentStatus> PaymentStatuses { get; set; } = null!;
        public DbSet<NotificationType> NotificationTypes { get; set; } = null!;
        public DbSet<WeekDay> WeekDays { get; set; } = null!;

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<SpecialtyCategory> SpecialtyCategories { get; set; } = null!;
        public DbSet<Specialty> Specialties { get; set; } = null!;
        public DbSet<ProviderProfile> ProviderProfiles { get; set; } = null!;
        public DbSet<WorkSchedule> WorkSchedules { get; set; } = null!;
        public DbSet<PatientProfile> PatientProfiles { get; set; } = null!;
        public DbSet<Clinic> Clinics { get; set; } = null!;
        public DbSet<ClinicWorkHours> ClinicWorkHours { get; set; } = null!;
        public DbSet<ClinicAddress> ClinicAddresses { get; set; } = null!;
        public DbSet<ServiceCategory> ServiceCategories { get; set; } = null!;
        public DbSet<Service> Services { get; set; } = null!;
        public DbSet<Insurance> Insurances { get; set; } = null!;
        public DbSet<PatientInsurance> PatientInsurances { get; set; } = null!;
        public DbSet<ClinicInsurance> ClinicInsurances { get; set; } = null!;
        public DbSet<ClinicService> ClinicServices { get; set; } = null!;
        public DbSet<ServiceRequest> ServiceRequests { get; set; } = null!;
        public DbSet<ServiceResult> ServiceResults { get; set; } = null!;
        public DbSet<Payment> Payments { get; set; } = null!;
        public DbSet<Notification> Notifications { get; set; } = null!;
        public DbSet<AuditLog> AuditLogs { get; set; } = null!;
        public DbSet<Appointment> Appointments { get; set; } = null!;
        public DbSet<Doctor> Doctors { get; set; } = null!;
        public DbSet<Patient> Patients { get; set; } = null!;
        public DbSet<MedicalRecord> MedicalRecords { get; set; } = null!;
        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Lookup seeds
            modelBuilder.Entity<UserRole>().HasData(
                new UserRole { Id = 1, RoleName = "admin" },
                new UserRole { Id = 2, RoleName = "doctor" },
                new UserRole { Id = 3, RoleName = "patient" }
            );

            modelBuilder.Entity<Gender>().HasData(
                new Gender { Id = 1, GenderName = "male" },
                new Gender { Id = 2, GenderName = "female" },
                new Gender { Id = 3, GenderName = "other" }
            );

            modelBuilder.Entity<AppointmentType>().HasData(
                new AppointmentType { Id = 1, TypeName = "in_person" },
                new AppointmentType { Id = 2, TypeName = "remote" }
            );

            modelBuilder.Entity<RequestStatus>().HasData(
                new RequestStatus { Id = 1, StatusName = "pending" },
                new RequestStatus { Id = 2, StatusName = "approved" },
                new RequestStatus { Id = 3, StatusName = "in_progress" },
                new RequestStatus { Id = 4, StatusName = "done" },
                new RequestStatus { Id = 5, StatusName = "rejected" }
            );

            modelBuilder.Entity<PaymentMethod>().HasData(
                new PaymentMethod { Id = 1, MethodName = "online" },
                new PaymentMethod { Id = 2, MethodName = "cash" },
                new PaymentMethod { Id = 3, MethodName = "card" }
            );

            modelBuilder.Entity<PaymentStatus>().HasData(
                new PaymentStatus { Id = 1, StatusName = "pending" },
                new PaymentStatus { Id = 2, StatusName = "success" },
                new PaymentStatus { Id = 3, StatusName = "failed" }
            );

            modelBuilder.Entity<NotificationType>().HasData(
                new NotificationType { Id = 1, TypeName = "info" },
                new NotificationType { Id = 2, TypeName = "warning" },
                new NotificationType { Id = 3, TypeName = "success" }
            );

            modelBuilder.Entity<WeekDay>().HasData(
                new WeekDay { Id = 1, Label = "Monday" },
                new WeekDay { Id = 2, Label = "Tuesday" },
                new WeekDay { Id = 3, Label = "Wednesday" },
                new WeekDay { Id = 4, Label = "Thursday" },
                new WeekDay { Id = 5, Label = "Friday" },
                new WeekDay { Id = 6, Label = "Saturday" },
                new WeekDay { Id = 7, Label = "Sunday" }
            );

            // Configure entity relationships
            ConfigureEntityRelationships(modelBuilder);
        }

        private void ConfigureEntityRelationships(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(b =>
            {
                b.Property(u => u.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                b.Property(u => u.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
                b.HasIndex(u => u.RoleId);
                b.HasIndex(u => u.GenderId);
                b.HasOne(u => u.Role).WithMany().HasForeignKey(u => u.RoleId).OnDelete(DeleteBehavior.Restrict);
                b.HasOne(u => u.Gender).WithMany().HasForeignKey(u => u.GenderId).OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<ProviderProfile>(b =>
            {
                b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                b.Property(x => x.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
                b.HasOne(p => p.User).WithOne(u => u.ProviderProfile).HasForeignKey<ProviderProfile>(p => p.UserId).OnDelete(DeleteBehavior.Cascade);
                b.HasOne(p => p.Clinic).WithMany().HasForeignKey(p => p.ClinicId).OnDelete(DeleteBehavior.SetNull);
                b.HasOne(p => p.Specialty).WithMany().HasForeignKey(p => p.SpecialtyId).OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<WorkSchedule>(b =>
            {
                b.HasOne(ws => ws.Provider).WithMany(p => p.WorkSchedules).HasForeignKey(ws => ws.ProviderId).OnDelete(DeleteBehavior.Cascade);
                b.HasOne(ws => ws.WeekDay).WithMany().HasForeignKey(ws => ws.WeekDayId).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<PatientProfile>(b =>
            {
                b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                b.Property(x => x.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
                b.HasOne(pp => pp.User).WithOne(u => u.PatientProfile).HasForeignKey<PatientProfile>(pp => pp.UserId).OnDelete(DeleteBehavior.Cascade);
            });

            // Configure other entities...
            ConfigureMoreEntityRelationships(modelBuilder);
        }

        private void ConfigureMoreEntityRelationships(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Clinic>(b =>
            {
                b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                b.Property(x => x.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
                b.HasOne(c => c.Manager).WithMany().HasForeignKey(c => c.ManagerId).OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<ClinicWorkHours>(b =>
            {
                b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                b.Property(x => x.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
                b.HasOne(cw => cw.Clinic).WithMany(c => c.WorkHours).HasForeignKey(cw => cw.ClinicId).OnDelete(DeleteBehavior.Cascade);
                b.HasOne(cw => cw.WeekDay).WithMany().HasForeignKey(cw => cw.WeekDayId).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ServiceRequest>(b =>
            {
                b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                b.Property(x => x.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
                b.HasOne(sr => sr.Patient).WithMany(u => u.ServiceRequests).HasForeignKey(sr => sr.PatientId).OnDelete(DeleteBehavior.Cascade);
                b.HasOne(sr => sr.Status).WithMany().HasForeignKey(sr => sr.StatusId).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Payment>(b =>
            {
                b.HasOne(p => p.Request).WithMany().HasForeignKey(p => p.RequestId).OnDelete(DeleteBehavior.Cascade);
                b.HasOne(p => p.PaymentMethod).WithMany().HasForeignKey(p => p.PaymentMethodId).OnDelete(DeleteBehavior.SetNull);
                b.HasOne(p => p.PaymentStatus).WithMany().HasForeignKey(p => p.PaymentStatusId).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Notification>(b =>
            {
                b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                b.HasOne(n => n.User).WithMany(u => u.Notifications).HasForeignKey(n => n.UserId).OnDelete(DeleteBehavior.Cascade);
                b.HasOne(n => n.NotificationType).WithMany().HasForeignKey(n => n.NotificationTypeId).OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<AuditLog>(b =>
            {
                b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                b.HasOne(a => a.User).WithMany(u => u.AuditLogs).HasForeignKey(a => a.UserId).OnDelete(DeleteBehavior.SetNull);
            });
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries();
            var currentTime = DateTime.UtcNow;

            foreach (var entry in entries)
            {
                if (entry.Entity is User u)
                {
                    if (entry.State == EntityState.Added)
                    {
                        u.CreatedAt = currentTime;
                        u.UpdatedAt = currentTime;
                    }
                    else if (entry.State == EntityState.Modified)
                    {
                        u.UpdatedAt = currentTime;
                    }
                }

                // Add similar blocks for other entities that have timestamps
                // This ensures all entities with timestamps are properly updated
            }
        }
    }
}