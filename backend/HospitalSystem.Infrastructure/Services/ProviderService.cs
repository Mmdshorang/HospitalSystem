using HospitalSystem.Infrastructure.Models;
using HospitalSystem.Domain.Entities;
using HospitalSystem.Domain.Entities.Enums;
using HospitalSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HospitalSystem.Infrastructure.Services;

public class ProviderService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ProviderService> _logger;

    public ProviderService(ApplicationDbContext context, ILogger<ProviderService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<ProviderProfileDto>> GetAllAsync(string? searchTerm = null, long? specialtyId = null, long? clinicId = null, bool? isActive = null)
    {
        var query = _context.ProviderProfiles
            .Include(p => p.User)
            .Include(p => p.Clinic)
            .Include(p => p.Specialty)
            .Include(p => p.WorkSchedules)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var searchLower = searchTerm.ToLower();
            query = query.Where(p =>
                (p.User != null && p.User.FirstName != null && p.User.FirstName.ToLower().Contains(searchLower)) ||
                (p.User != null && p.User.LastName != null && p.User.LastName.ToLower().Contains(searchLower)) ||
                (p.User != null && p.User.Email != null && p.User.Email.ToLower().Contains(searchLower)) ||
                (p.Specialty != null && p.Specialty.Name != null && p.Specialty.Name.ToLower().Contains(searchLower))
            );
        }

        if (specialtyId.HasValue)
        {
            query = query.Where(p => p.SpecialtyId == specialtyId.Value);
        }

        if (clinicId.HasValue)
        {
            query = query.Where(p => p.ClinicId == clinicId.Value);
        }

        if (isActive.HasValue)
        {
            query = query.Where(p => p.IsActive == isActive.Value);
        }

        var providers = await query
            .OrderBy(p => p.User != null ? p.User.FirstName : "")
            .ThenBy(p => p.User != null ? p.User.LastName : "")
            .ToListAsync();

        return providers.Select(p => new ProviderProfileDto
        {
            Id = p.Id,
            UserId = p.UserId,
            UserFirstName = p.User?.FirstName,
            UserLastName = p.User?.LastName,
            UserEmail = p.User?.Email,
            ClinicId = p.ClinicId,
            ClinicName = p.Clinic?.Name,
            SpecialtyId = p.SpecialtyId,
            SpecialtyName = p.Specialty?.Name,
            Degree = p.Degree,
            ExperienceYears = p.ExperienceYears,
            SharePercent = p.SharePercent,
            IsActive = p.IsActive,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt,
            WorkSchedules = p.WorkSchedules?.Select(ws => new WorkScheduleDto
            {
                Id = ws.Id,
                DayOfWeek = ws.DayOfWeek.ToString(),
                StartTime = ws.StartTime,
                EndTime = ws.EndTime,
                IsActive = ws.IsActive
            }).ToList()
        });
    }

    public async Task<ProviderProfileDto?> GetByIdAsync(long id)
    {
        var provider = await _context.ProviderProfiles
            .Include(p => p.User)
            .Include(p => p.Clinic)
            .Include(p => p.Specialty)
            .Include(p => p.WorkSchedules)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (provider == null) return null;

        return new ProviderProfileDto
        {
            Id = provider.Id,
            UserId = provider.UserId,
            UserFirstName = provider.User?.FirstName,
            UserLastName = provider.User?.LastName,
            UserEmail = provider.User?.Email,
            ClinicId = provider.ClinicId,
            ClinicName = provider.Clinic?.Name,
            SpecialtyId = provider.SpecialtyId,
            SpecialtyName = provider.Specialty?.Name,
            Degree = provider.Degree,
            ExperienceYears = provider.ExperienceYears,
            SharePercent = provider.SharePercent,
            IsActive = provider.IsActive,
            CreatedAt = provider.CreatedAt,
            UpdatedAt = provider.UpdatedAt,
            WorkSchedules = provider.WorkSchedules?.Select(ws => new WorkScheduleDto
            {
                Id = ws.Id,
                DayOfWeek = ws.DayOfWeek.ToString(),
                StartTime = ws.StartTime,
                EndTime = ws.EndTime,
                IsActive = ws.IsActive
            }).ToList()
        };
    }

    public async Task<ProviderProfileDto> CreateAsync(CreateProviderProfileDto dto)
    {
        var provider = new ProviderProfile
        {
            UserId = dto.UserId,
            ClinicId = dto.ClinicId,
            SpecialtyId = dto.SpecialtyId,
            Degree = dto.Degree,
            ExperienceYears = dto.ExperienceYears,
            SharePercent = dto.SharePercent,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.ProviderProfiles.Add(provider);
        await _context.SaveChangesAsync();

        // Add work schedules if provided
        if (dto.WorkSchedules != null && dto.WorkSchedules.Any())
        {
            foreach (var wsDto in dto.WorkSchedules)
            {
                if (Enum.TryParse<DayOfWeekEnum>(wsDto.DayOfWeek, true, out var dayOfWeek))
                {
                    var workSchedule = new WorkSchedule
                    {
                        ProviderId = provider.Id,
                        DayOfWeek = dayOfWeek,
                        StartTime = wsDto.StartTime,
                        EndTime = wsDto.EndTime,
                        IsActive = wsDto.IsActive
                    };
                    _context.WorkSchedules.Add(workSchedule);
                }
            }
            await _context.SaveChangesAsync();
        }

        // Load related entities
        await _context.Entry(provider)
            .Reference(p => p.User)
            .LoadAsync();
        await _context.Entry(provider)
            .Reference(p => p.Clinic)
            .LoadAsync();
        await _context.Entry(provider)
            .Reference(p => p.Specialty)
            .LoadAsync();
        await _context.Entry(provider)
            .Collection(p => p.WorkSchedules)
            .LoadAsync();

        return new ProviderProfileDto
        {
            Id = provider.Id,
            UserId = provider.UserId,
            UserFirstName = provider.User?.FirstName,
            UserLastName = provider.User?.LastName,
            UserEmail = provider.User?.Email,
            ClinicId = provider.ClinicId,
            ClinicName = provider.Clinic?.Name,
            SpecialtyId = provider.SpecialtyId,
            SpecialtyName = provider.Specialty?.Name,
            Degree = provider.Degree,
            ExperienceYears = provider.ExperienceYears,
            SharePercent = provider.SharePercent,
            IsActive = provider.IsActive,
            CreatedAt = provider.CreatedAt,
            UpdatedAt = provider.UpdatedAt,
            WorkSchedules = provider.WorkSchedules?.Select(ws => new WorkScheduleDto
            {
                Id = ws.Id,
                DayOfWeek = ws.DayOfWeek.ToString(),
                StartTime = ws.StartTime,
                EndTime = ws.EndTime,
                IsActive = ws.IsActive
            }).ToList()
        };
    }

    public async Task<ProviderProfileDto?> UpdateAsync(long id, UpdateProviderProfileDto dto)
    {
        var provider = await _context.ProviderProfiles
            .Include(p => p.User)
            .Include(p => p.Clinic)
            .Include(p => p.Specialty)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (provider == null) return null;

        provider.ClinicId = dto.ClinicId;
        provider.SpecialtyId = dto.SpecialtyId;
        provider.Degree = dto.Degree;
        provider.ExperienceYears = dto.ExperienceYears;
        provider.SharePercent = dto.SharePercent;
        provider.IsActive = dto.IsActive;
        provider.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        await _context.Entry(provider)
            .Reference(p => p.Clinic)
            .LoadAsync();
        await _context.Entry(provider)
            .Reference(p => p.Specialty)
            .LoadAsync();

        return new ProviderProfileDto
        {
            Id = provider.Id,
            UserId = provider.UserId,
            UserFirstName = provider.User?.FirstName,
            UserLastName = provider.User?.LastName,
            UserEmail = provider.User?.Email,
            ClinicId = provider.ClinicId,
            ClinicName = provider.Clinic?.Name,
            SpecialtyId = provider.SpecialtyId,
            SpecialtyName = provider.Specialty?.Name,
            Degree = provider.Degree,
            ExperienceYears = provider.ExperienceYears,
            SharePercent = provider.SharePercent,
            IsActive = provider.IsActive,
            CreatedAt = provider.CreatedAt,
            UpdatedAt = provider.UpdatedAt
        };
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var provider = await _context.ProviderProfiles.FindAsync(id);
        if (provider == null) return false;

        _context.ProviderProfiles.Remove(provider);
        await _context.SaveChangesAsync();
        return true;
    }
}

