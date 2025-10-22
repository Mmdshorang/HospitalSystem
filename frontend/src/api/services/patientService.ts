import apiClient from '../client';
import { Patient, CreatePatient, UpdatePatient } from '../types';

export const patientService = {
  // Get all patients
  getAll: async (): Promise<Patient[]> => {
    const response = await apiClient.get<Patient[]>('/api/patients');
    return response.data;
  },

  // Get patient by ID
  getById: async (id: string): Promise<Patient> => {
    const response = await apiClient.get<Patient>(`/api/patients/${id}`);
    return response.data;
  },

  // Create new patient
  create: async (patient: CreatePatient): Promise<Patient> => {
    const response = await apiClient.post<Patient>('/api/patients', patient);
    return response.data;
  },

  // Update patient
  update: async (id: string, patient: UpdatePatient): Promise<void> => {
    await apiClient.put(`/api/patients/${id}`, patient);
  },

  // Delete patient
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/patients/${id}`);
  },
};
