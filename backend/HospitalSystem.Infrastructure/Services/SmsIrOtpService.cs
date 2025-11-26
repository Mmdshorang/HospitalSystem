using System.Net.Http.Json;
using HospitalSystem.Domain.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace HospitalSystem.Infrastructure.Services;

public class SmsIrOtpService : IOtpService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<SmsIrOtpService> _logger;
    private readonly IConfiguration _configuration;

    public SmsIrOtpService(HttpClient httpClient, ILogger<SmsIrOtpService> logger, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _logger = logger;
        _configuration = configuration;
    }

    public async Task SendOtpAsync(string phone, string code, CancellationToken cancellationToken = default)
    {
        var settings = _configuration.GetSection("OtpSettings");
        var apiKey = settings["SmsIrApiKey"];
        var templateId = settings["SmsIrTemplateId"];

        if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(templateId))
        {
            _logger.LogWarning("SMS.ir settings are missing. Falling back to mock logging.");
            _logger.LogInformation("OTP for {Phone}: {Code}", phone, code);
            return;
        }

        var payload = new
        {
            mobile = phone,
            templateId,
            parameters = new[]
            {
                new { name = "CODE", value = code }
            }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, settings["SmsIrEndpoint"] ?? "https://api.sms.ir/v1/send/verify");
        request.Headers.Add("x-api-key", apiKey);
        request.Content = JsonContent.Create(payload);

        var response = await _httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogError("Failed to send OTP via SMS.ir: {Status} - {Body}", response.StatusCode, body);
            throw new InvalidOperationException("Failed to send OTP");
        }
    }

    public Task<bool> VerifyOtpAsync(string phone, string code, CancellationToken cancellationToken = default)
    {
        // Verification happens via our own stored codes, so this service does not call SMS.ir
        return Task.FromResult(true);
    }
}

