using HospitalSystem.Application.DTOs;
using MediatR;

namespace HospitalSystem.Application.Features.Specialties.Queries.GetSpecialtyById;

public class GetSpecialtyByIdQuery : IRequest<SpecialtyDto?>
{
    public long Id { get; set; }
}
