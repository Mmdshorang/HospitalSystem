import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 space-x-reverse">
            <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">ع</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">درمانگاه امام علی</h1>
              <p className="text-sm text-gray-600">شبانه‌روزی دزفول</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              صفحه اصلی
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-primary-600 transition-colors">
              خدمات
            </Link>
            <Link to="/laboratory" className="text-gray-700 hover:text-primary-600 transition-colors">
              آزمایشگاه
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/patient/requests" className="text-gray-700 hover:text-primary-600 transition-colors">
                  درخواست‌های من
                </Link>
                <Link to="/patient/profile" className="text-gray-700 hover:text-primary-600 transition-colors">
                  پروفایل
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  خروج
                </button>
              </>
            ) : (
              <>
                <Link to="/patient/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  ورود
                </Link>
                <Link
                  to="/patient/register"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  ثبت‌نام
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
