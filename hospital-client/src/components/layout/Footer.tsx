import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center text-2xl font-bold">
                ع
              </div>
              <div>
                <h3 className="text-xl font-bold">درمانگاه امام علی</h3>
                <p className="text-sm text-gray-400">شبانه‌روزی دزفول</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              درمانگاه امام علی (ع) دزفول از سال ۱۳۸۵ با هدف ارائه خدمات جامع سلامت فعالیت خود را آغاز کرد. این مرکز با برخورداری از تیمی چندتخصصی، خدمات متنوعی از جمله اورژانس، آزمایشگاه، رادیولوژی و سونوگرافی، دندانپزشکی، پوست و مو، طب کار و کلینیک‌های تخصصی را به‌صورت شبانه‌روزی ارائه می‌دهد.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">لینک سریع</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors">
                  نوبت‌دهی آنلاین
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  برنامه حضور پزشکان
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  راهنمای طبقات
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  تماس با ما
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">ارتباط با ما</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-white">📍</span>
                <span>دزفول - خیابان روستا، بین شهید بهشتی و حضرت رسول</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white">📞</span>
                <a href="tel:06142270624" className="hover:text-white transition-colors">
                  06142270624
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">ساعات کاری</h4>
            <p className="text-gray-400 text-sm">
              درمانگاه امام علی دزفول همه روزه به صورت شبانه‌روزی باز است.
            </p>
            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">۲۴ ساعته</span>
                <br />
                <span className="text-gray-400">همه روزه هفته</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} درمانگاه شبانه‌روزی امام علی (ع) دزفول. تمامی حقوق محفوظ است.</p>
          <p className="mt-2 text-xs">
            تعهد به کیفیت، احترام به بیماران و همکاری با اکثر بیمه‌های درمانی
          </p>
        </div>
      </div>
    </footer>
  );
};
