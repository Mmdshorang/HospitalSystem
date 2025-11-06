using HospitalSystem.Application.DTOs;
using MediatR;

namespace HospitalSystem.Application.Features.Specialties.Commands.CreateSpecialty;

public class CreateSpecialtyCommand : IRequest<SpecialtyDto>
{
    public long? CategoryId { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
}
