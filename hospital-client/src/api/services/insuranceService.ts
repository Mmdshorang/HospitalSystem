import apiClient from "../client";

export interface Insurance {
  id: number;
  name?: string;
  description?: string;
  coveragePercent?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const insuranceService = {
  async getAll(searchTerm?: string, isActive?: boolean): Promise<Insurance[]> {
    const params = new URLSearchParams();
    if (searchTerm) params.append("searchTerm", searchTerm);
    if (isActive !== undefined) params.append("isActive", isActive.toString());

    const { data } = await apiClient.get<Insurance[]>(
      `/insurances?${params.toString()}`
    );
    return data;
  },

  async getById(id: number): Promise<Insurance> {
    const { data } = await apiClient.get<Insurance>(`/insurances/${id}`);
    return data;
  },
};
