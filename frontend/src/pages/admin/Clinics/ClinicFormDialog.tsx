import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import type {
  CreateClinicDto,
  CreateClinicAddress,
  Clinic,
} from "../../../api/services/clinicService";
import { Button } from "../../../components/ui/button";
import MultiSelect from "@/components/ui/multiSelect";

interface ClinicFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateClinicDto) => Promise<void> | void;
  initialValues?: Clinic | null;
}

const defaultAddress: CreateClinicAddress = {
  street: "",
  city: "",
  state: "",
  postalCode: "",
};

const defaultValues: CreateClinicDto = {
  name: "",
  phone: "",
  isActive: true,
  managerId: undefined,
  logoUrl: "",
};

export const ClinicFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialValues,
}: ClinicFormDialogProps) => {
  const [values, setValues] = useState<CreateClinicDto>(defaultValues);
  const [address, setAddress] = useState<CreateClinicAddress>(defaultAddress);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    field: keyof CreateClinicDto,
    value: string | number | boolean | undefined
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleAddressChange = (
    field: keyof CreateClinicAddress,
    value: string
  ) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const prepareDataForSubmission = (): CreateClinicDto => {
    const trimmedName = values.name?.trim() || "";
    const trimmedPhone = values.phone?.trim();

    const data: CreateClinicDto = {
      name: trimmedName,
      isActive: values.isActive ?? true,
    };

    if (trimmedPhone) data.phone = trimmedPhone;
    if (values.managerId) data.managerId = values.managerId;
    if (values.logoUrl) data.logoUrl = values.logoUrl;
    if (values.workHours && values.workHours.length > 0) {
      data.workHours = values.workHours;
    }

    const hasAddress =
      address.street?.trim() ||
      address.city?.trim() ||
      address.state?.trim() ||
      address.postalCode?.trim() ||
      address.country?.trim();

    if (hasAddress) {
      const addressToSubmit: CreateClinicAddress = {};
      if (address.street?.trim())
        addressToSubmit.street = address.street.trim();
      if (address.city?.trim()) addressToSubmit.city = address.city.trim();
      if (address.state?.trim()) addressToSubmit.state = address.state.trim();
      if (address.postalCode?.trim())
        addressToSubmit.postalCode = address.postalCode.trim();
      if (address.country?.trim())
        addressToSubmit.country = address.country.trim();

      data.addresses = [addressToSubmit];
    }

    return data;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!values.name || !values.name.trim()) {
      setError("نام کلینیک الزامی است");
      return;
    }

    setIsSubmitting(true);

    try {
      const dataToSubmit = prepareDataForSubmission();
      await onSubmit(dataToSubmit);
      setValues(defaultValues);
      setAddress(defaultAddress);
      setError(null);
      onClose();
    } catch (error: any) {
      let errorMessage = "ثبت انجام نشد";

      if (error?.response?.data) {
        const data = error.response.data;
        if (
          data.errors &&
          Array.isArray(data.errors) &&
          data.errors.length > 0
        ) {
          errorMessage = data.errors.join(", ");
        } else if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === "string") {
          errorMessage = data;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (open && initialValues) {
      setValues({
        name: initialValues.name || "",
        phone: initialValues.phone || "",
        isActive: initialValues.isActive,
        managerId: initialValues.managerId,
        logoUrl: initialValues.logoUrl,
      });

      if (initialValues.addresses && initialValues.addresses.length > 0) {
        const a = initialValues.addresses[0];
        setAddress({
          street: a.street || "",
          city: a.city || "",
          state: a.state || "",
          postalCode: a.postalCode || "",
          country: a.country || "",
        });
      } else {
        setAddress(defaultAddress);
      }
    }

    if (!open) {
      setValues(defaultValues);
      setAddress(defaultAddress);
      setError(null);
    }
  }, [open, initialValues]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-2 sm:px-4 backdrop-blur overflow-y-auto py-4">
      <div className="relative w-full max-w-3xl max-h-[95vh] rounded-2xl sm:rounded-[32px] bg-white p-4 sm:p-6 md:p-8 shadow-2xl my-auto">
        <button
          className="absolute left-3 top-3 sm:left-6 sm:top-6 rounded-full border border-slate-100 p-2 text-slate-500 transition hover:text-slate-900 z-10"
          onClick={onClose}
          type="button"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <div className="space-y-1 text-right pr-0 sm:pr-0">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            {initialValues ? "ویرایش کلینیک" : "افزودن کلینیک جدید"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            {initialValues ? "ویرایش اطلاعات" : "اطلاعات کلینیک را وارد کنید"}
          </p>
        </div>
        <form
          className="mt-4 sm:mt-6 md:mt-8 space-y-4 overflow-y-auto max-h-[calc(95vh-180px)] pr-1"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-600 mb-2">
                نام کلینیک
              </label>
              <input
                className={`h-12 w-full rounded-2xl border px-4 text-sm outline-none focus:border-primary ${
                  error && !values.name?.trim()
                    ? "border-red-300"
                    : "border-slate-200"
                }`}
                value={values.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-600 mb-2">
                تلفن تماس
              </label>
              <input
                type="tel"
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                value={values.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                maxLength={11}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-600 mb-2">
                مدیر
              </label>
              <select
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                value={values.managerId ?? ""}
                onChange={(e) =>
                  handleChange(
                    "managerId",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-600 mb-2">
                لوگو (URL)
              </label>
              <input
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                value={values.logoUrl || ""}
                onChange={(e) => handleChange("logoUrl", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-600 mb-2">
                بیمه‌ها
              </label>
              <MultiSelect />
            </div>
          </div>
          {/* Address Section */}
          <div className="space-y-4 pt-2 border-slate-200">
            {/* <h4 className="text-base font-semibold text-slate-900">
              آدرس کلینیک
            </h4> */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-2">
                  استان
                </label>
                <input
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                  value={address.state || ""}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-2">
                  شهر
                </label>
                <input
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                  value={address.city || ""}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-2">
                  کد پستی
                </label>
                <input
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                  value={address.postalCode || ""}
                  onChange={(e) =>
                    handleAddressChange("postalCode", e.target.value)
                  }
                  maxLength={10}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-600 mb-2">
                آدرس و خیابان
              </label>
              <input
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary"
                value={address.street || ""}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2 mt-7">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={values.isActive ?? true}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-slate-600"
                >
                  فعال باشد
                </label>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full sm:w-auto rounded-2xl border-slate-200 text-white px-6 text-sm bg-gradient-to-l from-red-600 to-red-500"
                  onClick={onClose}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  className="h-11 w-full sm:w-auto rounded-2xl bg-gradient-to-l from-blue-600 to-blue-500 px-6 sm:px-10 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? initialValues
                      ? "در حال ذخیره..."
                      : "در حال ثبت..."
                    : initialValues
                    ? "ذخیره تغییرات"
                    : "ثبت کلینیک"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
