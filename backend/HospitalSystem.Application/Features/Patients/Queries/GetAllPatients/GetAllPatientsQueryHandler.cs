using AutoMapper;
using HospitalSystem.Application.Common.Interfaces;
using HospitalSystem.Application.DTOs;
using HospitalSystem.Domain.Entities;
using MediatR;

namespace HospitalSystem.Application.Features.Patients.Queries.GetAllPatients;

public class GetAllPatientsQueryHandler : IRequestHandler<GetAllPatientsQuery, IEnumerable<PatientDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetAllPatientsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<PatientDto>> Handle(GetAllPatientsQuery request, CancellationToken cancellationToken)
    {
        var patients = await _unitOfWork.Patients.GetAllAsync();
        return _mapper.Map<IEnumerable<PatientDto>>(patients);
    }
}
