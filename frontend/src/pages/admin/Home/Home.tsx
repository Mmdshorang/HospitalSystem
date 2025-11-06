import { Users, UserCheck, Shield, Hospital } from "lucide-react";
import PageHeader from "./components/PageHeader";
import StatsGrid from "./components/StatsGrid";
import QuickActions from "./components/QuickActions";
import AlertsList from "./components/AlertsList";
import RecentActivities from "./components/RecentActivities";
import AppointmentsTable from "./components/AppointmentsTable";
import ManagementShortcuts from "./components/ManagementShortcuts";
import type { AlertItem } from "./components/AlertsList";

const Home = () => {
  // داده‌های نمونه برای داشبورد
  const stats = [
    {
      name: "تعداد کاربران",
      value: 150,
      icon: Users,
      color: "bg-blue-500",
      link: "/patients",
    },
    {
      name: "تعداد پزشکان",
      value: 25,
      icon: UserCheck,
      color: "bg-green-500",
      link: "/doctors",
    },
    {
      name: "تعداد کلینیک‌ها",
      value: 8,
      icon: Hospital,
      color: "bg-purple-500",
      link: "/clinics",
    },
    {
      name: "تعداد بیمه‌های تعریف‌شده",
      value: 24,
      icon: Shield,
      color: "bg-orange-500",
      link: "/services",
    },
  ];

  const quickActions = [
    { title: "ثبت بیمار جدید", to: "/patients/new" },
    { title: "ثبت پزشک جدید", to: "/doctors/new" },
    { title: "مدیریت نوبت‌ها", to: "/appointments" },
    { title: "مدیریت بیمه/خدمات", to: "/services" },
  ];

  const recentActivities = [
    { id: 1, text: "ثبت بیمار جدید: محمد شرنگ ", time: "۲ دقیقه قبل" },
    { id: 2, text: "ویرایش پروفایل پزشک: دکتر مقدس پور", time: "۱ ساعت قبل" },
    { id: 3, text: "ایجاد نوبت:  محمد کنعانی با دکتر مقدس پور", time: "دیروز" },
  ];

  const upcomingAppointments = [
    {
      id: 101,
      patient: "محمد شرنگ",
      doctor: "دکتر مقدس پور",
      time: "۱۰:۳۰",
      clinic: "پوست",
    },
    {
      id: 102,
      patient: "عادل گندمی",
      doctor: "دکتر فریدون فر",
      time: "۱۲:۰۰",
      clinic: "قلب",
    },
    {
      id: 103,
      patient: "محمد کنعانی",
      doctor: "دکتر صدرنیا",
      time: "۱۴:۱۵",
      clinic: "داخلی",
    },
  ];

  const alerts: AlertItem[] = [
    { id: 1, type: "warning", text: "پشتیبان‌گیری ۳ روز است انجام نشده است." },
    { id: 2, type: "info", text: "به‌روزرسانی سیستم در انتظار تأیید مدیر." },
  ];

  return (
    <>
      <div>
        <PageHeader
          title="پنل ادمین"
          description="نمای کلی و کنترل‌های سریع سیستم مدیریت"
        />

        <StatsGrid stats={stats} />

        {/* اقدامات سریع و اعلان‌ها */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <QuickActions actions={quickActions} />
          <AlertsList alerts={alerts} />
        </div>

        {/* فعالیت‌های اخیر و نوبت‌های پیش‌رو */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <RecentActivities items={recentActivities} />
          <AppointmentsTable items={upcomingAppointments} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ManagementShortcuts
            items={[
              { to: "/patients", label: "مدیریت کاربران" },
              { to: "/doctors", label: "مدیریت پزشکان" },
              { to: "/appointments", label: "مدیریت نوبت‌ها" },
              { to: "/services", label: "خدمات و بیمه" },
            ]}
          />
        </div>
      </div>
    </>
  );
};
export default Home;
