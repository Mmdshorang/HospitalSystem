using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HospitalSystem.Application.DTOs;
using HospitalSystem.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace HospitalSystem.Api.Controllers;

[ApiController]
[Route("api/service-categories")]
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
        if (!ModelState.IsValid)
        {
            var errors = ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .SelectMany(x => x.Value!.Errors)
                .Select(x => x.ErrorMessage)
                .ToList();
            _logger.LogWarning("Service category validation failed: {Errors}", string.Join(", ", errors));
            return BadRequest(new { message = "اعتبارسنجی ناموفق بود", errors = errors });
        }

        try
        {
            var category = await _serviceCategoryService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Business rule violation creating service category: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError(dbEx, "Database error creating service category");
            return StatusCode(500, new { message = "خطای دیتابیس", details = dbEx.InnerException?.Message ?? dbEx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating service category: {Message}", ex.Message);
            return StatusCode(500, new { message = "خطای سرور", details = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing service category
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateServiceCategoryDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .SelectMany(x => x.Value!.Errors)
                .Select(x => x.ErrorMessage)
                .ToList();
            _logger.LogWarning("Service category validation failed: {Errors}", string.Join(", ", errors));
            return BadRequest(new { message = "اعتبارسنجی ناموفق بود", errors = errors });
        }

        try
        {
            if (id != dto.Id)
                return BadRequest(new { message = "عدم تطابق شناسه" });

            var category = await _serviceCategoryService.UpdateAsync(id, dto);

            if (category == null)
                return NotFound(new { message = "دسته‌بندی یافت نشد" });

            return Ok(category);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Business rule violation updating service category: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError(dbEx, "Database error updating service category");
            return StatusCode(500, new { message = "خطای دیتابیس", details = dbEx.InnerException?.Message ?? dbEx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating service category {Id}", id);
            return StatusCode(500, new { message = "خطای سرور", details = ex.Message });
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

