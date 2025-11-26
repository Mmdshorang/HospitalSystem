using HospitalSystem.Domain.Common.Interfaces;
using Microsoft.Extensions.Logging;

namespace HospitalSystem.Infrastructure.Services;

public class MockOtpService : IOtpService
{
    private readonly ILogger<MockOtpService> _logger;

    public MockOtpService(ILogger<MockOtpService> logger)
    {
        _logger = logger;
    }

    public Task SendOtpAsync(string phone, string code, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Mock OTP sent to {Phone}: {Code}", phone, code);
        return Task.CompletedTask;
    }

    public Task<bool> VerifyOtpAsync(string phone, string code, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Mock OTP verification for {Phone} with code {Code}", phone, code);
        return Task.FromResult(true);
    }
}

