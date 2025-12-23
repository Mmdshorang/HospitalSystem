import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">بیمارستان امام علی</h3>
            <p className="text-gray-400">
              ارائه خدمات درمانی با کیفیت و استانداردهای بین‌المللی
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">دسترسی سریع</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors">
                  خدمات
                </Link>
              </li>
              <li>
                <Link to="/laboratory" className="text-gray-400 hover:text-white transition-colors">
                  آزمایشگاه
                </Link>
              </li>
              <li>
                <Link to="/patient/register" className="text-gray-400 hover:text-white transition-colors">
                  ثبت‌نام
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">خدمات</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors">
                  ویزیت پزشک
                </Link>
              </li>
              <li>
                <Link to="/laboratory" className="text-gray-400 hover:text-white transition-colors">
                  آزمایشگاه
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors">
                  سونوگرافی
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors">
                  رادیولوژی
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">تماس با ما</h4>
            <ul className="space-y-2 text-gray-400">
              <li>تلفن: 021-12345678</li>
              <li>ایمیل: info@imamali-hospital.ir</li>
              <li>آدرس: تهران، خیابان ولیعصر</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} بیمارستان امام علی. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
};
