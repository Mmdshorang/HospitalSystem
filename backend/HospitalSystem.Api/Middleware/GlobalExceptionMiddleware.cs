using System.Net;
using System.Text.Json;
using Npgsql;
using Microsoft.EntityFrameworkCore;

namespace HospitalSystem.Api.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred: {ExceptionType}", ex.GetType().Name);
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        var statusCode = HttpStatusCode.InternalServerError;
        string message = "An error occurred while processing your request";
        string details = exception.Message;

        // Handle database connection errors
        if (exception is NpgsqlException npgsqlEx)
        {
            _logger.LogError(npgsqlEx, "Database connection error: {SqlState}, {MessageText}", 
                npgsqlEx.SqlState, npgsqlEx.Message);
            
            statusCode = HttpStatusCode.ServiceUnavailable;
            message = "Database connection error";
            details = "Unable to connect to the database. Please try again later.";
            
            // Log connection details (without sensitive info)
            if (npgsqlEx.InnerException != null)
            {
                _logger.LogError("Inner exception: {InnerException}", npgsqlEx.InnerException.Message);
            }
        }
        else if (exception is DbUpdateException dbEx)
        {
            _logger.LogError(dbEx, "Database update error: {Message}", dbEx.Message);
            
            if (dbEx.InnerException is NpgsqlException innerNpgsql)
            {
                statusCode = HttpStatusCode.ServiceUnavailable;
                message = "Database operation failed";
                details = "Unable to complete the database operation. Please try again later.";
            }
            else
            {
                statusCode = HttpStatusCode.BadRequest;
                message = "Database operation failed";
                details = dbEx.Message;
            }
        }
        else if (exception is TimeoutException)
        {
            _logger.LogError(exception, "Operation timeout");
            statusCode = HttpStatusCode.RequestTimeout;
            message = "Request timeout";
            details = "The operation took too long to complete. Please try again.";
        }

        context.Response.StatusCode = (int)statusCode;

        var response = new
        {
            error = new
            {
                message = message,
                details = details,
                timestamp = DateTime.UtcNow
            }
        };

        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(jsonResponse);
    }
}
