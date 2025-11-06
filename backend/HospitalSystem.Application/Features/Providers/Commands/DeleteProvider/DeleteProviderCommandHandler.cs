using HospitalSystem.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HospitalSystem.Application.Features.Providers.Commands.DeleteProvider;

public class DeleteProviderCommandHandler : IRequestHandler<DeleteProviderCommand, bool>
{
    private readonly ApplicationDbContext _context;

    public DeleteProviderCommandHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteProviderCommand request, CancellationToken cancellationToken)
    {
        var provider = await _context.ProviderProfiles
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (provider == null)
            return false;

        _context.ProviderProfiles.Remove(provider);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
