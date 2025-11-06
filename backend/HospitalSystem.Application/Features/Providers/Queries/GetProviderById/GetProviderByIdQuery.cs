using HospitalSystem.Application.DTOs;
using MediatR;

namespace HospitalSystem.Application.Features.Providers.Queries.GetProviderById;

public class GetProviderByIdQuery : IRequest<ProviderProfileDto?>
{
    public long Id { get; set; }
}
