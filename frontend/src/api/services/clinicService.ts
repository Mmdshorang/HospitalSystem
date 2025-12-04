import apiClient from "../client";

export interface Clinic {
  id: number;
  name?: string;
  phone?: string;
  email?: string;
  managerId?: number;
  managerName?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  workHours?: ClinicWorkHours[];
  addresses?: ClinicAddress[];
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

export interface CreateClinicDto {
  name?: string;
  phone?: string;
  email?: string;
  managerId?: number;
  logoUrl?: string;
  isActive?: boolean;
  workHours?: CreateClinicWorkHours[];
  addresses?: CreateClinicAddress[];
}

export interface CreateClinicWorkHours {
  dayOfWeek: string;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}

export interface CreateClinicAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface UpdateClinicDto {
  id: number;
  name?: string;
  phone?: string;
  email?: string;
  managerId?: number;
  logoUrl?: string;
  isActive?: boolean;
}

export const clinicService = {
  async getAll(
    searchTerm?: string,
    city?: string,
    isActive?: boolean
  ): Promise<Clinic[]> {
    const params = new URLSearchParams();
    if (searchTerm) params.append("searchTerm", searchTerm);
    if (city) params.append("city", city);
    if (isActive !== undefined) params.append("isActive", isActive.toString());

    const { data } = await apiClient.get<Clinic[]>(
      `/api/clinics?${params.toString()}`
    );
    return data;
  },

  async getById(id: number): Promise<Clinic> {
    const { data } = await apiClient.get<Clinic>(`/api/clinics/${id}`);
    return data;
  },

  async create(payload: CreateClinicDto): Promise<Clinic> {
    const { data } = await apiClient.post<Clinic>("/api/clinics", payload);
    return data;
  },

  async update(id: number, payload: UpdateClinicDto): Promise<Clinic> {
    const { data } = await apiClient.put<Clinic>(`/api/clinics/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/api/clinics/${id}`);
  },
};
