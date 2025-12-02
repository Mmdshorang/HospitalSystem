import {
  Activity,
  CalendarClock,
  ShieldCheck,
  Users2,
  Stethoscope,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';

const insights = [
  { label: 'پوشش بیمه', value: '۸۵%', trend: '+۵%', color: 'from-emerald-500 to-emerald-300' },
  { label: 'رضایت بیماران', value: '۹۲%', trend: '+۲%', color: 'from-sky-500 to-cyan-300' },
  { label: 'میانگین زمان انتظار', value: '۱۲ دقیقه', trend: '-۳ دقیقه', color: 'from-amber-500 to-orange-300' },
];

const quickActions = [
  { label: 'ثبت پزشک', href: '/doctors/new' },
  { label: 'ایجاد نوبت', href: '/appointments' },
  { label: 'افزودن بیمه', href: '/admin/insurances' },
  { label: 'ثبت کلینیک', href: '/admin/clinics' },
];

const activityFeed = [
  { id: 1, title: 'ثبت بیمار جدید', detail: 'سمیه نصیری در واحد قلب', time: '۲ دقیقه پیش' },
  { id: 2, title: 'تایید پزشک', detail: 'دکتر مهدی افشار برای کلینیک آتیه', time: '۴۵ دقیقه پیش' },
  { id: 3, title: 'درخواست خدمت', detail: 'درخواست MRI برای بیمارستان سینا', time: 'دیروز' },
];

const appointments = [
  { id: 1, time: '۰۹:۲۰', clinic: 'کلینیک آفتاب', doctor: 'دکتر راد', patient: 'مهسا صالحی' },
  { id: 2, time: '۱۰:۱۰', clinic: 'مرکز پارسه', doctor: 'دکتر طاهری', patient: 'بهنام شریفی' },
  { id: 3, time: '۱۱:۴۵', clinic: 'کلینیک ساحل', doctor: 'دکتر عرب', patient: 'حسن فراهانی' },
  { id: 4, time: '۱۳:۱۵', clinic: 'کلینیک امید', doctor: 'دکتر میرزایی', patient: 'سارا نعمتی' },
];

const Home = () => {
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
              وضعیت نوبت‌ها، پوشش بیمه، ظرفیت کلینیک‌ها و عملکرد پزشکان در یک نگاه.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1">امنیت تاییدشده</span>
            
            </div>
          </div>
          <div className="grid gap-4 text-right sm:grid-cols-3">
            {insights.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-slate-100 bg-slate-50 p-4 shadow-inner"
              >
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{item.value}</p>
                <p className="text-xs text-emerald-500">{item.trend}</p>
                <div className="mt-3 h-2 rounded-full bg-white">
                  <div className={`h-full rounded-full bg-gradient-to-l ${item.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'پزشکان فعال', value: '۲۸', icon: Stethoscope, accent: 'text-sky-500' },
          { label: 'بیماران امروز', value: '۱۸۴', icon: Users2, accent: 'text-emerald-500' },
          { label: 'کلینیک‌های تایید شده', value: '۱۲', icon: Building2, accent: 'text-purple-500' },
          { label: 'نوبت‌های امروز', value: '۳۲۴', icon: CalendarClock, accent: 'text-amber-500' },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-2xl bg-slate-100 p-3 ${item.accent}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-slate-400">امروز</span>
            </div>
            <p className="mt-6 text-3xl font-black text-slate-900">{item.value}</p>
            <p className="text-sm text-slate-500">{item.label}</p>
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
              <h3 className="text-xl font-black text-slate-900">آخرین فعالیت‌ها</h3>
            </div>
            <Button variant="ghost" className="text-xs text-slate-500 hover:text-slate-900">
              مشاهده بیشتر
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {activityFeed.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary-600">
                  <Activity className="h-5 w-5" />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.detail}</p>
                </div>
                <span className="text-xs text-slate-400">{item.time}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            quick
          </p>
          <h3 className="mt-1 text-xl font-black text-slate-900">عملیات سریع</h3>
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
              <h3 className="text-xl font-black text-slate-900">نوبت‌های امروز</h3>
            </div>
            <Button variant="ghost" className="text-xs text-slate-500 hover:text-slate-900">
              تقویم کامل
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 text-sm"
              >
                <span className="font-semibold text-slate-900">{appt.time}</span>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">{appt.patient}</p>
                  <p className="text-xs text-slate-500">
                    {appt.doctor} · {appt.clinic}
                  </p>
                </div>
              </div>
            ))}
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
