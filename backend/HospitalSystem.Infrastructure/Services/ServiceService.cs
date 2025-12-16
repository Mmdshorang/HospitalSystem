using HospitalSystem.Application.DTOs;
using HospitalSystem.Domain.Entities;
using HospitalSystem.Domain.Entities.Enums;
using HospitalSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HospitalSystem.Infrastructure.Services;

public class ServiceService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ServiceService> _logger;

    public ServiceService(ApplicationDbContext context, ILogger<ServiceService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<ServiceDto>> GetAllAsync(string? searchTerm = null, long? categoryId = null)
    {
        var query = _context.Services
            .Include(s => s.Category)
            .Include(s => s.ParentService)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var searchLower = searchTerm.ToLower();
            query = query.Where(s =>
                (s.Name != null && s.Name.ToLower().Contains(searchLower)) ||
                (s.Description != null && s.Description.ToLower().Contains(searchLower))
            );
        }

        if (categoryId.HasValue)
        {
            query = query.Where(s => s.CategoryId == categoryId.Value);
        }

        var services = await query
            .OrderBy(s => s.Name)
            .ToListAsync();

        return services.Select(s => new ServiceDto
        {
            Id = s.Id,
            Name = s.Name,
            Description = s.Description,
            CategoryId = s.CategoryId,
            CategoryName = s.Category?.Name,
            BasePrice = s.BasePrice,
            DurationMinutes = s.DurationMinutes,
            IsInPerson = s.IsInPerson,
            RequiresDoctor = s.RequiresDoctor,
            IsActive = s.IsActive,
            ImageUrl = s.ImageUrl,
            ParentServiceId = s.ParentServiceId,
            ParentServiceName = s.ParentService?.Name,
            DeliveryType = s.DeliveryType.ToString(),
            CreatedAt = s.CreatedAt,
            UpdatedAt = s.UpdatedAt
        });
    }

    public async Task<ServiceDto?> GetByIdAsync(long id)
    {
        var service = await _context.Services
            .Include(s => s.Category)
            .Include(s => s.ParentService)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (service == null) return null;

        return new ServiceDto
        {
            Id = service.Id,
            Name = service.Name,
            Description = service.Description,
            CategoryId = service.CategoryId,
            CategoryName = service.Category?.Name,
            BasePrice = service.BasePrice,
            DurationMinutes = service.DurationMinutes,
            IsInPerson = service.IsInPerson,
            RequiresDoctor = service.RequiresDoctor,
            IsActive = service.IsActive,
            ImageUrl = service.ImageUrl,
            ParentServiceId = service.ParentServiceId,
            ParentServiceName = service.ParentService?.Name,
            DeliveryType = service.DeliveryType.ToString(),
            CreatedAt = service.CreatedAt,
            UpdatedAt = service.UpdatedAt
        };
    }

    public async Task<ServiceDto> CreateAsync(CreateServiceDto dto)
    {
        var service = new Domain.Entities.Service
        {
            Name = dto.Name,
            Description = dto.Description,
            CategoryId = dto.CategoryId,
            BasePrice = dto.BasePrice,
            DurationMinutes = dto.DurationMinutes,
            IsInPerson = dto.IsInPerson,
            RequiresDoctor = dto.RequiresDoctor,
            IsActive = dto.IsActive,
            ImageUrl = dto.ImageUrl,
            ParentServiceId = dto.ParentServiceId,
            DeliveryType = ParseDeliveryType(dto.DeliveryType),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Services.Add(service);
        await _context.SaveChangesAsync();

        await _context.Entry(service)
            .Reference(s => s.Category)
            .LoadAsync();

        return new ServiceDto
        {
            Id = service.Id,
            Name = service.Name,
            Description = service.Description,
            CategoryId = service.CategoryId,
            CategoryName = service.Category?.Name,
            BasePrice = service.BasePrice,
            DurationMinutes = service.DurationMinutes,
            IsInPerson = service.IsInPerson,
            RequiresDoctor = service.RequiresDoctor,
            IsActive = service.IsActive,
            ImageUrl = service.ImageUrl,
            ParentServiceId = service.ParentServiceId,
            ParentServiceName = service.ParentService?.Name,
            DeliveryType = service.DeliveryType.ToString(),
            CreatedAt = service.CreatedAt,
            UpdatedAt = service.UpdatedAt
        };
    }

    public async Task<ServiceDto?> UpdateAsync(long id, UpdateServiceDto dto)
    {
        var service = await _context.Services
            .Include(s => s.Category)
            .Include(s => s.ParentService)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (service == null) return null;

        service.Name = dto.Name;
        service.Description = dto.Description;
        service.CategoryId = dto.CategoryId;
        service.BasePrice = dto.BasePrice;
        service.DurationMinutes = dto.DurationMinutes;
        service.IsInPerson = dto.IsInPerson;
        service.RequiresDoctor = dto.RequiresDoctor;
        service.IsActive = dto.IsActive;
        service.ImageUrl = dto.ImageUrl;
        service.ParentServiceId = dto.ParentServiceId;
        service.DeliveryType = ParseDeliveryType(dto.DeliveryType);
        service.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new ServiceDto
        {
            Id = service.Id,
            Name = service.Name,
            Description = service.Description,
            CategoryId = service.CategoryId,
            CategoryName = service.Category?.Name,
            BasePrice = service.BasePrice,
            DurationMinutes = service.DurationMinutes,
            IsInPerson = service.IsInPerson,
            RequiresDoctor = service.RequiresDoctor,
            IsActive = service.IsActive,
            ImageUrl = service.ImageUrl,
            ParentServiceId = service.ParentServiceId,
            ParentServiceName = service.ParentService?.Name,
            DeliveryType = service.DeliveryType.ToString(),
            CreatedAt = service.CreatedAt,
            UpdatedAt = service.UpdatedAt
        };
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var service = await _context.Services.FindAsync(id);
        if (service == null) return false;

        _context.Services.Remove(service);
        await _context.SaveChangesAsync();
        return true;
    }

    private static ServiceDeliveryType ParseDeliveryType(string? deliveryType)
    {
        if (!string.IsNullOrWhiteSpace(deliveryType) &&
            Enum.TryParse<ServiceDeliveryType>(deliveryType, true, out var parsed))
        {
            return parsed;
        }
        return ServiceDeliveryType.InClinic;
    }
}
