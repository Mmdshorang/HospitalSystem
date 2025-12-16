import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Stethoscope, Search, Plus, Trash, Edit } from "lucide-react";
import {
  serviceService,
  type Service,
  type CreateServiceDto,
} from "../../../api/services/serviceService";
import {
  serviceCategoryService,
  type ServiceCategory,
} from "../../../api/services/serviceCategoryService";
import DataTable, { type DataTableColumn } from "../../../components/DataTable";
import { Button } from "../../../components/ui/button";
import { EmptyState } from "../../../components/states/EmptyState";
import { PageLoader } from "../../../components/states/PageLoader";
import { ServiceFormDialog } from "./ServiceFormDialog";

const ServicesList = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["services", search, categoryFilter],
    queryFn: () =>
      serviceService.getAll(search || undefined, categoryFilter || undefined),
  });

  const { data: categories = [] } = useQuery<ServiceCategory[]>({
    queryKey: ["service-categories"],
    queryFn: () => serviceCategoryService.getAll(),
  });

  const createService = useMutation({
    mutationFn: (payload: CreateServiceDto) => serviceService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      await queryClient.refetchQueries({ queryKey: ["services"] });
      toast.success("خدمت جدید ثبت شد");
    },
    onError: (error: any) => {
      let errorMessage = "ثبت خدمت با خطا روبه‌رو شد";

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

  const deleteService = useMutation({
    mutationFn: (id: number) => serviceService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("خدمت حذف شد");
    },
    onError: () => toast.error("حذف خدمت انجام نشد"),
  });

  const updateService = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateServiceDto }) =>
      serviceService.update(id, { ...payload, id }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("خدمت با موفقیت به‌روزرسانی شد");
    },
    onError: () => toast.error("به‌روزرسانی انجام نشد"),
  });

  const columns: DataTableColumn<Service>[] = [
    {
      key: "name",
      header: "نام خدمت",
      accessor: (s) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{s.name}</div>
          <div className="text-sm text-gray-500">{s.description}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "category",
      header: "دسته‌بندی",
      accessor: (s) => s.categoryName || "-",
      sortable: true,
      className: "text-sm text-gray-500",
    },
    {
      key: "basePrice",
      header: "قیمت پایه",
      accessor: (s) =>
        s.basePrice ? `${s.basePrice.toLocaleString()} تومان` : "-",
      sortable: true,
      className: "text-sm text-gray-500",
    },
    {
      key: "durationMinutes",
      header: "مدت زمان",
      accessor: (s) => (s.durationMinutes ? `${s.durationMinutes} دقیقه` : "-"),
      sortable: true,
      className: "text-sm text-gray-500",
    },
    {
      key: "parentService",
      header: "زیرخدمتِ",
      accessor: (s) => s.parentServiceName || "-",
      sortable: true,
      className: "text-sm text-gray-500",
    },
    {
      key: "deliveryType",
      header: "نوع ارائه",
      accessor: (s) =>
        s.deliveryType === "Remote"
          ? "آنلاین"
          : s.deliveryType === "OnSite"
          ? "در محل"
          : "حضوری",
      className: "text-sm text-gray-500",
    },
    {
      key: "type",
      header: "ویژگی",
      accessor: (s) => (
        <div className="flex flex-wrap gap-2">
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            {s.isInPerson ? "حضوری" : "غیرحضوری"}
          </span>
          {s.requiresDoctor && (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
              نیاز به پزشک
            </span>
          )}
        </div>
      ),
    },
    {
      key: "active",
      header: "وضعیت",
      accessor: (s) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            s.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
          }`}
        >
          {s.isActive ? "فعال" : "غیرفعال"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "اقدام",
      accessor: (s) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingService(s);
              setIsDialogOpen(true);
            }}
            className="text-blue-600 hover:text-blue-900"
            title="ویرایش"
          >
            <Edit className="w-5" />
          </button>
          <button
            onClick={() => {
              if (confirm("آیا از حذف خدمت مطمئن هستید؟")) {
                deleteService.mutate(s.id);
              }
            }}
            className="text-red-600 hover:text-red-900"
            title="حذف"
          >
            <Trash className="w-5" />
          </button>
        </div>
      ),
      className: "text-sm font-medium",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-100 bg-white px-8 py-10 shadow-sm shadow-slate-200/60">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1 text-xs font-semibold text-primary-600">
              <Stethoscope className="h-4 w-4" />
              مدیریت خدمات
            </span>
            <h2 className="text-3xl font-black text-slate-900">فهرست خدمات</h2>
            <p className="text-sm text-slate-500">
              خدمات و زیرخدمات را به همراه وضعیت فعال/غیرفعال مدیریت کنید.
            </p>
          </div>
          <Button
            className="flex h-12 rounded-2xl bg-linear-to-l from-blue-600 to-blue-500 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-600"
            onClick={() => {
              setEditingService(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="ml-2 h-4 w-4" />
            افزودن خدمت
          </Button>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-100 bg-white/90 p-6 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              className="h-12 flex-1 border-0 bg-transparent text-sm outline-none"
              placeholder="جستجو در نام خدمت..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={categoryFilter || ""}
            onChange={(e) =>
              setCategoryFilter(e.target.value ? Number(e.target.value) : null)
            }
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-primary"
          >
            <option value="">همه دسته‌بندی‌ها</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : services.length === 0 ? (
          <EmptyState
            title="خدمتی یافت نشد"
            description="برای شروع یک خدمت جدید اضافه کنید."
          />
        ) : (
          <DataTable<Service>
            data={services}
            columns={columns}
            rowKey={(r) => String(r.id)}
            initialPageSize={10}
          />
        )}
      </section>

      <ServiceFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialValues={editingService ?? undefined}
        allServices={services}
        onSubmit={(values) =>
          (editingService
            ? updateService
                .mutateAsync({ id: editingService.id, payload: values })
                .then(() => setEditingService(null))
            : createService.mutateAsync(values)
          ).then(() => setIsDialogOpen(false))
        }
      />
    </div>
  );
};

export default ServicesList;
