import { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { InsuranceFormDialog } from "../Insurances/InsuranceFormDialog";
import { useNavigate, useParams } from "react-router-dom";
import {
  insuranceService,
  type CreateInsuranceDto,
  type Insurance,
} from "@/api/services/insuranceService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  clinicService,
  type Clinic,
} from "../../../api/services/clinicService";

const InsurancesManagment = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedInsurance, setSelectedInsurance] = useState<Insurance | null>(
    null
  );
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const clinicId = id ? Number(id) : null;

  const createInsurance = useMutation({
    mutationFn: (payload: CreateInsuranceDto) =>
      insuranceService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["insurances"] });
      await queryClient.refetchQueries({ queryKey: ["insurances"] });
      toast.success("بیمه جدید ثبت شد");
    },
    onError: (error: any) => {
      let errorMessage = "ثبت بیمه با خطا مواجه شد";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (
        error?.response?.data?.errors &&
        Array.isArray(error.response.data.errors) &&
        error.response.data.errors.length > 0
      ) {
        errorMessage = error.response.data.errors.join(", ");
      }

      toast.error(errorMessage);
    },
  });

  const { data: clinic, isLoading: isLoadingClinic } = useQuery<Clinic>({
    queryKey: ["clinic", clinicId],
    queryFn: () => clinicService.getById(clinicId!),
    enabled: !!clinicId,
  });

  const { data: insurances = [] } = useQuery<Insurance[]>({
    queryKey: ["insurances"],
    queryFn: () => insuranceService.getAll(undefined, true),
  });

  const { data: clinicInsurances = [] } = useQuery<Insurance[]>({
    queryKey: ["clinic-insurances", clinicId],
    queryFn: () =>
      clinicId
        ? clinicService.getClinicInsurances(clinicId)
        : Promise.resolve([]),
    enabled: !!clinicId,
  });

  const [supportedSet, setSupportedSet] = useState<Set<number>>(new Set());
  const [originalSupportedSet, setOriginalSupportedSet] = useState<Set<number>>(
    new Set()
  );
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!clinicId) return;
    const ids = new Set(clinicInsurances.map((i) => i.id));
    setSupportedSet(ids);
    setOriginalSupportedSet(new Set(ids));
    setDirty(false);
  }, [clinicInsurances, clinicId]);

  const setClinicInsurances = useMutation({
    mutationFn: (ids: number[]) =>
      clinicService.setClinicInsurances(clinicId!, ids),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["clinic-insurances", clinicId],
      });
      setOriginalSupportedSet(new Set(supportedSet));
      setDirty(false);
      toast.success("بیمه‌های کلینیک به‌روز شد");
    },
    onError: () => {
      toast.error("خطا در ذخیره بیمه‌های کلینیک");
    },
  });

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-100 bg-white px-6 py-10 shadow-sm shadow-slate-200/60">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3 text-right">
            <button
              onClick={() => navigate("/admin/clinics")}
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 transition"
            >
              <ArrowRight className="h-4 w-4" />
              بازگشت به لیست کلینیک‌ها
            </button>
            <h2 className="text-3xl font-black text-slate-900">
              {clinic?.name || "کلینیک"}
            </h2>
            <p className="text-sm text-slate-500">
              مدیریت خدمات ارائه شده در این کلینیک
            </p>
          </div>
          <Button
            className="h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-colors"
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            <Plus className="ml-2 h-4 w-4" />
            افزودن بیمه
          </Button>
        </div>
          {clinicId && dirty && (
            <div className="flex items-center gap-2 mt-5">
              <Button
                className="h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition-colors"
                onClick={() =>
                  setClinicInsurances.mutate(Array.from(supportedSet))
                }
              >
                ذخیره تغییرات
              </Button>
              <Button
                className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 px-4 text-sm font-semibold text-slate-700 shadow-sm transition-colors"
                onClick={() => {
                  setSupportedSet(new Set(originalSupportedSet));
                  setDirty(false);
                }}
              >
                لغو
              </Button>
            </div>
          )}
      </section>

      <section className="rounded-[28px] border border-slate-100 bg-white/90 p-6 shadow-sm shadow-slate-200/50">
        {
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {insurances.map((insurance) => (
              <article
                key={insurance.id}
                className="rounded-3xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-slate-900">
                        {insurance.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-400">
                      {clinicId ? (
                        <>
                          <span>
                            {supportedSet.has(insurance.id)
                              ? "پشتیبانی"
                              : "پشتیبانی‌نشده"}
                          </span>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300"
                            checked={supportedSet.has(insurance.id)}
                            onChange={() => {
                              const newSet = new Set(supportedSet);
                              if (newSet.has(insurance.id))
                                newSet.delete(insurance.id);
                              else newSet.add(insurance.id);
                              setSupportedSet(newSet);
                              setDirty(true);
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <span>{insurance.isActive ? "فعال" : "غیرفعال"}</span>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300"
                            checked={insurance.isActive}
                          />
                        </>
                      )}
                    </label>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  {insurance.description}
                </p>
                <div className="mt-5 rounded-2xl bg-white/80 p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>درصد پوشش</span>
                    <span>{insurance.coveragePercent}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-emerald-500 to-emerald-300"
                      style={{ width: `${insurance.coveragePercent}%` }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        }
      </section>

      <InsuranceFormDialog
        open={isDialogOpen}
        initialValues={
          selectedInsurance
            ? {
                name: selectedInsurance.name,
                description: selectedInsurance.description,
                coveragePercent: selectedInsurance.coveragePercent,
                isActive: selectedInsurance.isActive,
              }
            : undefined
        }
        title={selectedInsurance ? "ویرایش بیمه" : undefined}
        submitLabel={selectedInsurance ? "ذخیره تغییرات" : undefined}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedInsurance(null);
        }}
        onSubmit={async (values) => {
          try {
            await createInsurance.mutateAsync(values);
            setIsDialogOpen(false);
          } catch (error) {
            // error is already toasted in mutation onError, keep dialog open
            console.error("Insurance submit error", error);
          }
        }}
      />
    </div>
  );
};

export default InsurancesManagment;
