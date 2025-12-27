import apiClient from "../client";

export type RequestStatus =
  | "pending"
  | "approved"
  | "in_progress"
  | "done"
  | "rejected";
export type AppointmentType = "in_person" | "online" | "phone";

export interface ServiceRequest {
  id: number;
  patientId: number;
  patientName?: string;
  clinicId?: number;
  clinicName?: string;
  serviceId?: number;
  serviceName?: string;
  insuranceId?: number;
  insuranceName?: string;
  performedByUserId?: number;
  performedByUserName?: string;
  preferredTime?: string;
  appointmentType?: AppointmentType;
  status: RequestStatus;
  totalPrice?: number;
  insuranceCovered?: number;
  patientPayable?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  serviceResults?: any[];
  payments?: any[];
}

export interface CreateServiceRequestDto {
  patientId: number;
  clinicId?: number;
  serviceId?: number;
  insuranceId?: number;
  preferredTime?: string;
  appointmentType?: AppointmentType;
  notes?: string;
}

export interface UpdateServiceRequestDto {
  id: number;
  clinicId?: number;
  serviceId?: number;
  insuranceId?: number;
  performedByUserId?: number;
  preferredTime?: string;
  appointmentType?: AppointmentType;
  status?: RequestStatus;
  totalPrice?: number;
  insuranceCovered?: number;
  patientPayable?: number;
  notes?: string;
}

export interface ChangeStatusDto {
  status: RequestStatus;
  note?: string;
}

export interface AssignPerformerDto {
  performedByUserId: number;
}

export interface ServiceRequestHistory {
  changedAt: string;
  changedBy?: string;
  fromStatus?: string;
  toStatus?: string;
  note?: string;
}

export interface PagedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export const serviceRequestService = {
  async getAll(
    page: number = 1,
    pageSize: number = 10,
    status?: RequestStatus,
    clinicId?: number,
    patientId?: number,
    performerId?: number,
    fromDate?: string,
    toDate?: string,
    sortBy?: string,
    sortDirection: string = "desc"
  ): Promise<PagedResult<ServiceRequest>> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());
    if (status) params.append("status", status);
    if (clinicId) params.append("clinicId", clinicId.toString());
    if (patientId) params.append("patientId", patientId.toString());
    if (performerId) params.append("performerId", performerId.toString());
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);
    if (sortBy) params.append("sortBy", sortBy);
    params.append("sortDirection", sortDirection);

    const { data } = await apiClient.get<PagedResult<ServiceRequest>>(
      `/api/service-requests?${params.toString()}`
    );
    return data;
  },

  async getById(id: number): Promise<ServiceRequest> {
    const { data } = await apiClient.get<ServiceRequest>(
      `/api/service-requests/${id}`
    );
    return data;
  },

  async create(payload: CreateServiceRequestDto): Promise<ServiceRequest> {
    const { data } = await apiClient.post<ServiceRequest>(
      "/api/service-requests",
      payload
    );
    return data;
  },

  async update(
    id: number,
    payload: UpdateServiceRequestDto
  ): Promise<ServiceRequest> {
    const { data } = await apiClient.put<ServiceRequest>(
      `/api/service-requests/${id}`,
      payload
    );
    return data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/api/service-requests/${id}`);
  },

  async changeStatus(
    id: number,
    payload: ChangeStatusDto
  ): Promise<ServiceRequest> {
    const { data } = await apiClient.patch<ServiceRequest>(
      `/api/service-requests/${id}/status`,
      payload
    );
    return data;
  },

  async assignPerformer(
    id: number,
    payload: AssignPerformerDto
  ): Promise<ServiceRequest> {
    const { data } = await apiClient.post<ServiceRequest>(
      `/api/service-requests/${id}/performer`,
      payload
    );
    return data;
  },

  async getHistory(id: number): Promise<ServiceRequestHistory[]> {
    const { data } = await apiClient.get<ServiceRequestHistory[]>(
      `/api/service-requests/${id}/history`
    );
    return data;
  },
};
