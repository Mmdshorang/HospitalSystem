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

export interface CreateInsuranceDto {
  name?: string;
  description?: string;
  coveragePercent?: number;
  isActive?: boolean;
}

export interface UpdateInsuranceDto {
  id: number;
  name?: string;
  description?: string;
  coveragePercent?: number;
  isActive?: boolean;
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

  async create(payload: CreateInsuranceDto): Promise<Insurance> {
    const { data } = await apiClient.post<Insurance>(
      "/insurances",
      payload
    );
    return data;
  },

  async update(id: number, payload: UpdateInsuranceDto): Promise<Insurance> {
    const { data } = await apiClient.put<Insurance>(
      `/insurances/${id}`,
      payload
    );
    return data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/insurances/${id}`);
  },
};
