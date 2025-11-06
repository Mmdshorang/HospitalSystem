using HospitalSystem.Application.DTOs;
using HospitalSystem.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HospitalSystem.Application.Features.Providers.Queries.GetProviderById;

public class GetProviderByIdQueryHandler : IRequestHandler<GetProviderByIdQuery, ProviderProfileDto?>
{
    private readonly ApplicationDbContext _context;

    public GetProviderByIdQueryHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProviderProfileDto?> Handle(GetProviderByIdQuery request, CancellationToken cancellationToken)
    {
        var provider = await _context.ProviderProfiles
            .Include(p => p.User)
            .Include(p => p.Clinic)
            .Include(p => p.Specialty)
            .Include(p => p.WorkSchedules)
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (provider == null)
            return null;

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
            UpdatedAt = provider.UpdatedAt,
            WorkSchedules = provider.WorkSchedules?.Select(ws => new WorkScheduleDto
            {
                Id = ws.Id,
                DayOfWeek = ws.DayOfWeek.ToString(),
                StartTime = ws.StartTime,
                EndTime = ws.EndTime,
                IsActive = ws.IsActive
            }).ToList()
        };
    }
}
