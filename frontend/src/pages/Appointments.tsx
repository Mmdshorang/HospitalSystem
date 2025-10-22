import { Plus, Calendar, Clock, User } from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
  reason: string;
}

const Appointments = () => {
  // Mock data for simple appointments
  const appointments: Appointment[] = [
    {
      id: '1',
      patientName: 'احمد محمدی',
      doctorName: 'دکتر احمدی',
      date: '1403-01-15',
      time: '10:00',
      status: 'تعیین شده',
      reason: 'معاینه دوره‌ای',
    },
    {
      id: '2',
      patientName: 'فاطمه احمدی',
      doctorName: 'دکتر رضایی',
      date: '1403-01-15',
      time: '14:30',
      status: 'تکمیل شده',
      reason: 'پیگیری',
    },
  ];

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">نوبت‌ها</h1>
          <p className="mt-2 text-gray-600">مدیریت نوبت‌دهی و برنامه‌ریزی بیماران</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn btn-primary inline-flex items-center">
            <Plus className="h-4 w-4 ml-2" />
            تعیین نوبت
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">نوبت‌های امروز</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.patientName}
                        </p>
                        <p className="text-sm text-gray-500">
                          با {appointment.doctorName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {appointment.reason}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.time}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === 'تعیین شده' 
                            ? 'bg-blue-100 text-blue-800'
                            : appointment.status === 'تکمیل شده'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">آمار سریع</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-500 ml-2" />
                  <span className="text-sm text-gray-600">امروز</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">2</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-green-500 ml-2" />
                  <span className="text-sm text-gray-600">تکمیل شده</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">1</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-purple-500 ml-2" />
                  <span className="text-sm text-gray-600">در انتظار</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">1</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">پزشکان در دسترس</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">دکتر احمدی</p>
                  <p className="text-xs text-gray-500">قلب و عروق</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  در دسترس
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">دکتر رضایی</p>
                  <p className="text-xs text-gray-500">مغز و اعصاب</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  مشغول
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;