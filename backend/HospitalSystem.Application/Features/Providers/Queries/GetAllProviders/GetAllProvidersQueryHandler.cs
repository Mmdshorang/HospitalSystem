using HospitalSystem.Application.DTOs;
using HospitalSystem.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HospitalSystem.Application.Features.Providers.Queries.GetAllProviders;

public class GetAllProvidersQueryHandler : IRequestHandler<GetAllProvidersQuery, IEnumerable<ProviderProfileDto>>
{
    private readonly ApplicationDbContext _context;

    public GetAllProvidersQueryHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProviderProfileDto>> Handle(GetAllProvidersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.ProviderProfiles
            .Include(p => p.User)
            .Include(p => p.Clinic)
            .Include(p => p.Specialty)
            .Include(p => p.WorkSchedules)
            .AsQueryable();

        // Search by user name, phone, or specialty
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchLower = request.SearchTerm.ToLower();
            query = query.Where(p =>
                (p.User != null && p.User.FirstName != null && p.User.FirstName.ToLower().Contains(searchLower)) ||
                (p.User != null && p.User.LastName != null && p.User.LastName.ToLower().Contains(searchLower)) ||
                (p.User != null && p.User.Phone != null && p.User.Phone.ToLower().Contains(searchLower)) ||
                (p.Specialty != null && p.Specialty.Name != null && p.Specialty.Name.ToLower().Contains(searchLower))
            );
        }

        // Filter by specialty
        if (request.SpecialtyId.HasValue)
        {
            query = query.Where(p => p.SpecialtyId == request.SpecialtyId.Value);
        }

        // Filter by clinic
        if (request.ClinicId.HasValue)
        {
            query = query.Where(p => p.ClinicId == request.ClinicId.Value);
        }

        // Filter by active status
        if (request.IsActive.HasValue)
        {
            query = query.Where(p => p.IsActive == request.IsActive.Value);
        }

        var providers = await query
            .OrderBy(p => p.User != null ? p.User.FirstName : "")
            .ThenBy(p => p.User != null ? p.User.LastName : "")
            .ToListAsync(cancellationToken);

        return providers.Select(p => new ProviderProfileDto
        {
            Id = p.Id,
            UserId = p.UserId,
            UserFirstName = p.User?.FirstName,
            UserLastName = p.User?.LastName,
            UserPhone = p.User?.Phone,
            ClinicId = p.ClinicId,
            ClinicName = p.Clinic?.Name,
            SpecialtyId = p.SpecialtyId,
            SpecialtyName = p.Specialty?.Name,
            Degree = p.Degree,
            ExperienceYears = p.ExperienceYears,
            SharePercent = p.SharePercent,
            IsActive = p.IsActive,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt,
            WorkSchedules = p.WorkSchedules?.Select(ws => new WorkScheduleDto
            {
                Id = ws.Id,
                DayOfWeek = ws.DayOfWeek.ToString(),
                StartTime = ws.StartTime,
                EndTime = ws.EndTime,
                IsActive = ws.IsActive
            }).ToList()
        });
    }
}
