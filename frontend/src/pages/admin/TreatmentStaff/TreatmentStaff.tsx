import { Plus, Edit, Trash2, Search, Users2, Stethoscope } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import AddDoctorDialog, { type AddDoctorFormValues } from "./AddTreatmentStaffDialog";
import DataTable from "../../../components/DataTable";
import { providerService, type Provider } from "../../../api/services/providerService";
import { specialtyService, type Specialty } from "../../../api/services/specialtyService";
import { clinicService, type Clinic } from "../../../api/services/clinicService";
import { authService } from "../../../api/services/authService";
import { Button } from "../../../components/ui/button";

const TreatmentStaff = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<number | undefined>();
  const [selectedClinicId, setSelectedClinicId] = useState<number | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'true' | 'false'>('all');
  const queryClient = useQueryClient();

  // Fetch specialties for filter dropdown
  const { data: specialties = [] } = useQuery<Specialty[]>({
    queryKey: ["specialties"],
    queryFn: () => specialtyService.getAll(),
  });

  // Fetch clinics for filter dropdown
  const { data: clinics = [] } = useQuery<Clinic[]>({
    queryKey: ["clinics"],
    queryFn: () => clinicService.getAll(),
  });

  // Fetch providers with filters
  const { data: providers = [], isLoading, error } = useQuery<Provider[]>({
    queryKey: ["providers", searchTerm, selectedSpecialtyId, selectedClinicId, selectedStatus],
    queryFn: async () => {
      try {
        const result = await providerService.getAll(
          searchTerm,
          selectedSpecialtyId,
          selectedClinicId,
          selectedStatus === 'all' ? undefined : selectedStatus === 'true'
        );
        console.log("Providers fetched:", result);
        return result;
      } catch (err) {
        console.error("Error fetching providers:", err);
        throw err;
      }
    },
  });

  // Create provider mutation
  const createMutation = useMutation({
    mutationFn: providerService.create,
    onSuccess: () => {
      // Invalidate all provider queries to refresh the list (including filtered queries)
      queryClient.invalidateQueries({
        queryKey: ["providers"],
        exact: false // This will invalidate all queries that start with ["providers"]
      });
      toast.success("کادر درمانی با موفقیت اضافه شد");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "خطا در افزودن کادر درمانی");
    },
  });

  // Delete provider mutation
  const deleteMutation = useMutation({
    mutationFn: providerService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      toast.success("کادر درمانی با موفقیت حذف شد");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "خطا در حذف کادر درمانی");
    },
  });

  const handleAddDoctor = async (form: AddDoctorFormValues) => {
    // Save current admin token to restore it later
    const currentToken = authService.getToken();

    try {
      // First, create the User with doctor role
      const registerResponse = await authService.register({
        phone: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
        firstName: form.firstName,
        lastName: form.lastName,
        nationalCode: form.nationalId || undefined,
        role: "doctor",
      });

      // Restore the admin token (register overwrites it)
      if (currentToken) {
        localStorage.setItem("authToken", currentToken);
      }

      // Then, create the Provider using the created User's ID
      await createMutation.mutateAsync({
        userId: registerResponse.user.id,
        clinicId: form.clinicId || undefined,
        specialtyId: form.specialtyId || undefined,
        degree: form.degree || undefined,
        experienceYears: form.experienceYears || undefined,
        isActive: form.isActive,
      });

      setIsAddOpen(false);
    } catch (error: any) {
      // Restore the admin token in case of error
      if (currentToken) {
        localStorage.setItem("authToken", currentToken);
      }
      toast.error(error.response?.data?.message || "خطا در ایجاد کاربر یا کادر درمانی");
      // Re-throw so the dialog stays open for corrections
      throw error;
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("آیا از حذف این کادر درمانی اطمینان دارید؟")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "fullName",
        header: "کادر درمانی",
        sortable: true,
        accessor: (row: Provider) => `${row.userFirstName || ""} ${row.userLastName || ""}`,
        cell: (_: unknown, row: Provider) => (
          <div>
            <div className="text-sm font-medium text-gray-900">
              {row.userFirstName} {row.userLastName}
            </div>
            <div className="text-sm text-gray-500">
              {row.userPhone || "-"}
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
              className="rounded-lg p-1.5 text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
              title="ویرایش"
              onClick={() => toast.info("ویرایش به زودی اضافه خواهد شد")}
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              className="rounded-lg p-1.5 text-red-600 transition hover:bg-red-50 hover:text-red-700"
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
    console.error("Providers query error:", error);
    return (
      <div className="p-4 text-center text-red-600">
        خطا در بارگذاری اطلاعات کادر درمانی: {error instanceof Error ? error.message : "خطای نامشخص"}
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
              شبکه کادر درمانی
            </p>
            <h1 className="text-3xl font-black text-slate-900">مدیریت کادر درمانی</h1>
            <p className="text-sm text-slate-500">
              اطلاعات کادر درمان، وضعیت و کلینیک مرتبط را به‌روز نگه دارید.
            </p>
            <div className="flex gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <Users2 className="h-4 w-4 text-sky-500" />
                {providers.length} کادر درمانی ثبت‌شده
              </span>
              {/* <span className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-emerald-500" />
                {specialties.length} تخصص
              </span> */}
            </div>
          </div>
          <Button
            className="h-12 rounded-2xl bg-linear-to-l from-blue-600 to-blue-500 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-600"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus className="ml-2 h-4 w-4" />
            افزودن کادر درمانی
          </Button>
        </div>
      </section>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 rounded-[24px] border border-slate-100 bg-white/90 p-5 shadow-sm sm:flex-row">
        <div className="relative flex flex-1 items-center">
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="جستجوی نام، شماره یا تخصص..."
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
        <select
          value={selectedClinicId || ""}
          onChange={(e) => setSelectedClinicId(e.target.value ? Number(e.target.value) : undefined)}
          className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-600 outline-none focus:border-primary sm:w-64"
        >
          <option value="">همه کلینیک‌ها</option>
          {clinics.map((clinic) => (
            <option key={clinic.id} value={clinic.id}>
              {clinic.name}
            </option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'true' | 'false')}
          className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-600 outline-none focus:border-primary sm:w-64"
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="true">فعال</option>
          <option value="false">غیرفعال</option>
        </select>
      </div>

      <div className="px-0">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">در حال بارگذاری...</div>
        ) : providers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            هیچ کادر درمانی ثبت نشده است.
          </div>
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

export default TreatmentStaff;
