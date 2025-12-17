import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import moment from "jalali-moment";
import {
  Calendar,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  UserCheck,
  Clock,
  Plus,
} from "lucide-react";
import {
  serviceRequestService,
  type ServiceRequest,
  type RequestStatus,
  type ChangeStatusDto,
} from "../../../api/services/serviceRequestService";
import { clinicService } from "../../../api/services/clinicService";
import { Button } from "../../../components/ui/button";
import { EmptyState } from "../../../components/states/EmptyState";
import { PageLoader } from "../../../components/states/PageLoader";
import { ChangeStatusDialog } from "./ChangeStatusDialog";
import { AppointmentHistoryDialog } from "./AppointmentHistoryDialog";
import { AppointmentFormDialog } from "./AppointmentFormDialog";
import { AssignPerformerDialog } from "./AssignPerformerDialog";
import JalaliDatePicker from "../../../components/DatePicker/DatePicker";
import { formatPersianDateTime } from "../../../lib/utils";


const statusLabels: Record<RequestStatus, string> = {
  pending: "در انتظار",
  approved: "تایید شده",
  in_progress: "در حال انجام",
  done: "انجام شده",
  rejected: "رد شده",
};

const statusColors: Record<RequestStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-blue-100 text-blue-700",
  in_progress: "bg-purple-100 text-purple-700",
  done: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

const toGregorianDate = (jalali: string | null) => {
  if (!jalali) return undefined;
  const m = moment(jalali, "jYYYY/jMM/jDD");
  return m.isValid() ? m.format("YYYY-MM-DD") : undefined;
};

const AppointmentsList = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">(
    "all"
  );
  const [clinicFilter, setClinicFilter] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<ServiceRequest | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isPerformerDialogOpen, setIsPerformerDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: appointmentsData, isLoading } = useQuery({
    queryKey: [
      "appointments",
      page,
      pageSize,
      statusFilter,
      clinicFilter,
      fromDate,
      toDate,
    ],
    queryFn: () =>
      serviceRequestService.getAll(
        page,
        pageSize,
        statusFilter !== "all" ? statusFilter : undefined,
        clinicFilter || undefined,
        undefined,
        undefined,
        toGregorianDate(fromDate) || undefined,
        toGregorianDate(toDate) || undefined,
        "createdAt",
        "desc"
      ),
  });

  const { data: clinics = [] } = useQuery({
    queryKey: ["clinics"],
    queryFn: () => clinicService.getAll(),
  });

  const changeStatus = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: ChangeStatusDto }) =>
      serviceRequestService.changeStatus(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("وضعیت با موفقیت تغییر کرد");
      setIsStatusDialogOpen(false);
      setSelectedAppointment(null);
    },
    onError: () => toast.error("تغییر وضعیت با خطا مواجه شد"),
  });

  const handleStatusChange = (appointment: ServiceRequest) => {
    setSelectedAppointment(appointment);
    setIsStatusDialogOpen(true);
  };

  const handleViewHistory = (appointment: ServiceRequest) => {
    setSelectedAppointment(appointment);
    setIsHistoryDialogOpen(true);
  };

  const handleAssignPerformer = (appointment: ServiceRequest) => {
    setSelectedAppointment(appointment);
    setIsPerformerDialogOpen(true);
  };

  const totalPages = appointmentsData?.totalPages || 0;
  const appointments = appointmentsData?.data || [];

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-100 bg-white px-8 py-10 shadow-sm shadow-slate-200/60">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Calendar className="h-10 w-6" />
              <h2 className="text-3xl font-black text-slate-900">
                نوبت‌ها و درخواست‌ها
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              مدیریت کامل نوبت‌ها، تغییر وضعیت و ردیابی تاریخچه تغییرات.
            </p>
          </div>
          <Button
            className="flex h-12 rounded-2xl bg-linear-to-l from-blue-600 to-blue-500 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-600"
            onClick={() => setIsFormDialogOpen(true)}
          >
           <Plus className="ml-2 h-6 w-5" />
            افزودن نوبت
          </Button>
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-[28px] border border-slate-100 bg-white/90 p-6 shadow-sm shadow-slate-200/50">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              className="h-12 flex-1 border-0 bg-transparent text-sm outline-none"
              placeholder="جستجو..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as RequestStatus | "all")
            }
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-primary"
          >
            <option value="all">همه وضعیت‌ها</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={clinicFilter || ""}
            onChange={(e) =>
              setClinicFilter(e.target.value ? Number(e.target.value) : null)
            }
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-primary"
          >
            <option value="">همه کلینیک‌ها</option>
            {clinics.map((clinic) => (
              <option key={clinic.id} value={clinic.id}>
                {clinic.name}
              </option>
            ))}
          </select>
        </div>
          <div className="flex gap-2 w-[50%] mb-4">
            <JalaliDatePicker
              value={fromDate || null}
              onChange={(val) => setFromDate(val ?? "")}
              placeholder="از تاریخ"
              className="w-full"
              inputClassName="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-primary"
            />
            <JalaliDatePicker
              value={toDate || null}
              onChange={(val) => setToDate(val ?? "")}
              placeholder="تا تاریخ"
              className="w-full"
              inputClassName="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-primary"
            />
          </div>

        {isLoading ? (
          <PageLoader />
        ) : appointments.length === 0 ? (
          <EmptyState
            title="نوبتی یافت نشد"
            description="برای افزودن نوبت جدید از دکمه بالا استفاده کنید."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      بیمار
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      کلینیک
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      خدمت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      انجام‌دهنده
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاریخ/زمان
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      وضعیت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      قیمت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.patientName ||
                          `ID: ${appointment.patientId}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.clinicName || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.serviceName || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.performedByUserName || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.preferredTime
                          ? formatPersianDateTime(appointment.preferredTime)
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            statusColors[appointment.status]
                          }`}
                        >
                          {statusLabels[appointment.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.totalPrice
                          ? `${appointment.totalPrice.toLocaleString()} تومان`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewHistory(appointment)}
                            className="text-blue-600 hover:text-blue-900"
                            title="تاریخچه"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(appointment)}
                            className="text-green-600 hover:text-green-900"
                            title="تغییر وضعیت"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {!appointment.performedByUserId && (
                            <button
                              onClick={() => handleAssignPerformer(appointment)}
                              className="text-purple-600 hover:text-purple-900"
                              title="تعیین انجام‌دهنده"
                            >
                              <UserCheck className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  صفحه {page} از {totalPages} (
                  {appointmentsData?.totalCount || 0} مورد)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="h-10"
                  >
                    <ChevronRight className="h-4 w-4" />
                    قبلی
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="h-10"
                  >
                    بعدی
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Dialogs */}
      {selectedAppointment && (
        <>
          <ChangeStatusDialog
            open={isStatusDialogOpen}
            onClose={() => {
              setIsStatusDialogOpen(false);
              setSelectedAppointment(null);
            }}
            appointment={selectedAppointment}
            onSubmit={(dto) =>
              changeStatus.mutate({ id: selectedAppointment.id, dto })
            }
          />
          <AppointmentHistoryDialog
            open={isHistoryDialogOpen}
            onClose={() => {
              setIsHistoryDialogOpen(false);
              setSelectedAppointment(null);
            }}
            appointmentId={selectedAppointment.id}
          />
          <AssignPerformerDialog
            open={isPerformerDialogOpen}
            onClose={() => {
              setIsPerformerDialogOpen(false);
              setSelectedAppointment(null);
            }}
            appointment={selectedAppointment}
            onSubmit={async (dto) => {
              await serviceRequestService.assignPerformer(
                selectedAppointment.id,
                dto
              );
              queryClient.invalidateQueries({ queryKey: ["appointments"] });
              toast.success("انجام‌دهنده با موفقیت تعیین شد");
              setIsPerformerDialogOpen(false);
              setSelectedAppointment(null);
            }}
          />
        </>
      )}
      <AppointmentFormDialog
        open={isFormDialogOpen}
        onClose={() => setIsFormDialogOpen(false)}
        onSubmit={async (dto) => {
          try {
            await serviceRequestService.create(dto);
            await queryClient.invalidateQueries({ queryKey: ["appointments"] });
            await queryClient.refetchQueries({ queryKey: ["appointments"] });
            toast.success("نوبت با موفقیت ثبت شد");
            setIsFormDialogOpen(false);
          } catch (error: any) {
            let errorMessage = "ثبت نوبت با خطا مواجه شد";

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
            throw error;
          }
        }}
      />
    </div>
  );
};

export default AppointmentsList;
