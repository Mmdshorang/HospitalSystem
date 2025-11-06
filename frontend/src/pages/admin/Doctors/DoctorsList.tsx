import { Plus, Edit, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import AddDoctorDialog, { type AddDoctorFormValues } from "./AddDoctorDialog";
import DataTable from "../../../components/DataTable";

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  phone: string;
  licenseNumber: string;
  isAvailable: boolean;
}

const Doctors = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: "1",
      firstName: "دکتر حسین",
      lastName: "مقدس پور",
      specialization: "قلب و عروق",
      phone: "09123456789",
      licenseNumber: "MD12345",
      isAvailable: true,
    },
    {
      id: "2",
      firstName: "دکتر حسن",
      lastName: "فریدون فر",
      specialization: "مغز و اعصاب",
      phone: "09123456790",
      licenseNumber: "MD67890",
      isAvailable: false,
    },
  ]);

  const handleAddDoctor = (form: AddDoctorFormValues) => {
    const newDoctor: Doctor = {
      id: String(Date.now()),
      firstName: form.firstName,
      lastName: form.lastName,
      specialization: form.specializationName || "-",
      phone: form.phone,
      licenseNumber: form.licenseNumber,
      isAvailable: form.isActive,
    };
    setDoctors((prev) => [newDoctor, ...prev]);
  };

  const columns = useMemo(
    () => [
      {
        key: "fullName",
        header: "پزشک",
        sortable: true,
        accessor: (row: Doctor) => `${row.firstName} ${row.lastName}`,
        cell: (_: unknown, row: Doctor) => (
          <div>
            <div className="text-sm font-medium text-gray-900">
              {row.firstName} {row.lastName}
            </div>
            <div className="text-sm text-gray-500">
              شماره نظام: {row.licenseNumber}
            </div>
          </div>
        ),
      },
      {
        key: "specialization",
        header: "تخصص",
        sortable: true,
        accessor: (row: Doctor) => row.specialization,
        cell: (value: unknown) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {String(value)}
          </span>
        ),
      },
      {
        key: "phone",
        header: "تماس",
        accessor: (row: Doctor) => row.phone,
        cell: (value: unknown) => (
          <div className="text-sm text-gray-500">{String(value)}</div>
        ),
      },
      {
        key: "isAvailable",
        header: "وضعیت",
        accessor: (row: Doctor) => (row.isAvailable ? "در دسترس" : "مشغول"),
        cell: (_: unknown, row: Doctor) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              row.isAvailable
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.isAvailable ? "در دسترس" : "مشغول"}
          </span>
        ),
      },
      {
        key: "actions",
        header: "عملیات",
        accessor: () => null,
        cell: (_: unknown, row: Doctor) => (
          <div className="flex gap-1.5">
            <button
              className="text-indigo-600 hover:text-indigo-900"
              title="ویرایش"
              onClick={() => console.log("edit", row.id)}
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              className="text-red-600 hover:text-red-900"
              title="حذف"
              onClick={() =>
                setDoctors((prev) => prev.filter((d) => d.id !== row.id))
              }
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ),
      },
    ],
    [setDoctors]
  );

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

      <div className="px-0">
        <DataTable
          data={doctors}
          columns={columns}
          rowKey={(row) => (row as Doctor).id}
        />
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
