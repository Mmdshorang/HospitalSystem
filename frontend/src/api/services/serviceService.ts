import apiClient from "../client";

export interface Service {
  id: number;
  name?: string;
  description?: string;
  categoryId?: number;
  categoryName?: string;
  basePrice?: number;
  durationMinutes?: number;
  isInPerson: boolean;
  requiresDoctor: boolean;
  isActive: boolean;
  imageUrl?: string;
  parentServiceId?: number;
  parentServiceName?: string;
  deliveryType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceDto {
  name?: string;
  description?: string;
  categoryId?: number;
  basePrice?: number;
  durationMinutes?: number;
  isInPerson?: boolean;
  requiresDoctor?: boolean;
  isActive?: boolean;
  imageUrl?: string;
  parentServiceId?: number;
  deliveryType?: string;
}

export interface UpdateServiceDto {
  id: number;
  name?: string;
  description?: string;
  categoryId?: number;
  basePrice?: number;
  durationMinutes?: number;
  isInPerson?: boolean;
  requiresDoctor?: boolean;
  isActive?: boolean;
  imageUrl?: string;
  parentServiceId?: number;
  deliveryType?: string;
}

export const serviceService = {
  async getAll(searchTerm?: string, categoryId?: number): Promise<Service[]> {
    const params = new URLSearchParams();
    if (searchTerm) params.append("searchTerm", searchTerm);
    if (categoryId) params.append("categoryId", categoryId.toString());

    const { data } = await apiClient.get<Service[]>(
      `/api/services?${params.toString()}`
    );
    return data;
  },

  async getById(id: number): Promise<Service> {
    const { data } = await apiClient.get<Service>(`/api/services/${id}`);
    return data;
  },

  async create(payload: CreateServiceDto): Promise<Service> {
    const { data } = await apiClient.post<Service>("/api/services", payload);
    return data;
  },

  async update(id: number, payload: UpdateServiceDto): Promise<Service> {
    const { data } = await apiClient.put<Service>(
      `/api/services/${id}`,
      payload
    );
    return data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/api/services/${id}`);
  },
};
