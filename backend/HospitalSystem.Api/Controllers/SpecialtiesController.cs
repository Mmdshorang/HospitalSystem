using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MediatR;
using HospitalSystem.Application.Features.Specialties.Queries.GetAllSpecialties;
using HospitalSystem.Application.Features.Specialties.Queries.GetSpecialtyById;
using HospitalSystem.Application.Features.Specialties.Commands.CreateSpecialty;
using HospitalSystem.Application.Features.Specialties.Commands.UpdateSpecialty;
using HospitalSystem.Application.Features.Specialties.Commands.DeleteSpecialty;

namespace HospitalSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SpecialtiesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<SpecialtiesController> _logger;

    public SpecialtiesController(IMediator mediator, ILogger<SpecialtiesController> logger)
    {
        _mediator = mediator;
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
            var query = new GetAllSpecialtiesQuery
            {
                SearchTerm = searchTerm,
                CategoryId = categoryId
            };

            var specialties = await _mediator.Send(query);
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
            var query = new GetSpecialtyByIdQuery { Id = id };
            var specialty = await _mediator.Send(query);

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
    public async Task<IActionResult> Create([FromBody] CreateSpecialtyCommand command)
    {
        try
        {
            var specialty = await _mediator.Send(command);
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
    public async Task<IActionResult> Update(long id, [FromBody] UpdateSpecialtyCommand command)
    {
        try
        {
            if (id != command.Id)
                return BadRequest(new { message = "ID mismatch" });

            var specialty = await _mediator.Send(command);

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
            var command = new DeleteSpecialtyCommand { Id = id };
            var result = await _mediator.Send(command);

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
