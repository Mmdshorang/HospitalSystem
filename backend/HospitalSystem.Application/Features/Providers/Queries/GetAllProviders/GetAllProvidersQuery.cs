using HospitalSystem.Application.DTOs;
using MediatR;

namespace HospitalSystem.Application.Features.Providers.Queries.GetAllProviders;

public class GetAllProvidersQuery : IRequest<IEnumerable<ProviderProfileDto>>
{
    public string? SearchTerm { get; set; }
    public long? SpecialtyId { get; set; }
    public long? ClinicId { get; set; }
    public bool? IsActive { get; set; }
}
