import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const PatientForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Patient data:', formData);
    alert('اطلاعات بیمار با موفقیت ذخیره شد!');
  };

  return (
    <div>
      <div className="mb-8">
        <button className="btn btn-outline inline-flex items-center mb-4">
          <ArrowLeft className="h-4 w-4 ml-2" />
          بازگشت به بیماران
        </button>
        <h1 className="text-3xl font-bold text-gray-900">افزودن بیمار جدید</h1>
        <p className="mt-2 text-gray-600">اطلاعات بیمار را وارد کنید</p>
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
              تاریخ تولد
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              آدرس
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="input"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تماس اضطراری
            </label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سابقه پزشکی
            </label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleInputChange}
              className="input"
              rows={4}
              placeholder="هرگونه سابقه پزشکی مرتبط را وارد کنید..."
            />
          </div>

          <div className="flex justify-end space-x-4 space-x-reverse">
            <button type="button" className="btn btn-outline">
              انصراف
            </button>
            <button 
              type="submit" 
              className="h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 px-10 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-colors"
            >
              ذخیره بیمار
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;