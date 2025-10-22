using AutoMapper;
using HospitalSystem.Application.Common.Interfaces;
using HospitalSystem.Application.DTOs;
using HospitalSystem.Domain.Entities;
using MediatR;

namespace HospitalSystem.Application.Features.Patients.Commands.CreatePatient;

public class CreatePatientCommandHandler : IRequestHandler<CreatePatientCommand, PatientDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreatePatientCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PatientDto> Handle(CreatePatientCommand request, CancellationToken cancellationToken)
    {
        var patient = _mapper.Map<Patient>(request.Patient);
        await _unitOfWork.Patients.AddAsync(patient);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<PatientDto>(patient);
    }
}
