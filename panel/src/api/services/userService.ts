import apiClient from "../client";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
  nationalCode?: string;
  role?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const userService = {
  async getAll(searchTerm?: string): Promise<User[]> {
    const params = new URLSearchParams();
    if (searchTerm) params.append("searchTerm", searchTerm);
    const { data } = await apiClient.get<User[]>(`/users?${params.toString()}`);
    return data;
  },
};
