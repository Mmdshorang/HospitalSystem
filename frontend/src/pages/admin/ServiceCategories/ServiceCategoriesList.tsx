import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Layers3, Sparkles, Plus } from 'lucide-react';
import {
    serviceCategoryService,
    type ServiceCategory,
    type ServiceCategoryPayload,
} from '../../../api/services/serviceCategoryService';
import { Button } from '../../../components/ui/button';
import { EmptyState } from '../../../components/states/EmptyState';
import { PageLoader } from '../../../components/states/PageLoader';
import { ServiceCategoryFormDialog } from './ServiceCategoryFormDialog';

const iconPalette = ['🧬', '🦷', '🫀', '🩺', '🧠', '🩻'];

const ServiceCategoriesList = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data: categories = [], isLoading } = useQuery<ServiceCategory[]>({
        queryKey: ['service-categories'],
        queryFn: serviceCategoryService.getAll,
    });

    const createCategory = useMutation({
        mutationFn: (payload: ServiceCategoryPayload) => serviceCategoryService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-categories'] });
            toast.success('دسته‌بندی ثبت شد');
        },
        onError: () => toast.error('ثبت دسته‌بندی با خطا مواجه شد'),
    });

    return (
        <div className="space-y-8">
            <section className="rounded-[32px] border border-slate-100 bg-white px-6 py-10 shadow-sm shadow-slate-200/60">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-3 text-right">
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1 text-xs font-semibold text-primary-600">
                            <Sparkles className="h-4 w-4" />
                            ساختار خدمات
                        </span>
                        <h2 className="text-3xl font-black text-slate-900">دسته‌بندی خدمات درمانی</h2>
                        <p className="text-sm text-slate-500">
                            نظم‌دهی به خدمات برای جستجو و گزارش‌گیری آسان‌تر.
                        </p>
                    </div>
                    <Button
                        className="h-12 rounded-2xl from-primary-600 to-primary-400 px-8 text-sm font-semibold shadow-lg shadow-primary/30"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <Plus className="ml-2 h-4 w-4" />
                        دسته جدید
                    </Button>
                </div>
            </section>

            <section className="rounded-[28px] border border-slate-100 bg-white/90 p-6 shadow-md">
                {isLoading ? (
                    <PageLoader />
                ) : categories.length === 0 ? (
                    <EmptyState title="دسته‌ای ثبت نشده است" />
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {categories.map((category, index) => (
                            <article
                                key={category.id}
                                className="rounded-3xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                                            {category.icon ?? iconPalette[index % iconPalette.length]}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-slate-900">{category.name}</p>
                                            <p className="text-xs text-slate-400">
                                                {category.servicesCount} خدمت تعریف شده
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${category.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                            }`}
                                    >
                                        {category.isActive ? 'فعال' : 'متوقف'}
                                    </span>
                                </div>
                                <p className="mt-4 text-sm text-slate-500">{category.description}</p>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <ServiceCategoryFormDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={(values) => createCategory.mutateAsync(values).then(() => setIsDialogOpen(false))}
            />
        </div>
    );
};

export default ServiceCategoriesList;

