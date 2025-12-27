import apiClient from '../client';
import type { Doctor  , CreateDoctor, UpdateDoctor } from '../generated-types';

export const doctorService = {
  // Get all doctors
  getAll: async (): Promise<Doctor[]> => {
    const response = await apiClient.get<Doctor[]>('/doctors');
    return response.data;
  },

  // Get doctor by ID 
  getById: async (id: string): Promise<Doctor> => {
    const response = await apiClient.get<Doctor>(`/doctors/${id}`);
    return response.data;
  },

  // Create new doctor
  create: async (doctor: CreateDoctor): Promise<Doctor> => {
    const response = await apiClient.post<Doctor>('/doctors', doctor);
    return response.data;
  },

  // Update doctor
  update: async (id: string, doctor: UpdateDoctor): Promise<void> => {
    await apiClient.put(`/doctors/${id}`, doctor);
  },

  // Delete doctor
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/doctors/${id}`);
  },
};
