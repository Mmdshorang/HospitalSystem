import React from "react";
import { Calendar } from "lucide-react";

export type AppointmentItem = {
  id: number | string;
  patient: string;
  doctor: string;
  clinic: string;
  time: string;
};

type AppointmentsTableProps = {
  title?: string;
  items: AppointmentItem[];
};

const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  title = "نوبت‌های امروز",
  items,
}) => {
  return (
    <div className="card p-6 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <Calendar className="h-5 w-5 text-primary-600" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                بیمار
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                پزشک
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                کلینیک
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                ساعت
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {items.map((appt) => (
              <tr key={appt.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700">
                  {appt.patient}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {appt.doctor}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {appt.clinic}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">{appt.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsTable;
