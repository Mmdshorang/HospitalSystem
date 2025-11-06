using MediatR;

namespace HospitalSystem.Application.Features.Providers.Commands.DeleteProvider;

public class DeleteProviderCommand : IRequest<bool>
{
    public long Id { get; set; }
}
