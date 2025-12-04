using HospitalSystem.Application.DTOs;
using HospitalSystem.Domain.Entities;
using HospitalSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HospitalSystem.Infrastructure.Services;

public class ServiceCategoryService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ServiceCategoryService> _logger;

    public ServiceCategoryService(ApplicationDbContext context, ILogger<ServiceCategoryService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<ServiceCategoryDto>> GetAllAsync(string? searchTerm = null)
    {
        var query = _context.ServiceCategories
            .Include(sc => sc.Services)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var searchLower = searchTerm.ToLower();
            query = query.Where(sc =>
                (sc.Name != null && sc.Name.ToLower().Contains(searchLower)) ||
                (sc.Description != null && sc.Description.ToLower().Contains(searchLower))
            );
        }

        var categories = await query
            .OrderBy(sc => sc.Name)
            .ToListAsync();

        return categories.Select(sc => new ServiceCategoryDto
        {
            Id = sc.Id,
            Name = sc.Name,
            Description = sc.Description,
            CreatedAt = sc.CreatedAt,
            UpdatedAt = sc.UpdatedAt
        });
    }

    public async Task<ServiceCategoryDto?> GetByIdAsync(long id)
    {
        var category = await _context.ServiceCategories
            .Include(sc => sc.Services)
            .FirstOrDefaultAsync(sc => sc.Id == id);

        if (category == null) return null;

        return new ServiceCategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt
        };
    }

    public async Task<ServiceCategoryDto> CreateAsync(CreateServiceCategoryDto dto)
    {
        // Check for duplicate name (case-insensitive)
        if (!string.IsNullOrWhiteSpace(dto.Name))
        {
            var existingCategory = await _context.ServiceCategories
                .FirstOrDefaultAsync(sc => sc.Name != null && sc.Name.ToLower() == dto.Name.ToLower());

            if (existingCategory != null)
            {
                throw new InvalidOperationException($"دسته‌بندی با نام '{dto.Name}' از قبل وجود دارد");
            }
        }

        var category = new ServiceCategory
        {
            Name = dto.Name,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.ServiceCategories.Add(category);
        await _context.SaveChangesAsync();

        return new ServiceCategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt
        };
    }

    public async Task<ServiceCategoryDto?> UpdateAsync(long id, UpdateServiceCategoryDto dto)
    {
        var category = await _context.ServiceCategories.FindAsync(id);

        if (category == null) return null;

        // Check for duplicate name (case-insensitive, excluding current category)
        if (!string.IsNullOrWhiteSpace(dto.Name))
        {
            var existingCategory = await _context.ServiceCategories
                .FirstOrDefaultAsync(sc => sc.Id != id && sc.Name != null && sc.Name.ToLower() == dto.Name.ToLower());

            if (existingCategory != null)
            {
                throw new InvalidOperationException($"دسته‌بندی با نام '{dto.Name}' از قبل وجود دارد");
            }
        }

        category.Name = dto.Name;
        category.Description = dto.Description;
        category.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new ServiceCategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt
        };
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var category = await _context.ServiceCategories.FindAsync(id);
        if (category == null) return false;

        _context.ServiceCategories.Remove(category);
        await _context.SaveChangesAsync();
        return true;
    }
}

