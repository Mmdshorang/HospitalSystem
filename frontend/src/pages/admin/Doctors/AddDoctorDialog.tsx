import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  specialtyService,
  type Specialty,
} from "../../../api/services/specialtyService";
import {
  clinicService,
  type Clinic,
} from "../../../api/services/clinicService";

export interface AddDoctorFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  nationalId?: string | null;
  licenseNumber: string;
  specialtyId?: number | null;
  clinicId?: number | null;
  degree?: string | null;
  experienceYears?: number | null;
  isActive: boolean;
}

interface AddDoctorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: AddDoctorFormValues) => void;
}

const AddDoctorDialog: React.FC<AddDoctorDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState<AddDoctorFormValues>({
    firstName: "",
    lastName: "",
    phone: "",
    nationalId: null,
    licenseNumber: "",
    specialtyId: null,
    clinicId: null,
    degree: "",
    experienceYears: null,
    isActive: true,
  });

  // Fetch specialties for dropdown
  const { data: specialties = [] } = useQuery<Specialty[]>({
    queryKey: ["specialties"],
    queryFn: () => specialtyService.getAll(),
  });

  // Fetch clinics for dropdown
  const { data: clinics = [] } = useQuery<Clinic[]>({
    queryKey: ["clinics"],
    queryFn: () => clinicService.getAll(),
  });

  const resetAndClose = () => {
    setValues({
      firstName: "",
      lastName: "",
      phone: "",
      nationalId: null,
      licenseNumber: "",
      specialtyId: null,
      clinicId: null,
      degree: "",
      experienceYears: null,
      isActive: true,
    });
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]:
        name === "experienceYears" ||
        name === "userId" ||
        name === "clinicId" ||
        name === "specialtyId"
          ? value === ""
            ? null
            : Number(value)
          : name === "sharePercent"
          ? value === ""
            ? null
            : Number(value)
          : value,
    }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.firstName || !values.lastName || !values.licenseNumber) return;
    onSubmit(values);
    resetAndClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={resetAndClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">افزودن کادر درمانی</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">نام</label>
              <input
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                نام خانوادگی
              </label>
              <input
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">کد ملی</label>
              <input
                name="nationalId"
                value={values.nationalId ?? ""}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                شماره تماس
              </label>
              <input
                name="phone"
                value={values.phone}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                شماره نظام پزشکی
              </label>
              <input
                name="licenseNumber"
                value={values.licenseNumber}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">تخصص</label>
              <select
                name="specialtyId"
                value={values.specialtyId ?? ""}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-primary"
              >
                <option value="">انتخاب تخصص...</option>
                {specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">کلینیک</label>
              <select
                name="clinicId"
                value={values.clinicId ?? ""}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-primary"
              >
                <option value="">انتخاب کلینیک...</option>
                {clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">مدرک</label>
              <input
                name="degree"
                value={values.degree ?? ""}
                onChange={handleChange}
                className="input"
                placeholder="MD / PhD / ..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                سال‌های تجربه
              </label>
              <input
                name="experienceYears"
                value={values.experienceYears ?? ""}
                onChange={handleChange}
                className="input"
                type="number"
                min={0}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={values.isActive}
                onChange={handleCheckbox}
                className="h-4 w-4"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                فعال باشد
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              className="btn btn-ghost h-11 rounded-2xl bg-red-600 hover:bg-red-700 px-10 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-colors"
              onClick={resetAndClose}
            >
              انصراف
            </button>
            <button
              type="submit"
              className="h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 px-10 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-colors"
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorDialog;
