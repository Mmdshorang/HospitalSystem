using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HospitalSystem.Application.DTOs;
using HospitalSystem.Infrastructure.Services;

namespace HospitalSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ServiceCategoriesController : ControllerBase
{
    private readonly ServiceCategoryService _serviceCategoryService;
    private readonly ILogger<ServiceCategoriesController> _logger;

    public ServiceCategoriesController(ServiceCategoryService serviceCategoryService, ILogger<ServiceCategoriesController> logger)
    {
        _serviceCategoryService = serviceCategoryService;
        _logger = logger;
    }

    /// <summary>
    /// Get all service categories with optional search
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? searchTerm)
    {
        try
        {
            var categories = await _serviceCategoryService.GetAllAsync(searchTerm);
            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting service categories");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Get service category by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        try
        {
            var category = await _serviceCategoryService.GetByIdAsync(id);

            if (category == null)
                return NotFound(new { message = "Service category not found" });

            return Ok(category);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting service category {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Create a new service category
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Create([FromBody] CreateServiceCategoryDto dto)
    {
        try
        {
            var category = await _serviceCategoryService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating service category");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Update an existing service category
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateServiceCategoryDto dto)
    {
        try
        {
            if (id != dto.Id)
                return BadRequest(new { message = "ID mismatch" });

            var category = await _serviceCategoryService.UpdateAsync(id, dto);

            if (category == null)
                return NotFound(new { message = "Service category not found" });

            return Ok(category);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating service category {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Delete a service category
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(long id)
    {
        try
        {
            var result = await _serviceCategoryService.DeleteAsync(id);

            if (!result)
                return NotFound(new { message = "Service category not found" });

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting service category {Id}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}

