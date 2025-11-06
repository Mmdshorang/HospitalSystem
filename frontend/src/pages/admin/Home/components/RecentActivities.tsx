import React from "react";
import { Activity } from "lucide-react";

export type ActivityItem = {
  id: number | string;
  text: string;
  time: string;
};

type RecentActivitiesProps = {
  items: ActivityItem[];
};

const RecentActivities: React.FC<RecentActivitiesProps> = ({ items }) => {
  return (
    <div className="card p-6 lg:col-span-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">فعالیت‌های اخیر</h2>
        <Activity className="h-5 w-5 text-primary-600" />
      </div>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex items-start justify-between">
            <div className="text-sm text-gray-800">{item.text}</div>
            <div className="text-xs text-gray-500">{item.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;
