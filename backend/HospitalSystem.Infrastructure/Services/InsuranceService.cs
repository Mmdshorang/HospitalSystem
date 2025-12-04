using HospitalSystem.Application.DTOs;
using HospitalSystem.Domain.Entities;
using HospitalSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HospitalSystem.Infrastructure.Services;

public class InsuranceService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<InsuranceService> _logger;

    public InsuranceService(ApplicationDbContext context, ILogger<InsuranceService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<InsuranceDto>> GetAllAsync(string? searchTerm = null, bool? isActive = null)
    {
        var query = _context.Insurances.AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var searchLower = searchTerm.ToLower();
            query = query.Where(i =>
                (i.Name != null && i.Name.ToLower().Contains(searchLower)) ||
                (i.Description != null && i.Description.ToLower().Contains(searchLower))
            );
        }

        if (isActive.HasValue)
        {
            query = query.Where(i => i.IsActive == isActive.Value);
        }

        var insurances = await query
            .OrderBy(i => i.Name)
            .ToListAsync();

        return insurances.Select(i => new InsuranceDto
        {
            Id = i.Id,
            Name = i.Name,
            Description = i.Description,
            CoveragePercent = i.CoveragePercent,
            IsActive = i.IsActive,
            CreatedAt = i.CreatedAt,
            UpdatedAt = i.UpdatedAt
        });
    }

    public async Task<InsuranceDto?> GetByIdAsync(long id)
    {
        var insurance = await _context.Insurances.FindAsync(id);

        if (insurance == null) return null;

        return new InsuranceDto
        {
            Id = insurance.Id,
            Name = insurance.Name,
            Description = insurance.Description,
            CoveragePercent = insurance.CoveragePercent,
            IsActive = insurance.IsActive,
            CreatedAt = insurance.CreatedAt,
            UpdatedAt = insurance.UpdatedAt
        };
    }

    public async Task<InsuranceDto> CreateAsync(CreateInsuranceDto dto)
    {
        var insurance = new Insurance
        {
            Name = dto.Name,
            Description = dto.Description,
            CoveragePercent = dto.CoveragePercent,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Insurances.Add(insurance);
        await _context.SaveChangesAsync();

        return new InsuranceDto
        {
            Id = insurance.Id,
            Name = insurance.Name,
            Description = insurance.Description,
            CoveragePercent = insurance.CoveragePercent,
            IsActive = insurance.IsActive,
            CreatedAt = insurance.CreatedAt,
            UpdatedAt = insurance.UpdatedAt
        };
    }

    public async Task<InsuranceDto?> UpdateAsync(long id, UpdateInsuranceDto dto)
    {
        var insurance = await _context.Insurances.FindAsync(id);

        if (insurance == null) return null;

        insurance.Name = dto.Name;
        insurance.Description = dto.Description;
        insurance.CoveragePercent = dto.CoveragePercent;
        insurance.IsActive = dto.IsActive;
        insurance.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new InsuranceDto
        {
            Id = insurance.Id,
            Name = insurance.Name,
            Description = insurance.Description,
            CoveragePercent = insurance.CoveragePercent,
            IsActive = insurance.IsActive,
            CreatedAt = insurance.CreatedAt,
            UpdatedAt = insurance.UpdatedAt
        };
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var insurance = await _context.Insurances.FindAsync(id);
        if (insurance == null) return false;

        _context.Insurances.Remove(insurance);
        await _context.SaveChangesAsync();
        return true;
    }
}

