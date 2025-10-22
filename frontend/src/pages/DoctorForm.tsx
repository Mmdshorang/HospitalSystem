import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const DoctorForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    email: '',
    phone: '',
    licenseNumber: '',
    officeLocation: '',
    workingHoursStart: '',
    workingHoursEnd: '',
    isAvailable: true,
  });

  const specializations = [
    'قلب و عروق',
    'مغز و اعصاب',
    'ارتوپدی',
    'اطفال',
    'پوست',
    'روانپزشکی',
    'رادیولوژی',
    'جراحی',
    'طب داخلی',
    'اورژانس',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Doctor data:', formData);
    alert('اطلاعات پزشک با موفقیت ذخیره شد!');
  };

  return (
    <div>
      <div className="mb-8">
        <button className="btn btn-outline inline-flex items-center mb-4">
          <ArrowLeft className="h-4 w-4 ml-2" />
          بازگشت به پزشکان
        </button>
        <h1 className="text-3xl font-bold text-gray-900">افزودن پزشک جدید</h1>
        <p className="mt-2 text-gray-600">اطلاعات پزشک را وارد کنید</p>
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
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ایمیل
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تلفن
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
          </div>

          <div>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

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
            <button type="button" className="btn btn-outline">
              انصراف
            </button>
            <button type="submit" className="btn btn-primary">
              ذخیره پزشک
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorForm;