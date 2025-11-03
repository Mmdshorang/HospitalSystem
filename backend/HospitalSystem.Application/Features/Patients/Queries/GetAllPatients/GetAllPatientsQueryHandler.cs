using HospitalSystem.Application.DTOs;
using HospitalSystem.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HospitalSystem.Application.Features.Patients.Queries.GetAllPatients;

public class GetAllPatientsQueryHandler : IRequestHandler<GetAllPatientsQuery, IEnumerable<PatientDto>>
{
    private readonly ApplicationDbContext _context;

    public GetAllPatientsQueryHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PatientDto>> Handle(GetAllPatientsQuery request, CancellationToken cancellationToken)
    {
        var patients = await _context.Users
            .Where(u => u.Role == Domain.Entities.Enums.UserRole.patient && u.IsActive && u.DeletedAt == null)
            .Include(u => u.PatientProfile)
            .ToListAsync(cancellationToken);

        return patients.Select(user => new PatientDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            NationalCode = user.NationalCode,
            BirthDate = user.BirthDate,
            Gender = user.Gender?.ToString(),
            Phone = user.Phone,
            Email = user.Email,
            AvatarUrl = user.AvatarUrl,
            IsActive = user.IsActive,
            PatientProfileId = user.PatientProfile?.Id,
            BloodType = user.PatientProfile?.BloodType,
            Height = user.PatientProfile?.Height,
            Weight = user.PatientProfile?.Weight,
            MedicalHistory = user.PatientProfile?.MedicalHistory,
            EmergencyName = user.PatientProfile?.EmergencyName,
            EmergencyRelationship = user.PatientProfile?.EmergencyRelationship,
            EmergencyPhone = user.PatientProfile?.EmergencyPhone,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        });
    }
}
