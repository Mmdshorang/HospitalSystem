import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  serviceService,
  type Service,
  type ServiceCategory,
} from "../../api/services/serviceService";
import { Loading } from "../../components/common/Loading";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";

const staticServices = [
  { title: "آزمایش", icon: "🧪" },
  { title: "سونوگرافی", icon: "🩺" },
  { title: "رادیولوژی", icon: "🩻" },
  { title: "MRI", icon: "🧠" },
];

export const ServicesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();

  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["services", searchTerm, selectedCategory],
    queryFn: () =>
      serviceService.getAll(searchTerm || undefined, selectedCategory),
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<
    ServiceCategory[]
  >({
    queryKey: ["serviceCategories"],
    queryFn: () => serviceService.getCategories(),
  });

  if (servicesLoading || categoriesLoading) {
    return <Loading />;
  }

  const filteredServices =
    services?.filter((service) => service.isActive) || [];

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <img
          src={"/ImamAli.png"}
          alt="Logo"
          className="w-50 h-40 mx-auto mb-4"
        />
        <h1 className="text-3xl text-gray-800 mb-3">خدمات پاراکلینیک</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          ارائه کامل‌ترین خدمات تشخیصی با تجهیزات مدرن و کادر مجرب
        </p>
      </div>

      {/* Static Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {staticServices.map((item) => (
          <a href={`/services/${item.title}`} key={item.title}>
            <div
              key={item.title}
              className={`border-2 border-black text-white rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg`}
            >
              <span className="text-4xl mb-3">{item.icon}</span>
              <span className="font-semibold text-black text-lg">
                {item.title}
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-3 flex-wrap justify-center mb-10">
        {/* <button
          onClick={() => setSelectedCategory(undefined)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition
          ${
            selectedCategory === undefined
              ? "bg-primary-600 text-white shadow"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          همه خدمات
        </button> */}

        {/* {categories?.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition
            ${
              selectedCategory === category.id
                ? "bg-primary-600 text-white shadow"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {category.name}
          </button>
        ))} */}
      </div>

      {/* Services */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 text-gray-500">خدماتی یافت نشد</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
            >
              {service.imageUrl && (
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-52 object-cover"
                />
              )}

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {service.name}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {service.description}
                </p>

                <div className="flex justify-between items-center mb-4">
                  {service.basePrice && (
                    <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {service.basePrice.toLocaleString()} تومان
                    </span>
                  )}
                  {service.durationMinutes && (
                    <span className="text-xs text-gray-400">
                      ⏱ {service.durationMinutes} دقیقه
                    </span>
                  )}
                </div>

                <Link to={`/services/${service.id}`}>
                  <Button className="w-full rounded-xl">مشاهده جزئیات</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
