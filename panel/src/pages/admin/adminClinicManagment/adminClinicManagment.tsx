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
import { userService, type User } from "@/api/services/userService";

const AdminManagment = () => {
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
      toast.success("شخص جدید ثبت شد");
    },
    onError: (error: any) => {
      let errorMessage = "ثبت شخص با خطا مواجه شد";

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

  const { data: clinicManagers = [] } = useQuery<any[]>({
    queryKey: ["clinic-managers", clinicId],
    queryFn: () =>
      clinicId
        ? clinicService.getClinicManagers(clinicId)
        : Promise.resolve([]),
    enabled: !!clinicId,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const { data: users = [], refetch: refetchUsers } = useQuery<User[]>({
    queryKey: ["users", searchTerm],
    queryFn: () => userService.getAll(searchTerm),
    enabled: true,
  });

  const [supportedSet, setSupportedSet] = useState<Set<number>>(new Set());
  const [originalSupportedSet, setOriginalSupportedSet] = useState<Set<number>>(
    new Set()
  );
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!clinicId) return;
    const ids = new Set(clinicManagers.map((i) => i.id));
    setSupportedSet(ids);
    setOriginalSupportedSet(new Set(ids));
    setDirty(false);
  }, [clinicManagers, clinicId]);

  const setClinicInsurances = useMutation({
    mutationFn: (ids: number[]) =>
      clinicService.setClinicManagers(clinicId!, ids),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["clinic-managers", clinicId],
      });
      setOriginalSupportedSet(new Set(supportedSet));
      setDirty(false);
      toast.success("مدیران کلینیک به‌روز شد");
    },
    onError: () => {
      toast.error("خطا در ذخیره مدیران کلینیک");
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
          </div>
          <Button
            className="h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-colors"
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            <Plus className="ml-2 h-4 w-4" />
            افزودن شخص
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
        <div className="mb-4 flex items-center justify-between">
          <div className="w-1/2">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجوی نام یا تلفن"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <Button
              className="h-10 rounded-xl bg-slate-100 px-3 text-sm"
              onClick={() => refetchUsers()}
            >
              جستجو
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-right">
            <thead>
              <tr className="text-xs text-slate-500">
                <th className="px-3 py-2">انتخاب</th>
                <th className="px-3 py-2">نام و نام‌خانوادگی</th>
                <th className="px-3 py-2">تلفن</th>
                <th className="px-3 py-2">نقش</th>
                <th className="px-3 py-2">فعال</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={supportedSet.has(u.id)}
                      onChange={() => {
                        const newSet = new Set(supportedSet);
                        if (newSet.has(u.id)) newSet.delete(u.id);
                        else newSet.add(u.id);
                        setSupportedSet(newSet);
                        setDirty(true);
                      }}
                    />
                  </td>
                  <td className="px-3 py-2">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-3 py-2">{u.phone}</td>
                  <td className="px-3 py-2">{u.role}</td>
                  <td className="px-3 py-2">{u.isActive ? "بله" : "خیر"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default AdminManagment;
