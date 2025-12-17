import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Shield, Search, Edit, Trash2, Settings, Plus } from "lucide-react";
import {
  clinicService,
  type Clinic,
  type CreateClinicDto,
} from "../../../api/services/clinicService";
import DataTable, { type DataTableColumn } from "../../../components/DataTable";
import { Button } from "../../../components/ui/button";
import { EmptyState } from "../../../components/states/EmptyState";
import { PageLoader } from "../../../components/states/PageLoader";
import { ClinicFormDialog } from "./ClinicFormDialog";

const statusLabels: Record<string, string> = {
  true: "فعال",
  false: "غیرفعال",
};

const statusColors: Record<string, string> = {
  true: "bg-emerald-100 text-emerald-700",
  false: "bg-rose-100 text-rose-700",
};

const ClinicsList = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | string>("all");
  const [city, setCity] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClinicForEdit, setSelectedClinicForEdit] =
    useState<Clinic | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: clinics = [], isLoading } = useQuery<Clinic[]>({
    queryKey: ["clinics", search, city, status],
    queryFn: () =>
      clinicService.getAll(
        search || undefined,
        city || undefined,
        status === "all" ? undefined : status === "true"
      ),
  });

  const createClinic = useMutation({
    mutationFn: (payload: CreateClinicDto) => clinicService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      toast.success("کلینیک جدید ثبت شد");
    },
    onError: () => toast.error("ثبت کلینیک انجام نشد"),
  });

  const updateClinic = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      clinicService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      toast.success("کلینیک به‌روزرسانی شد");
    },
    onError: () => toast.error("ویرایش کلینیک انجام نشد"),
  });

  const deleteClinic = useMutation({
    mutationFn: (id: number) => clinicService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      toast.success("کلینیک حذف شد");
    },
    onError: () => toast.error("حذف کلینیک انجام نشد"),
  });

  const columns: DataTableColumn<Clinic>[] = [
    {
      key: "name",
      header: "نام کلینیک",
      accessor: (clinic) => (
        <div className="text-sm font-semibold text-slate-900">
          {clinic.name}
        </div>
      ),
      sortable: true,
    },
    {
      key: "manager",
      header: "مدیر کلینیک",
      accessor: (clinic) => (
        <div className="text-sm font-semibold text-slate-900">
          {clinic.managerName}
        </div>
      ),
      sortable: true,
    },
    {
      key: "city",
      header: "شهر",
      accessor: (clinic) =>
        clinic.addresses && clinic.addresses.length > 0
          ? clinic.addresses[0].city
          : "—",
      sortable: true,
      className: "text-sm text-slate-600",
    },
    {
      key: "city",
      header: "آدرس",
      accessor: (clinic) =>
        clinic.addresses && clinic.addresses.length > 0
          ? clinic.addresses[0].street
          : "—",
      sortable: true,
      className: "text-sm text-slate-600",
    },
    {
      key: "phone",
      header: "تلفن",
      accessor: (clinic) => clinic.phone || "—",
      sortable: true,
      className: "text-sm text-slate-600",
    },
    {
      key: "status",
      header: "وضعیت",
      accessor: (clinic) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            statusColors[clinic.isActive.toString()]
          }`}
        >
          {statusLabels[clinic.isActive.toString()]}
        </span>
      ),
      sortable: true,
    },
    {
      key: "actions",
      header: "اقدام",
      accessor: (clinic) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/clinics/${clinic.id}/services`)}
            className="text-blue-600 hover:text-blue-800"
            title="مدیریت بیمه ها"
          >
            <Shield className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate(`/admin/clinics/${clinic.id}/services`)}
            className="text-blue-600 hover:text-blue-800"
            title="مدیریت خدمات"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setSelectedClinicForEdit(clinic);
              setIsDialogOpen(true);
            }}
            className="text-slate-700 hover:text-slate-900"
            title="ویرایش"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (confirm("کلینیک حذف شود؟")) {
                deleteClinic.mutate(clinic.id);
              }
            }}
            className="text-rose-600 hover:text-rose-800"
            title="حذف"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const stats = useMemo(() => {
    const active = clinics.filter((clinic) => clinic.isActive).length;
    const inactive = clinics.filter((clinic) => !clinic.isActive).length;
    return [
      { label: "کلینیک فعال", value: `${active}`, chip: "فعال" },
      { label: "غیرفعال", value: `${inactive}`, chip: "خاموش" },
      { label: "کل کلینیک‌ها", value: `${clinics.length}`, chip: "موجود" },
    ];
  }, [clinics]);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-100 bg-white px-8 py-10 shadow-sm shadow-slate-200/60">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-900">
              مدیریت کلینیک‌ها
            </h2>
            <p className="text-sm text-slate-500">
              کلینیک‌ها را در قالب جدول ببینید، ویرایش کنید و خدمات/اعضا را
              مدیریت کنید.
            </p>
            <div className="flex gap-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 px-4 py-3 text-right"
                >
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="text-xl font-black text-slate-900">
                    {item.value}
                  </p>
                  <span className="text-[11px] font-semibold text-emerald-500">
                    {item.chip}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Button
              className="h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-colors"
              onClick={() => {
                setSelectedClinicForEdit(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 ml-2" />
              افزودن کلینیک
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-100 bg-white/90 p-6 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              className="h-12 flex-1 border-0 bg-transparent text-sm outline-none"
              placeholder="جستجو بر اساس نام..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-primary"
              placeholder="شهر..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-primary"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="true">فعال</option>
              <option value="false">غیرفعال</option>
            </select>
            <Button
              variant="outline"
              className="h-11 rounded-2xl border-slate-200 px-5 text-sm text-slate-700"
              onClick={() => {
                setSearch("");
                setCity("");
                setStatus("all");
              }}
            >
              پاک کردن فیلتر
            </Button>
          </div>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : clinics.length === 0 ? (
          <EmptyState
            title="کلینیکی یافت نشد"
            description="کلینیک جدید ثبت کنید."
          />
        ) : (
          <DataTable<Clinic>
            data={clinics}
            columns={columns}
            rowKey={(r) => String(r.id)}
            initialPageSize={10}
          />
        )}
      </section>

      <ClinicFormDialog
        open={isDialogOpen}
        initialValues={selectedClinicForEdit ?? undefined}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedClinicForEdit(null);
        }}
        onSubmit={async (values) => {
          if (selectedClinicForEdit) {
            await updateClinic.mutateAsync({
              id: selectedClinicForEdit.id,
              payload: { ...values, id: selectedClinicForEdit.id },
            });
            setSelectedClinicForEdit(null);
          } else {
            await createClinic.mutateAsync(values);
          }
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
};

export default ClinicsList;
