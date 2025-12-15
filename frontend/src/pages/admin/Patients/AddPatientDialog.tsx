import React, { useState, useEffect } from "react";
import JalaliDatePicker from "@/components/DatePicker/DatePicker";

export interface AddPatientFormValues {
  id?: string | null;
  firstName: string;
  lastName: string;
  nationalId: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  bloodType: string;
  emergencyContact: string;
  emergencyPhone: string;
  gender?: "male" | "female" | "other" | null;
  isActive: boolean;
}

interface AddPatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: AddPatientFormValues) => void;
  initialValues?: Partial<AddPatientFormValues> | null;
}

const AddPatientDialog: React.FC<AddPatientDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues = null,
}) => {
  const [values, setValues] = useState<AddPatientFormValues>({
    firstName: "",
    lastName: "",
    nationalId: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    bloodType: "",
    emergencyContact: "",
    emergencyPhone: "",
    gender: null,
    id: null,
    isActive: true,
  });

  useEffect(() => {
    if (isOpen && initialValues) {
      setValues(
        (prev) =>
          ({
            ...prev,
            ...initialValues,
          } as AddPatientFormValues)
      );
    }
    if (!isOpen) {
      // reset when closed
      setValues({
        firstName: "",
        lastName: "",
        nationalId: "",
        dateOfBirth: "",
        phoneNumber: "",
        address: "",
        bloodType: "",
        emergencyContact: "",
        emergencyPhone: "",
        gender: null,
        id: null,
        isActive: true,
      });
    }
  }, [isOpen, initialValues]);

  const resetAndClose = () => {
    setValues({
      firstName: "",
      lastName: "",
      nationalId: "",
      dateOfBirth: "",
      phoneNumber: "",
      address: "",
      bloodType: "",
      emergencyContact: "",
      emergencyPhone: "",
      gender: null,
      id: null,
      isActive: true,
    });
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.firstName || !values.lastName) return;
    if (!values.nationalId || !values.phoneNumber || !values.dateOfBirth)
      return;
    onSubmit(values);
    resetAndClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={resetAndClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            {values.id ? "ویرایش بیمار" : "افزودن بیمار"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                value={values.nationalId}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                شماره تماس بیمار
              </label>
              <input
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                تاریخ تولد بیمار
              </label>
              <JalaliDatePicker
                value={values.dateOfBirth}
                onChange={(val) =>
                  setValues((prev) => ({ ...prev, dateOfBirth: val ?? "" }))
                }
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
                name="RelationshipToPatient"
                value={values.RelationshipToPatient ?? ""}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                شماره تماس اضطراری بیمار
              </label>
              <input
                name="PhoneRelationshipToPatient"
                value={values.PhoneRelationshipToPatient ?? ""}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">آدرس</label>
              <textarea
                name="address"
                value={values.address}
                onChange={handleChange}
                className="input h-24"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                شماره بیمه بیمار
              </label>
              <input
                name="bloodType"
                value={values.bloodType}
                onChange={handleChange}
                className="input"
                placeholder="مثال: O+"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                تماس اضطراری
              </label>
              <input
                name="emergencyContact"
                value={values.emergencyContact}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                شماره تماس اضطراری
              </label>
              <input
                name="emergencyPhone"
                value={values.emergencyPhone}
                onChange={handleChange}
                className="input"
                required
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
