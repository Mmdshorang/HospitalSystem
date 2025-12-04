using HospitalSystem.Application.DTOs;
using HospitalSystem.Domain.Entities;
using HospitalSystem.Domain.Entities.Enums;
using HospitalSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using System.Text.Json;

namespace HospitalSystem.Infrastructure.Services;

public class ServiceRequestService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ServiceRequestService> _logger;

    public ServiceRequestService(ApplicationDbContext context, ILogger<ServiceRequestService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<PagedResult<ServiceRequestDto>> GetAllAsync(
        int page = 1,
        int pageSize = 10,
        RequestStatus? status = null,
        long? clinicId = null,
        long? patientId = null,
        long? performerId = null,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        string? sortBy = null,
        string? sortDirection = "asc")
    {
        var query = _context.ServiceRequests
            .Include(sr => sr.Patient)
            .Include(sr => sr.Clinic)
            .Include(sr => sr.Service)
            .Include(sr => sr.Insurance)
            .Include(sr => sr.PerformedByUser)
            .AsQueryable();

        // Apply filters dynamically
        if (status.HasValue)
        {
            query = query.Where(sr => sr.Status == status.Value);
        }

        if (clinicId.HasValue)
        {
            query = query.Where(sr => sr.ClinicId == clinicId.Value);
        }

        if (patientId.HasValue)
        {
            query = query.Where(sr => sr.PatientId == patientId.Value);
        }

        if (performerId.HasValue)
        {
            query = query.Where(sr => sr.PerformedByUserId == performerId.Value);
        }

        if (fromDate.HasValue)
        {
            query = query.Where(sr => sr.CreatedAt >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(sr => sr.CreatedAt <= toDate.Value);
        }

        // Apply sorting
        query = ApplySorting(query, sortBy, sortDirection);

        // Get total count before pagination
        var totalCount = await query.CountAsync();

        // Apply pagination
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<ServiceRequestDto>
        {
            Data = items.Select(MapToDto).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<ServiceRequestDto?> GetByIdAsync(long id)
    {
        var request = await _context.ServiceRequests
            .Include(sr => sr.Patient)
            .Include(sr => sr.Clinic)
            .Include(sr => sr.Service)
            .Include(sr => sr.Insurance)
            .Include(sr => sr.PerformedByUser)
            .FirstOrDefaultAsync(sr => sr.Id == id);

        if (request == null) return null;

        return MapToDto(request);
    }

    public async Task<ServiceRequestDto> CreateAsync(CreateServiceRequestDto dto)
    {
        var request = new ServiceRequest
        {
            PatientId = dto.PatientId,
            ClinicId = dto.ClinicId,
            ServiceId = dto.ServiceId,
            InsuranceId = dto.InsuranceId,
            PreferredTime = dto.PreferredTime,
            AppointmentType = dto.AppointmentType,
            Status = RequestStatus.pending,
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.ServiceRequests.Add(request);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(request.Id) ?? MapToDto(request);
    }

    public async Task<ServiceRequestDto?> UpdateAsync(long id, UpdateServiceRequestDto dto)
    {
        var request = await _context.ServiceRequests
            .Include(sr => sr.Patient)
            .Include(sr => sr.Clinic)
            .Include(sr => sr.Service)
            .Include(sr => sr.Insurance)
            .Include(sr => sr.PerformedByUser)
            .FirstOrDefaultAsync(sr => sr.Id == id);

        if (request == null) return null;

        var oldStatus = request.Status;

        request.ClinicId = dto.ClinicId ?? request.ClinicId;
        request.ServiceId = dto.ServiceId ?? request.ServiceId;
        request.InsuranceId = dto.InsuranceId ?? request.InsuranceId;
        request.PerformedByUserId = dto.PerformedByUserId ?? request.PerformedByUserId;
        request.PreferredTime = dto.PreferredTime ?? request.PreferredTime;
        request.AppointmentType = dto.AppointmentType ?? request.AppointmentType;
        request.Status = dto.Status ?? request.Status;
        request.TotalPrice = dto.TotalPrice ?? request.TotalPrice;
        request.InsuranceCovered = dto.InsuranceCovered ?? request.InsuranceCovered;
        request.PatientPayable = dto.PatientPayable ?? request.PatientPayable;
        request.Notes = dto.Notes ?? request.Notes;
        request.UpdatedAt = DateTime.UtcNow;

        // Log status change if changed
        if (dto.Status.HasValue && oldStatus != dto.Status.Value)
        {
            await LogStatusChange(request.Id, null, oldStatus.ToString(), dto.Status.Value.ToString(), null);
        }

        await _context.SaveChangesAsync();

        return MapToDto(request);
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var request = await _context.ServiceRequests.FindAsync(id);
        if (request == null) return false;

        _context.ServiceRequests.Remove(request);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<ServiceRequestDto?> ChangeStatusAsync(long id, ChangeStatusDto dto, long? userId = null)
    {
        var request = await _context.ServiceRequests
            .Include(sr => sr.Patient)
            .Include(sr => sr.Clinic)
            .Include(sr => sr.Service)
            .Include(sr => sr.Insurance)
            .Include(sr => sr.PerformedByUser)
            .FirstOrDefaultAsync(sr => sr.Id == id);

        if (request == null) return null;

        var oldStatus = request.Status;

        // Validate status transition
        if (!IsValidStatusTransition(oldStatus, dto.Status))
        {
            throw new InvalidOperationException($"Invalid status transition from {oldStatus} to {dto.Status}");
        }

        request.Status = dto.Status;
        request.UpdatedAt = DateTime.UtcNow;

        // Log status change
        await LogStatusChange(request.Id, userId, oldStatus.ToString(), dto.Status.ToString(), dto.Note);

        // Auto-assign status based on performer assignment
        if (dto.Status == RequestStatus.approved && request.PerformedByUserId == null)
        {
            // If assigning performer, auto-approve
            request.Status = RequestStatus.approved;
        }

        await _context.SaveChangesAsync();

        return MapToDto(request);
    }

    public async Task<ServiceRequestDto?> AssignPerformerAsync(long id, AssignPerformerDto dto, long? userId = null)
    {
        var request = await _context.ServiceRequests
            .Include(sr => sr.Patient)
            .Include(sr => sr.Clinic)
            .Include(sr => sr.Service)
            .Include(sr => sr.Insurance)
            .Include(sr => sr.PerformedByUser)
            .FirstOrDefaultAsync(sr => sr.Id == id);

        if (request == null) return null;

        var oldStatus = request.Status;
        request.PerformedByUserId = dto.PerformedByUserId;
        
        // Auto-change status based on current status
        if (request.Status == RequestStatus.pending)
        {
            request.Status = RequestStatus.approved;
        }
        else if (request.Status == RequestStatus.approved)
        {
            request.Status = RequestStatus.in_progress;
        }

        request.UpdatedAt = DateTime.UtcNow;

        // Log status change if changed
        if (oldStatus != request.Status)
        {
            await LogStatusChange(request.Id, userId, oldStatus.ToString(), request.Status.ToString(), "Performer assigned");
        }

        await _context.SaveChangesAsync();

        return MapToDto(request);
    }

    public async Task<IEnumerable<ServiceRequestHistoryDto>> GetHistoryAsync(long id)
    {
        var auditLogs = await _context.AuditLogs
            .Include(al => al.User)
            .Where(al => al.Entity == "ServiceRequest" && al.EntityId == id)
            .OrderByDescending(al => al.CreatedAt)
            .ToListAsync();

        return auditLogs.Select(al =>
        {
            var oldStatus = ExtractStatusFromJson(al.OldValue);
            var newStatus = ExtractStatusFromJson(al.NewValue);

            return new ServiceRequestHistoryDto
            {
                ChangedAt = al.CreatedAt,
                ChangedBy = al.User != null ? $"{al.User.FirstName} {al.User.LastName}" : null,
                FromStatus = oldStatus,
                ToStatus = newStatus,
                Note = ExtractNoteFromJson(al.NewValue)
            };
        });
    }

    private IQueryable<ServiceRequest> ApplySorting(IQueryable<ServiceRequest> query, string? sortBy, string? sortDirection)
    {
        sortBy = sortBy?.ToLower() ?? "createdat";
        sortDirection = sortDirection?.ToLower() ?? "desc";

        return sortBy switch
        {
            "createdat" => sortDirection == "asc" ? query.OrderBy(sr => sr.CreatedAt) : query.OrderByDescending(sr => sr.CreatedAt),
            "preferredtime" => sortDirection == "asc" ? query.OrderBy(sr => sr.PreferredTime) : query.OrderByDescending(sr => sr.PreferredTime),
            "status" => sortDirection == "asc" ? query.OrderBy(sr => sr.Status) : query.OrderByDescending(sr => sr.Status),
            _ => query.OrderByDescending(sr => sr.CreatedAt)
        };
    }

    private bool IsValidStatusTransition(RequestStatus from, RequestStatus to)
    {
        // Define valid transitions
        return from switch
        {
            RequestStatus.pending => to == RequestStatus.approved || to == RequestStatus.rejected,
            RequestStatus.approved => to == RequestStatus.in_progress || to == RequestStatus.rejected,
            RequestStatus.in_progress => to == RequestStatus.done || to == RequestStatus.rejected,
            RequestStatus.done => false, // Cannot change from done
            RequestStatus.rejected => false, // Cannot change from rejected
            _ => false
        };
    }

    private async Task LogStatusChange(long requestId, long? userId, string? oldStatus, string? newStatus, string? note)
    {
        var logData = new
        {
            Status = newStatus,
            Note = note
        };

        var oldValue = oldStatus != null ? JsonSerializer.Serialize(new { Status = oldStatus }) : null;
        var newValue = JsonSerializer.Serialize(logData);

        var auditLog = new AuditLog
        {
            UserId = userId,
            Action = "StatusChanged",
            Entity = "ServiceRequest",
            EntityId = requestId,
            OldValue = oldValue,
            NewValue = newValue,
            CreatedAt = DateTime.UtcNow
        };

        _context.AuditLogs.Add(auditLog);
        await _context.SaveChangesAsync();
    }

    private string? ExtractStatusFromJson(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return null;

        try
        {
            var doc = JsonDocument.Parse(json);
            if (doc.RootElement.TryGetProperty("Status", out var statusElement))
            {
                return statusElement.GetString();
            }
        }
        catch { }

        return null;
    }

    private string? ExtractNoteFromJson(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return null;

        try
        {
            var doc = JsonDocument.Parse(json);
            if (doc.RootElement.TryGetProperty("Note", out var noteElement))
            {
                return noteElement.GetString();
            }
        }
        catch { }

        return null;
    }

    private ServiceRequestDto MapToDto(ServiceRequest request)
    {
        return new ServiceRequestDto
        {
            Id = request.Id,
            PatientId = request.PatientId,
            PatientName = request.Patient != null ? $"{request.Patient.FirstName} {request.Patient.LastName}" : null,
            ClinicId = request.ClinicId,
            ClinicName = request.Clinic?.Name,
            ServiceId = request.ServiceId,
            ServiceName = request.Service?.Name,
            InsuranceId = request.InsuranceId,
            InsuranceName = request.Insurance?.Name,
            PerformedByUserId = request.PerformedByUserId,
            PerformedByUserName = request.PerformedByUser != null ? $"{request.PerformedByUser.FirstName} {request.PerformedByUser.LastName}" : null,
            PreferredTime = request.PreferredTime,
            AppointmentType = request.AppointmentType,
            Status = request.Status,
            TotalPrice = request.TotalPrice,
            InsuranceCovered = request.InsuranceCovered,
            PatientPayable = request.PatientPayable,
            Notes = request.Notes,
            CreatedAt = request.CreatedAt,
            UpdatedAt = request.UpdatedAt
        };
    }
}

