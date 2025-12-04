import { useState } from 'react';
import { X } from 'lucide-react';
import type { ServiceRequest, ChangeStatusDto, RequestStatus } from '../../../api/services/serviceRequestService';
import { Button } from '../../../components/ui/button';

interface ChangeStatusDialogProps {
  open: boolean;
  onClose: () => void;
  appointment: ServiceRequest;
  onSubmit: (dto: ChangeStatusDto) => Promise<void> | void;
}

const statusOptions: { value: RequestStatus; label: string }[] = [
  { value: 'pending', label: 'در انتظار' },
  { value: 'approved', label: 'تایید شده' },
  { value: 'in_progress', label: 'در حال انجام' },
  { value: 'done', label: 'انجام شده' },
  { value: 'rejected', label: 'رد شده' },
];

export const ChangeStatusDialog = ({ open, onClose, appointment, onSubmit }: ChangeStatusDialogProps) => {
  const [status, setStatus] = useState<RequestStatus>(appointment.status);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    await onSubmit({ status, note: note || undefined });
    setIsSubmitting(false);
    setNote('');
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
          <h3 className="text-2xl font-black text-slate-900">تغییر وضعیت</h3>
          <p className="text-sm text-slate-500">نوبت: {appointment.id}</p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="text-sm font-medium text-slate-600">
            وضعیت جدید
            <select
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
              value={status}
              onChange={(e) => setStatus(e.target.value as RequestStatus)}
              required
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-600">
            یادداشت (اختیاری)
            <textarea
              className="mt-2 min-h-[90px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-primary"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'در حال تغییر...' : 'تغییر وضعیت'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

