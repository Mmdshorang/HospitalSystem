import { useState } from 'react';
import { X } from 'lucide-react';
import type { CreateClinicDto } from '../../../api/services/clinicService';
import { PhoneInput } from '../../../components/ui/phone-input';
import { Button } from '../../../components/ui/button';

interface ClinicFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: CreateClinicDto) => Promise<void> | void;
}

const defaultValues: CreateClinicDto = {
    name: '',
    phone: '',
    email: '',
    isActive: true,
};

export const ClinicFormDialog = ({ open, onClose, onSubmit }: ClinicFormDialogProps) => {
    const [values, setValues] = useState<CreateClinicDto>(defaultValues);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: keyof CreateClinicDto, value: string | number | boolean | undefined) => {
        setValues((prev) => ({ ...prev, [field]: value }));
    };

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
            <div className="relative w-full max-w-xl rounded-[32px] bg-white p-8 shadow-2xl">
                <button
                    className="absolute left-6 top-6 rounded-full border border-slate-100 p-2 text-slate-500 transition hover:text-slate-900"
                    onClick={onClose}
                    type="button"
                >
                    <X className="h-5 w-5" />
                </button>
                <div className="space-y-1 text-right">
                    <h3 className="text-2xl font-black text-slate-900">افزودن کلینیک جدید</h3>
                    <p className="text-sm text-slate-500">اطلاعات کلینیک را تکمیل کنید</p>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="text-sm font-medium text-slate-600">
                            نام کلینیک
                            <input
                                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                                value={values.name || ''}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required
                            />
                        </label>
                        <PhoneInput
                            label="شماره تماس"
                            value={values.phone || ''}
                            onChange={(event) => handleChange('phone', event.target.value)}
                            maxLength={11}
                        />
                    </div>
                    <label className="text-sm font-medium text-slate-600">
                        ایمیل
                        <input
                            type="email"
                            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                            value={values.email || ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <input
                            type="checkbox"
                            checked={values.isActive ?? true}
                            onChange={(e) => handleChange('isActive', e.target.checked)}
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
                            className="h-11 rounded-2xl bg-gradient-to-l from-primary-600 to-primary-400 px-10 text-sm font-semibold text-slate-600"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'در حال ذخیره...' : 'ثبت کلینیک'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

