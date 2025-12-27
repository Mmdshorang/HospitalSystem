import { Plus, Edit, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AddPatientDialog, {
  type AddPatientFormValues,
} from "./AddPatientDialog";
import DataTable from "../../../components/DataTable";
import { Button } from "../../../components/ui/button";
import { patientService } from "../../../api/services/patientService";
import { formatPersianDate } from "../../../lib/utils";

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  gender?: string;
  bloodType?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
};

const Doctors = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await patientService.getAll();
        setPatients(
          result.map((p) => ({
            id: String(p.id),
            firstName: p.firstName,
            lastName: p.lastName,
            nationalId: p.nationalId,
            phoneNumber: p.phoneNumber,
            dateOfBirth: p.dateOfBirth || "",
            address: p.address || "",
            bloodType: p.bloodType,
            emergencyContact: p.emergencyContact,
            emergencyPhone: p.emergencyPhone,
          }))
        );
      } catch (err) {
        console.error(err);
        setError("خطا در دریافت لیست بیماران");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleAddDoctor = async (form: AddPatientFormValues) => {
    try {
      if (form.id) {
        await patientService.update(form.id, {
          id: form.id,
          firstName: form.firstName,
          lastName: form.lastName,
          nationalId: form.nationalId,
          dateOfBirth: form.dateOfBirth,
          phoneNumber: form.phoneNumber,
          address: form.address,
          bloodType: form.bloodType,
          emergencyContact: form.emergencyContact,
          emergencyPhone: form.emergencyPhone,
        });
        setPatients((prev) =>
          prev.map((p) =>
            p.id === form.id
              ? {
                ...p,
                firstName: form.firstName,
                lastName: form.lastName,
                nationalId: form.nationalId,
                phoneNumber: form.phoneNumber,
                dateOfBirth: form.dateOfBirth,
                address: form.address,
                bloodType: form.bloodType,
                emergencyContact: form.emergencyContact,
                emergencyPhone: form.emergencyPhone,
              }
              : p
          )
        );
        setSelectedPatient(null);
        return;
      }

      const created = await patientService.create({
        firstName: form.firstName,
        lastName: form.lastName,
        nationalId: form.nationalId,
        dateOfBirth: form.dateOfBirth,
        phoneNumber: form.phoneNumber,
        address: form.address,
        bloodType: form.bloodType,
        emergencyContact: form.emergencyContact,
        emergencyPhone: form.emergencyPhone,
      });

      setPatients((prev) => [
        {
          id: String(created.id),
          firstName: created.firstName,
          lastName: created.lastName,
          nationalId: created.nationalId,
          phoneNumber: created.phoneNumber,
          dateOfBirth: created.dateOfBirth,
          address: created.address,
          bloodType: created.bloodType,
          emergencyContact: created.emergencyContact,
          emergencyPhone: created.emergencyPhone,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
      setError("خطا در ذخیره اطلاعات بیمار");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await patientService.delete(id);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      setError("خطا در حذف بیمار");
    }
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
        header: "گروه خونی",
        sortable: true,
        accessor: (row: Patient) => row.bloodType || "-",
        cell: (value: unknown) => (
          <span className="text-sm text-gray-500">{String(value)}</span>
        ),
      },
      {
        key: "phone",
        header: "تماس",
        accessor: (row: Patient) => row.phoneNumber,
        cell: (value: unknown) => (
          <div className="text-sm text-gray-500">{String(value)}</div>
        ),
      },
      {
        key: "isAvailable",
        header: "تاریخ تولد",
        accessor: (row: Patient) => row.dateOfBirth,
        cell: (value: unknown) => (
          <div className="text-sm text-gray-500">
            {value ? formatPersianDate(String(value)) : "-"}
          </div>
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
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <DataTable
            data={patients}
            columns={columns}
            rowKey={(row) => (row as Patient).id}
            loading={loading}
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
                phoneNumber: selectedPatient.phoneNumber,
                nationalId: selectedPatient.nationalId,
                dateOfBirth: selectedPatient.dateOfBirth,
                address: selectedPatient.address,
                gender: selectedPatient.gender as
                  | "male"
                  | "female"
                  | "other"
                  | null,
                bloodType: selectedPatient.bloodType || "",
                emergencyContact: selectedPatient.emergencyContact || "",
                emergencyPhone: selectedPatient.emergencyPhone || "",
              }
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default Doctors;
