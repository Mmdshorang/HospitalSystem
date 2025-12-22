import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { CreateInsuranceDto } from "../../../api/services/insuranceService";
import { Button } from "../../../components/ui/button";

interface InsuranceFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateInsuranceDto) => Promise<void> | void;
  initialValues?: CreateInsuranceDto;
  title?: string;
  submitLabel?: string;
}

const emptyValues: CreateInsuranceDto = {
  name: "",
  description: "",
  coveragePercent: 70,
  isActive: true,
};

export const InsuranceFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  title,
  submitLabel,
}: InsuranceFormDialogProps) => {
  const [values, setValues] = useState<CreateInsuranceDto>(
    initialValues ?? emptyValues
  );
  const [loading, setLoading] = useState(false);

  // Sync values when dialog is opened with provided initial values
  useEffect(() => {
    if (open) {
      setValues(initialValues ?? emptyValues);
    }
  }, [open, initialValues]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await onSubmit(values);
    setLoading(false);
    setValues(emptyValues);
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
          <h3 className="text-2xl font-black text-slate-900">
            {title ?? "افزودن بیمه جدید"}
          </h3>
          <p className="text-sm text-slate-500">
            پوشش و توضیحات بیمه را وارد کنید
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="text-sm font-medium text-slate-600">
            نام بیمه
            <input
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
              value={values.name}
              onChange={(e) =>
                setValues((prev: CreateInsuranceDto) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              required
            />
          </label>
          <label className="text-sm font-medium text-slate-600">
            توضیحات
            <textarea
              className="mt-2 min-h-[90px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-primary"
              value={values.description}
              onChange={(e) =>
                setValues((prev: CreateInsuranceDto) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </label>
          <label className="text-sm font-medium text-slate-600">
            درصد پوشش
            <input
              type="number"
              min={0}
              max={100}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
              value={values.coveragePercent}
              onChange={(e) =>
                setValues((prev: CreateInsuranceDto) => ({
                  ...prev,
                  coveragePercent: Number(e.target.value),
                }))
              }
              required
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(e) =>
                setValues((prev: CreateInsuranceDto) => ({
                  ...prev,
                  isActive: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-slate-300"
            />
            فعال شود
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
              {loading ? "در حال ذخیره..." : submitLabel ?? "افزودن بیمه"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
