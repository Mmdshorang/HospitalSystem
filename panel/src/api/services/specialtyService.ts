import { apiClient } from '../client';

export interface Specialty {
  id: number;
  categoryId?: number;
  categoryName?: string;
  name?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSpecialtyDto {
  categoryId?: number;
  name?: string;
  description?: string;
}

export interface UpdateSpecialtyDto {
  id: number;
  categoryId?: number;
  name?: string;
  description?: string;
}

export const specialtyService = {
  // Get all specialties with optional filters
  getAll: async (searchTerm?: string, categoryId?: number): Promise<Specialty[]> => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('searchTerm', searchTerm);
    if (categoryId) params.append('categoryId', categoryId.toString());

    const response = await apiClient.get(`/api/specialties?${params.toString()}`);
    return response.data;
  },

  // Get specialty by ID
  getById: async (id: number): Promise<Specialty> => {
    const response = await apiClient.get(`/api/specialties/${id}`);
    return response.data;
  },

  // Create new specialty
  create: async (data: CreateSpecialtyDto): Promise<Specialty> => {
    const response = await apiClient.post('/api/specialties', data);
    return response.data;
  },

  // Update existing specialty
  update: async (id: number, data: UpdateSpecialtyDto): Promise<Specialty> => {
    const response = await apiClient.put(`/api/specialties/${id}`, { ...data, id });
    return response.data;
  },

  // Delete specialty
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/specialties/${id}`);
  },
};
