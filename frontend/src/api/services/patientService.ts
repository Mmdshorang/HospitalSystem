import apiClient from '../client';
import type { Patient  , CreatePatient, UpdatePatient } from '../generated-types';

export const patientService = {
  
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
