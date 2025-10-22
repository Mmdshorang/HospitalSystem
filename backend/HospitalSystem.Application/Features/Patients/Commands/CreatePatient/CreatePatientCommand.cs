using HospitalSystem.Application.DTOs;
using MediatR;

namespace HospitalSystem.Application.Features.Patients.Commands.CreatePatient;

public class CreatePatientCommand : IRequest<PatientDto>
{
    public CreatePatientDto Patient { get; set; } = null!;
}
