import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Building2, MapPin, Search, Sparkles, Settings } from 'lucide-react';
import { clinicService, type Clinic, type CreateClinicDto } from '../../../api/services/clinicService';
import { Button } from '../../../components/ui/button';
import { EmptyState } from '../../../components/states/EmptyState';
import { PageLoader } from '../../../components/states/PageLoader';
import { ClinicFormDialog } from './ClinicFormDialog';

const statusLabels: Record<string, string> = {
    true: 'فعال',
    false: 'غیرفعال',
};

const statusColors: Record<string, string> = {
    true: 'bg-emerald-100 text-emerald-700',
    false: 'bg-rose-100 text-rose-700',
};

const ClinicsList = () => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<'all' | string>('all');
    const [city, setCity] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: clinics = [], isLoading } = useQuery<Clinic[]>({
        queryKey: ['clinics', search, city, status],
        queryFn: () => clinicService.getAll(search || undefined, city || undefined, status === 'all' ? undefined : status === 'true'),
    });

    const createClinic = useMutation({
        mutationFn: (payload: CreateClinicDto) => clinicService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clinics'] });
            toast.success('کلینیک جدید ثبت شد');
        },
        onError: () => toast.error('ثبت کلینیک با خطا مواجه شد'),
    });

    const filteredClinics = clinics; // Filtering is done on backend

    const stats = useMemo(() => {
        const active = clinics.filter((clinic) => clinic.isActive).length;
        const inactive = clinics.filter((clinic) => !clinic.isActive).length;
        return [
            { label: 'کلینیک فعال', value: `${active}`, chip: 'فعال' },
            { label: 'غیرفعال', value: `${inactive}`, chip: 'غیرفعال' },
            { label: 'کل کلینیک‌ها', value: `${clinics.length}`, chip: 'مجموع' },
        ];
    }, [clinics]);

    return (
        <div className="space-y-8">
            <section className="rounded-[32px] border border-slate-100 bg-white px-8 py-10 shadow-sm shadow-slate-200/60">
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="space-y-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1 text-xs font-semibold text-primary-600">
                            <Sparkles className="h-4 w-4" />
                            شبکه کلینیک‌ها
                        </span>
                        <h2 className="text-3xl font-black text-slate-900">مدیریت مدرن کلینیک‌ها</h2>
                        <p className="text-sm text-slate-500">
                            وضعیت تایید، ظرفیت و سلامت عملیاتی تمامی کلینیک‌ها در یک نگاه.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        {stats.map((item) => (
                            <div
                                key={item.label}
                                className="rounded-3xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 px-6 py-4 text-right"
                            >
                                <p className="text-sm text-slate-500">{item.label}</p>
                                <p className="text-2xl font-black text-slate-900">{item.value}</p>
                                <span className="text-xs font-semibold text-emerald-500">{item.chip}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="rounded-[28px] border border-slate-100 bg-white/90 p-6 shadow-sm shadow-slate-200/50">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
                        <Search className="h-5 w-5 text-slate-400" />
                        <input
                            className="h-12 flex-1 border-0 bg-transparent text-sm outline-none"
                            placeholder="جستجو بر اساس نام، شهر یا مدیر..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <input
                            className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-primary"
                            placeholder="شهر..."
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-primary"
                        >
                            <option value="all">همه وضعیت‌ها</option>
                            <option value="true">فعال</option>
                            <option value="false">غیرفعال</option>
                        </select>
                        <Button
                            className="h-12 rounded-2xl bg-gradient-to-l from-primary-600 to-primary-400 px-6 text-sm font-semibold shadow-lg shadow-primary/30"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            افزودن کلینیک
                        </Button>
                    </div>
                </div>

                <div className="mt-8">
                    {isLoading ? (
                        <PageLoader />
                    ) : filteredClinics.length === 0 ? (
                        <EmptyState
                            title="کلینیکی یافت نشد"
                            description="برای افزودن کلینیک جدید از دکمه بالا استفاده کنید."
                        />
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {filteredClinics.map((clinic) => (
                                <article
                                    key={clinic.id}
                                    className="rounded-3xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary-600">
                                                <Building2 className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900">{clinic.name}</h3>
                                                <p className="text-xs text-slate-500">{clinic.managerName}</p>
                                            </div>
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[clinic.isActive.toString()]}`}
                                        >
                                            {statusLabels[clinic.isActive.toString()]}
                                        </span>
                                    </div>

                                    {clinic.addresses && clinic.addresses.length > 0 && (
                                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                                            <MapPin className="h-4 w-4" />
                                            {clinic.addresses[0].city} · {clinic.addresses[0].street}
                                        </div>
                                    )}

                                    <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-semibold text-slate-500">
                                        <div className="rounded-2xl bg-white/70 px-4 py-3 text-slate-600">
                                            <p>تلفن</p>
                                            <p className="mt-1 text-lg font-black text-primary-600">
                                                {clinic.phone || 'ندارد'}
                                            </p>
                                        </div>
                                        <div className="rounded-2xl bg-white/70 px-4 py-3 text-slate-600">
                                            <p>ایمیل</p>
                                            <p className="mt-1 text-sm font-black text-emerald-600">
                                                {clinic.email || 'ندارد'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => navigate(`/admin/clinics/${clinic.id}/services`)}
                                            className="flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary/20"
                                        >
                                            <Settings className="h-4 w-4" />
                                            مدیریت خدمات
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <ClinicFormDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={(values) => createClinic.mutateAsync(values).then(() => setIsDialogOpen(false))}
            />
        </div>
    );
};

export default ClinicsList;

