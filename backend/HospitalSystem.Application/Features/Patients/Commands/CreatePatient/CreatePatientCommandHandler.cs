using AutoMapper;
using HospitalSystem.Application.DTOs;
using HospitalSystem.Domain.Entities;
using HospitalSystem.Domain.Entities.Enums;
using HospitalSystem.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace HospitalSystem.Application.Features.Patients.Commands.CreatePatient;

public class CreatePatientCommandHandler : IRequestHandler<CreatePatientCommand, PatientDto>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CreatePatientCommandHandler(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PatientDto> Handle(CreatePatientCommand request, CancellationToken cancellationToken)
    {
        // Check if user already exists
        if (await _context.Users.AnyAsync(u => u.Phone == request.Patient.Phone || u.NationalCode == request.Patient.NationalCode, cancellationToken))
        {
            throw new InvalidOperationException("کاربری با این شماره موبایل یا کد ملی موجود است");
        }

        // Create User
        var user = new User
        {
            FirstName = request.Patient.FirstName,
            LastName = request.Patient.LastName,
            NationalCode = request.Patient.NationalCode,
            Phone = request.Patient.Phone,
            PasswordHash = HashPassword(request.Patient.Password),
            Role = UserRole.patient,
            Gender = !string.IsNullOrEmpty(request.Patient.Gender) && Enum.TryParse<GenderType>(request.Patient.Gender, true, out var gender) ? gender : null,
            BirthDate = request.Patient.BirthDate,
            AvatarUrl = request.Patient.AvatarUrl,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        // Create PatientProfile
        var patientProfile = new PatientProfile
        {
            UserId = user.Id,
            BloodType = request.Patient.BloodType,
            Height = request.Patient.Height,
            Weight = request.Patient.Weight,
            MedicalHistory = request.Patient.MedicalHistory,
            EmergencyName = request.Patient.EmergencyName,
            EmergencyRelationship = request.Patient.EmergencyRelationship,
            EmergencyPhone = request.Patient.EmergencyPhone,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.PatientProfiles.Add(patientProfile);
        await _context.SaveChangesAsync(cancellationToken);

        // Return combined DTO
        return new PatientDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            NationalCode = user.NationalCode,
            BirthDate = user.BirthDate,
            Gender = user.Gender?.ToString(),
            Phone = user.Phone,
            AvatarUrl = user.AvatarUrl,
            IsActive = user.IsActive,
            PatientProfileId = patientProfile.Id,
            BloodType = patientProfile.BloodType,
            Height = patientProfile.Height,
            Weight = patientProfile.Weight,
            MedicalHistory = patientProfile.MedicalHistory,
            EmergencyName = patientProfile.EmergencyName,
            EmergencyRelationship = patientProfile.EmergencyRelationship,
            EmergencyPhone = patientProfile.EmergencyPhone,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }

    private string HashPassword(string password)
    {
        using var rng = RandomNumberGenerator.Create();
        var salt = new byte[16];
        rng.GetBytes(salt);

        using var pbkdf2 = new System.Security.Cryptography.Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
        var hash = pbkdf2.GetBytes(32);

        var hashBytes = new byte[48];
        Array.Copy(salt, 0, hashBytes, 0, 16);
        Array.Copy(hash, 0, hashBytes, 16, 32);

        return Convert.ToBase64String(hashBytes);
    }
}
