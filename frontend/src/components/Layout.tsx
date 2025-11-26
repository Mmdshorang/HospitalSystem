import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Stethoscope,
  Users2,
  Building2,
  ShieldCheck,
  Layers3,
  CalendarClock,
  LogOut,
  Menu,
  X,
  Sun,
  Settings2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'داشبورد', href: '/', icon: LayoutDashboard },
  { name: 'پزشکان', href: '/doctors', icon: Stethoscope },
  { name: 'بیماران', href: '/patients', icon: Users2 },
  { name: 'کلینیک‌ها', href: '/admin/clinics', icon: Building2 },
  { name: 'بیمه‌ها', href: '/admin/insurances', icon: ShieldCheck },
  { name: 'دسته‌بندی خدمات', href: '/admin/service-categories', icon: Layers3 },
  { name: 'نوبت‌ها', href: '/appointments', icon: CalendarClock },
];

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const breadcrumbs = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const crumbs = segments.map((segment, index) => ({
      label: segment.replace(/-/g, ' '),
      href: '/' + segments.slice(0, index + 1).join('/'),
    }));
    return crumbs.length ? crumbs : [{ label: 'خانه', href: '/' }];
  }, [location.pathname]);

  const NavLinks = () => (
    <nav className="mt-8 space-y-2 text-sm font-semibold text-slate-500">
      {navigation.map((item) => {
        const isActive =
          item.href === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.href);
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center justify-between rounded-2xl px-4 py-3 transition',
              isActive
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
            onClick={() => setSidebarOpen(false)}
          >
            <span className="flex items-center gap-3">
              <item.icon className="h-5 w-5" />
              {item.name}
            </span>
            {isActive && <span className="h-2 w-2 rounded-full bg-emerald-400" />}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-72 transform border-l border-slate-100 bg-white px-6 py-8 text-slate-700 shadow-xl transition lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
              hospi
            </p>
            <h2 className="mt-2 text-xl font-black text-slate-900">Hospital OS</h2>
          </div>
          <button
            className="rounded-full border border-slate-200 p-2 text-slate-400 transition hover:text-slate-600 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          مدیریت یکپارچه‌ی کلینیک، بیمه و خدمات درمانی.
        </p>

        <NavLinks />

        <div className="mt-10 space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>پوشش بیمه</span>
            <span className="font-semibold text-emerald-500">۸۵٪</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100">
            <div className="h-full w-4/5 rounded-full bg-gradient-to-l from-emerald-500 to-emerald-300" />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>آخرین بروزرسانی</span>
            <span>۲ دقیقه پیش</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
          <div>
            <p className="font-semibold text-slate-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-slate-500">{user?.role ?? 'مدیر سیستم'}</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full border border-slate-200 text-slate-500 hover:bg-white"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </aside>

      <div className="flex min-h-screen w-full flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-4 sm:px-8">
            <div className="flex items-center gap-4">
              <button
                className="rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:text-slate-900 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <nav className="flex items-center gap-2 text-xs text-slate-400">
                  <Link to="/">خانه</Link>
                  {breadcrumbs.map((crumb) => (
                    <span key={crumb.href} className="flex items-center gap-2 capitalize text-slate-500">
                      <span>/</span>
                      <Link to={crumb.href} className="hover:text-slate-900">
                        {crumb.label}
                      </Link>
                    </span>
                  ))}
                </nav>
                <h1 className="text-xl font-black text-slate-900">
                  {navigation.find((item) => location.pathname.startsWith(item.href))?.name ||
                    'داشبورد'}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                <Sun className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="hidden rounded-2xl border-slate-200 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 sm:flex"
              >
                <Settings2 className="ml-2 h-4 w-4" />
                تنظیمات سریع
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-slate-50">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
