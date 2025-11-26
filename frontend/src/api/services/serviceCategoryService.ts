import apiClient from "../client";

export interface ServiceCategory {
  id: number;
  name: string;
  description: string;
  servicesCount: number;
  isActive: boolean;
  icon?: string;
  parentId?: number | null;
}

export interface ServiceCategoryPayload {
  name: string;
  description: string;
  isActive?: boolean;
  parentId?: number | null;
}

let mockCategories: ServiceCategory[] = [
  {
    id: 1,
    name: "تصویربرداری",
    description: "MRI، CT-Scan و خدمات تصویربرداری پیشرفته",
    servicesCount: 12,
    isActive: true,
    icon: "🧠",
  },
  {
    id: 2,
    name: "آزمایشگاه",
    description: "خدمات آزمایشگاهی و پاتولوژی کامل",
    servicesCount: 18,
    isActive: true,
    icon: "🧪",
  },
  {
    id: 3,
    name: "توانبخشی",
    description: "فیزیوتراپی و گفتار درمانی",
    servicesCount: 9,
    isActive: false,
    icon: "🦿",
  },
];

export const serviceCategoryService = {
  async getAll(): Promise<ServiceCategory[]> {
    try {
      const { data } = await apiClient.get<ServiceCategory[]>(
        "/api/service-categories"
      );
      return data;
    } catch {
      return [...mockCategories];
    }
  },

  async create(payload: ServiceCategoryPayload): Promise<ServiceCategory> {
    try {
      const { data } = await apiClient.post<ServiceCategory>(
        "/api/service-categories",
        payload
      );
      return data;
    } catch {
      const category: ServiceCategory = {
        id: Date.now(),
        servicesCount: 0,
        isActive: payload.isActive ?? true,
        icon: "🩺",
        ...payload,
      };
      mockCategories = [category, ...mockCategories];
      return category;
    }
  },

  async update(
    id: number,
    payload: Partial<ServiceCategoryPayload>
  ): Promise<ServiceCategory> {
    try {
      const { data } = await apiClient.put<ServiceCategory>(
        `/api/service-categories/${id}`,
        payload
      );
      return data;
    } catch {
      mockCategories = mockCategories.map((category) =>
        category.id === id ? { ...category, ...payload } : category
      );
      const updated = mockCategories.find((category) => category.id === id);
      if (!updated) {
        throw new Error("دسته‌بندی یافت نشد");
      }
      return updated;
    }
  },
};
