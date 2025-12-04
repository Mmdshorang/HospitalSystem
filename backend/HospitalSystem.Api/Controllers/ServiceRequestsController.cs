using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HospitalSystem.Application.DTOs;
using HospitalSystem.Domain.Entities.Enums;
using HospitalSystem.Infrastructure.Services;
using System.Security.Claims;

namespace HospitalSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ServiceRequestsController : ControllerBase
{
    private readonly ServiceRequestService _serviceRequestService;
    private readonly ILogger<ServiceRequestsController> _logger;

    public ServiceRequestsController(ServiceRequestService serviceRequestService, ILogger<ServiceRequestsController> logger)
    {
        _serviceRequestService = serviceRequestService;
        _logger = logger;
    }

    /// <summary>
    /// Get all service requests with filters and pagination
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] RequestStatus? status = null,
        [FromQuery] long? clinicId = null,
        [FromQuery] long? patientId = null,
        [FromQuery] long? performerId = null,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] string? sortBy = null,
        [FromQuery] string? sortDirection = "desc")
    {
        try
        {
            var result = await _serviceRequestService.GetAllAsync(
                page, pageSize, status, clinicId, patientId, performerId,
                fromDate, toDate, sortBy, sortDirection);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting service requests");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Get service request by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        try
        {
            var request = await _serviceRequestService.GetByIdAsync(id);

            if (request == null)
                return NotFound(new { message = "Service request not found" });

            return Ok(request);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting service request {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Create a new service request
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateServiceRequestDto dto)
    {
        try
        {
            var request = await _serviceRequestService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = request.Id }, request);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating service request");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Update an existing service request
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "admin,manager")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateServiceRequestDto dto)
    {
        try
        {
            if (id != dto.Id)
                return BadRequest(new { message = "ID mismatch" });

            var request = await _serviceRequestService.UpdateAsync(id, dto);

            if (request == null)
                return NotFound(new { message = "Service request not found" });

            return Ok(request);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating service request {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Delete a service request
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(long id)
    {
        try
        {
            var result = await _serviceRequestService.DeleteAsync(id);

            if (!result)
                return NotFound(new { message = "Service request not found" });

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting service request {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Change status of a service request
    /// </summary>
    [HttpPatch("{id}/status")]
    [Authorize(Roles = "admin,manager,doctor")]
    public async Task<IActionResult> ChangeStatus(long id, [FromBody] ChangeStatusDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();
            var request = await _serviceRequestService.ChangeStatusAsync(id, dto, userId);

            if (request == null)
                return NotFound(new { message = "Service request not found" });

            return Ok(request);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing status for service request {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Get history of a service request
    /// </summary>
    [HttpGet("{id}/history")]
    public async Task<IActionResult> GetHistory(long id)
    {
        try
        {
            var history = await _serviceRequestService.GetHistoryAsync(id);
            return Ok(history);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting history for service request {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Assign a performer to a service request
    /// </summary>
    [HttpPost("{id}/performer")]
    [Authorize(Roles = "admin,manager")]
    public async Task<IActionResult> AssignPerformer(long id, [FromBody] AssignPerformerDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();
            var request = await _serviceRequestService.AssignPerformerAsync(id, dto, userId);

            if (request == null)
                return NotFound(new { message = "Service request not found" });

            return Ok(request);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error assigning performer to service request {Id}", id);
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

