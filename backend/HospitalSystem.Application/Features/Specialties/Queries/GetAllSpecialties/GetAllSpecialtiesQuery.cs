using HospitalSystem.Application.DTOs;
using MediatR;

namespace HospitalSystem.Application.Features.Specialties.Queries.GetAllSpecialties;

public class GetAllSpecialtiesQuery : IRequest<IEnumerable<SpecialtyDto>>
{
    public string? SearchTerm { get; set; }
    public long? CategoryId { get; set; }
}
