import { apiClient } from '../client';

export interface WorkSchedule {
  id: number;
  dayOfWeek: string;
  startTime?: string;
  endTime?: string;
  isActive: boolean;
}

export interface Provider {
  id: number;
  userId: number;
  userFirstName?: string;
  userLastName?: string;
  userPhone?: string;
  clinicId?: number;
  clinicName?: string;
  specialtyId?: number;
  specialtyName?: string;
  degree?: string;
  experienceYears?: number;
  sharePercent?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  workSchedules?: WorkSchedule[];
}

export interface CreateProviderDto {
  userId: number;
  clinicId?: number;
  specialtyId?: number;
  degree?: string;
  experienceYears?: number;
  sharePercent?: number;
  isActive?: boolean;
}

export interface UpdateProviderDto {
  id: number;
  clinicId?: number;
  specialtyId?: number;
  degree?: string;
  experienceYears?: number;
  sharePercent?: number;
  isActive: boolean;
}

export const providerService = {
  // Get all providers with optional filters
  getAll: async (
    searchTerm?: string,
    specialtyId?: number,
    clinicId?: number,
    isActive?: boolean
  ): Promise<Provider[]> => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('searchTerm', searchTerm);
    if (specialtyId) params.append('specialtyId', specialtyId.toString());
    if (clinicId) params.append('clinicId', clinicId.toString());
    if (isActive !== undefined) params.append('isActive', isActive.toString());

    const response = await apiClient.get(`/providers?${params.toString()}`);
    console.log("Provider service response:", response.data);
    console.log("Is array?", Array.isArray(response.data));
    
    // Ensure we return an array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    // If it's not an array, return empty array or wrap it
    console.warn("Response data is not an array:", response.data);
    return [];
  },

  // Get provider by ID
  getById: async (id: number): Promise<Provider> => {
    const response = await apiClient.get(`/providers/${id}`);
    return response.data;
  },

  // Create new provider
  create: async (data: CreateProviderDto): Promise<Provider> => {
    const response = await apiClient.post('/providers', data);
    return response.data;
  },

  // Update existing provider
  update: async (id: number, data: UpdateProviderDto): Promise<Provider> => {
    const response = await apiClient.put(`/providers/${id}`, { ...data, id });
    return response.data;
  },

  // Delete provider
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/providers/${id}`);
  },
};
