using HospitalSystem.Infrastructure.Models;
using HospitalSystem.Domain.Entities;
using HospitalSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HospitalSystem.Infrastructure.Services;

public class SpecialtyService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<SpecialtyService> _logger;

    public SpecialtyService(ApplicationDbContext context, ILogger<SpecialtyService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<SpecialtyDto>> GetAllAsync(string? searchTerm = null, long? categoryId = null)
    {
        var query = _context.Specialties
            .Include(s => s.Category)
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

        var specialties = await query
            .OrderBy(s => s.Name)
            .ToListAsync();

        return specialties.Select(s => new SpecialtyDto
        {
            Id = s.Id,
            CategoryId = s.CategoryId,
            CategoryName = s.Category?.Name,
            Name = s.Name,
            Description = s.Description,
            CreatedAt = s.CreatedAt,
            UpdatedAt = s.UpdatedAt
        });
    }

    public async Task<SpecialtyDto?> GetByIdAsync(long id)
    {
        var specialty = await _context.Specialties
            .Include(s => s.Category)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (specialty == null) return null;

        return new SpecialtyDto
        {
            Id = specialty.Id,
            CategoryId = specialty.CategoryId,
            CategoryName = specialty.Category?.Name,
            Name = specialty.Name,
            Description = specialty.Description,
            CreatedAt = specialty.CreatedAt,
            UpdatedAt = specialty.UpdatedAt
        };
    }

    public async Task<SpecialtyDto> CreateAsync(CreateSpecialtyDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            throw new InvalidOperationException("نام تخصص الزامی است");
        }

        var existing = await _context.Specialties
            .FirstOrDefaultAsync(s => s.Name != null && s.Name.ToLower() == dto.Name.ToLower());

        if (existing != null)
        {
            throw new InvalidOperationException($"تخصص با نام '{dto.Name}' از قبل وجود دارد");
        }

        var specialty = new Specialty
        {
            CategoryId = dto.CategoryId,
            Name = dto.Name,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Specialties.Add(specialty);
        await _context.SaveChangesAsync();

        await _context.Entry(specialty)
            .Reference(s => s.Category)
            .LoadAsync();

        return new SpecialtyDto
        {
            Id = specialty.Id,
            CategoryId = specialty.CategoryId,
            CategoryName = specialty.Category?.Name,
            Name = specialty.Name,
            Description = specialty.Description,
            CreatedAt = specialty.CreatedAt,
            UpdatedAt = specialty.UpdatedAt
        };
    }

    public async Task<SpecialtyDto?> UpdateAsync(long id, UpdateSpecialtyDto dto)
    {
        var specialty = await _context.Specialties
            .Include(s => s.Category)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (specialty == null) return null;

        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            throw new InvalidOperationException("نام تخصص الزامی است");
        }

        var existing = await _context.Specialties
            .FirstOrDefaultAsync(s =>
                s.Id != id &&
                s.Name != null &&
                s.Name.ToLower() == dto.Name.ToLower());

        if (existing != null)
        {
            throw new InvalidOperationException($"تخصص با نام '{dto.Name}' از قبل وجود دارد");
        }

        specialty.CategoryId = dto.CategoryId;
        specialty.Name = dto.Name;
        specialty.Description = dto.Description;
        specialty.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new SpecialtyDto
        {
            Id = specialty.Id,
            CategoryId = specialty.CategoryId,
            CategoryName = specialty.Category?.Name,
            Name = specialty.Name,
            Description = specialty.Description,
            CreatedAt = specialty.CreatedAt,
            UpdatedAt = specialty.UpdatedAt
        };
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var specialty = await _context.Specialties.FindAsync(id);
        if (specialty == null) return false;

        _context.Specialties.Remove(specialty);
        await _context.SaveChangesAsync();
        return true;
    }
}

