using AutoMapper;
using HospitalSystem.Application.DTOs;
using HospitalSystem.Domain.Entities;

namespace HospitalSystem.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Patient mappings
        CreateMap<Patient, PatientDto>().ReverseMap();
        CreateMap<Patient, CreatePatientDto>().ReverseMap();
        CreateMap<Patient, UpdatePatientDto>().ReverseMap();

        // Doctor mappings
        CreateMap<Doctor, DoctorDto>().ReverseMap();
        CreateMap<Doctor, CreateDoctorDto>().ReverseMap();
        CreateMap<Doctor, UpdateDoctorDto>().ReverseMap();

        // Appointment mappings
        CreateMap<Appointment, AppointmentDto>().ReverseMap();
        CreateMap<Appointment, CreateAppointmentDto>().ReverseMap();
        CreateMap<Appointment, UpdateAppointmentDto>().ReverseMap();
    }
}
