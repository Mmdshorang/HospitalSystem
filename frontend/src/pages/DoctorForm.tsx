import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { clinicService, type Clinic } from "../api/services/clinicService";
import {
  specialtyService,
  type Specialty,
} from "../api/services/specialtyService";
const DoctorForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    specialization: "",
    email: "",
    phone: "",
    licenseNumber: "",
    officeLocation: "",
    workingHoursStart: "",
    workingHoursEnd: "",
    clinicId: null,
    degree: null,
    isAvailable: true,
    experienceYears: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Doctor data:", formData);
    alert("اطلاعات پزشک با موفقیت ذخیره شد!");
  };

  const { data: specialties = [] } = useQuery<Specialty[]>({
    queryKey: ["specialties"],
    queryFn: () => specialtyService.getAll(),
  });

  const { data: clinics = [] } = useQuery<Clinic[]>({
    queryKey: ["clinics"],
    queryFn: () => clinicService.getAll(),
  });

  return (
    <div>
      <div className="mb-8">
        <button className="btn btn-outline inline-flex items-center mb-4">
          <ArrowLeft className="h-4 w-4 ml-2" />
          بازگشت به لیست کادر درمانی
        </button>
        <h1 className="text-3xl font-bold text-gray-900">افزودن کادر درمانی</h1>
        <p className="mt-2 text-gray-600">اطلاعات کادر درمان را وارد کنید</p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نام
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نام خانوادگی
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                شماره تماس
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تخصص
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="input"
                required
              >
                <option value="">انتخاب تخصص</option>
                {specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شماره نظام پزشکی
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">کلینیک</label>
              <select
                name="clinicId"
                value={formData.clinicId ?? ""}
                onChange={handleInputChange}
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-1">مدرک</label>
              <input
                name="degree"
                value={formData.degree ?? ""}
                onChange={handleInputChange}
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
                value={formData.experienceYears ?? ""}
                onChange={handleInputChange}
                className="input"
                type="number"
                min={0}
              />
            </div>
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              محل مطب
            </label>
            <input
              type="text"
              name="officeLocation"
              value={formData.officeLocation}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div> */}

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ساعت شروع کار
              </label>
              <input
                type="time"
                name="workingHoursStart"
                value={formData.workingHoursStart}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ساعت پایان کار
              </label>
              <input
                type="time"
                name="workingHoursEnd"
                value={formData.workingHoursEnd}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
          </div> */}

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="mr-2 block text-sm text-gray-900">
              برای نوبت‌دهی در دسترس است
            </label>
          </div>

          <div className="flex justify-end space-x-4 space-x-reverse">
            {/* <button type="button" className="btn btn-outline h-11 rounded-2xl bg-red-600 hover:bg-red-700 px-10 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-colors">
              انصراف
            </button> */}
            <button
              type="submit"
              className="h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 px-10 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-colors"
            >
            ثبت اطلاعات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorForm;
