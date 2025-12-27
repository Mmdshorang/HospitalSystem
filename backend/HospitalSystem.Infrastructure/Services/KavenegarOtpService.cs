using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using HospitalSystem.Domain.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace HospitalSystem.Infrastructure.Services;

/// <summary>
/// OTP service implementation using Kavenegar VerifyLookup API.
/// This class is responsible ONLY for sending the OTP via SMS.
/// Validation of the OTP code انجام در AuthService و دیتابیس انجام می‌شود.
/// </summary>
public class KavenegarOtpService : IOtpService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<KavenegarOtpService> _logger;
    private readonly IConfiguration _configuration;

    public KavenegarOtpService(
        HttpClient httpClient,
        ILogger<KavenegarOtpService> logger,
        IConfiguration configuration)
    {
        _httpClient = httpClient;
        _logger = logger;
        _configuration = configuration;
    }

    public async Task SendOtpAsync(string phone, string code, CancellationToken cancellationToken = default)
    {
        // Priority: Environment variables > appsettings
        var apiKey = Environment.GetEnvironmentVariable("KAVENEGAR_API_KEY") 
            ?? _configuration["Kavenegar:ApiKey"];
        var template = Environment.GetEnvironmentVariable("KAVENEGAR_TEMPLATE") 
            ?? _configuration["Kavenegar:Template"];
        var type = Environment.GetEnvironmentVariable("KAVENEGAR_TYPE") 
            ?? _configuration["Kavenegar:Type"] 
            ?? "sms";

        if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(template))
        {
            _logger.LogWarning("Kavenegar settings are not configured properly. ApiKey or Template is missing.");
            return;
        }

        try
        {
            // Kavenegar VerifyLookup REST endpoint
            var url = $"https://api.kavenegar.com/v1/{apiKey}/verify/lookup.json";

            var payload = new Dictionary<string, string?>
            {
                ["receptor"] = phone,
                ["token"] = code,
                ["template"] = template,
                ["type"] = type
            };

            using var content = new FormUrlEncodedContent(payload!);

            var response = await _httpClient.PostAsync(url, content, cancellationToken);
            var raw = await response.Content.ReadAsStringAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError(
                    "Kavenegar VerifyLookup failed. StatusCode: {StatusCode}, Response: {Response}",
                    (int)response.StatusCode,
                    raw);
                throw new InvalidOperationException("Failed to send OTP via Kavenegar.");
            }

            _logger.LogInformation("Kavenegar OTP sent to {Phone}. RawResponse: {Response}", phone, raw);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error while sending OTP via Kavenegar for {Phone}", phone);
            throw;
        }
    }

    /// <summary>
    /// در این پروژه، صحت‌سنجی OTP از طریق دیتابیس انجام می‌شود،
    /// بنابراین این متد فقط برای سازگاری با Interface مقدار true برمی‌گرداند.
    /// </summary>
    public Task<bool> VerifyOtpAsync(string phone, string code, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("KavenegarOtpService.VerifyOtpAsync called for {Phone}. Validation is handled in AuthService.", phone);
        return Task.FromResult(true);
    }
}


