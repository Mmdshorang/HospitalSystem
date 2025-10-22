using Microsoft.Extensions.Diagnostics.HealthChecks;
using HospitalSystem.Infrastructure.Data;

namespace HospitalSystem.Api.HealthChecks;

public class DatabaseHealthCheck : IHealthCheck
{
    private readonly HospitalDbContext _context;

    public DatabaseHealthCheck(HospitalDbContext context)
    {
        _context = context;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            await _context.Database.CanConnectAsync(cancellationToken);
            return HealthCheckResult.Healthy("Database connection is healthy");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Database connection is unhealthy", ex);
        }
    }
}
