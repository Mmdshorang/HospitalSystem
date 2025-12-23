import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { serviceService } from '../../api/services/serviceService';
import { Loading } from '../../components/common/Loading';
import { Button } from '../../components/common/Button';

export const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => serviceService.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 text-lg mb-4">خدمت یافت نشد</p>
        <Link to="/services">
          <Button>بازگشت به لیست خدمات</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-primary-600 hover:text-primary-700"
        >
          ← بازگشت
        </button>

        <div className="card">
          {service.imageUrl && (
            <img
              src={service.imageUrl}
              alt={service.name}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          <h1 className="text-3xl font-bold mb-4 text-gray-800">{service.name}</h1>

          {service.description && (
            <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {service.basePrice && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">قیمت پایه</div>
                <div className="text-2xl font-bold text-primary-600">
                  {service.basePrice.toLocaleString()} تومان
                </div>
              </div>
            )}

            {service.durationMinutes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">مدت زمان</div>
                <div className="text-2xl font-bold text-gray-800">
                  {service.durationMinutes} دقیقه
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">نوع خدمت</div>
              <div className="text-lg font-semibold text-gray-800">
                {service.deliveryType === 'InClinic' ? 'حضوری' :
                  service.deliveryType === 'OnSite' ? 'ویزیت در محل' :
                    'آنلاین'}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">نیاز به پزشک</div>
              <div className="text-lg font-semibold text-gray-800">
                {service.requiresDoctor ? 'بله' : 'خیر'}
              </div>
            </div>
          </div>

          <Link to={`/book/${service.id}`}>
            <Button size="lg" className="w-full">
              رزرو این خدمت
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
