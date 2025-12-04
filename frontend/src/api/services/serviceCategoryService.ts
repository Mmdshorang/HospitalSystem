import apiClient from "../client";

export interface ServiceCategory {
  id: number;
  name?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceCategoryDto {
  name?: string;
  description?: string;
}

export interface UpdateServiceCategoryDto {
  id: number;
  name?: string;
  description?: string;
}

export const serviceCategoryService = {
  async getAll(searchTerm?: string): Promise<ServiceCategory[]> {
    const params = new URLSearchParams();
    if (searchTerm) params.append("searchTerm", searchTerm);

    const { data } = await apiClient.get<ServiceCategory[]>(
      `/api/service-categories?${params.toString()}`
    );
    return data;
  },

  async getById(id: number): Promise<ServiceCategory> {
    const { data } = await apiClient.get<ServiceCategory>(
      `/api/service-categories/${id}`
    );
    return data;
  },

  async create(payload: CreateServiceCategoryDto): Promise<ServiceCategory> {
    const { data } = await apiClient.post<ServiceCategory>(
      "/api/service-categories",
      payload
    );
    return data;
  },

  async update(
    id: number,
    payload: UpdateServiceCategoryDto
  ): Promise<ServiceCategory> {
    const { data } = await apiClient.put<ServiceCategory>(
      `/api/service-categories/${id}`,
      payload
    );
    return data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/api/service-categories/${id}`);
  },
};
