using HospitalSystem.Application.DTOs;
using HospitalSystem.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HospitalSystem.Application.Features.Specialties.Commands.UpdateSpecialty;

public class UpdateSpecialtyCommandHandler : IRequestHandler<UpdateSpecialtyCommand, SpecialtyDto?>
{
    private readonly ApplicationDbContext _context;

    public UpdateSpecialtyCommandHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<SpecialtyDto?> Handle(UpdateSpecialtyCommand request, CancellationToken cancellationToken)
    {
        var specialty = await _context.Specialties
            .Include(s => s.Category)
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        if (specialty == null)
            return null;

        specialty.CategoryId = request.CategoryId;
        specialty.Name = request.Name;
        specialty.Description = request.Description;
        specialty.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        // Reload category if changed
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
