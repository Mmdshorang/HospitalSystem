import apiClient from "../client";

export interface PatientProfile {
  id: number;
  userId: number;
  bloodType?: string;
  height?: number;
  weight?: number;
  medicalHistory?: string;
  emergencyName?: string;
  emergencyRelationship?: string;
  emergencyPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePatientProfileDto {
  bloodType?: string;
  height?: number;
  weight?: number;
  medicalHistory?: string;
  emergencyName?: string;
  emergencyRelationship?: string;
  emergencyPhone?: string;
}

export const patientService = {
  async getProfile(userId: number): Promise<PatientProfile | null> {
    try {
      const { data } = await apiClient.get<PatientProfile>(
        `/patients/${userId}/profile`
      );
      return data;
    } catch {
      return null;
    }
  },

  async updateProfile(
    userId: number,
    payload: UpdatePatientProfileDto
  ): Promise<PatientProfile> {
    const { data } = await apiClient.put<PatientProfile>(
      `/patients/${userId}/profile`,
      payload
    );
    return data;
  },
};
