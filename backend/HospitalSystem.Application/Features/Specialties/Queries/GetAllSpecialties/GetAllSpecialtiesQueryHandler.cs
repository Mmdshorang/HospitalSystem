using HospitalSystem.Application.DTOs;
using HospitalSystem.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HospitalSystem.Application.Features.Specialties.Queries.GetAllSpecialties;

public class GetAllSpecialtiesQueryHandler : IRequestHandler<GetAllSpecialtiesQuery, IEnumerable<SpecialtyDto>>
{
    private readonly ApplicationDbContext _context;

    public GetAllSpecialtiesQueryHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SpecialtyDto>> Handle(GetAllSpecialtiesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Specialties
            .Include(s => s.Category)
            .AsQueryable();

        // Search by name or description
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchLower = request.SearchTerm.ToLower();
            query = query.Where(s =>
                (s.Name != null && s.Name.ToLower().Contains(searchLower)) ||
                (s.Description != null && s.Description.ToLower().Contains(searchLower))
            );
        }

        // Filter by category
        if (request.CategoryId.HasValue)
        {
            query = query.Where(s => s.CategoryId == request.CategoryId.Value);
        }

        var specialties = await query
            .OrderBy(s => s.Name)
            .ToListAsync(cancellationToken);

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
}
