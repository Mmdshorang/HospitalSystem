using HospitalSystem.Application.DTOs;

namespace HospitalSystem.Application.Common.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<bool> ValidateTokenAsync(string token);
    Task<UserInfo> GetUserInfoAsync(string userId);
    Task SendOtpAsync(string phone);
    Task<bool> VerifyOtpCodeAsync(string phone, string code);
    Task<AuthResponse> LoginWithOtpAsync(string phone, string code);
}
