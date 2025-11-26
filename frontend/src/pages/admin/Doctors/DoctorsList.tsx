import { Plus, Edit, Trash2, Search, Users2, Stethoscope } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import AddDoctorDialog, { type AddDoctorFormValues } from "./AddDoctorDialog";
import DataTable from "../../../components/DataTable";
import { providerService, type Provider } from "../../../api/services/providerService";
import { specialtyService, type Specialty } from "../../../api/services/specialtyService";
import { Button } from "../../../components/ui/button";

const Doctors = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<number | undefined>();
  const queryClient = useQueryClient();

  // Fetch specialties for filter dropdown
  const { data: specialties = [] } = useQuery<Specialty[]>({
    queryKey: ["specialties"],
    queryFn: () => specialtyService.getAll(),
  });

  // Fetch providers with filters
  const { data: providers = [], isLoading, error } = useQuery<Provider[]>({
    queryKey: ["providers", searchTerm, selectedSpecialtyId],
    queryFn: () => providerService.getAll(searchTerm, selectedSpecialtyId, undefined, true),
  });

  // Create provider mutation
  const createMutation = useMutation({
    mutationFn: providerService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      toast.success("پزشک با موفقیت اضافه شد");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "خطا در افزودن پزشک");
    },
  });

  // Delete provider mutation
  const deleteMutation = useMutation({
    mutationFn: providerService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      toast.success("پزشک با موفقیت حذف شد");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "خطا در حذف پزشک");
    },
  });

  const handleAddDoctor = (form: AddDoctorFormValues) => {
    if (!form.userId) {
      toast.error("شناسه کاربر (UserId) الزامی است");
      return;
    }

    createMutation.mutate({
      userId: form.userId,
      clinicId: form.clinicId || undefined,
      specialtyId: form.specialtyId || undefined,
      degree: form.degree || undefined,
      experienceYears: form.experienceYears || undefined,
      sharePercent: form.sharePercent || undefined,
      isActive: form.isActive,
    });

    setIsAddOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("آیا از حذف این پزشک اطمینان دارید؟")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "fullName",
        header: "پزشک",
        sortable: true,
        accessor: (row: Provider) => `${row.userFirstName || ""} ${row.userLastName || ""}`,
        cell: (_: unknown, row: Provider) => (
          <div>
            <div className="text-sm font-medium text-gray-900">
              {row.userFirstName} {row.userLastName}
            </div>
            <div className="text-sm text-gray-500">
              {row.userEmail || "-"}
            </div>
          </div>
        ),
      },
      {
        key: "specialtyName",
        header: "تخصص",
        sortable: true,
        accessor: (row: Provider) => row.specialtyName || "-",
        cell: (value: unknown) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {String(value)}
          </span>
        ),
      },
      {
        key: "clinicName",
        header: "کلینیک",
        accessor: (row: Provider) => row.clinicName || "-",
        cell: (value: unknown) => (
          <div className="text-sm text-gray-500">{String(value)}</div>
        ),
      },
      {
        key: "experienceYears",
        header: "سابقه",
        accessor: (row: Provider) => row.experienceYears ? `${row.experienceYears} سال` : "-",
        cell: (value: unknown) => (
          <div className="text-sm text-gray-600">{String(value)}</div>
        ),
      },
      {
        key: "isActive",
        header: "وضعیت",
        accessor: (row: Provider) => (row.isActive ? "فعال" : "غیرفعال"),
        cell: (_: unknown, row: Provider) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
              }`}
          >
            {row.isActive ? "فعال" : "غیرفعال"}
          </span>
        ),
      },
      {
        key: "actions",
        header: "عملیات",
        accessor: () => null,
        cell: (_: unknown, row: Provider) => (
          <div className="flex gap-1.5">
            <button
              className="text-indigo-600 hover:text-indigo-900"
              title="ویرایش"
              onClick={() => toast.info("ویرایش به زودی اضافه خواهد شد")}
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              className="text-red-600 hover:text-red-900"
              title="حذف"
              onClick={() => handleDelete(row.id)}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ),
      },
    ],
    [handleDelete]
  );

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        خطا در بارگذاری اطلاعات پزشکان
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-slate-100 bg-white px-6 py-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold text-primary-600">
              <Stethoscope className="h-4 w-4" />
              شبکه پزشکان
            </p>
            <h1 className="text-3xl font-black text-slate-900">مدیریت پزشکان و پرسنل</h1>
            <p className="text-sm text-slate-500">
              اطلاعات تخصص، وضعیت و کلینیک مرتبط را به‌روز نگه دارید.
            </p>
            <div className="flex gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <Users2 className="h-4 w-4 text-sky-500" />
                {providers.length} پزشک ثبت‌شده
              </span>
              <span className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-emerald-500" />
                {specialties.length} تخصص
              </span>
            </div>
          </div>
          <Button
            className="h-12 rounded-2xl bg-gradient-to-l from-primary-600 to-primary-400 px-8 text-sm font-semibold text-white shadow-lg shadow-primary/30"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus className="ml-2 h-4 w-4" />
            افزودن پزشک
          </Button>
        </div>
      </section>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 rounded-[24px] border border-slate-100 bg-white/90 p-5 shadow-sm sm:flex-row">
        <div className="relative flex flex-1 items-center">
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="جستجوی نام، ایمیل یا تخصص..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 pr-12 pl-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <select
          value={selectedSpecialtyId || ""}
          onChange={(e) => setSelectedSpecialtyId(e.target.value ? Number(e.target.value) : undefined)}
          className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-600 outline-none focus:border-primary sm:w-64"
        >
          <option value="">همه تخصص‌ها</option>
          {specialties.map((specialty) => (
            <option key={specialty.id} value={specialty.id}>
              {specialty.name}
            </option>
          ))}
        </select>
      </div>

      <div className="px-0">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">در حال بارگذاری...</div>
        ) : (
          <DataTable
            data={providers}
            columns={columns}
            rowKey={(row) => String((row as Provider).id)}
          />
        )}
      </div>

      <AddDoctorDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddDoctor}
      />
    </div>
  );
};

export default Doctors;
