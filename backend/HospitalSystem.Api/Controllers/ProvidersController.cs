using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HospitalSystem.Infrastructure.Models;
using HospitalSystem.Infrastructure.Services;
using System.Security.Claims;

namespace HospitalSystem.Api.Controllers;

[ApiController]
[Route("api/providers")]
[Authorize]
public class ProvidersController : ControllerBase
{
    private readonly ProviderService _providerService;
    private readonly ILogger<ProvidersController> _logger;

    public ProvidersController(ProviderService providerService, ILogger<ProvidersController> logger)
    {
        _providerService = providerService;
        _logger = logger;
    }

    /// <summary>
    /// Get all providers with optional search and filters
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? searchTerm,
        [FromQuery] long? specialtyId,
        [FromQuery] long? clinicId,
        [FromQuery] bool? isActive)
    {
        try
        {
            var providers = await _providerService.GetAllAsync(searchTerm, specialtyId, clinicId, isActive);
            return Ok(providers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting providers");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Get provider by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        try
        {
            var provider = await _providerService.GetByIdAsync(id);

            if (provider == null)
                return NotFound(new { message = "Provider not found" });

            return Ok(provider);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting provider {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Create a new provider profile
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Create([FromBody] CreateProviderProfileDto dto)
    {
        try
        {
            if (dto.UserId <= 0)
            {
                return BadRequest(new { message = "UserId is required and must be greater than 0" });
            }

            var provider = await _providerService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = provider.Id }, provider);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Business logic error creating provider: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating provider");
            return StatusCode(500, new { message = "Internal server error", details = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing provider profile
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateProviderProfileDto dto)
    {
        try
        {
            if (id != dto.Id)
                return BadRequest(new { message = "ID mismatch" });

            var provider = await _providerService.UpdateAsync(id, dto);

            if (provider == null)
                return NotFound(new { message = "Provider not found" });

            return Ok(provider);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating provider {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Delete a provider profile
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(long id)
    {
        try
        {
            var result = await _providerService.DeleteAsync(id);

            if (!result)
                return NotFound(new { message = "Provider not found" });

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting provider {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    private long? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (long.TryParse(userIdClaim, out var userId))
        {
            return userId;
        }
        return null;
    }
}
