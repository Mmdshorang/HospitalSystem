using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HospitalSystem.Infrastructure.Models;
using HospitalSystem.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace HospitalSystem.Api.Controllers;

[ApiController]
[Route("api/specialties")]
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
        if (!ModelState.IsValid)
        {
            var errors = ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .SelectMany(x => x.Value!.Errors)
                .Select(x => x.ErrorMessage)
                .ToList();
            _logger.LogWarning("Specialty validation failed: {Errors}", string.Join(", ", errors));
            return BadRequest(new { message = "اعتبارسنجی ناموفق بود", errors = errors });
        }

        try
        {
            var specialty = await _specialtyService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = specialty.Id }, specialty);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Business rule violation creating specialty: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError(dbEx, "Database error creating specialty");
            return StatusCode(500, new { message = "خطای دیتابیس", details = dbEx.InnerException?.Message ?? dbEx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating specialty");
            return StatusCode(500, new { message = "خطای سرور", details = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing specialty
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateSpecialtyDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .SelectMany(x => x.Value!.Errors)
                .Select(x => x.ErrorMessage)
                .ToList();
            _logger.LogWarning("Specialty validation failed on update: {Errors}", string.Join(", ", errors));
            return BadRequest(new { message = "اعتبارسنجی ناموفق بود", errors = errors });
        }

        if (id != dto.Id)
            return BadRequest(new { message = "شناسه ارسالی با داده‌ها همخوانی ندارد" });

        try
        {
            var specialty = await _specialtyService.UpdateAsync(id, dto);

            if (specialty == null)
                return NotFound(new { message = "تخصص پیدا نشد" });

            return Ok(specialty);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Business rule violation updating specialty {Id}: {Message}", id, ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError(dbEx, "Database error updating specialty {Id}", id);
            return StatusCode(500, new { message = "خطای دیتابیس", details = dbEx.InnerException?.Message ?? dbEx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating specialty {Id}", id);
            return StatusCode(500, new { message = "خطای سرور", details = ex.Message });
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
