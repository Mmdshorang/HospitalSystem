import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { CreateClinicServiceDto, ClinicService } from '../../../api/services/clinicServiceService';
import type { Service } from '../../../api/services/serviceService';
import { Button } from '../../../components/ui/button';

interface AddClinicServiceDialogProps {
    open: boolean;
    onClose: () => void;
    clinicId: number;
    allServices: Service[];
    existingClinicServices: ClinicService[];
    editingService: ClinicService | null;
    onSubmit: (values: CreateClinicServiceDto) => Promise<void> | void;
}

export const AddClinicServiceDialog = ({
    open,
    onClose,
    clinicId,
    allServices,
    existingClinicServices,
    editingService,
    onSubmit,
}: AddClinicServiceDialogProps) => {
    const [values, setValues] = useState<CreateClinicServiceDto>({
        clinicId,
        serviceId: 0,
        price: undefined,
        active: true,
    });
    const [loading, setLoading] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    useEffect(() => {
        if (editingService) {
            setValues({
                clinicId: editingService.clinicId,
                serviceId: editingService.serviceId,
                price: editingService.price || undefined,
                active: editingService.active,
            });
            const service = allServices.find((s) => s.id === editingService.serviceId);
            setSelectedService(service || null);
        } else {
            setValues({
                clinicId,
                serviceId: 0,
                price: undefined,
                active: true,
            });
            setSelectedService(null);
        }
    }, [editingService, clinicId, allServices]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (values.serviceId <= 0) {
            alert('لطفا خدمت را انتخاب کنید');
            return;
        }
        setLoading(true);
        await onSubmit(values);
        setLoading(false);
        setValues({
            clinicId,
            serviceId: 0,
            price: undefined,
            active: true,
        });
        setSelectedService(null);
    };

    const handleServiceChange = (serviceId: number) => {
        const service = allServices.find((s) => s.id === serviceId);
        setSelectedService(service || null);
        setValues((prev) => ({
            ...prev,
            serviceId,
            price: service?.basePrice || prev.price,
        }));
    };

    if (!open) return null;

    // Filter out services that are already added to this clinic (except when editing)
    const addedServiceIds = existingClinicServices.map((cs) => cs.serviceId);
    const availableServices = allServices.filter(
        (service) => editingService ? service.id === editingService.serviceId : !addedServiceIds.includes(service.id)
    );

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
                    <h3 className="text-2xl font-black text-slate-900">
                        {editingService ? 'ویرایش خدمت کلینیک' : 'افزودن خدمت به کلینیک'}
                    </h3>
                    <p className="text-sm text-slate-500">
                        {editingService
                            ? 'اطلاعات خدمت را ویرایش کنید'
                            : 'خدمت مورد نظر را انتخاب و قیمت را وارد کنید'}
                    </p>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <label className="text-sm font-medium text-slate-600">
                        خدمت *
                        <select
                            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                            value={values.serviceId}
                            onChange={(e) => handleServiceChange(Number(e.target.value))}
                            required
                            disabled={!!editingService}
                        >
                            <option value="0">انتخاب کنید...</option>
                            {availableServices.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name} {service.basePrice ? `(${new Intl.NumberFormat('fa-IR').format(service.basePrice)} تومان)` : ''}
                                </option>
                            ))}
                        </select>
                        {selectedService?.description && (
                            <p className="mt-1 text-xs text-slate-500">{selectedService.description}</p>
                        )}
                    </label>
                    <label className="text-sm font-medium text-slate-600">
                        قیمت (تومان)
                        <input
                            type="number"
                            min={0}
                            step="1000"
                            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                            value={values.price || ''}
                            onChange={(e) =>
                                setValues((prev) => ({
                                    ...prev,
                                    price: e.target.value ? Number(e.target.value) : undefined,
                                }))
                            }
                            placeholder={selectedService?.basePrice ? `قیمت پیشنهادی: ${new Intl.NumberFormat('fa-IR').format(selectedService.basePrice)}` : ''}
                        />
                        {selectedService?.basePrice && (
                            <p className="mt-1 text-xs text-slate-500">
                                قیمت پایه خدمت: {new Intl.NumberFormat('fa-IR').format(selectedService.basePrice)} تومان
                            </p>
                        )}
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <input
                            type="checkbox"
                            checked={values.active}
                            onChange={(e) =>
                                setValues((prev) => ({ ...prev, active: e.target.checked }))
                            }
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
                            className="h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 px-10 text-sm font-semibold text-white shadow-lg shadow-blue-600/30"
                            disabled={loading}
                        >
                            {loading
                                ? 'در حال ذخیره...'
                                : editingService
                                  ? 'ذخیره تغییرات'
                                  : 'افزودن خدمت'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

