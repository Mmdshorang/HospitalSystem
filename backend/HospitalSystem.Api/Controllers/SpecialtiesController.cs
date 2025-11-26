using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HospitalSystem.Infrastructure.Models;
using HospitalSystem.Infrastructure.Services;

namespace HospitalSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SpecialtiesController : ControllerBase
{
    private readonly SpecialtyService _specialtyService;
    private readonly ILogger<SpecialtiesController> _logger;

    public SpecialtiesController(SpecialtyService specialtyService, ILogger<SpecialtiesController> logger)
    {
        _specialtyService = specialtyService;
        _logger = logger;
    }

    /// <summary>
    /// Get all specialties with optional search and filter
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? searchTerm, [FromQuery] long? categoryId)
    {
        try
        {
            var specialties = await _specialtyService.GetAllAsync(searchTerm, categoryId);
            return Ok(specialties);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting specialties");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Get specialty by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        try
        {
            var specialty = await _specialtyService.GetByIdAsync(id);

            if (specialty == null)
                return NotFound(new { message = "Specialty not found" });

            return Ok(specialty);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting specialty {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Create a new specialty
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Create([FromBody] CreateSpecialtyDto dto)
    {
        try
        {
            var specialty = await _specialtyService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = specialty.Id }, specialty);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating specialty");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Update an existing specialty
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateSpecialtyDto dto)
    {
        try
        {
            if (id != dto.Id)
                return BadRequest(new { message = "ID mismatch" });

            var specialty = await _specialtyService.UpdateAsync(id, dto);

            if (specialty == null)
                return NotFound(new { message = "Specialty not found" });

            return Ok(specialty);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating specialty {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Delete a specialty
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(long id)
    {
        try
        {
            var result = await _specialtyService.DeleteAsync(id);

            if (!result)
                return NotFound(new { message = "Specialty not found" });

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting specialty {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}
