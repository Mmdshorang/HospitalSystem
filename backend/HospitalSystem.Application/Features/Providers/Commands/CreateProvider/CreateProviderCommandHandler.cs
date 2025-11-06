using HospitalSystem.Application.DTOs;
using HospitalSystem.Domain.Entities;
using HospitalSystem.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HospitalSystem.Application.Features.Providers.Commands.CreateProvider;

public class CreateProviderCommandHandler : IRequestHandler<CreateProviderCommand, ProviderProfileDto>
{
    private readonly ApplicationDbContext _context;

    public CreateProviderCommandHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProviderProfileDto> Handle(CreateProviderCommand request, CancellationToken cancellationToken)
    {
        var provider = new ProviderProfile
        {
            UserId = request.UserId,
            ClinicId = request.ClinicId,
            SpecialtyId = request.SpecialtyId,
            Degree = request.Degree,
            ExperienceYears = request.ExperienceYears,
            SharePercent = request.SharePercent,
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.ProviderProfiles.Add(provider);
        await _context.SaveChangesAsync(cancellationToken);

        // Load related entities
        await _context.Entry(provider)
            .Reference(p => p.User)
            .LoadAsync(cancellationToken);
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
            UserEmail = provider.User?.Email,
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
