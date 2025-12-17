import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { CreateServiceRequestDto } from '../../../api/services/serviceRequestService';
import { clinicService } from '../../../api/services/clinicService';
import { serviceService } from '../../../api/services/serviceService';
import { insuranceService } from '../../../api/services/insuranceService';
import { patientService, type PatientListItem } from '../../../api/services/patientService';
import { Button } from '../../../components/ui/button';
import JalaliDatePicker from '../../../components/DatePicker/DatePicker';
import moment from 'jalali-moment';

interface AppointmentFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateServiceRequestDto) => Promise<void> | void;
}

const defaultValues: CreateServiceRequestDto = {
  patientId: 0,
  clinicId: undefined,
  serviceId: undefined,
  insuranceId: undefined,
  preferredTime: undefined,
  appointmentType: undefined,
  notes: undefined,
};

export const AppointmentFormDialog = ({ open, onClose, onSubmit }: AppointmentFormDialogProps) => {
  const [values, setValues] = useState<CreateServiceRequestDto>(defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('');

  const buildPreferredIso = (dateJ: string, time: string) => {
    if (!dateJ || !time) return undefined;
    const m = moment(dateJ, 'jYYYY/jMM/jDD').hour(Number(time.split(':')[0] || 0)).minute(Number(time.split(':')[1] || 0)).second(0).millisecond(0);
    return m.isValid() ? m.toDate().toISOString() : undefined;
  };

  useEffect(() => {
    if (open) {
      setPreferredDate(values.preferredTime ? moment(values.preferredTime).format('jYYYY/jMM/jDD') : '');
      setPreferredTime(values.preferredTime ? moment(values.preferredTime).format('HH:mm') : '');
    }
  }, [open, values.preferredTime]);

  const { data: clinics = [] } = useQuery({
    queryKey: ['clinics'],
    queryFn: () => clinicService.getAll(),
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceService.getAll(),
  });

  const { data: insurances = [] } = useQuery({
    queryKey: ['insurances', 'active'],
    queryFn: () => insuranceService.getAll(undefined, true),
  });

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientService.getAll(),
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (values.patientId <= 0) {
      alert('لطفا بیمار را انتخاب کنید');
      return;
    }
    setIsSubmitting(true);
    await onSubmit(values);
    setIsSubmitting(false);
    setValues(defaultValues);
    setPreferredDate('');
    setPreferredTime('');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur">
      <div className="relative w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          className="absolute left-6 top-6 rounded-full border border-slate-100 p-2 text-slate-500 transition hover:text-slate-900"
          onClick={onClose}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="space-y-1 text-right">
          <h3 className="text-2xl font-black text-slate-900">افزودن نوبت جدید</h3>
          <p className="text-sm text-slate-500">اطلاعات نوبت را تکمیل کنید</p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="text-sm font-medium text-slate-600">
            بیمار *
            <select
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
              value={values.patientId || ''}
              onChange={(e) => setValues((prev) => ({ ...prev, patientId: Number(e.target.value) }))}
              required
            >
              <option value="">انتخاب کنید...</option>
              {patients.map((patient: PatientListItem) => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName} - {patient.nationalCode}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-600">
              کلینیک
              <select
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                value={values.clinicId || ''}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    clinicId: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              >
                <option value="">انتخاب کنید...</option>
                {clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-600">
              خدمت
              <select
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                value={values.serviceId || ''}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    serviceId: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              >
                <option value="">انتخاب کنید...</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-600">
              بیمه
              <select
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                value={values.insuranceId || ''}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    insuranceId: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              >
                <option value="">انتخاب کنید...</option>
                {insurances.map((insurance) => (
                  <option key={insurance.id} value={insurance.id}>
                    {insurance.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-600">
              نوع نوبت
              <select
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                value={values.appointmentType || ''}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    appointmentType: e.target.value ? (e.target.value as 'in_person' | 'online' | 'phone') : undefined,
                  }))
                }
              >
                <option value="">انتخاب کنید...</option>
                <option value="in_person">حضوری</option>
                <option value="online">آنلاین</option>
                <option value="phone">تلفنی</option>
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-600">
              تاریخ ترجیحی
              <JalaliDatePicker
                value={preferredDate || null}
                onChange={(val) => {
                  const dateVal = val ?? '';
                  setPreferredDate(dateVal);
                  setValues((prev) => ({
                    ...prev,
                    preferredTime: buildPreferredIso(dateVal, preferredTime),
                  }));
                }}
                placeholder="انتخاب تاریخ"
                className="mt-2"
                inputClassName="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="text-sm font-medium text-slate-600">
              زمان ترجیحی
              <input
                type="time"
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                value={preferredTime}
                onChange={(e) => {
                  const timeVal = e.target.value;
                  setPreferredTime(timeVal);
                  setValues((prev) => ({
                    ...prev,
                    preferredTime: buildPreferredIso(preferredDate, timeVal),
                  }));
                }}
              />
            </label>
          </div>
          <label className="text-sm font-medium text-slate-600">
            یادداشت
            <textarea
              className="mt-2 min-h-[90px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-primary"
              value={values.notes || ''}
              onChange={(e) => setValues((prev) => ({ ...prev, notes: e.target.value }))}
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
              className="h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 px-10 text-sm font-semibold text-white shadow-lg shadow-blue-600/30"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'در حال ذخیره...' : 'ثبت نوبت'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

