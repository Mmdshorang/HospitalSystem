using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HospitalSystem.Application.DTOs;
using HospitalSystem.Infrastructure.Services;
using System.Security.Claims;

namespace HospitalSystem.Api.Controllers;

[ApiController]
[Route("api/clinics")]
public class ClinicsController : ControllerBase
{
    private readonly ClinicService _clinicService;
    private readonly ILogger<ClinicsController> _logger;

    public ClinicsController(ClinicService clinicService, ILogger<ClinicsController> logger)
    {
        _clinicService = clinicService;
        _logger = logger;
    }

    /// <summary>
    /// Get all clinics with optional filters
    /// </summary>
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? searchTerm,
        [FromQuery] string? city,
        [FromQuery] bool? isActive)
    {
        try
        {
            var clinics = await _clinicService.GetAllAsync(searchTerm, city, isActive);
            return Ok(clinics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting clinics");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Get clinic by ID
    /// </summary>
    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(long id)
    {
        try
        {
            var clinic = await _clinicService.GetByIdAsync(id);

            if (clinic == null)
                return NotFound(new { message = "Clinic not found" });

            return Ok(clinic);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting clinic {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Create a new clinic
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "admin,manager")]
    public async Task<IActionResult> Create([FromBody] CreateClinicDto dto)
    {
        // Log user role for debugging (this will only run if authorization passes)
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        _logger.LogInformation("Create clinic request - UserId: {UserId}, Role: {Role}", userId, userRole);

        if (!ModelState.IsValid)
        {
            var errors = ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .SelectMany(x => x.Value!.Errors.Select(e => e.ErrorMessage))
                .ToList();
            return BadRequest(new { message = "خطا در اعتبارسنجی داده‌ها", errors });
        }

        if (dto == null)
        {
            return BadRequest(new { message = "داده‌های ورودی نامعتبر است" });
        }

        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest(new { message = "نام کلینیک الزامی است" });
        }

        try
        {
            var clinic = await _clinicService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = clinic.Id }, clinic);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating clinic");
            return StatusCode(500, new { message = "خطا در ایجاد کلینیک", error = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing clinic
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "admin,manager")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateClinicDto dto)
    {
        try
        {
            if (id != dto.Id)
                return BadRequest(new { message = "ID mismatch" });

            var clinic = await _clinicService.UpdateAsync(id, dto);

            if (clinic == null)
                return NotFound(new { message = "Clinic not found" });

            return Ok(clinic);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating clinic {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Delete a clinic
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(long id)
    {
        try
        {
            var result = await _clinicService.DeleteAsync(id);

            if (!result)
                return NotFound(new { message = "Clinic not found" });

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting clinic {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Get all services for a clinic
    /// </summary>
    [HttpGet("{id}/services")]
    public async Task<IActionResult> GetClinicServices(long id)
    {
        try
        {
            var services = await _clinicService.GetClinicServicesAsync(id);
            return Ok(services);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting clinic services for clinic {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Add a service to a clinic
    /// </summary>
    [HttpPost("{id}/services")]
    [Authorize(Roles = "admin,manager")]
    public async Task<IActionResult> AddClinicService(long id, [FromBody] CreateClinicServiceDto dto)
    {
        try
        {
            if (id != dto.ClinicId)
                return BadRequest(new { message = "Clinic ID mismatch" });

            var clinicService = await _clinicService.AddClinicServiceAsync(id, dto);

            if (clinicService == null)
                return BadRequest(new { message = "Clinic or service not found, or service already exists" });

            return CreatedAtAction(nameof(GetClinicServices), new { id }, clinicService);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding service to clinic {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Update a clinic service
    /// </summary>
    [HttpPut("{id}/services/{serviceId}")]
    [Authorize(Roles = "admin,manager")]
    public async Task<IActionResult> UpdateClinicService(long id, long serviceId, [FromBody] CreateClinicServiceDto dto)
    {
        try
        {
            var clinicService = await _clinicService.UpdateClinicServiceAsync(id, serviceId, dto);

            if (clinicService == null)
                return NotFound(new { message = "Clinic service not found" });

            return Ok(clinicService);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating clinic service {ClinicId}/{ServiceId}", id, serviceId);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Remove a service from a clinic
    /// </summary>
    [HttpDelete("{id}/services/{serviceId}")]
    [Authorize(Roles = "admin,manager")]
    public async Task<IActionResult> DeleteClinicService(long id, long serviceId)
    {
        try
        {
            var result = await _clinicService.DeleteClinicServiceAsync(id, serviceId);

            if (!result)
                return NotFound(new { message = "Clinic service not found" });

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting clinic service {ClinicId}/{ServiceId}", id, serviceId);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}

