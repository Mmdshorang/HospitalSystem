import { useState } from 'react';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { ServiceRequest, AssignPerformerDto } from '../../../api/services/serviceRequestService';
import { providerService } from '../../../api/services/providerService';
import { Button } from '../../../components/ui/button';

interface AssignPerformerDialogProps {
  open: boolean;
  onClose: () => void;
  appointment: ServiceRequest;
  onSubmit: (dto: AssignPerformerDto) => Promise<void> | void;
}

export const AssignPerformerDialog = ({
  open,
  onClose,
  appointment,
  onSubmit,
}: AssignPerformerDialogProps) => {
  const [performerId, setPerformerId] = useState<number>(appointment.performedByUserId || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: providers = [], isLoading } = useQuery({
    queryKey: ['providers'],
    queryFn: () => providerService.getAll(),
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (performerId <= 0) {
      alert('لطفا انجام‌دهنده را انتخاب کنید');
      return;
    }
    setIsSubmitting(true);
    await onSubmit({ performedByUserId: performerId });
    setIsSubmitting(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur">
      <div className="relative w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl">
        <button
          className="absolute left-6 top-6 rounded-full border border-slate-100 p-2 text-slate-500 transition hover:text-slate-900"
          onClick={onClose}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="space-y-1 text-right">
          <h3 className="text-2xl font-black text-slate-900">تعیین انجام‌دهنده</h3>
          <p className="text-sm text-slate-500">نوبت: {appointment.id}</p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="text-sm font-medium text-slate-600">
            انجام‌دهنده *
            {isLoading ? (
              <div className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm flex items-center">
                در حال بارگذاری...
              </div>
            ) : (
              <select
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                value={performerId}
                onChange={(e) => setPerformerId(Number(e.target.value))}
                required
              >
                <option value="0">انتخاب کنید...</option>
                {providers.map((provider: any) => (
                  <option key={provider.id} value={provider.userId || provider.id}>
                    {provider.firstName} {provider.lastName} - {provider.specialtyName}
                  </option>
                ))}
              </select>
            )}
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
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? 'در حال ذخیره...' : 'تعیین انجام‌دهنده'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

