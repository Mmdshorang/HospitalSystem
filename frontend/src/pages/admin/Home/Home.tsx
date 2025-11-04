import {
  Users,
  UserCheck,
  Calendar,
  Activity,
  Shield,
  Bell,
  AlertTriangle,
  PlusCircle,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  // داده‌های نمونه برای داشبورد
  const stats = [
    {
      name: "تعداد کاربران",
      value: 150,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      name: "تعداد پزشکان",
      value: 25,
      icon: UserCheck,
      color: "bg-green-500",
    },
    {
      name: "تعداد کلینیک‌ها",
      value: 8,
      icon: Calendar,
      color: "bg-purple-500",
    },
    {
      name: "تعداد بیمه‌های تعریف‌شده",
      value: 24,
      icon: Shield,
      color: "bg-orange-500",
    },
  ];

  const quickActions = [
    { title: "ثبت بیمار جدید", to: "/patients/new" },
    { title: "ثبت پزشک جدید", to: "/doctors/new" },
    { title: "مدیریت نوبت‌ها", to: "/appointments" },
    { title: "مدیریت بیمه/خدمات", to: "/services" },
  ];

  const recentActivities = [
    { id: 1, text: "ثبت بیمار جدید: علی رضایی", time: "۲ دقیقه قبل" },
    { id: 2, text: "ویرایش پروفایل پزشک: دکتر احمدی", time: "۱ ساعت قبل" },
    { id: 3, text: "ایجاد نوبت: بیمار کاظمی با دکتر محمدی", time: "دیروز" },
  ];

  const upcomingAppointments = [
    {
      id: 101,
      patient: "ندا محمدی",
      doctor: "دکتر حسینی",
      time: "۱۰:۳۰",
      clinic: "پوست",
    },
    {
      id: 102,
      patient: "کامران خانزاده",
      doctor: "دکتر کریمی",
      time: "۱۲:۰۰",
      clinic: "قلب",
    },
    {
      id: 103,
      patient: "سارا اکبری",
      doctor: "دکتر احمدی",
      time: "۱۴:۱۵",
      clinic: "داخلی",
    },
  ];

  const alerts = [
    { id: 1, type: "warning", text: "پشتیبان‌گیری ۳ روز است انجام نشده است." },
    { id: 2, type: "info", text: "به‌روزرسانی سیستم در انتظار تأیید مدیر." },
  ];

  const systemHealth = {
    uptime: 99.9,
    apiLatencyMs: 180,
    queueDepth: 3,
  };

  const trendPoints = [5, 9, 7, 13, 11, 15, 12, 18];

  return (
    <>
      <div>
        {/* سربرگ */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-600">داشبورد ادمین</h1>
          <p className="mt-2 text-gray-600">
            نمای کلی و کنترل‌های سریع سیستم مدیریت بیمارستان
          </p>
        </div>

        {/* آمار کلیدی */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            return (
              <div key={stat.name} className="card p-6 text-center">
                <div className="flex items-center justify-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="font-medium text-gray-900">{stat.name}</p>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <p className="text-2xl font-extrabold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>  
              </div>
            );
          })}
        </div>

        {/* اقدامات سریع */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                اقدامات سریع
              </h2>
              <PlusCircle className="h-5 w-5 text-primary-600" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  to={action.to}
                  className="w-full text-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
                >
                  {action.title}
                </Link>
              ))}
            </div>
          </div>

          {/* اعلان‌ها */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">اعلان‌ها</h2>
              <Bell className="h-5 w-5 text-primary-600" />
            </div>
            <ul className="space-y-3">
              {alerts.map((a) => (
                <li key={a.id} className="flex items-start gap-3">
                  {a.type === "warning" ? (
                    <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                  ) : (
                    <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
                  )}
                  <span className="text-sm text-gray-700">{a.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* فعالیت‌های اخیر و نوبت‌های پیش‌رو */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                فعالیت‌های اخیر
              </h2>
              <Activity className="h-5 w-5 text-primary-600" />
            </div>
            <ul className="space-y-4">
              {recentActivities.map((item) => (
                <li key={item.id} className="flex items-start justify-between">
                  <div className="text-sm text-gray-800">{item.text}</div>
                  <div className="text-xs text-gray-500">{item.time}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                نوبت‌های امروز
              </h2>
              <Calendar className="h-5 w-5 text-primary-600" />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                      بیمار
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                      پزشک
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                      کلینیک
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                      ساعت
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {upcomingAppointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {appt.patient}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {appt.doctor}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {appt.clinic}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {appt.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          <div className="card p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              میانبرهای مدیریت
            </h2>
            <div className="flex flex-col gap-2">
              <Link
                to="/patients"
                className="px-4 py-2 rounded border text-sm hover:bg-gray-50"
              >
                مدیریت بیماران
              </Link>
              <Link
                to="/doctors"
                className="px-4 py-2 rounded border text-sm hover:bg-gray-50"
              >
                مدیریت پزشکان
              </Link>
              <Link
                to="/appointments"
                className="px-4 py-2 rounded border text-sm hover:bg-gray-50"
              >
                مدیریت نوبت‌ها
              </Link>
              <Link
                to="/services"
                className="px-4 py-2 rounded border text-sm hover:bg-gray-50"
              >
                خدمات و بیمه
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
