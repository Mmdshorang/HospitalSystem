import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const Home = () => {
  const services = [
    {
      id: 1,
      title: 'ویزیت پزشک',
      description: 'رزرو نوبت ویزیت حضوری و آنلاین',
      icon: '👨‍⚕️',
      link: '/services',
      color: 'bg-blue-500',
    },
    {
      id: 2,
      title: 'آزمایشگاه',
      description: 'انجام آزمایش‌های پزشکی با کد رهگیری',
      icon: '🧪',
      link: '/laboratory',
      color: 'bg-green-500',
    },
    {
      id: 3,
      title: 'سونوگرافی',
      description: 'خدمات تصویربرداری سونوگرافی',
      icon: '📡',
      link: '/services',
      color: 'bg-purple-500',
    },
    {
      id: 4,
      title: 'رادیولوژی',
      description: 'خدمات تصویربرداری رادیولوژی',
      icon: '📷',
      link: '/services',
      color: 'bg-yellow-500',
    },
    {
      id: 5,
      title: 'MRI',
      description: 'خدمات تصویربرداری MRI',
      icon: '🔬',
      link: '/services',
      color: 'bg-red-500',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-l from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">به بیمارستان امام علی خوش آمدید</h1>
            <p className="text-xl mb-8 text-primary-100">
              ارائه خدمات درمانی با کیفیت و استانداردهای بین‌المللی
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/services">
                <Button size="lg" variant="secondary">
                  مشاهده خدمات
                </Button>
              </Link>
              <Link to="/patient/register">
                <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-primary-50">
                  ثبت‌نام
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            خدمات ما
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.id}
                to={service.link}
                className="card hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className={`${service.color} w-16 h-16 rounded-lg flex items-center justify-center text-3xl`}>
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                      {service.title}
                    </h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">درباره بیمارستان امام علی</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              بیمارستان امام علی با بیش از 20 سال سابقه در ارائه خدمات درمانی، یکی از معتبرترین
              مراکز درمانی کشور است. ما با بهره‌گیری از کادر مجرب و تجهیزات پیشرفته، بهترین
              خدمات را به بیماران ارائه می‌دهیم.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">20+</div>
              <div className="text-gray-700">سال تجربه</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-700">پزشک متخصص</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">100K+</div>
              <div className="text-gray-700">بیمار راضی</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-700">خدمات شبانه‌روزی</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
