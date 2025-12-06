import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  CalendarClock,
  Users2,
  Stethoscope,
  Building2,
  ArrowRight,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { providerService } from "../../../api/services/providerService";
import { clinicService } from "../../../api/services/clinicService";
import { insuranceService } from "../../../api/services/insuranceService";
import { patientService } from "../../../api/services/patientService";
import {
  serviceRequestService,
  type ServiceRequest,
} from "../../../api/services/serviceRequestService";
import { PageLoader } from "../../../components/states/PageLoader";

const quickActions = [
  { label: "ثبت پزشک", href: "/doctors/new" },
  { label: "ایجاد نوبت", href: "/appointments" },
  { label: "افزودن بیمه", href: "/admin/insurances" },
  { label: "ثبت کلینیک", href: "/admin/clinics" },
];

const Home = () => {
  // Active providers (doctors)
  const { data: providers = [], isLoading: loadingProviders } = useQuery({
    queryKey: ["dashboard", "providers", "active"],
    queryFn: () =>
      providerService.getAll(undefined, undefined, undefined, true),
  });

  // Active clinics
  const { data: clinics = [], isLoading: loadingClinics } = useQuery({
    queryKey: ["dashboard", "clinics", "active"],
    queryFn: () => clinicService.getAll(undefined, undefined, true),
  });

  // Active insurances
  const { data: insurances = [], isLoading: loadingInsurances } = useQuery({
    queryKey: ["dashboard", "insurances", "active"],
    queryFn: () => insuranceService.getAll(undefined, true),
  });

  // Patients (simple count)
  const { data: patients = [], isLoading: loadingPatients } = useQuery({
    queryKey: ["dashboard", "patients"],
    queryFn: () => patientService.getAll(),
  });

  // Today range for appointments
  const { todayStartIso, todayEndIso } = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return {
      todayStartIso: start.toISOString(),
      todayEndIso: end.toISOString(),
    };
  }, []);

  // Today's appointments (service requests)
  const { data: todayAppointmentsResult, isLoading: loadingTodayAppointments } =
    useQuery({
      queryKey: [
        "dashboard",
        "appointments",
        "today",
        todayStartIso,
        todayEndIso,
      ],
      queryFn: () =>
        serviceRequestService.getAll(
          1,
          10,
          undefined,
          undefined,
          undefined,
          undefined,
          todayStartIso,
          todayEndIso,
          "createdAt",
          "asc"
        ),
    });

  const todayAppointments: ServiceRequest[] =
    todayAppointmentsResult?.data ?? [];
  const todayAppointmentsCount = todayAppointmentsResult?.totalCount ?? 0;

  // Recent activity (latest service requests)
  const { data: recentRequestsResult, isLoading: loadingRecent } = useQuery({
    queryKey: ["dashboard", "service-requests", "recent"],
    queryFn: () =>
      serviceRequestService.getAll(
        1,
        5,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        "createdAt",
        "desc"
      ),
  });

  const recentRequests: ServiceRequest[] = recentRequestsResult?.data ?? [];

  const isAnyLoading =
    loadingProviders || loadingClinics || loadingInsurances || loadingPatients;

  const insights = [
    {
      label: "تعداد بیمه‌های فعال",
      value: insurances.length.toString(),
      trend: "",
      color: "from-emerald-500 to-emerald-300",
    },
    {
      label: "تعداد بیماران ثبت‌شده",
      value: patients.length.toString(),
      trend: "",
      color: "from-sky-500 to-cyan-300",
    },
    {
      label: "نوبت‌های امروز",
      value: todayAppointmentsCount.toString(),
      trend: "",
      color: "from-amber-500 to-orange-300",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-100 bg-white px-8 py-10 shadow-sm shadow-slate-200/60">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
              hospi
            </p>
            <h1 className="text-3xl font-black leading-tight text-slate-900">
              داشبورد یکپارچه مدیریت بیمارستان
            </h1>
            <p className="text-sm text-slate-500">
              وضعیت نوبت‌ها، پوشش بیمه، ظرفیت کلینیک‌ها و عملکرد پزشکان در یک
              نگاه.
            </p>
          </div>
          <div className="grid gap-4 text-right sm:grid-cols-3">
            {isAnyLoading ? (
              <PageLoader />
            ) : (
              insights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-slate-100 bg-slate-50 p-4 shadow-inner"
                >
                  <p className="text-xs text-center text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl text-center font-black text-slate-900">
                    {item.value}
                  </p>
                  {item.trend && (
                    <p className="text-xs text-emerald-500">{item.trend}</p>
                  )}
                  <div className="mt-3 h-2 rounded-full bg-white">
                    <div
                      className={`h-full rounded-full bg-linear-to-l ${item.color}`}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "پزشکان فعال",
            value: loadingProviders ? "..." : providers.length.toString(),
            icon: Stethoscope,
            accent: "text-sky-500",
          },
          {
            label: "بیماران ثبت‌شده",
            value: loadingPatients ? "..." : patients.length.toString(),
            icon: Users2,
            accent: "text-emerald-500",
          },
          {
            label: "کلینیک‌های فعال",
            value: loadingClinics ? "..." : clinics.length.toString(),
            icon: Building2,
            accent: "text-purple-500",
          },
          {
            label: "نوبت‌های امروز",
            value: loadingTodayAppointments
              ? "..."
              : todayAppointmentsCount.toString(),
            icon: CalendarClock,
            accent: "text-amber-500",
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-2xl bg-slate-100 p-3 ${item.accent}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-slate-400">
                امروز
              </span>
            </div>
            <div className="flex justify-between">
              <p className="text-sm mt-7 text-slate-500">{item.label}</p>
              <p className="mt-6 text-3xl font-black text-slate-900">
                {item.value}
              </p>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                activity
              </p>
              <h3 className="text-xl font-black text-slate-900">
                آخرین فعالیت‌ها
              </h3>
            </div>
            <Button
              variant="ghost"
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              مشاهده بیشتر
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {loadingRecent ? (
              <PageLoader />
            ) : recentRequests.length === 0 ? (
              <p className="text-sm text-slate-500">
                فعلاً فعالیتی ثبت نشده است.
              </p>
            ) : (
              recentRequests.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary-600">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {item.serviceName || "درخواست خدمت"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.patientName || "بیمار نامشخص"}{" "}
                      {item.clinicName ? `· ${item.clinicName}` : ""}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleTimeString("fa-IR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            quick
          </p>
          <h3 className="mt-1 text-xl font-black text-slate-900">
            عملیات سریع
          </h3>
          <div className="mt-6 space-y-3">
            {quickActions.map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-200 hover:bg-slate-50"
              >
                {action.label}
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </a>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                today
              </p>
              <h3 className="text-xl font-black text-slate-900">
                نوبت‌های امروز
              </h3>
            </div>
            <Button
              variant="ghost"
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              تقویم کامل
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {loadingTodayAppointments ? (
              <PageLoader />
            ) : todayAppointments.length === 0 ? (
              <p className="text-sm text-slate-500">
                امروز نوبتی ثبت نشده است.
              </p>
            ) : (
              todayAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 text-sm"
                >
                  <span className="font-semibold text-slate-900">
                    {appt.preferredTime
                      ? new Date(appt.preferredTime).toLocaleTimeString(
                          "fa-IR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : new Date(appt.createdAt).toLocaleTimeString("fa-IR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                  </span>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">
                      {appt.patientName || "بیمار نامشخص"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {appt.serviceName || "خدمت نامشخص"}{" "}
                      {appt.clinicName ? `· ${appt.clinicName}` : ""}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        {/* <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>پایداری سامانه</span>
            <span className="font-semibold text-emerald-600">۹۹.۴٪</span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-slate-100">
            <div className="h-full w-[94%] rounded-full bg-gradient-to-l from-emerald-500 to-emerald-300" />
          </div>
          <p className="mt-6 text-lg font-semibold text-slate-900">آخرین پشتیبان‌گیری</p>
          <p className="text-sm text-slate-500">۲ ساعت پیش · ذخیره در S3</p>
          <div className="mt-8 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
            <div>
              <p className="text-slate-900">کانال بیمه</p>
              <p className="text-xs text-slate-500">پوشش ۴ بیمه فعال</p>
            </div>
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </div>
        </article> */}
      </section>
    </div>
  );
};

export default Home;
