import React, { useState } from "react";

export interface AddPatientFormValues {
  firstName: string;
  lastName: string;
  phone?: string | null;
  nationalId?: string | null;
  birthDate?: string | null;
  gender?: "male" | "female" | "other" | null;
  insuranceNumber?: string | null;
  address?: string | null;
  isActive: boolean;
  RelationshipToPatient?: string | null;
  PhoneRelationshipToPatient?: string | null;
}

interface AddPatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: AddPatientFormValues) => void;
}

const AddPatientDialog: React.FC<AddPatientDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState<AddPatientFormValues>({
    firstName: "",
    lastName: "",
    phone: null,
    nationalId: null,
    birthDate: null,
    gender: null,
    insuranceNumber: null,
    address: null,
    isActive: true,
    RelationshipToPatient: null,
    PhoneRelationshipToPatient: null,
  });

  const resetAndClose = () => {
    setValues({
      firstName: "",
      lastName: "",
      phone: null,
      nationalId: null,
      birthDate: null,
      gender: null,
      insuranceNumber: null,
      address: null,
      isActive: true,
      RelationshipToPatient: null,
      PhoneRelationshipToPatient: null,
    });
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value === "" ? null : value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.firstName || !values.lastName) return;
    onSubmit(values);
    resetAndClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={resetAndClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">افزودن بیمار</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                نام بیمار
              </label>
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
                نام خانوادگی بیمار
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
              <label className="block text-sm text-gray-700 mb-1">
                کد ملی بیمار
              </label>
              <input
                name="nationalId"
                value={values.nationalId ?? ""}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                شماره تماس بیمار
              </label>
              <input
                name="phone"
                value={values.phone ?? ""}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                تاریخ تولد بیمار
              </label>
              <input
                name="birthDate"
                value={values.birthDate ?? ""}
                onChange={handleChange}
                className="input"
                type="date"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                جنسیت بیمار
              </label>
              <select
                name="gender"
                value={values.gender ?? ""}
                onChange={handleChange}
                className="input"
              >
                <option value="">انتخاب کنید</option>
                <option value="male">مرد</option>
                <option value="female">زن</option>
                <option value="other">سایر</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                نام همراه بیمار
              </label>
              <input
                name="firstName"
                value={values.RelationshipToPatient ?? ""}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                شماره تماس اضطراری بیمار
              </label>
              <input
                name="firstName"
                value={values.RelationshipToPatient ?? ""}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">آدرس</label>
              <textarea
                name="address"
                value={values.address ?? ""}
                onChange={handleChange}
                className="input h-24"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                شماره بیمه بیمار
              </label>
              <input
                name="insuranceNumber"
                value={values.insuranceNumber ?? ""}
                onChange={handleChange}
                className="input"
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

export default AddPatientDialog;
