using HospitalSystem.Application.DTOs;
using HospitalSystem.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HospitalSystem.Application.Features.Providers.Commands.UpdateProvider;

public class UpdateProviderCommandHandler : IRequestHandler<UpdateProviderCommand, ProviderProfileDto?>
{
    private readonly ApplicationDbContext _context;

    public UpdateProviderCommandHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProviderProfileDto?> Handle(UpdateProviderCommand request, CancellationToken cancellationToken)
    {
        var provider = await _context.ProviderProfiles
            .Include(p => p.User)
            .Include(p => p.Clinic)
            .Include(p => p.Specialty)
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (provider == null)
            return null;

        provider.ClinicId = request.ClinicId;
        provider.SpecialtyId = request.SpecialtyId;
        provider.Degree = request.Degree;
        provider.ExperienceYears = request.ExperienceYears;
        provider.SharePercent = request.SharePercent;
        provider.IsActive = request.IsActive;
        provider.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        // Reload related entities if changed
        await _context.Entry(provider)
            .Reference(p => p.Clinic)
            .LoadAsync(cancellationToken);
        await _context.Entry(provider)
            .Reference(p => p.Specialty)
            .LoadAsync(cancellationToken);

        return new ProviderProfileDto
        {
            Id = provider.Id,
            UserId = provider.UserId,
            UserFirstName = provider.User?.FirstName,
            UserLastName = provider.User?.LastName,
            UserPhone = provider.User?.Phone,
            ClinicId = provider.ClinicId,
            ClinicName = provider.Clinic?.Name,
            SpecialtyId = provider.SpecialtyId,
            SpecialtyName = provider.Specialty?.Name,
            Degree = provider.Degree,
            ExperienceYears = provider.ExperienceYears,
            SharePercent = provider.SharePercent,
            IsActive = provider.IsActive,
            CreatedAt = provider.CreatedAt,
            UpdatedAt = provider.UpdatedAt
        };
    }
}
