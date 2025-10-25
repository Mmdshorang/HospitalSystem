using HospitalSystem.Application.Common.Interfaces;
using HospitalSystem.Application.DTOs;
using HospitalSystem.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace HospitalSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DoctorsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DoctorsController> _logger;

    public DoctorsController(IUnitOfWork unitOfWork, ILogger<DoctorsController> logger)
    {
        _unitOfWork = unitOfWork;
       
        
        _logger = logger;









    }

    /// <summary>
    /// Get all doctors
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DoctorDto>>> GetDoctors()
    {
        try
        {
            var doctors = await _unitOfWork.Doctors.GetAllAsync();
            var doctorDtos = doctors.Select(d => new DoctorDto
            {
                Id = d.Id,
                FirstName = d.FirstName,
                LastName = d.LastName,
                LicenseNumber = d.LicenseNumber,
                Specialization = d.Specialization,
                PhoneNumber = d.PhoneNumber,
                Email = d.Email,
                OfficeLocation = d.OfficeLocation,
                WorkingHoursStart = d.WorkingHoursStart,
                WorkingHoursEnd = d.WorkingHoursEnd,
                IsAvailable = d.IsAvailable,
                CreatedAt = d.CreatedAt,
                UpdatedAt = d.UpdatedAt
            });

            return Ok(doctorDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving doctors");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get doctor by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<DoctorDto>> GetDoctor(Guid id)
    {
        try
        {
            var doctor = await _unitOfWork.Doctors.GetByIdAsync(id);
            if (doctor == null)
            {
                return NotFound();
            }

            var doctorDto = new DoctorDto
            {
                Id = doctor.Id,
                FirstName = doctor.FirstName,
                LastName = doctor.LastName,
                LicenseNumber = doctor.LicenseNumber,
                Specialization = doctor.Specialization,
                PhoneNumber = doctor.PhoneNumber,
                Email = doctor.Email,
                OfficeLocation = doctor.OfficeLocation,
                WorkingHoursStart = doctor.WorkingHoursStart,
                WorkingHoursEnd = doctor.WorkingHoursEnd,
                IsAvailable = doctor.IsAvailable,
                CreatedAt = doctor.CreatedAt,
                UpdatedAt = doctor.UpdatedAt
            };

            return Ok(doctorDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving doctor with ID: {DoctorId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new doctor
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<DoctorDto>> CreateDoctor(CreateDoctorDto createDoctorDto)
    {
        try
        {
            var doctor = new Doctor
            {
                FirstName = createDoctorDto.FirstName,
                LastName = createDoctorDto.LastName,
                LicenseNumber = createDoctorDto.LicenseNumber,
                Specialization = createDoctorDto.Specialization,
                PhoneNumber = createDoctorDto.PhoneNumber,
                Email = createDoctorDto.Email,
                OfficeLocation = createDoctorDto.OfficeLocation,
                WorkingHoursStart = createDoctorDto.WorkingHoursStart,
                WorkingHoursEnd = createDoctorDto.WorkingHoursEnd,
                IsAvailable = createDoctorDto.IsAvailable
            };

            await _unitOfWork.Doctors.AddAsync(doctor);
            await _unitOfWork.SaveChangesAsync();

            var doctorDto = new DoctorDto
            {
                Id = doctor.Id,
                FirstName = doctor.FirstName,
                LastName = doctor.LastName,
                LicenseNumber = doctor.LicenseNumber,
                Specialization = doctor.Specialization,
                PhoneNumber = doctor.PhoneNumber,
                Email = doctor.Email,
                OfficeLocation = doctor.OfficeLocation,
                WorkingHoursStart = doctor.WorkingHoursStart,
                WorkingHoursEnd = doctor.WorkingHoursEnd,
                IsAvailable = doctor.IsAvailable,
                CreatedAt = doctor.CreatedAt,
                UpdatedAt = doctor.UpdatedAt
            };

            return CreatedAtAction(nameof(GetDoctor), new { id = doctor.Id }, doctorDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating doctor");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing doctor
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDoctor(Guid id, UpdateDoctorDto updateDoctorDto)
    {
        try
        {
            if (id != updateDoctorDto.Id)
            {
                return BadRequest();
            }

            var doctor = await _unitOfWork.Doctors.GetByIdAsync(id);
            if (doctor == null)
            {
                return NotFound();
            }

            doctor.FirstName = updateDoctorDto.FirstName;
            doctor.LastName = updateDoctorDto.LastName;
            doctor.LicenseNumber = updateDoctorDto.LicenseNumber;
            doctor.Specialization = updateDoctorDto.Specialization;
            doctor.PhoneNumber = updateDoctorDto.PhoneNumber;
            doctor.Email = updateDoctorDto.Email;
            doctor.OfficeLocation = updateDoctorDto.OfficeLocation;
            doctor.WorkingHoursStart = updateDoctorDto.WorkingHoursStart;
            doctor.WorkingHoursEnd = updateDoctorDto.WorkingHoursEnd;
            doctor.IsAvailable = updateDoctorDto.IsAvailable;

            await _unitOfWork.Doctors.UpdateAsync(doctor);
            await _unitOfWork.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating doctor with ID: {DoctorId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete a doctor
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDoctor(Guid id)
    {
        try
        {
            var doctor = await _unitOfWork.Doctors.GetByIdAsync(id);
            if (doctor == null)
            {
                return NotFound();
            }

            await _unitOfWork.Doctors.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting doctor with ID: {DoctorId}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}
