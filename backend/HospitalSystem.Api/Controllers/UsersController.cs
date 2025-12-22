using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HospitalSystem.Infrastructure.Data;
using HospitalSystem.Application.DTOs;
using Microsoft.EntityFrameworkCore;

namespace HospitalSystem.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<UsersController> _logger;

    public UsersController(ApplicationDbContext context, ILogger<UsersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll([FromQuery] string? searchTerm)
    {
        try
        {
            var query = _context.Users.AsQueryable();
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var s = searchTerm.Trim().ToLower();
                query = query.Where(u => (u.FirstName != null && u.FirstName.ToLower().Contains(s))
                    || (u.LastName != null && u.LastName.ToLower().Contains(s))
                    || (u.Phone != null && u.Phone.Contains(searchTerm)));
            }

            var users = await query.OrderBy(u => u.FirstName).ThenBy(u => u.LastName).ToListAsync();

            var dtos = users.Select(u => new UserDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                NationalCode = u.NationalCode,
                Phone = u.Phone,
                Role = u.Role,
                Gender = u.Gender,
                BirthDate = u.BirthDate,
                AvatarUrl = u.AvatarUrl,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt
            });

            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting users");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}
