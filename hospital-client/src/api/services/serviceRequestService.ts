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
  trackingCode?: string;
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
  trackingCode?: string;
}

export const serviceRequestService = {
  async create(payload: CreateServiceRequestDto): Promise<ServiceRequest> {
    const { data } = await apiClient.post<ServiceRequest>(
      "/api/service-requests",
      payload
    );
    return data;
  },

  async getByTrackingCode(trackingCode: string): Promise<ServiceRequest> {
    const { data } = await apiClient.get<ServiceRequest>(
      `/api/service-requests/track/${trackingCode}`
    );
    return data;
  },

  async getByPatientId(patientId: number): Promise<ServiceRequest[]> {
    const { data } = await apiClient.get<ServiceRequest[]>(
      `/api/service-requests/patient/${patientId}`
    );
    return data;
  },

  async getById(id: number): Promise<ServiceRequest> {
    const { data } = await apiClient.get<ServiceRequest>(
      `/api/service-requests/${id}`
    );
    return data;
  },
};
