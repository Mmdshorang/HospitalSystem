import apiClient from "../client";

export interface ClinicService {
  id: number;
  clinicId: number;
  clinicName?: string;
  serviceId: number;
  serviceName?: string;
  price?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClinicServiceDto {
  clinicId: number;
  serviceId: number;
  price?: number;
  active?: boolean;
}

export const clinicServiceService = {
  async getClinicServices(clinicId: number): Promise<ClinicService[]> {
    const { data } = await apiClient.get<ClinicService[]>(
      `/clinics/${clinicId}/services`
    );
    return data;
  },

  async addClinicService(
    clinicId: number,
    payload: CreateClinicServiceDto
  ): Promise<ClinicService> {
    const { data } = await apiClient.post<ClinicService>(
      `/clinics/${clinicId}/services`,
      payload
    );
    return data;
  },

  async updateClinicService(
    clinicId: number,
    serviceId: number,
    payload: CreateClinicServiceDto
  ): Promise<ClinicService> {
    const { data } = await apiClient.put<ClinicService>(
      `/clinics/${clinicId}/services/${serviceId}`,
      payload
    );
    return data;
  },

  async removeClinicService(
    clinicId: number,
    serviceId: number
  ): Promise<void> {
    await apiClient.delete(`/clinics/${clinicId}/services/${serviceId}`);
  },
};
