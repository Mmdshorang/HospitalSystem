import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { CreateServiceDto, Service } from "../../../api/services/serviceService";
import { serviceCategoryService } from "../../../api/services/serviceCategoryService";
import { Button } from "../../../components/ui/button";

interface ServiceFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateServiceDto) => Promise<void> | void;
  initialValues?: Service | null;
  allServices?: Service[];
}

const defaultValues: CreateServiceDto = {
  name: "",
  description: "",
  categoryId: undefined,
  basePrice: undefined,
  durationMinutes: undefined,
  isInPerson: true,
  requiresDoctor: false,
  isActive: true,
  deliveryType: "InClinic",
};

export const ServiceFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  allServices = [],
}: ServiceFormDialogProps) => {
  const [values, setValues] = useState<CreateServiceDto>(defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["service-categories"],
    queryFn: () => serviceCategoryService.getAll(),
  });

  useEffect(() => {
    if (open && initialValues) {
      setValues({
        name: initialValues.name || "",
        description: initialValues.description || "",
        categoryId: initialValues.categoryId,
        basePrice: initialValues.basePrice,
        durationMinutes: initialValues.durationMinutes,
        isInPerson: initialValues.isInPerson,
        requiresDoctor: initialValues.requiresDoctor,
        isActive: initialValues.isActive,
        imageUrl: initialValues.imageUrl,
        parentServiceId: initialValues.parentServiceId,
        deliveryType: initialValues.deliveryType || "InClinic",
      });
    } else if (!open) {
      setValues(defaultValues);
    }
  }, [open, initialValues]);

  const parentOptions = useMemo(
    () => allServices.filter((s) => !initialValues || s.id !== initialValues.id),
    [allServices, initialValues]
  );

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
          <h3 className="text-2xl font-black text-slate-900">
            {initialValues ? "ویرایش خدمت" : "افزودن خدمت جدید"}
          </h3>
          <p className="text-sm text-slate-500">
            {initialValues
              ? "اطلاعات خدمت را ویرایش کنید"
              : "مشخصات خدمت را تکمیل کنید"}
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-600">
              نام خدمت
              <input
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                value={values.name || ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </label>
            <label className="text-sm font-medium text-slate-600">
              دسته‌بندی
              <select
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                value={values.categoryId || ""}
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

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-600">
              تصویر (URL)
              <input
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                value={values.imageUrl || ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, imageUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </label>
            <label className="text-sm font-medium text-slate-600">
              نوع ارائه
              <select
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                value={values.deliveryType || "InClinic"}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, deliveryType: e.target.value }))
                }
              >
                <option value="InClinic">حضوری در کلینیک</option>
                <option value="OnSite">ویزیت در محل</option>
                <option value="Remote">آنلاین</option>
              </select>
            </label>
          </div>

          <label className="text-sm font-medium text-slate-600">
            توضیحات
            <textarea
              className="mt-2 min-h-[90px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-primary"
              value={values.description || ""}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-600">
              قیمت پایه (تومان)
              <input
                type="number"
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                value={values.basePrice ?? ""}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    basePrice: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              />
            </label>
            <label className="text-sm font-medium text-slate-600">
              مدت‌زمان (دقیقه)
              <input
                type="number"
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                value={values.durationMinutes ?? ""}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    durationMinutes: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-600">
              زیرخدمتِ
              <select
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                value={values.parentServiceId || ""}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    parentServiceId: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              >
                <option value="">بدون والد</option>
                {parentOptions.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-col justify-center gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={values.isActive ?? true}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />
                فعال
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={values.isInPerson ?? true}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, isInPerson: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />
                حضوری (پرچم legacy)
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={values.requiresDoctor ?? false}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      requiresDoctor: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />
                نیاز به پزشک
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex h-11 rounded-2xl bg-linear-to-l from-red-600 to-red-500 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-xl hover:shadow-blue-500/40 hover:from-red-700 hover:to-red-600"
              onClick={onClose}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              className="h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 px-10 text-sm font-semibold text-white shadow-lg shadow-blue-600/30"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "در حال ذخیره..."
                : initialValues
                ? "ذخیره تغییرات"
                : "ثبت خدمت"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
