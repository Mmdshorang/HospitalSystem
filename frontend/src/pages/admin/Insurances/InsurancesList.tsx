import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ShieldCheck, BadgeCheck, Plus } from 'lucide-react';
import {
    insuranceService,
    type Insurance,
    type InsurancePayload,
} from '../../../api/services/insuranceService';
import { Button } from '../../../components/ui/button';
import { EmptyState } from '../../../components/states/EmptyState';
import { PageLoader } from '../../../components/states/PageLoader';
import { InsuranceFormDialog } from './InsuranceFormDialog';

const InsurancesList = () => {
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data: insurances = [], isLoading } = useQuery<Insurance[]>({
        queryKey: ['insurances'],
        queryFn: insuranceService.getAll,
    });

    const createInsurance = useMutation({
        mutationFn: (payload: InsurancePayload) => insuranceService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['insurances'] });
            toast.success('بیمه جدید ثبت شد');
        },
        onError: () => toast.error('ثبت بیمه با خطا مواجه شد'),
    });

    const toggleInsurance = useMutation({
        mutationFn: (insurance: Insurance) =>
            insuranceService.update(insurance.id, { isActive: !insurance.isActive }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['insurances'] });
        },
        onError: () => toast.error('به‌روزرسانی وضعیت بیمه ممکن نشد'),
    });

    const filteredInsurances = useMemo(() => {
        if (filter === 'all') return insurances;
        return insurances.filter((insurance) => insurance.isActive === (filter === 'active'));
    }, [filter, insurances]);

    return (
        <div className="space-y-8">
            <section className="rounded-[28px] border border-slate-100 bg-white px-6 py-10 shadow-sm shadow-slate-200/60">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-3 text-right">
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold text-emerald-700">
                            <BadgeCheck className="h-4 w-4" />
                            بیمه‌های متصل
                        </span>
                        <h2 className="text-3xl font-black text-slate-900">مدیریت بیمه‌ها</h2>
                        <p className="text-sm text-slate-500">
                            پوشش‌ها، درصد پرداخت و وضعیت فعال بودن بیمه‌ها را کنترل کنید.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {['all', 'active', 'inactive'].map((option) => {
                            const active = filter === option;

                            return (
                                <button
                                    key={option}
                                    onClick={() => setFilter(option as typeof filter)}
                                    className={`
          rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200
          ${active
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                                        }
        `}
                                >
                                    {option === 'all'
                                        ? 'همه'
                                        : option === 'active'
                                            ? 'فعال'
                                            : 'غیرفعال'}
                                </button>
                            );
                        })}

                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            className="rounded-xl px-6 py-2.5 font-semibold flex items-center gap-2
        bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/30"
                        >
                            <Plus className="h-4 w-4" />
                            بیمه جدید
                        </Button>
                    </div>

                </div>
            </section>

            <section className="rounded-[28px] border border-slate-100 bg-white/90 p-6 shadow-sm shadow-slate-200/50">
                {isLoading ? (
                    <PageLoader />
                ) : filteredInsurances.length === 0 ? (
                    <EmptyState title="بیمه‌ای موجود نیست" />
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {filteredInsurances.map((insurance) => (
                            <article
                                key={insurance.id}
                                className="rounded-3xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                                            <ShieldCheck className="h-6 w-6" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-slate-900">{insurance.name}</p>
                                            <p className="text-xs text-slate-400">{insurance.updatedAt}</p>
                                        </div>
                                    </div>
                                    <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-400">
                                        <span>{insurance.isActive ? 'فعال' : 'غیرفعال'}</span>
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-slate-300"
                                            checked={insurance.isActive}
                                            onChange={() => toggleInsurance.mutate(insurance)}
                                        />
                                    </label>
                                </div>
                                <p className="mt-4 text-sm text-slate-500">{insurance.description}</p>
                                <div className="mt-5 rounded-2xl bg-white/80 p-4">
                                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                                        <span>درصد پوشش</span>
                                        <span>{insurance.coveragePercent}%</span>
                                    </div>
                                    <div className="mt-3 h-2 rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-l from-emerald-500 to-emerald-300"
                                            style={{ width: `${insurance.coveragePercent}%` }}
                                        />
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <InsuranceFormDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={(values) => createInsurance.mutateAsync(values).then(() => setIsDialogOpen(false))}
            />
        </div>
    );
};

export default InsurancesList;

