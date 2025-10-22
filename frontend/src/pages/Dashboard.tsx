import { Users, UserCheck, Calendar, Activity } from 'lucide-react';

const Dashboard = () => {
  // Mock data for simple dashboard
  const stats = [
    {
      name: 'کل بیماران',
      value: 150,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'کل پزشکان',
      value: 25,
      icon: UserCheck,
      color: 'bg-green-500',
    },
    {
      name: 'نوبت‌های امروز',
      value: 8,
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      name: 'پرونده‌های فعال',
      value: 24,
      icon: Activity,
      color: 'bg-red-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">داشبورد</h1>
        <p className="mt-2 text-gray-600">نمای کلی سیستم مدیریت بیمارستان</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">بیماران اخیر</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">احمد محمدی</p>
                <p className="text-sm text-gray-500">کد: P001</p>
              </div>
              <span className="text-sm text-gray-500">2 ساعت پیش</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">فاطمه احمدی</p>
                <p className="text-sm text-gray-500">کد: P002</p>
              </div>
              <span className="text-sm text-gray-500">4 ساعت پیش</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">نوبت‌های پیش رو</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">دکتر احمدی - قلب</p>
                <p className="text-sm text-gray-500">بیمار: احمد محمدی</p>
              </div>
              <span className="text-sm text-gray-500">10:00 صبح</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">دکتر رضایی - مغز و اعصاب</p>
                <p className="text-sm text-gray-500">بیمار: فاطمه احمدی</p>
              </div>
              <span className="text-sm text-gray-500">2:30 بعدازظهر</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;