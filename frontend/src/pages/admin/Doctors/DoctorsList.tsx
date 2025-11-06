import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import AddDoctorDialog, { type AddDoctorFormValues } from "./AddDoctorDialog";
import DataTable from "../../../components/DataTable";
import { providerService, type Provider } from "../../../api/services/providerService";
import { specialtyService, type Specialty } from "../../../api/services/specialtyService";

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
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              row.isActive
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
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">پزشکان</h1>
          <p className="mt-2 text-gray-600">مدیریت پروفایل و اطلاعات پزشکان</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            className="btn btn-primary inline-flex items-center"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus className="h-4 w-4 ml-2" />
            افزودن پزشک
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="جستجو بر اساس نام، ایمیل یا تخصص..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pr-10 w-full"
          />
        </div>
        <select
          value={selectedSpecialtyId || ""}
          onChange={(e) => setSelectedSpecialtyId(e.target.value ? Number(e.target.value) : undefined)}
          className="input w-full sm:w-64"
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
