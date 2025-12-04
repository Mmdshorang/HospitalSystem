using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HospitalSystem.Application.DTOs;
using HospitalSystem.Infrastructure.Services;

namespace HospitalSystem.Api.Controllers;

[ApiController]
[Route("api/insurances")]
[Authorize]
public class InsurancesController : ControllerBase
{
    private readonly InsuranceService _insuranceService;
    private readonly ILogger<InsurancesController> _logger;

    public InsurancesController(InsuranceService insuranceService, ILogger<InsurancesController> logger)
    {
        _insuranceService = insuranceService;
        _logger = logger;
    }

    /// <summary>
    /// Get all insurances with optional filters
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? searchTerm,
        [FromQuery] bool? isActive)
    {
        try
        {
            var insurances = await _insuranceService.GetAllAsync(searchTerm, isActive);
            return Ok(insurances);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting insurances");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Get insurance by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        try
        {
            var insurance = await _insuranceService.GetByIdAsync(id);

            if (insurance == null)
                return NotFound(new { message = "Insurance not found" });

            return Ok(insurance);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting insurance {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Create a new insurance
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Create([FromBody] CreateInsuranceDto dto)
    {
        try
        {
            var insurance = await _insuranceService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = insurance.Id }, insurance);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating insurance");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Update an existing insurance
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateInsuranceDto dto)
    {
        try
        {
            if (id != dto.Id)
                return BadRequest(new { message = "ID mismatch" });

            var insurance = await _insuranceService.UpdateAsync(id, dto);

            if (insurance == null)
                return NotFound(new { message = "Insurance not found" });

            return Ok(insurance);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating insurance {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Delete an insurance
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(long id)
    {
        try
        {
            var result = await _insuranceService.DeleteAsync(id);

            if (!result)
                return NotFound(new { message = "Insurance not found" });

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting insurance {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}

