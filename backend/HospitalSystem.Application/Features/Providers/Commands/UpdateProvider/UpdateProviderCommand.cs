using HospitalSystem.Application.DTOs;
using MediatR;

namespace HospitalSystem.Application.Features.Providers.Commands.UpdateProvider;

public class UpdateProviderCommand : IRequest<ProviderProfileDto?>
{
    public long Id { get; set; }
    public long? ClinicId { get; set; }
    public long? SpecialtyId { get; set; }
    public string? Degree { get; set; }
    public int? ExperienceYears { get; set; }
    public decimal? SharePercent { get; set; }
    public bool IsActive { get; set; }
}
