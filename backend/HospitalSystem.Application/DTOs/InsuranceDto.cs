namespace HospitalSystem.Application.DTOs;

public class InsuranceDto
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? CoveragePercent { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateInsuranceDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? CoveragePercent { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateInsuranceDto
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? CoveragePercent { get; set; }
    public bool IsActive { get; set; } = true;
}

