using HospitalSystem.Application.DTOs;
using MediatR;

namespace HospitalSystem.Application.Features.Specialties.Commands.UpdateSpecialty;

public class UpdateSpecialtyCommand : IRequest<SpecialtyDto?>
{
    public long Id { get; set; }
    public long? CategoryId { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
}
