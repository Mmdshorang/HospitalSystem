using HospitalSystem.Application.DTOs;
using HospitalSystem.Domain.Entities;
using HospitalSystem.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HospitalSystem.Application.Features.Specialties.Commands.CreateSpecialty;

public class CreateSpecialtyCommandHandler : IRequestHandler<CreateSpecialtyCommand, SpecialtyDto>
{
    private readonly ApplicationDbContext _context;

    public CreateSpecialtyCommandHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<SpecialtyDto> Handle(CreateSpecialtyCommand request, CancellationToken cancellationToken)
    {
        var specialty = new Specialty
        {
            CategoryId = request.CategoryId,
            Name = request.Name,
            Description = request.Description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Specialties.Add(specialty);
        await _context.SaveChangesAsync(cancellationToken);

        // Load category for response
        await _context.Entry(specialty)
            .Reference(s => s.Category)
            .LoadAsync(cancellationToken);

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
