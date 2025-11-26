import { useState } from 'react';
import { X } from 'lucide-react';
import type { ServiceCategoryPayload } from '../../../api/services/serviceCategoryService';
import { Button } from '../../../components/ui/button';

interface ServiceCategoryFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: ServiceCategoryPayload) => Promise<void> | void;
}

const defaultValues: ServiceCategoryPayload = {
    name: '',
    description: '',
    isActive: true,
    parentId: null,
};

export const ServiceCategoryFormDialog = ({
    open,
    onClose,
    onSubmit,
}: ServiceCategoryFormDialogProps) => {
    const [values, setValues] = useState<ServiceCategoryPayload>(defaultValues);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        await onSubmit(values);
        setLoading(false);
        setValues(defaultValues);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur">
            <div className="relative w-full max-w-md rounded-[28px] bg-white p-8 shadow-2xl">
                <button
                    className="absolute left-6 top-6 rounded-full border border-slate-100 p-2 text-slate-500 transition hover:text-slate-900"
                    onClick={onClose}
                    type="button"
                >
                    <X className="h-5 w-5" />
                </button>
                <div className="space-y-1 text-right">
                    <h3 className="text-2xl font-black text-slate-900">دسته‌بندی جدید</h3>
                    <p className="text-sm text-slate-500">تعریف گروه بندی خدمات</p>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <label className="text-sm font-medium text-slate-600">
                        نام دسته‌بندی
                        <input
                            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                            value={values.name}
                            onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
                            required
                        />
                    </label>
                    <label className="text-sm font-medium text-slate-600">
                        توضیحات
                        <textarea
                            className="mt-2 min-h-[90px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-primary"
                            value={values.description}
                            onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
                            required
                        />
                    </label>

                    <label className="text-sm font-medium text-slate-600">
                        دسته والد (اختیاری)
                        <input
                            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                            placeholder="شناسه یا نام دسته والد"
                            onChange={(e) =>
                                setValues((prev) => ({
                                    ...prev,
                                    parentId: e.target.value ? Number(e.target.value) : null,
                                }))
                            }
                        />
                    </label>

                    <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <input
                            type="checkbox"
                            checked={values.isActive}
                            onChange={(e) => setValues((prev) => ({ ...prev, isActive: e.target.checked }))}
                            className="h-4 w-4 rounded border-slate-300"
                        />
                        فعال باشد
                    </label>

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
                            className="h-11 rounded-2xl bg-gradient-to-l from-primary-600 to-primary-400 px-10 text-sm font-semibold text-white"
                            disabled={loading}
                        >
                            {loading ? 'در حال ذخیره...' : 'ثبت دسته‌بندی'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

