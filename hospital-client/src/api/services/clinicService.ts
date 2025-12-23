import apiClient from "../client";
import type { Insurance } from "./insuranceService";

export interface Clinic {
  id: number;
  name?: string;
  phone?: string;
  managerId?: number;
  managerName?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  workHours?: ClinicWorkHours[];
  addresses?: ClinicAddress[];
  clinicServices?: ClinicService[];
}

export interface ClinicWorkHours {
  id: number;
  dayOfWeek: string;
  startTime?: string;
  endTime?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicAddress {
  id: number;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface ClinicService {
  id: number;
  clinicId: number;
  serviceId: number;
  price?: number;
  active: boolean;
  service?: {
    id: number;
    name?: string;
  };
}

export const clinicService = {
  async getAll(
    searchTerm?: string,
    city?: string,
    isActive?: boolean,
    insuranceId?: number,
    serviceId?: number
  ): Promise<Clinic[]> {
    const params = new URLSearchParams();
    if (searchTerm) params.append("searchTerm", searchTerm);
    if (city) params.append("city", city);
    if (isActive !== undefined) params.append("isActive", isActive.toString());
    if (insuranceId) params.append("insuranceId", insuranceId.toString());
    if (serviceId) params.append("serviceId", serviceId.toString());

    const { data } = await apiClient.get<Clinic[]>(
      `/api/clinics?${params.toString()}`
    );
    return data;
  },

  async getById(id: number): Promise<Clinic> {
    const { data } = await apiClient.get<Clinic>(`/api/clinics/${id}`);
    return data;
  },

  async getClinicServices(clinicId: number): Promise<ClinicService[]> {
    const { data } = await apiClient.get<ClinicService[]>(
      `/api/clinics/${clinicId}/services`
    );
    return data;
  },
};
