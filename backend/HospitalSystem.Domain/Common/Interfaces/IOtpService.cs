namespace HospitalSystem.Domain.Common.Interfaces;

public interface IOtpService
{
    Task SendOtpAsync(string phone, string code, CancellationToken cancellationToken = default);
    Task<bool> VerifyOtpAsync(string phone, string code, CancellationToken cancellationToken = default);
}

