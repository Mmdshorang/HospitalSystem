import { Plus, Edit, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import AddPatientDialog, {
  type AddPatientFormValues,
} from "./AddPatientDialog";
import DataTable from "../../../components/DataTable";
import { Button } from "../../../components/ui/button";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  nationalId?: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  gender?: string;
}

const Doctors = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [doctors, setDoctors] = useState<Patient[]>([
    {
      id: "1",
      firstName: "محمد",
      lastName: "کنعانی",
      nationalId: "0012345678",
      phone: "09123456789",
      dateOfBirth: "1378/4/6",
      address: "دزفول",
      gender: "male",
    },
    {
      id: "2",
      firstName: "محمد",
      lastName: "شرنگ",
      nationalId: "0098765432",
      phone: "09123456790",
      dateOfBirth: "1378/4/6",
      address: "دزفول",
      gender: "male",
    },
  ]);

  const handleAddDoctor = (form: AddPatientFormValues) => {
    // if form includes id -> update existing patient
    if (form.id) {
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === form.id
            ? {
                ...d,
                firstName: form.firstName,
                lastName: form.lastName,
                phone: form.phone || "",
                dateOfBirth: form.birthDate || d.dateOfBirth,
                address: form.address || d.address,
                gender: form.gender || d.gender,
                nationalId: form.nationalId || d.nationalId,
              }
            : d
        )
      );
      setSelectedPatient(null);
      return;
    }

    const newDoctor: Patient = {
      id: String(Date.now()),
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone || "",
      dateOfBirth: form.birthDate || "",
      address: form.address || "",
      gender: form.gender || undefined,
    };
    setDoctors((prev) => [newDoctor, ...prev]);
  };

  const columns = useMemo(
    () => [
      {
        key: "id",
        header: "ردیف",
        sortable: true,
        accessor: (row: Patient) => `${row.id}`,
      },
      {
        key: "fullName",
        header: "نام",
        sortable: true,
        accessor: (row: Patient) => `${row.firstName} ${row.lastName}`,
        cell: (_: unknown, row: Patient) => (
          <div>
            <div className="text-sm font-medium text-gray-900">
              {row.firstName} {row.lastName}
            </div>
          </div>
        ),
      },
      {
        key: "nationalId",
        header: "کد ملی",
        sortable: true,
        accessor: (row: Patient) => row.nationalId,
        cell: (value: unknown) => (
          <span className="text-sm text-gray-500">{String(value)}</span>
        ),
      },
      {
        key: "gender",
        header: "جنسیت",
        sortable: true,
        accessor: (row: Patient) => row.gender,
        cell: (value: unknown) => (
          <span className="text-sm text-gray-500">
            {String(value) === "male" ? "مرد" : "زن"}
          </span>
        ),
      },
      {
        key: "phone",
        header: "تماس",
        accessor: (row: Patient) => row.phone,
        cell: (value: unknown) => (
          <div className="text-sm text-gray-500">{String(value)}</div>
        ),
      },
      {
        key: "isAvailable",
        header: "تاریخ تولد",
        accessor: (row: Patient) => row.dateOfBirth,
        cell: (value: unknown) => (
          <div className="text-sm text-gray-500">{String(value)}</div>
        ),
      },
      {
        key: "actions",
        header: "عملیات",
        accessor: () => null,
        cell: (_: unknown, row: Patient) => (
          <div className="flex gap-1.5">
            <button
              className="text-indigo-600 hover:text-indigo-900"
              title="ویرایش"
              onClick={() => {
                setSelectedPatient(row);
                setIsAddOpen(true);
              }}
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
      <section className="rounded-[28px] border border-slate-100 bg-white px-6 py-8 shadow-sm">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">بیماران</h1>
            <p className="mt-2 text-gray-600">مدیریت اطلاعات بیماران</p>
          </div>
          <Button
            className="flex h-12 rounded-2xl bg-linear-to-l from-blue-600 to-blue-500 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-600"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus className="h-4 w-4 ml-2" />
            افزودن بیمار
          </Button>
        </div>
      </section>

      <div className="mt-5">
        <div className="px-0">
          <DataTable
            data={doctors}
            columns={columns}
            rowKey={(row) => (row as Patient).id}
          />
        </div>
        <AddPatientDialog
          isOpen={isAddOpen}
          onClose={() => {
            setIsAddOpen(false);
            setSelectedPatient(null);
          }}
          onSubmit={handleAddDoctor}
          initialValues={
            selectedPatient
              ? {
                  id: selectedPatient.id,
                  firstName: selectedPatient.firstName,
                  lastName: selectedPatient.lastName,
                  phone: selectedPatient.phone,
                  nationalId: selectedPatient.nationalId,
                  birthDate: selectedPatient.dateOfBirth,
                  address: selectedPatient.address,
                  gender: selectedPatient.gender as
                    | "male"
                    | "female"
                    | "other"
                    | null,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default Doctors;
