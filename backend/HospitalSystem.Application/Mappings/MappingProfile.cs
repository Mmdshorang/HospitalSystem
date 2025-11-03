using AutoMapper;
using HospitalSystem.Application.DTOs;
using HospitalSystem.Domain.Entities;

namespace HospitalSystem.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Note: Old entity mappings removed (Patient, Doctor, Appointment)
        // These entities have been removed from the new schema
        // New mappings should use User, PatientProfile, ProviderProfile, ServiceRequest, etc.
        
        // TODO: Add mappings for new entities if needed
        // Example:
        // CreateMap<User, UserDto>().ReverseMap();
        // CreateMap<PatientProfile, PatientProfileDto>().ReverseMap();
    }
}
