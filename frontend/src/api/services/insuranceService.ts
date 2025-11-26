import apiClient from "../client";

export interface Insurance {
  id: number;
  name: string;
  description: string;
  coveragePercent: number;
  updatedAt: string;
  isActive: boolean;
}

export interface InsurancePayload {
  name: string;
  description: string;
  coveragePercent: number;
  isActive?: boolean;
}

let mockInsurances: Insurance[] = [
  {
    id: 1,
    name: "تأمین اجتماعی",
    description: "پوشش عمومی خدمات درمانی",
    coveragePercent: 80,
    updatedAt: "۱۴۰۳/۰۸/۰۱",
    isActive: true,
  },
  {
    id: 2,
    name: "نیروهای مسلح",
    description: "پوشش کامل خدمات تخصصی",
    coveragePercent: 90,
    updatedAt: "۱۴۰۳/۰۷/۲۸",
    isActive: true,
  },
  {
    id: 3,
    name: "بیمه تکمیلی آتیه",
    description: "پوشش جراحی و خدمات زیبایی",
    coveragePercent: 65,
    updatedAt: "۱۴۰۳/۰۶/۱۲",
    isActive: false,
  },
];

export const insuranceService = {
  async getAll(): Promise<Insurance[]> {
    try {
      const { data } = await apiClient.get<Insurance[]>("/api/insurances");
      return data;
    } catch {
      return [...mockInsurances];
    }
  },

  async create(payload: InsurancePayload): Promise<Insurance> {
    try {
      const { data } = await apiClient.post<Insurance>(
        "/api/insurances",
        payload
      );
      return data;
    } catch {
      const insurance: Insurance = {
        id: Date.now(),
        updatedAt: new Date().toLocaleDateString("fa-IR"),
        isActive: payload.isActive ?? true,
        ...payload,
      };
      mockInsurances = [insurance, ...mockInsurances];
      return insurance;
    }
  },

  async update(
    id: number,
    payload: Partial<InsurancePayload>
  ): Promise<Insurance> {
    try {
      const { data } = await apiClient.put<Insurance>(
        `/api/insurances/${id}`,
        payload
      );
      return data;
    } catch {
      mockInsurances = mockInsurances.map((insurance) =>
        insurance.id === id ? { ...insurance, ...payload } : insurance
      );
      const updated = mockInsurances.find((insurance) => insurance.id === id);
      if (!updated) throw new Error("بیمه یافت نشد");
      return updated;
    }
  },
};
