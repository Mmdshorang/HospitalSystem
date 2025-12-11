import apiClient from "../client";
import type { Patient, CreatePatient, UpdatePatient } from "../generated-types";

export interface PatientListItem {
  id: number;
  firstName: string;
  lastName: string;
  nationalId: string;
  phoneNumber: string;
  dateOfBirth?: string;
  address?: string;
  bloodType?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export const patientService = {
  // Get all patients
  getAll: async (): Promise<PatientListItem[]> => {
    const response = await apiClient.get<any[]>("/api/patients");
    return (response.data || []).map((p: any) => ({
      id: p.id || Number(p.id),
      firstName: p.firstName || "",
      lastName: p.lastName || "",
      nationalId: p.nationalId || p.nationalCode || "",
      phoneNumber: p.phoneNumber || p.phone || "",
      dateOfBirth: p.dateOfBirth || p.birthDate || "",
      address: p.address || "",
      bloodType: p.bloodType || "",
      emergencyContact: p.emergencyContact || "",
      emergencyPhone: p.emergencyPhone || "",
    }));
  },

  // Create new patient
  create: async (patient: CreatePatient): Promise<Patient> => {
    const response = await apiClient.post<Patient>("/api/patients", patient);
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
