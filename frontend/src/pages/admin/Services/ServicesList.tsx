import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Stethoscope, Search, Plus, Trash } from "lucide-react";
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
      let errorMessage = "ثبت خدمت با خطا مواجه شد";

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
    onError: () => toast.error("حذف خدمت ممکن نشد"),
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
      key: "type",
      header: "نوع",
      accessor: (s) => (
        <div>
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            {s.isInPerson ? "حضوری" : "آنلاین"}
          </span>
          {s.requiresDoctor && (
            <span className="mr-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
              نیاز به پزشک
            </span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "عملیات",
      accessor: (s) => (
        <button
          onClick={() => {
            if (confirm("آیا از حذف این خدمت مطمئن هستید؟")) {
              deleteService.mutate(s.id);
            }
          }}
          className="text-red-600 hover:text-red-900"
        >
          <Trash className="w-5" />
        </button>
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
              خدمات درمانی
            </span>
            <h2 className="text-3xl font-black text-slate-900">مدیریت خدمات</h2>
            <p className="text-sm text-slate-500">
              تعریف و مدیریت خدمات ارائه شده در کلینیک‌ها.
            </p>
          </div>
          <Button
            className="flex h-12 rounded-2xl bg-linear-to-l from-blue-600 to-blue-500 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-600"
            onClick={() => setIsDialogOpen(true)}
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
              placeholder="جستجو بر اساس نام..."
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
            description="برای افزودن خدمت جدید از دکمه بالا استفاده کنید."
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
        onSubmit={(values) =>
          createService.mutateAsync(values).then(() => setIsDialogOpen(false))
        }
      />
    </div>
  );
};

export default ServicesList;
