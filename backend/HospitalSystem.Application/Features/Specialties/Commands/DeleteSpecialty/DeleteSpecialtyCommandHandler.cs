using HospitalSystem.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HospitalSystem.Application.Features.Specialties.Commands.DeleteSpecialty;

public class DeleteSpecialtyCommandHandler : IRequestHandler<DeleteSpecialtyCommand, bool>
{
    private readonly ApplicationDbContext _context;

    public DeleteSpecialtyCommandHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteSpecialtyCommand request, CancellationToken cancellationToken)
    {
        var specialty = await _context.Specialties
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        if (specialty == null)
            return false;

        _context.Specialties.Remove(specialty);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
