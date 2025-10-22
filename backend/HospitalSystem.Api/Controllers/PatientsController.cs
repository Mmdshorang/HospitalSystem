using HospitalSystem.Application.Common.Interfaces;
using HospitalSystem.Application.DTOs;
using HospitalSystem.Application.Features.Patients.Queries.GetAllPatients;
using HospitalSystem.Application.Features.Patients.Commands.CreatePatient;
using HospitalSystem.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace HospitalSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PatientsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<PatientsController> _logger;

    public PatientsController(IMediator mediator, IUnitOfWork unitOfWork, ILogger<PatientsController> logger)
    {
        _mediator = mediator;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <summary>
    /// Get all patients
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PatientDto>>> GetPatients()
    {
        try
        {
            var query = new GetAllPatientsQuery();
            var patients = await _mediator.Send(query);
            return Ok(patients);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving patients");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get patient by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<PatientDto>> GetPatient(Guid id)
    {
        try
        {
            var patient = await _unitOfWork.Patients.GetByIdAsync(id);
            if (patient == null)
            {
                return NotFound();
            }

            var patientDto = new PatientDto
            {
                Id = patient.Id,
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                NationalId = patient.NationalId,
                DateOfBirth = patient.DateOfBirth,
                PhoneNumber = patient.PhoneNumber,
                Email = patient.Email,
                Address = patient.Address,
                BloodType = patient.BloodType,
                EmergencyContact = patient.EmergencyContact,
                EmergencyPhone = patient.EmergencyPhone,
                CreatedAt = patient.CreatedAt,
                UpdatedAt = patient.UpdatedAt
            };

            return Ok(patientDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving patient with ID: {PatientId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new patient
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<PatientDto>> CreatePatient(CreatePatientDto createPatientDto)
    {
        try
        {
            var command = new CreatePatientCommand { Patient = createPatientDto };
            var patient = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, patient);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating patient");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing patient
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePatient(Guid id, UpdatePatientDto updatePatientDto)
    {
        try
        {
            if (id != updatePatientDto.Id)
            {
                return BadRequest();
            }

            var patient = await _unitOfWork.Patients.GetByIdAsync(id);
            if (patient == null)
            {
                return NotFound();
            }

            patient.FirstName = updatePatientDto.FirstName;
            patient.LastName = updatePatientDto.LastName;
            patient.NationalId = updatePatientDto.NationalId;
            patient.DateOfBirth = updatePatientDto.DateOfBirth;
            patient.PhoneNumber = updatePatientDto.PhoneNumber;
            patient.Email = updatePatientDto.Email;
            patient.Address = updatePatientDto.Address;
            patient.BloodType = updatePatientDto.BloodType;
            patient.EmergencyContact = updatePatientDto.EmergencyContact;
            patient.EmergencyPhone = updatePatientDto.EmergencyPhone;

            await _unitOfWork.Patients.UpdateAsync(patient);
            await _unitOfWork.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating patient with ID: {PatientId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete a patient
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePatient(Guid id)
    {
        try
        {
            var patient = await _unitOfWork.Patients.GetByIdAsync(id);
            if (patient == null)
            {
                return NotFound();
            }

            await _unitOfWork.Patients.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting patient with ID: {PatientId}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}
