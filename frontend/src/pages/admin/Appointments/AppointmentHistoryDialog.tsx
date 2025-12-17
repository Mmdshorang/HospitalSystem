import { useQuery } from '@tanstack/react-query';
import { X, Clock } from 'lucide-react';
import { serviceRequestService, type ServiceRequestHistory } from '../../../api/services/serviceRequestService';
import { PageLoader } from '../../../components/states/PageLoader';
import { formatPersianDateTime } from '../../../lib/utils';

interface AppointmentHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  appointmentId: number;
}

export const AppointmentHistoryDialog = ({ open, onClose, appointmentId }: AppointmentHistoryDialogProps) => {
  const { data: history = [], isLoading } = useQuery<ServiceRequestHistory[]>({
    queryKey: ['appointment-history', appointmentId],
    queryFn: () => serviceRequestService.getHistory(appointmentId),
    enabled: open,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur">
      <div className="relative w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
        <button
          className="absolute left-6 top-6 rounded-full border border-slate-100 p-2 text-slate-500 transition hover:text-slate-900"
          onClick={onClose}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="space-y-1 text-right">
          <h3 className="text-2xl font-black text-slate-900">تاریخچه تغییرات</h3>
          <p className="text-sm text-slate-500">نوبت: {appointmentId}</p>
        </div>
        <div className="mt-8 space-y-4">
          {isLoading ? (
            <PageLoader />
          ) : history.length === 0 ? (
            <p className="text-center text-gray-500 py-8">تاریخچه‌ای موجود نیست</p>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.fromStatus} → {item.toStatus}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.changedBy || 'سیستم'} · {formatPersianDateTime(item.changedAt)}
                      </p>
                    </div>
                  </div>
                </div>
                {item.note && (
                  <p className="mt-2 text-sm text-slate-600 pr-14">{item.note}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

