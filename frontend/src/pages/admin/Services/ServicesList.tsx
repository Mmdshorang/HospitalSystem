import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Stethoscope, Search, Plus } from 'lucide-react';
import { serviceService, type Service, type CreateServiceDto } from '../../../api/services/serviceService';
import { serviceCategoryService } from '../../../api/services/serviceCategoryService';
import { Button } from '../../../components/ui/button';
import { EmptyState } from '../../../components/states/EmptyState';
import { PageLoader } from '../../../components/states/PageLoader';
import { ServiceFormDialog } from './ServiceFormDialog';

const ServicesList = () => {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data: services = [], isLoading } = useQuery<Service[]>({
        queryKey: ['services', search, categoryFilter],
        queryFn: () => serviceService.getAll(search || undefined, categoryFilter || undefined),
    });

    const { data: categories = [] } = useQuery({
        queryKey: ['service-categories'],
        queryFn: serviceCategoryService.getAll,
    });

    const createService = useMutation({
        mutationFn: (payload: CreateServiceDto) => serviceService.create(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['services'] });
            await queryClient.refetchQueries({ queryKey: ['services'] });
            toast.success('خدمت جدید ثبت شد');
        },
        onError: (error: any) => {
            let errorMessage = 'ثبت خدمت با خطا مواجه شد';
            
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
                errorMessage = error.response.data.errors.join(', ');
            }
            
            toast.error(errorMessage);
        },
    });

    const deleteService = useMutation({
        mutationFn: (id: number) => serviceService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            toast.success('خدمت حذف شد');
        },
        onError: () => toast.error('حذف خدمت ممکن نشد'),
    });

    return (
        <div className="space-y-8">
            <section className="rounded-[32px] border border-slate-100 bg-white px-8 py-10 shadow-sm shadow-slate-200/60">
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="space-y-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1 text-xs font-semibold text-primary-600">
                            <Stethoscope className="h-4 w-4" />
                            خدمات درمانی
                        </span>
                        <h2 className="text-3xl font-black text-slate-900">مدیریت خدمات</h2>
                        <p className="text-sm text-slate-500">
                            تعریف و مدیریت خدمات ارائه شده در کلینیک‌ها.
                        </p>
                    </div>
                    <Button
                        className="h-12 rounded-2xl bg-gradient-to-l from-primary-600 to-primary-400 px-6 text-sm font-semibold shadow-lg shadow-primary/30"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <Plus className="ml-2 h-4 w-4" />
                        افزودن خدمت
                    </Button>
                </div>
            </section>

            <section className="rounded-[28px] border border-slate-100 bg-white/90 p-6 shadow-sm shadow-slate-200/50">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
                        <Search className="h-5 w-5 text-slate-400" />
                        <input
                            className="h-12 flex-1 border-0 bg-transparent text-sm outline-none"
                            placeholder="جستجو بر اساس نام..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        value={categoryFilter || ''}
                        onChange={(e) => setCategoryFilter(e.target.value ? Number(e.target.value) : null)}
                        className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-primary"
                    >
                        <option value="">همه دسته‌بندی‌ها</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {isLoading ? (
                    <PageLoader />
                ) : services.length === 0 ? (
                    <EmptyState
                        title="خدمتی یافت نشد"
                        description="برای افزودن خدمت جدید از دکمه بالا استفاده کنید."
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        نام خدمت
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        دسته‌بندی
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        قیمت پایه
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        مدت زمان
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        نوع
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        عملیات
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {services.map((service) => (
                                    <tr key={service.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                            <div className="text-sm text-gray-500">{service.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {service.categoryName || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {service.basePrice ? `${service.basePrice.toLocaleString()} تومان` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {service.durationMinutes ? `${service.durationMinutes} دقیقه` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {service.isInPerson ? 'حضوری' : 'آنلاین'}
                                            </span>
                                            {service.requiresDoctor && (
                                                <span className="mr-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                    نیاز به پزشک
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    if (confirm('آیا از حذف این خدمت مطمئن هستید؟')) {
                                                        deleteService.mutate(service.id);
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                حذف
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <ServiceFormDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={(values) => createService.mutateAsync(values).then(() => setIsDialogOpen(false))}
            />
        </div>
    );
};

export default ServicesList;

