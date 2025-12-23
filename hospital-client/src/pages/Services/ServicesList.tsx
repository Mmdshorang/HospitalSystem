import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { serviceService, type Service, type ServiceCategory } from '../../api/services/serviceService';
import { Loading } from '../../components/common/Loading';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const ServicesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();

  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['services', searchTerm, selectedCategory],
    queryFn: () => serviceService.getAll(searchTerm || undefined, selectedCategory),
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<ServiceCategory[]>({
    queryKey: ['serviceCategories'],
    queryFn: () => serviceService.getCategories(),
  });

  if (servicesLoading || categoriesLoading) {
    return <Loading />;
  }

  const filteredServices = services?.filter((service) => service.isActive) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">خدمات درمانی</h1>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <Input
          placeholder="جستجو در خدمات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`px-4 py-2 rounded-lg ${selectedCategory === undefined
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            همه
          </button>
          {categories?.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg ${selectedCategory === category.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">خدماتی یافت نشد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="card hover:shadow-lg transition-shadow">
              {service.imageUrl && (
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{service.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
              <div className="flex items-center justify-between mb-4">
                {service.basePrice && (
                  <span className="text-lg font-bold text-primary-600">
                    {service.basePrice.toLocaleString()} تومان
                  </span>
                )}
                {service.durationMinutes && (
                  <span className="text-sm text-gray-500">
                    {service.durationMinutes} دقیقه
                  </span>
                )}
              </div>
              <Link to={`/services/${service.id}`}>
                <Button className="w-full">مشاهده جزئیات</Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
