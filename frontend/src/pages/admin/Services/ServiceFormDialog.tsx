import { useState } from 'react';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { CreateServiceDto } from '../../../api/services/serviceService';
import { serviceCategoryService } from '../../../api/services/serviceCategoryService';
import { Button } from '../../../components/ui/button';

interface ServiceFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: CreateServiceDto) => Promise<void> | void;
}

const defaultValues: CreateServiceDto = {
    name: '',
    description: '',
    categoryId: undefined,
    basePrice: undefined,
    durationMinutes: undefined,
    isInPerson: true,
    requiresDoctor: false,
};

export const ServiceFormDialog = ({ open, onClose, onSubmit }: ServiceFormDialogProps) => {
    const [values, setValues] = useState<CreateServiceDto>(defaultValues);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: categories = [] } = useQuery({
        queryKey: ['service-categories'],
        queryFn: () => serviceCategoryService.getAll(),
    });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        await onSubmit(values);
        setIsSubmitting(false);
        setValues(defaultValues);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur">
            <div className="relative w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-2xl">
                <button
                    className="absolute left-6 top-6 rounded-full border border-slate-100 p-2 text-slate-500 transition hover:text-slate-900"
                    onClick={onClose}
                    type="button"
                >
                    <X className="h-5 w-5" />
                </button>
                <div className="space-y-1 text-right">
                    <h3 className="text-2xl font-black text-slate-900">افزودن خدمت جدید</h3>
                    <p className="text-sm text-slate-500">اطلاعات خدمت را تکمیل کنید</p>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="text-sm font-medium text-slate-600">
                            نام خدمت
                            <input
                                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                                value={values.name || ''}
                                onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </label>
                        <label className="text-sm font-medium text-slate-600">
                            دسته‌بندی
                            <select
                                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                                value={values.categoryId || ''}
                                onChange={(e) =>
                                    setValues((prev) => ({
                                        ...prev,
                                        categoryId: e.target.value ? Number(e.target.value) : undefined,
                                    }))
                                }
                            >
                                <option value="">انتخاب کنید...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <label className="text-sm font-medium text-slate-600">
                        توضیحات
                        <textarea
                            className="mt-2 min-h-[90px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-primary"
                            value={values.description || ''}
                            onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
                        />
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="text-sm font-medium text-slate-600">
                            قیمت پایه (تومان)
                            <input
                                type="number"
                                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                                value={values.basePrice || ''}
                                onChange={(e) =>
                                    setValues((prev) => ({
                                        ...prev,
                                        basePrice: e.target.value ? Number(e.target.value) : undefined,
                                    }))
                                }
                            />
                        </label>
                        <label className="text-sm font-medium text-slate-600">
                            مدت زمان (دقیقه)
                            <input
                                type="number"
                                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                                value={values.durationMinutes || ''}
                                onChange={(e) =>
                                    setValues((prev) => ({
                                        ...prev,
                                        durationMinutes: e.target.value ? Number(e.target.value) : undefined,
                                    }))
                                }
                            />
                        </label>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <input
                                type="checkbox"
                                checked={values.isInPerson ?? true}
                                onChange={(e) => setValues((prev) => ({ ...prev, isInPerson: e.target.checked }))}
                                className="h-4 w-4 rounded border-slate-300"
                            />
                            حضوری
                        </label>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <input
                                type="checkbox"
                                checked={values.requiresDoctor ?? false}
                                onChange={(e) =>
                                    setValues((prev) => ({ ...prev, requiresDoctor: e.target.checked }))
                                }
                                className="h-4 w-4 rounded border-slate-300"
                            />
                            نیاز به پزشک
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-11 rounded-2xl border-slate-200 px-6 text-sm text-slate-600"
                            onClick={onClose}
                        >
                            انصراف
                        </Button>
                        <Button
                            type="submit"
                            className="h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 px-10 text-sm font-semibold text-white shadow-lg shadow-blue-600/30"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'در حال ذخیره...' : 'ثبت خدمت'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

