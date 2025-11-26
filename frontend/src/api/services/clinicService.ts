import apiClient from "../client";

export interface Clinic {
  id: number;
  name: string;
  city: string;
  address: string;
  managerName: string;
  phone: string;
  services: number;
  status: "active" | "pending" | "inactive";
  rating: number;
  capacity: number;
  logo?: string;
}

export interface ClinicPayload {
  name: string;
  city: string;
  address: string;
  managerName: string;
  phone: string;
  status?: Clinic["status"];
  capacity?: number;
}

let mockClinics: Clinic[] = [
  {
    id: 1,
    name: "کلینیک آفتاب سبز",
    city: "تهران",
    address: "خیابان ولیعصر، بالاتر از ونک",
    managerName: "دکتر نیلوفر ادیبی",
    phone: "021-88990011",
    services: 24,
    status: "active",
    rating: 4.7,
    capacity: 120,
  },
  {
    id: 2,
    name: "مرکز جامع پارسه",
    city: "اصفهان",
    address: "میدان نقش جهان، کوچه طبیبان",
    managerName: "دکتر مهران راد",
    phone: "031-33445522",
    services: 18,
    status: "pending",
    rating: 4.2,
    capacity: 80,
  },
  {
    id: 3,
    name: "کلینیک تخصصی ساحل",
    city: "رشت",
    address: "بلوار معلم، نبش کوچه ۱۲",
    managerName: "دکتر لیلا عرب",
    phone: "013-22334455",
    services: 15,
    status: "active",
    rating: 4.5,
    capacity: 65,
  },
];

export const clinicService = {
  async getAll(): Promise<Clinic[]> {
    try {
      const { data } = await apiClient.get<Clinic[]>("/api/clinics");
      return data;
    } catch {
      return Promise.resolve([...mockClinics]);
    }
  },

  async create(payload: ClinicPayload): Promise<Clinic> {
    try {
      const { data } = await apiClient.post<Clinic>("/api/clinics", payload);
      return data;
    } catch {
      const clinic: Clinic = {
        id: Date.now(),
        services: 0,
        rating: 4.3,
        status: payload.status ?? "pending",
        capacity: payload.capacity ?? 50,
        ...payload,
      };
      mockClinics = [clinic, ...mockClinics];
      return clinic;
    }
  },

  async update(id: number, payload: Partial<ClinicPayload>): Promise<Clinic> {
    try {
      const { data } = await apiClient.put<Clinic>(
        `/api/clinics/${id}`,
        payload
      );
      return data;
    } catch {
      mockClinics = mockClinics.map((clinic) =>
        clinic.id === id ? { ...clinic, ...payload } : clinic
      );
      const updated = mockClinics.find((clinic) => clinic.id === id);
      if (!updated) {
        throw new Error("کلینیک یافت نشد");
      }
      return updated;
    }
  },

  async remove(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/clinics/${id}`);
    } catch {
      mockClinics = mockClinics.filter((clinic) => clinic.id !== id);
    }
  },
};
