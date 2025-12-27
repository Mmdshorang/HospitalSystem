import React from "react";
import { Bell, AlertTriangle } from "lucide-react";

export type AlertItem = {
  id: number | string;
  type: "warning" | "info";
  text: string;
};

type AlertsListProps = {
  alerts: AlertItem[];
};

const AlertsList: React.FC<AlertsListProps> = ({ alerts }) => {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">اعلان‌ها</h2>
        <Bell className="h-5 w-5 text-primary-600" />
      </div>
      <ul className="space-y-3">
        {alerts.map((a) => (
          <li key={a.id} className="flex items-start gap-3">
            {a.type === "warning" ? (
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
            ) : (
              <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
            )}
            <span className="text-sm text-gray-700">{a.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertsList;
