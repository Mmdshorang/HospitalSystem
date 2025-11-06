using HospitalSystem.Application.DTOs;
using HospitalSystem.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HospitalSystem.Application.Features.Specialties.Queries.GetSpecialtyById;

public class GetSpecialtyByIdQueryHandler : IRequestHandler<GetSpecialtyByIdQuery, SpecialtyDto?>
{
    private readonly ApplicationDbContext _context;

    public GetSpecialtyByIdQueryHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<SpecialtyDto?> Handle(GetSpecialtyByIdQuery request, CancellationToken cancellationToken)
    {
        var specialty = await _context.Specialties
            .Include(s => s.Category)
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        if (specialty == null)
            return null;

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
}
