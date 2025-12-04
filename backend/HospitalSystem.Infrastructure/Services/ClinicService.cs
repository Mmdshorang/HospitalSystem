using HospitalSystem.Application.DTOs;
using HospitalSystem.Domain.Entities;
using HospitalSystem.Domain.Entities.Enums;
using HospitalSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HospitalSystem.Infrastructure.Services;

public class ClinicService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ClinicService> _logger;

    public ClinicService(ApplicationDbContext context, ILogger<ClinicService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<ClinicDto>> GetAllAsync(string? searchTerm = null, string? city = null, bool? isActive = null)
    {
        var query = _context.Clinics
            .Include(c => c.Manager)
            .Include(c => c.Addresses)
            .Include(c => c.WorkHours)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var searchLower = searchTerm.ToLower();
            query = query.Where(c =>
                (c.Name != null && c.Name.ToLower().Contains(searchLower)) ||
                (c.Phone != null && c.Phone.Contains(searchTerm)) ||
                (c.Email != null && c.Email.ToLower().Contains(searchLower))
            );
        }

        if (!string.IsNullOrWhiteSpace(city))
        {
            query = query.Where(c => c.Addresses != null && c.Addresses.Any(a => a.City != null && a.City.Contains(city)));
        }

        if (isActive.HasValue)
        {
            query = query.Where(c => c.IsActive == isActive.Value);
        }

        var clinics = await query
            .OrderBy(c => c.Name)
            .ToListAsync();

        return clinics.Select(c => MapToDto(c));
    }

    public async Task<ClinicDto?> GetByIdAsync(long id)
    {
        var clinic = await _context.Clinics
            .Include(c => c.Manager)
            .Include(c => c.Addresses)
            .Include(c => c.WorkHours)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (clinic == null) return null;

        return MapToDto(clinic);
    }

    public async Task<ClinicDto> CreateAsync(CreateClinicDto dto)
    {
        var clinic = new Clinic
        {
            Name = dto.Name,
            Phone = dto.Phone,
            Email = dto.Email,
            ManagerId = dto.ManagerId,
            LogoUrl = dto.LogoUrl,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Clinics.Add(clinic);
        await _context.SaveChangesAsync();

        // Add work hours if provided
        if (dto.WorkHours != null && dto.WorkHours.Any())
        {
            var workHours = dto.WorkHours.Select(wh => new ClinicWorkHours
            {
                ClinicId = clinic.Id,
                DayOfWeek = Enum.Parse<DayOfWeekEnum>(wh.DayOfWeek, true),
                StartTime = wh.StartTime,
                EndTime = wh.EndTime,
                IsActive = wh.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }).ToList();

            _context.ClinicWorkHours.AddRange(workHours);
        }

        // Add addresses if provided
        if (dto.Addresses != null && dto.Addresses.Any())
        {
            var addresses = dto.Addresses.Select(addr => new ClinicAddress
            {
                ClinicId = clinic.Id,
                Street = addr.Street,
                City = addr.City,
                State = addr.State,
                PostalCode = addr.PostalCode,
                Country = addr.Country
            }).ToList();

            _context.ClinicAddresses.AddRange(addresses);
        }

        await _context.SaveChangesAsync();

        // Reload with includes
        return await GetByIdAsync(clinic.Id) ?? MapToDto(clinic);
    }

    public async Task<ClinicDto?> UpdateAsync(long id, UpdateClinicDto dto)
    {
        var clinic = await _context.Clinics
            .Include(c => c.Manager)
            .Include(c => c.Addresses)
            .Include(c => c.WorkHours)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (clinic == null) return null;

        clinic.Name = dto.Name;
        clinic.Phone = dto.Phone;
        clinic.Email = dto.Email;
        clinic.ManagerId = dto.ManagerId;
        clinic.LogoUrl = dto.LogoUrl;
        clinic.IsActive = dto.IsActive;
        clinic.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(clinic);
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var clinic = await _context.Clinics.FindAsync(id);
        if (clinic == null) return false;

        _context.Clinics.Remove(clinic);
        await _context.SaveChangesAsync();
        return true;
    }

    // Clinic Services methods
    public async Task<IEnumerable<ClinicServiceDto>> GetClinicServicesAsync(long clinicId)
    {
        var clinicServices = await _context.ClinicServices
            .Include(cs => cs.Clinic)
            .Include(cs => cs.Service)
                .ThenInclude(s => s!.Category)
            .Where(cs => cs.ClinicId == clinicId)
            .OrderBy(cs => cs.Service != null ? cs.Service.Name : "")
            .ToListAsync();

        return clinicServices.Select(cs => new ClinicServiceDto
        {
            Id = cs.Id,
            ClinicId = cs.ClinicId,
            ClinicName = cs.Clinic?.Name,
            ServiceId = cs.ServiceId,
            ServiceName = cs.Service?.Name,
            Price = cs.Price,
            Active = cs.Active,
            CreatedAt = cs.CreatedAt,
            UpdatedAt = cs.UpdatedAt
        });
    }

    public async Task<ClinicServiceDto?> AddClinicServiceAsync(long clinicId, CreateClinicServiceDto dto)
    {
        // Verify clinic exists
        var clinic = await _context.Clinics.FindAsync(clinicId);
        if (clinic == null) return null;

        // Verify service exists
        var service = await _context.Services.FindAsync(dto.ServiceId);
        if (service == null) return null;

        // Check if already exists
        var existing = await _context.ClinicServices
            .FirstOrDefaultAsync(cs => cs.ClinicId == clinicId && cs.ServiceId == dto.ServiceId);
        if (existing != null) return null;

        var clinicService = new Domain.Entities.ClinicService
        {
            ClinicId = clinicId,
            ServiceId = dto.ServiceId,
            Price = dto.Price,
            Active = dto.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.ClinicServices.Add(clinicService);
        await _context.SaveChangesAsync();

        // Reload with includes
        await _context.Entry(clinicService)
            .Reference(cs => cs.Clinic)
            .LoadAsync();
        await _context.Entry(clinicService)
            .Reference(cs => cs.Service)
            .LoadAsync();

        return new ClinicServiceDto
        {
            Id = clinicService.Id,
            ClinicId = clinicService.ClinicId,
            ClinicName = clinicService.Clinic?.Name,
            ServiceId = clinicService.ServiceId,
            ServiceName = clinicService.Service?.Name,
            Price = clinicService.Price,
            Active = clinicService.Active,
            CreatedAt = clinicService.CreatedAt,
            UpdatedAt = clinicService.UpdatedAt
        };
    }

    public async Task<ClinicServiceDto?> UpdateClinicServiceAsync(long clinicId, long serviceId, CreateClinicServiceDto dto)
    {
        var clinicService = await _context.ClinicServices
            .Include(cs => cs.Clinic)
            .Include(cs => cs.Service)
            .FirstOrDefaultAsync(cs => cs.ClinicId == clinicId && cs.ServiceId == serviceId);

        if (clinicService == null) return null;

        clinicService.Price = dto.Price;
        clinicService.Active = dto.Active;
        clinicService.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new ClinicServiceDto
        {
            Id = clinicService.Id,
            ClinicId = clinicService.ClinicId,
            ClinicName = clinicService.Clinic?.Name,
            ServiceId = clinicService.ServiceId,
            ServiceName = clinicService.Service?.Name,
            Price = clinicService.Price,
            Active = clinicService.Active,
            CreatedAt = clinicService.CreatedAt,
            UpdatedAt = clinicService.UpdatedAt
        };
    }

    public async Task<bool> DeleteClinicServiceAsync(long clinicId, long serviceId)
    {
        var clinicService = await _context.ClinicServices
            .FirstOrDefaultAsync(cs => cs.ClinicId == clinicId && cs.ServiceId == serviceId);

        if (clinicService == null) return false;

        _context.ClinicServices.Remove(clinicService);
        await _context.SaveChangesAsync();
        return true;
    }

    private ClinicDto MapToDto(Clinic clinic)
    {
        return new ClinicDto
        {
            Id = clinic.Id,
            Name = clinic.Name,
            Phone = clinic.Phone,
            Email = clinic.Email,
            ManagerId = clinic.ManagerId,
            ManagerName = clinic.Manager != null ? $"{clinic.Manager.FirstName} {clinic.Manager.LastName}" : null,
            LogoUrl = clinic.LogoUrl,
            IsActive = clinic.IsActive,
            CreatedAt = clinic.CreatedAt,
            UpdatedAt = clinic.UpdatedAt,
            WorkHours = clinic.WorkHours?.Select(wh => new ClinicWorkHoursDto
            {
                Id = wh.Id,
                DayOfWeek = wh.DayOfWeek.ToString(),
                StartTime = wh.StartTime,
                EndTime = wh.EndTime,
                IsActive = wh.IsActive,
                CreatedAt = wh.CreatedAt,
                UpdatedAt = wh.UpdatedAt
            }).ToList(),
            Addresses = clinic.Addresses?.Select(addr => new ClinicAddressDto
            {
                Id = addr.Id,
                Street = addr.Street,
                City = addr.City,
                State = addr.State,
                PostalCode = addr.PostalCode,
                Country = addr.Country
            }).ToList()
        };
    }
}

