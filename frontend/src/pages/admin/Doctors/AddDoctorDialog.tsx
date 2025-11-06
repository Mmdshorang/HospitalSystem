import React, { useState } from "react";

export interface AddDoctorFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  specializationName: string; 
  specialtyId?: number | null; 
  userId?: number | null;
  clinicId?: number | null;
  degree?: string | null;
  experienceYears?: number | null;
  sharePercent?: number | null; 
  isActive: boolean; 
}

interface AddDoctorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: AddDoctorFormValues) => void;
}

const AddDoctorDialog: React.FC<AddDoctorDialogProps> = ({ isOpen, onClose, onSubmit }) => {
  const [values, setValues] = useState<AddDoctorFormValues>({
    firstName: "",
    lastName: "",
    phone: "",
    licenseNumber: "",
    specializationName: "",
    specialtyId: null,
    userId: null,
    clinicId: null,
    degree: "",
    experienceYears: null,
    sharePercent: null,
    isActive: true,
  });

  const resetAndClose = () => {
    setValues({
      firstName: "",
      lastName: "",
      phone: "",
      licenseNumber: "",
      specializationName: "",
      specialtyId: null,
      userId: null,
      clinicId: null,
      degree: "",
      experienceYears: null,
      sharePercent: null,
      isActive: true,
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: name === "experienceYears" || name === "userId" || name === "clinicId" || name === "specialtyId"
        ? (value === "" ? null : Number(value))
        : name === "sharePercent"
        ? (value === "" ? null : Number(value))
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
          <h2 className="text-lg font-semibold">افزودن پزشک</h2>
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
              <label className="block text-sm text-gray-700 mb-1">نام خانوادگی</label>
              <input
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">شماره تماس</label>
              <input
                name="phone"
                value={values.phone}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">شماره نظام پزشکی</label>
              <input
                name="licenseNumber"
                value={values.licenseNumber}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">تخصص (عنوان نمایشی)</label>
              <input
                name="specializationName"
                value={values.specializationName}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">شناسه تخصص</label>
              <input
                name="specialtyId"
                value={values.specialtyId ?? ""}
                onChange={handleChange}
                className="input"
                type="number"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">شناسه کاربر (UserId)</label>
              <input
                name="userId"
                value={values.userId ?? ""}
                onChange={handleChange}
                className="input"
                type="number"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">شناسه کلینیک (ClinicId)</label>
              <input
                name="clinicId"
                value={values.clinicId ?? ""}
                onChange={handleChange}
                className="input"
                type="number"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">مدرک (Degree)</label>
              <input
                name="degree"
                value={values.degree ?? ""}
                onChange={handleChange}
                className="input"
                placeholder="MD / PhD / ..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">سال‌های تجربه</label>
              <input
                name="experienceYears"
                value={values.experienceYears ?? ""}
                onChange={handleChange}
                className="input"
                type="number"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">درصد سهم (0 تا 100 با دو رقم اعشار)</label>
              <input
                name="sharePercent"
                value={values.sharePercent ?? ""}
                onChange={handleChange}
                className="input"
                type="number"
                min={0}
                max={100}
                step={0.01}
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
              <label htmlFor="isActive" className="text-sm text-gray-700">فعال باشد</label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" className="btn btn-ghost" onClick={resetAndClose}>
              انصراف
            </button>
            <button type="submit" className="btn btn-primary">
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorDialog;


