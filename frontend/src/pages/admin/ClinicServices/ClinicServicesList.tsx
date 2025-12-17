import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Building2, Plus, Edit, Trash2, ArrowRight } from 'lucide-react';
import { clinicServiceService, type ClinicService, type CreateClinicServiceDto } from '../../../api/services/clinicServiceService';
import { clinicService, type Clinic } from '../../../api/services/clinicService';
import { serviceService, type Service } from '../../../api/services/serviceService';
import { Button } from '../../../components/ui/button';
import { EmptyState } from '../../../components/states/EmptyState';
import { PageLoader } from '../../../components/states/PageLoader';
import { AddClinicServiceDialog } from './AddClinicServiceDialog';
import { formatPersianDate } from '../../../lib/utils';

const ClinicServicesList = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const clinicId = id ? Number(id) : null;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<ClinicService | null>(null);
    const queryClient = useQueryClient();

    const { data: clinic, isLoading: isLoadingClinic } = useQuery<Clinic>({
        queryKey: ['clinic', clinicId],
        queryFn: () => clinicService.getById(clinicId!),
        enabled: !!clinicId,
    });

    const { data: clinicServices = [], isLoading: isLoadingServices } = useQuery<ClinicService[]>({
        queryKey: ['clinic-services', clinicId],
        queryFn: () => clinicServiceService.getClinicServices(clinicId!),
        enabled: !!clinicId,
    });

    const { data: allServices = [] } = useQuery<Service[]>({
        queryKey: ['services'],
        queryFn: () => serviceService.getAll(),
    });

    const addService = useMutation({
        mutationFn: (payload: CreateClinicServiceDto) =>
            clinicServiceService.addClinicService(clinicId!, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clinic-services', clinicId] });
            toast.success('خدمت به کلینیک اضافه شد');
            setIsDialogOpen(false);
        },
        onError: () => toast.error('افزودن خدمت با خطا مواجه شد'),
    });

    const updateService = useMutation({
        mutationFn: ({ serviceId, payload }: { serviceId: number; payload: CreateClinicServiceDto }) =>
            clinicServiceService.updateClinicService(clinicId!, serviceId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clinic-services', clinicId] });
            toast.success('خدمت به‌روزرسانی شد');
            setEditingService(null);
            setIsDialogOpen(false);
        },
        onError: () => toast.error('به‌روزرسانی خدمت با خطا مواجه شد'),
    });

    const removeService = useMutation({
        mutationFn: (serviceId: number) => clinicServiceService.removeClinicService(clinicId!, serviceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clinic-services', clinicId] });
            toast.success('خدمت از کلینیک حذف شد');
        },
        onError: () => toast.error('حذف خدمت ممکن نشد'),
    });

    if (!clinicId) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <EmptyState title="کلینیک یافت نشد" description="لطفا یک کلینیک معتبر انتخاب کنید." />
            </div>
        );
    }

    if (isLoadingClinic || isLoadingServices) {
        return <PageLoader />;
    }

    return (
        <div className="space-y-8">
            <section className="rounded-[32px] border border-slate-100 bg-white px-6 py-10 shadow-sm shadow-slate-200/60">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-3 text-right">
                        <button
                            onClick={() => navigate('/admin/clinics')}
                            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 transition"
                        >
                            <ArrowRight className="h-4 w-4" />
                            بازگشت به لیست کلینیک‌ها
                        </button>
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1 text-xs font-semibold text-primary-600">
                            <Building2 className="h-4 w-4" />
                            خدمات کلینیک
                        </span>
                        <h2 className="text-3xl font-black text-slate-900">
                            {clinic?.name || 'کلینیک'}
                        </h2>
                        <p className="text-sm text-slate-500">
                            مدیریت خدمات ارائه شده در این کلینیک
                        </p>
                    </div>
                    <Button
                        className="h-12 rounded-2xl bg-gradient-to-l from-primary-600 to-primary-400 px-6 text-sm font-semibold shadow-lg shadow-primary/30"
                        onClick={() => {
                            setEditingService(null);
                            setIsDialogOpen(true);
                        }}
                    >
                        <Plus className="ml-2 h-4 w-4" />
                        افزودن خدمت
                    </Button>
                </div>
            </section>

            <section className="rounded-[28px] border border-slate-100 bg-white/90 p-6 shadow-md">
                {clinicServices.length === 0 ? (
                    <EmptyState
                        title="خدمتی ثبت نشده است"
                        description="برای افزودن خدمت به این کلینیک از دکمه بالا استفاده کنید."
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
                                        قیمت
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        وضعیت
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        تاریخ ثبت
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        عملیات
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {clinicServices.map((clinicService) => (
                                    <tr key={clinicService.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {clinicService.serviceName || 'نامشخص'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {clinicService.price
                                                    ? new Intl.NumberFormat('fa-IR', {
                                                        style: 'currency',
                                                        currency: 'IRR',
                                                    }).format(clinicService.price)
                                                    : 'تعیین نشده'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${clinicService.active
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-rose-100 text-rose-700'
                                                    }`}
                                            >
                                                {clinicService.active ? 'فعال' : 'غیرفعال'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatPersianDate(clinicService.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingService(clinicService);
                                                        setIsDialogOpen(true);
                                                    }}
                                                    className="text-primary-600 hover:text-primary-900 p-2 rounded-lg hover:bg-primary/10 transition"
                                                    title="ویرایش"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                'آیا از حذف این خدمت از کلینیک اطمینان دارید؟'
                                                            )
                                                        ) {
                                                            removeService.mutate(clinicService.serviceId);
                                                        }
                                                    }}
                                                    className="text-rose-600 hover:text-rose-900 p-2 rounded-lg hover:bg-rose/10 transition"
                                                    title="حذف"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <AddClinicServiceDialog
                open={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setEditingService(null);
                }}
                clinicId={clinicId}
                allServices={allServices}
                existingClinicServices={clinicServices}
                editingService={editingService}
                onSubmit={(values) => {
                    if (editingService) {
                        updateService.mutate({
                            serviceId: editingService.serviceId,
                            payload: values,
                        });
                    } else {
                        addService.mutate(values);
                    }
                }}
            />
        </div>
    );
};

export default ClinicServicesList;

