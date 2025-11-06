using MediatR;

namespace HospitalSystem.Application.Features.Specialties.Commands.DeleteSpecialty;

public class DeleteSpecialtyCommand : IRequest<bool>
{
    public long Id { get; set; }
}
