using HospitalSystem.Application.DTOs;
using MediatR;

namespace HospitalSystem.Application.Features.Patients.Queries.GetAllPatients;

public class GetAllPatientsQuery : IRequest<IEnumerable<PatientDto>>
{
}
