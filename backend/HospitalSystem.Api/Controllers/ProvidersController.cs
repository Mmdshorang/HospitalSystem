using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MediatR;
using HospitalSystem.Application.Features.Providers.Queries.GetAllProviders;
using HospitalSystem.Application.Features.Providers.Queries.GetProviderById;
using HospitalSystem.Application.Features.Providers.Commands.CreateProvider;
using HospitalSystem.Application.Features.Providers.Commands.UpdateProvider;
using HospitalSystem.Application.Features.Providers.Commands.DeleteProvider;

namespace HospitalSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProvidersController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ProvidersController> _logger;

    public ProvidersController(IMediator mediator, ILogger<ProvidersController> logger)
    {
        _mediator = mediator;
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
            var query = new GetAllProvidersQuery
            {
                SearchTerm = searchTerm,
                SpecialtyId = specialtyId,
                ClinicId = clinicId,
                IsActive = isActive
            };

            var providers = await _mediator.Send(query);
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
            var query = new GetProviderByIdQuery { Id = id };
            var provider = await _mediator.Send(query);

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
    public async Task<IActionResult> Create([FromBody] CreateProviderCommand command)
    {
        try
        {
            var provider = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = provider.Id }, provider);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating provider");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Update an existing provider profile
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateProviderCommand command)
    {
        try
        {
            if (id != command.Id)
                return BadRequest(new { message = "ID mismatch" });

            var provider = await _mediator.Send(command);

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
            var command = new DeleteProviderCommand { Id = id };
            var result = await _mediator.Send(command);

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
}
