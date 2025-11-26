namespace HospitalSystem.Infrastructure.Models;

public class SpecialtyDto
{
    public long Id { get; set; }
    public long? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateSpecialtyDto
{
    public long? CategoryId { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
}

public class UpdateSpecialtyDto
{
    public long Id { get; set; }
    public long? CategoryId { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
}

