using HospitalSystem.Application.Common.Interfaces;
using HospitalSystem.Application.DTOs;
using HospitalSystem.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace HospitalSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<PatientsController> _logger;

    public PatientsController(IUnitOfWork unitOfWork, ILogger<PatientsController> logger)
    {
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
            var patients = await _unitOfWork.Patients.GetAllAsync();
            var patientDtos = patients.Select(p => new PatientDto
            {
                Id = p.Id,
                FirstName = p.FirstName,
                LastName = p.LastName,
                NationalId = p.NationalId,
                DateOfBirth = p.DateOfBirth,
                PhoneNumber = p.PhoneNumber,
                Email = p.Email,
                Address = p.Address,
                BloodType = p.BloodType,
                EmergencyContact = p.EmergencyContact,
                EmergencyPhone = p.EmergencyPhone,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            });

            return Ok(patientDtos);
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
            var patient = new Patient
            {
                FirstName = createPatientDto.FirstName,
                LastName = createPatientDto.LastName,
                NationalId = createPatientDto.NationalId,
                DateOfBirth = createPatientDto.DateOfBirth,
                PhoneNumber = createPatientDto.PhoneNumber,
                Email = createPatientDto.Email,
                Address = createPatientDto.Address,
                BloodType = createPatientDto.BloodType,
                EmergencyContact = createPatientDto.EmergencyContact,
                EmergencyPhone = createPatientDto.EmergencyPhone
            };

            await _unitOfWork.Patients.AddAsync(patient);
            await _unitOfWork.SaveChangesAsync();

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

            return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, patientDto);
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
