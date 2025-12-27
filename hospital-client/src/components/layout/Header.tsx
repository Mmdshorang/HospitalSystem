import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../../../public/ImamAli.png";
import { CircleUser, LogOut, Menu, X, Search } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const navItems = [
    { to: "/", label: "صفحه اصلی" },
    { to: "/services", label: "خدمات" },
    { to: "/laboratory", label: "آزمایشگاه" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="container mx-auto px-4">
        {/* Top Row */}
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={Logo} alt="Logo" className="w-10 h-10 md:w-12 md:h-12" />
            <div className="hidden sm:block leading-tight">
              <h1 className="font-bold text-gray-800 text-sm md:text-base">
                درمانگاه امام علی
              </h1>
              <p className="text-xs text-gray-500">درمانگاه شبانه‌روزی دزفول</p>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="جستجو ..."
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pr-10 pl-4 text-sm text-gray-700
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/patient/profile"
                  className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  <CircleUser className="w-4 h-4 text-primary-600" />
                  <span className="text-gray-700">{user?.phone ?? "پروفایل"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm text-red-500 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  خروج
                </button>
              </>
            ) : (
              <Link
                to="/patient/login"
                className="text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                ورود
              </Link>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden rounded-lg p-2 hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex h-12 items-center justify-center gap-8">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="relative text-sm text-gray-700 hover:text-primary-600
                after:absolute after:left-1/2 after:-bottom-1 after:h-[2px]
                after:w-0 after:bg-primary-600 after:transition-all
                hover:after:w-full hover:after:left-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-1000 md:hidden bg-white">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold">منو</span>
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="جستجو ..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-10 pl-4 text-sm"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Mobile Nav */}
            <nav className="flex flex-col gap-2 px-4">
              {navItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto p-4 border-t">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/patient/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100"
                  >
                    <CircleUser className="w-4 h-4" />
                    پروفایل
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-red-500 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    خروج
                  </button>
                </>
              ) : (
                <Link
                  to="/patient/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg bg-primary-600 px-3 py-2 text-center text-white"
                >
                  ورود
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
